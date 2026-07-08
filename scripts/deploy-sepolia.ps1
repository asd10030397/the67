# Deploy THE67 Genesis to Base Sepolia, open mint window, and verify on BaseScan.
# Prerequisites: copy .env.example to .env and fill all values before running.

$ErrorActionPreference = "Stop"
$env:Path = "$env:USERPROFILE\.foundry\bin;$env:Path"

if (-not (Test-Path ".env")) {
    Write-Error ".env not found. Copy .env.example to .env and fill deployment values."
}

$rpcUrl = if ($env:BASE_SEPOLIA_RPC_URL) { $env:BASE_SEPOLIA_RPC_URL } else { "https://sepolia.base.org" }

Write-Host "Deploying THE67Genesis to Base Sepolia..."
forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia `
    --rpc-url $rpcUrl `
    --broadcast `
    --verify `
    -vvvv

Write-Host ""
Write-Host "Update .env THE67_GENESIS_ADDRESS with the deployed address from the output above."
Write-Host "Then open the mint window:"
Write-Host "  forge script script/ConfigureSepoliaMint.s.sol:ConfigureSepoliaMint --rpc-url $rpcUrl --broadcast -vvvv"
Write-Host ""
Write-Host "Finally update lib/participation/mint.ts SEPOLIA_DEPLOYED_CONTRACT_ADDRESS and rebuild the site."
