# Temporary Sepolia test metadata

These files are **not** production Genesis metadata.

## Pinata upload (manual)

No local IPFS daemon is required.

### 1. Prepare package

```bash
npm run pinata:prepare-metadata
```

This creates `metadata-test/revealed.zip` and `metadata-test/pinata-cids.json`.

### 2. Upload in Pinata

At [https://app.pinata.cloud](https://app.pinata.cloud), upload:

| Local file | Pinata upload type | `.env` key |
|------------|-------------------|------------|
| `metadata-test/hidden.json` | Single file | `HIDDEN_METADATA_URI` |
| `metadata-test/contract.json` | Single file | `CONTRACT_URI` |
| `metadata-test/revealed.zip` | **Directory** (must contain `1.json`, `2.json`, `3.json` at root) | `REVEALED_BASE_URI` |

For the revealed folder, use Pinata's directory upload (or upload the zip as a directory). The resulting **folder CID** must resolve to:

- `{folderCid}/1.json`
- `{folderCid}/2.json`
- `{folderCid}/3.json`

`REVEALED_BASE_URI` must end with `/`.

### 3. Record CIDs

Copy each returned CID into `metadata-test/pinata-cids.json`:

```json
{
  "hidden": "bafy...",
  "contract": "bafy...",
  "revealedDirectory": "bafy..."
}
```

### 4. Apply to `.env` and verify gateways

```bash
npm run pinata:apply-metadata-uris
```

Or pass CIDs directly:

```bash
npm run pinata:apply-metadata-uris -- <hiddenCid> <contractCid> <revealedDirectoryCid>
```

This updates `.env` and verifies:

- `https://ipfs.io/ipfs/<hiddenCid>`
- `https://ipfs.io/ipfs/<contractCid>`
- `https://ipfs.io/ipfs/<revealedDirectoryCid>/1.json`
