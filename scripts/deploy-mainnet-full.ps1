# End-to-end Base mainnet deploy: contract, mint window, env wiring, build, verification.
# Prerequisites: .env filled; deployer wallet funded on Base mainnet.

$ErrorActionPreference = "Stop"
$env:Path = "$env:USERPROFILE\.foundry\bin;$env:Path"
Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path ".env")) {
    Write-Error ".env not found. Copy .env.example to .env and fill deployment values."
}

Get-Content ".env" | ForEach-Object {
    if ($_ -match '^([^#=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

$rpcUrl = if ($env:BASE_MAINNET_RPC_URL) { $env:BASE_MAINNET_RPC_URL } else { "https://mainnet.base.org" }

Write-Host "=== Step 1: Deploy THE67Genesis ==="
forge script script/DeployBaseMainnet.s.sol:DeployBaseMainnet `
    --rpc-url $rpcUrl `
    --broadcast `
    --verify `
    -vvvv

$latestRun = Get-ChildItem "broadcast/DeployBaseMainnet.s.sol/8453" -Filter "run-latest.json" -Recurse -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $latestRun) {
    Write-Error "Deploy broadcast artifact not found. Check forge output above."
}

$runJson = Get-Content $latestRun.FullName -Raw | ConvertFrom-Json
$deployTx = $runJson.transactions | Where-Object { $_.contractName -eq "THE67Genesis" -and $_.transactionType -eq "CREATE" } | Select-Object -First 1

if (-not $deployTx) {
    Write-Error "Could not parse THE67Genesis deployment from broadcast JSON."
}

$contractAddress = $deployTx.contractAddress
$deployTxHash = $deployTx.hash

Write-Host "Deployed: $contractAddress"
Write-Host "Tx: $deployTxHash"

Write-Host ""
Write-Host "=== Step 2: Configure mint window ==="
$env:THE67_GENESIS_ADDRESS = $contractAddress
forge script script/ConfigureBaseMainnetMint.s.sol:ConfigureBaseMainnetMint `
    --rpc-url $rpcUrl `
    --broadcast `
    -vvvv

Write-Host ""
Write-Host "=== Step 3: Update .env and mint.ts ==="
node scripts/update-genesis-address.mjs $contractAddress

Write-Host ""
Write-Host "=== Step 4: Rebuild website ==="
npm run build

Write-Host ""
Write-Host "=== Step 5: On-chain verification ==="
$startTime = cast call $contractAddress "mintStartTime()(uint256)" --rpc-url $rpcUrl
$endTime = cast call $contractAddress "mintEndTime()(uint256)" --rpc-url $rpcUrl
$reserveMinted = cast call $contractAddress "reservedMinted()(uint256)" --rpc-url $rpcUrl
$totalMinted = cast call $contractAddress "totalSupply()(uint256)" --rpc-url $rpcUrl

Write-Host "mintStartTime: $startTime"
Write-Host "mintEndTime: $endTime"
Write-Host "reservedMinted: $reserveMinted (expect 0)"
Write-Host "totalSupply: $totalMinted (expect 0)"

$verifyUrl = "https://basescan.org/address/$contractAddress#code"
Write-Host ""
Write-Host "=== Deployment complete ==="
Write-Host "Contract: $contractAddress"
Write-Host "Deploy tx: $deployTxHash"
Write-Host "BaseScan: $verifyUrl"
