# THE67 Genesis Citizens — Smart Contracts

Production Foundry project for the **THE67 Genesis Citizens** ERC721A collection on **Base**.

## Collection

| Field | Value |
|-------|-------|
| Name | THE67 Genesis Citizens |
| Symbol | THE67 |
| Network | Base |
| Total Supply | 67 |
| Public Supply | 63 |
| Creator Reserve | 4 |
| Mint Price | 0.0067 ETH |
| Max Per Wallet | 1 |
| Max Per Transaction | 1 |
| Default Royalty | 5% (ERC2981) |

Minting is **closed by default** at deployment. The owner configures `mintStartTime` and `mintEndTime` without redeploying.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

## Install dependencies

From the repository root:

```bash
forge install foundry-rs/forge-std --no-commit
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-commit
forge install chiru-labs/ERC721A@v4.3.0 --no-commit
```

## Build

```bash
forge build
```

## Test

```bash
forge test
```

Verbose output:

```bash
forge test -vvv
```

## Environment variables

Copy `.env.example` to `.env` and fill in values. **Never commit private keys.**

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Deployer private key (without `0x` prefix) |
| `INITIAL_OWNER` | Ownable admin address |
| `ROYALTY_RECEIVER` | ERC2981 royalty recipient |
| `HIDDEN_METADATA_URI` | Hidden metadata URI before reveal |
| `CONTRACT_URI` | OpenSea collection metadata URI |
| `BASE_SEPOLIA_RPC_URL` | Base Sepolia RPC endpoint |
| `BASE_MAINNET_RPC_URL` | Base mainnet RPC endpoint |
| `BASESCAN_API_KEY` | Basescan API key for verification |

## Deployment

### Base Sepolia (testnet)

```bash
source .env

forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

Chain ID: `84532`

### Base Mainnet

```bash
source .env

forge script script/DeployBaseMainnet.s.sol:DeployBaseMainnet \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

Chain ID: `8453`

## Post-deployment configuration

Typical launch sequence:

```solidity
// 1. Set revealed metadata base (trailing slash required)
setBaseURI("ipfs://your-revealed-base/");

// 2. Open mint for 48 hours
setMintStartTime(block.timestamp);
setMintEndTime(block.timestamp + 48 hours);

// 3. After art is ready
reveal();
```

Extend an unsold mint:

```solidity
setMintEndTime(newEndTime);
```

Creator reserve (max 4 total):

```solidity
reserveMint(recipient, quantity);
```

Withdraw proceeds:

```solidity
withdraw();
```

## Contract verification

If automatic verification fails during deployment:

```bash
forge verify-contract \
  --chain-id 8453 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(address,address,string,string)" $INITIAL_OWNER $ROYALTY_RECEIVER "$HIDDEN_METADATA_URI" "$CONTRACT_URI") \
  <DEPLOYED_ADDRESS> \
  contracts/THE67Genesis.sol:THE67Genesis \
  --etherscan-api-key $BASESCAN_API_KEY
```

## Security properties

- Non-upgradeable
- No `tx.origin`
- No `delegatecall`
- Checks-Effects-Interactions on state-changing flows
- `ReentrancyGuard` on `mint`, `reserveMint`, and `withdraw`
- Creator reserve hard-capped at 4
- Public mint hard-capped at 63
- Immutable mint economics (`MINT_PRICE`, wallet/tx limits)
- Custom errors for gas-efficient reverts
- NatSpec on all external/public interfaces

## Website integration

The contract exposes everything required for the production mint flow:

| Website step | Contract surface |
|--------------|------------------|
| Connect wallet | `mintIsOpen()`, `MINT_PRICE`, `publicRemaining()` |
| Sign message | Off-chain (existing participation flow) |
| Mint | `mint()` payable |
| Success / Citizen page | `ownerOf(tokenId)`, `tokenURI(tokenId)`, `tokensOfOwner(address)` |
| OpenSea | `contractURI()`, ERC2981 `royaltyInfo` |

Update `lib/participation/mint.ts` with the deployed contract address and set `status: "live"` when ready.

## Audit readiness

This contract is written for external review:

- Explicit supply accounting (`reservedMinted`, `_publicMinted`, `_totalMinted`)
- No hidden owner mint path beyond `reserveMint`
- Exact payment validation
- Pausable public mint only
- Protected ETH withdrawals

## Project layout

```
contracts/
  THE67Genesis.sol
script/
  DeployBaseSepolia.s.sol
  DeployBaseMainnet.s.sol
test/
  THE67Genesis.t.sol
foundry.toml
remappings.txt
```
