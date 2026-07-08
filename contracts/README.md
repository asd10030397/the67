# THE67 Genesis Citizens — Smart Contracts

Production Foundry project for the **THE67 Genesis Citizens** ERC721A collection on **Base**.

See the repository root `CONTRACTS.md` for the full deployment and verification guide.

## Quick start

```bash
forge install foundry-rs/forge-std --no-commit
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-commit
forge install chiru-labs/ERC721A@v4.3.0 --no-commit

forge build
forge test
```

## Files

- `THE67Genesis.sol` — production ERC721A collection contract
- `../script/DeployBaseSepolia.s.sol` — Base Sepolia deployment
- `../script/DeployBaseMainnet.s.sol` — Base mainnet deployment
- `../test/THE67Genesis.t.sol` — comprehensive Foundry tests
