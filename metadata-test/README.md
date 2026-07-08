# Temporary Sepolia test metadata
#
# These files are NOT production Genesis metadata.
# CIDs are deterministic from file content. Pin/upload before deployment so gateways can fetch them.
#
# Hash local CIDs:
#   npm run ipfs:hash-test-metadata
#
# Upload/pin to IPFS (run from your machine):
#   npm run ipfs:upload-test-metadata
#
# Manual upload alternatives:
#   curl -F "file=@metadata-test/hidden.json" https://filedrop.besoeasy.com/upload
#   curl -F "file=@metadata-test/contract.json" https://filedrop.besoeasy.com/upload
#   curl -F "file=@metadata-test/revealed.zip" https://filedrop.besoeasy.com/uploadzip

## Files

| File | Purpose | `.env` key |
|------|---------|------------|
| `hidden.json` | Pre-reveal token URI | `HIDDEN_METADATA_URI` |
| `contract.json` | Collection metadata | `CONTRACT_URI` |
| `revealed/` | Post-reveal base folder (`1.json`, `2.json`, `3.json`) | `REVEALED_BASE_URI` |

`REVEALED_BASE_URI` must end with `/` and resolve to a folder containing `{tokenId}.json`.

## Current Sepolia test CIDs (from `npm run ipfs:hash-test-metadata`)

```
HIDDEN_METADATA_URI=ipfs://bafybeidms6fnbh7rghvx2bar5nknhqge3rppaxez3ceeugsjn4ovvj7kue
CONTRACT_URI=ipfs://bafybeicqzvxoyor3fgoaz2t6ycd3revobxv4vwh667zlfjqrmp4xeyvzty
REVEALED_BASE_URI=ipfs://bafybeifdvusqb27t2tzkywby3ucxri3fxvgxl2i36g2ex5jfdlo42jttbu/
```

After pinning, verify:

- https://ipfs.io/ipfs/bafybeidms6fnbh7rghvx2bar5nknhqge3rppaxez3ceeugsjn4ovvj7kue
- https://ipfs.io/ipfs/bafybeicqzvxoyor3fgoaz2t6ycd3revobxv4vwh667zlfjqrmp4xeyvzty
- https://ipfs.io/ipfs/bafybeifdvusqb27t2tzkywby3ucxri3fxvgxl2i36g2ex5jfdlo42jttbu/1.json
