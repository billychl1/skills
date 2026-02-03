---
name: archon
description: Interact with Archon decentralized identity network via public web APIs. Resolve DIDs, explore network events, check node status.
homepage: https://archon.technology
metadata:
  project: archon
  type: identity
  networks:
    - archon
    - hyperswarm
---

# Archon - Decentralized Identity Network

Archon is an open-source decentralized self-sovereign identity (SSI) system. This skill provides access to the public Archon network via web APIs for resolving DIDs, exploring network activity, and checking node status.

## Public Archon Node

**Base URL:** https://archon.technology

The public Archon node serves as a gateway to the decentralized identity network, hosting DIDs across multiple registries (Hyperswarm, BTC mainnet, BTC signet).

## What is Archon?

- **Decentralized Identifiers (DIDs):** `did:cid:<base32-cid>` format
- **Verifiable Credentials:** Issue and verify cryptographic attestations
- **Group Vaults:** Encrypted shared storage with role-based access
- **P2P Network:** Distributed identity resolution via Hyperswarm
- **Bitcoin Anchoring:** Optional BTC blockchain anchoring for permanence

## Core Operations

### 1. Resolve a DID

Retrieve the DID document for any published Archon DID.

**Endpoint:** `GET /api/v1/did/{did}`

**Example:**
```bash
curl -s "https://archon.technology/api/v1/did/did:cid:bagaaierabnbxp5xjvsi6556egk2ikhirvlcp34zl5xp4rwvmjkmhhpm3ieyq" | jq '.'
```

**Response Structure:**
```json
{
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  },
  "didDocument": {
    "id": "did:cid:...",
    "@context": [...],
    "verificationMethod": [...],
    "authentication": [...],
    "assertionMethod": [...]
  },
  "didDocumentMetadata": {
    "created": "2026-01-29T...",
    "updated": "2026-01-29T..."
  }
}
```

**Error Response:**
```json
{
  "didResolutionMetadata": {"error": "notFound"},
  "didDocument": {},
  "didDocumentMetadata": {}
}
```

### 2. Check Node Status

Get current status of the public Archon node including DID counts and network stats.

**Endpoint:** Homepage parses node status JSON

**Example:**
```bash
curl -s "https://archon.technology" | grep -oP '{\s*"uptimeSeconds".*?\n.*?}\s*}' | head -1 | jq '.'
```

**Response:**
```json
{
  "uptimeSeconds": 238336,
  "dids": {
    "total": 153,
    "byType": {
      "agents": 52,
      "assets": 101,
      "confirmed": 152,
      "unconfirmed": 1
    },
    "byRegistry": {
      "hyperswarm": 149,
      "BTC:mainnet": 3,
      "BTC:signet": 1
    }
  }
}
```

### 3. Explore Network (Web UI)

**DID Explorer:** https://explorer.archon.technology/events  
**P2P Wallet:** https://wallet.archon.technology

These are browser-based interfaces for exploring DIDs and managing identities.

## OpenClaw Integration

### Using web_fetch

```bash
# Resolve a DID
web_fetch "https://archon.technology/api/v1/did/did:cid:bagaaiera..."
```

### Helper Scripts

Location: `~/clawd/skills/archon/scripts/`

**Resolve DID:**
```bash
~/clawd/skills/archon/scripts/archon-resolve.sh did:cid:bagaaiera...
```

**Check node status:**
```bash
~/clawd/skills/archon/scripts/archon-status.sh
```

## Use Cases

**For AI Agents:**
- Verify identity claims by resolving DIDs
- Check credential issuer reputation (DID document verification methods)
- Explore decentralized identity network topology
- Monitor Archon network health and activity

**For Projects:**
- Build identity-aware applications
- Verify credentials without running own node
- Discover other agents/entities on the network
- Check if specific DIDs are published

## Limitations

- **Read-Only:** Public API is read-only (no DID creation/updates)
- **Public DIDs Only:** Only resolves DIDs published to the public node
- **No Wallet Operations:** Cannot sign or issue credentials via web API
- **Rate Limiting:** Subject to public node rate limits

## Running Your Own Node

For full Archon capabilities (creating DIDs, issuing credentials, vault management), run your own node:

**GitHub:** https://github.com/archetech/archon  
**Docs:** https://archetech.com

## Related

- **@didcid/keymaster:** CLI tool for full Archon wallet operations (local node required)
- **DID Specification:** https://www.w3.org/TR/did-core/
- **Verifiable Credentials:** https://www.w3.org/TR/vc-data-model/

## Examples

**Resolve Hex's DID (if published to public node):**
```bash
curl -s "https://archon.technology/api/v1/did/did:cid:bagaaieratn3qejd6mr4y2bk3nliriafoyeftt74tkl7il6bbvakfdupahkla" | jq '.didDocument'
```

**Check if DID exists:**
```bash
RESULT=$(curl -s "https://archon.technology/api/v1/did/did:cid:...")
if echo "$RESULT" | jq -e '.didResolutionMetadata.error' > /dev/null; then
  echo "DID not found on public node"
else
  echo "DID found"
fi
```

**Get network stats:**
```bash
curl -s "https://archon.technology" | grep -oP '"dids":\s*{[^}]+}' | jq -R 'fromjson'
```

---

**Last Updated:** 2026-02-02  
**Maintainer:** Hex (hex@lightning-goats.com)  
**Public Node:** archon.technology
