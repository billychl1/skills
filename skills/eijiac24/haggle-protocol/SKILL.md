---
name: haggle-protocol
description: On-chain negotiation protocol for AI agents. Create, negotiate, and settle deals using real USDC on Base Mainnet or test tokens on Solana/Monad/Arbitrum testnets.
homepage: https://haggle.dev
user-invocable: true
metadata: {"clawdbot": {"category": "crypto", "tags": ["negotiation", "defi", "base", "solana", "ai-agents", "usdc"]}, "requires": {"env": ["HAGGLE_PRIVATE_KEY"]}}
files: ["scripts/*"]
---

# Haggle Protocol

> The first on-chain negotiation protocol for autonomous AI agents.

Haggle Protocol enables two AI agents to negotiate a fair price through multi-round alternating offers with escrow decay. Instead of fixed pricing, agents discover fair prices through dynamic bargaining.

**Use it when:** You need to buy or sell a service from another agent but don't know the fair price.

## Deployments

| Chain | Network | Contract | Token |
|-------|---------|----------|-------|
| Base | **Mainnet** | `0xB77B5E932de5e5c6Ad34CB4862E33CD634045514` | USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) |
| Solana | Devnet | `DRXGcVHj1GZSc7wD4LTnrM8RJ1shWH93s1zKCXtJtGbq` | SPL Token |
| Monad | Testnet | `0x30FD25bAB859D8D68de6A0719983bb75200b1CeC` | MockERC20 |
| Base | Sepolia | `0x30FD25bAB859D8D68de6A0719983bb75200b1CeC` | MockERC20 |
| Arbitrum | Sepolia | `0x30FD25bAB859D8D68de6A0719983bb75200b1CeC` | MockERC20 |

## How It Works

```
1. Buyer deposits escrow (USDC) into protocol-controlled vault
2. Seller accepts the negotiation invitation
3. Both parties submit alternating offers (turn-based, enforced on-chain)
4. Each round, escrow decays by a configurable rate, creating time pressure
5. Either party accepts the counterparty's offer -> settlement and payout
```

## Setup

### Option 1: MCP Server (Recommended)

Install the MCP server for full agent integration:

```bash
npm install -g @haggle-protocol/mcp
```

Configure with your private key:

```bash
export HAGGLE_PRIVATE_KEY="0x..."   # EVM private key
```

Run:

```bash
npx @haggle-protocol/mcp
```

### Option 2: TypeScript SDK

```bash
npm install @haggle-protocol/evm    # For Base/Monad/Arbitrum
npm install @haggle-protocol/solana  # For Solana
npm install @haggle-protocol/core    # Shared types
```

### Option 3: REST API

```bash
npx @haggle-protocol/api
```

## Buyer Workflow (Base Mainnet)

```typescript
import { HaggleEVM } from "@haggle-protocol/evm";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.HAGGLE_PRIVATE_KEY, provider);
const haggle = new HaggleEVM("base_mainnet", wallet);

// 1. Approve USDC
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const usdc = new ethers.Contract(USDC, [
  "function approve(address,uint256) returns (bool)"
], wallet);
await (await usdc.approve(haggle.contractAddress, 1000000n)).wait(); // 1 USDC

// 2. Create negotiation
const negId = await haggle.createNegotiation({
  seller: "0xSELLER_ADDRESS",
  escrowAmount: 1000000n,      // 1 USDC (6 decimals)
  tokenAddress: USDC,
  serviceHash: ethers.keccak256(ethers.toUtf8Bytes("data analysis")),
  maxRounds: 6,
  decayRateBps: 200,           // 2% decay per round
  responseWindow: 300,         // 5 min per turn
  globalDeadlineSeconds: 1800, // 30 min total
  minOfferBps: 1000,           // min 10% of escrow
});

// 3. Submit offer
await haggle.submitOffer(negId, 500000n); // Offer 0.5 USDC
```

## Seller Workflow

```typescript
// 1. Accept invitation
await haggle.acceptInvitation(negId);

// 2. Counter-offer
await haggle.submitOffer(negId, 800000n); // Counter at 0.8 USDC

// 3. Accept buyer's offer (triggers settlement)
await haggle.acceptOffer(negId);
```

## Reading Negotiation State

```typescript
const neg = await haggle.getNegotiation(negId);

console.log("Status:", neg.status);
console.log("Round:", neg.currentRound);
console.log("Current Offer:", ethers.formatUnits(neg.currentOfferAmount, 6), "USDC");
console.log("Effective Escrow:", ethers.formatUnits(neg.effectiveEscrow, 6), "USDC");
```

## MCP Server Tools

When using the MCP server, these tools are available:

| Tool | Description |
|------|-------------|
| `create_negotiation` | Create a new negotiation with escrow deposit |
| `get_negotiation` | Read negotiation state by ID |
| `submit_offer` | Submit a price offer (respects turn order) |
| `accept_offer` | Accept counterparty's offer, trigger settlement |
| `reject_negotiation` | Walk away, return escrow to buyer |
| `get_protocol_config` | Read protocol configuration |
| `list_chains` | List all supported chains |

## Key Parameters

| Parameter | Description |
|-----------|-------------|
| `escrowAmount` | Total escrow deposited by buyer (in token smallest unit) |
| `maxRounds` | Maximum negotiation rounds before expiry |
| `decayRateBps` | Escrow decay per round in basis points (200 = 2%) |
| `responseWindow` | Seconds each party has to respond |
| `globalDeadlineSeconds` | Total seconds before negotiation expires |
| `minOfferBps` | Minimum offer as % of effective escrow (1000 = 10%) |

## Settlement Math

```
protocolFee    = settledAmount * 50 / 10000  (0.5%)
sellerReceives = settledAmount - protocolFee
buyerRefund    = effectiveEscrow - settledAmount
```

## Negotiation Strategy Tips

1. **Start with anchoring** - Open with an aggressive but reasonable first offer
2. **Concede gradually** - Small concessions signal firmness
3. **Watch the decay** - Each round costs both parties
4. **Monitor effectiveEscrow** - As it decays, the viable offer range narrows

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| `https://mainnet.base.org` | Transaction data | Base Mainnet RPC |
| `https://api.devnet.solana.com` | Transaction data | Solana Devnet RPC |
| `https://monad-testnet.drpc.org` | Transaction data | Monad Testnet RPC |

## Security & Privacy

- All interactions are on-chain transactions signed with your private key
- No data is sent to third-party analytics or tracking services
- Private keys never leave your local environment
- The protocol smart contracts are open source: https://github.com/EijiAC24/haggle-protocol
- All offers are numeric amounts only - no free-text, no prompt injection risk
- Escrow is held in contract-controlled vaults - no rug pull possible
- Turn-based enforcement is on-chain - cannot submit out of turn

## Links

- Website: https://haggle.dev
- GitHub: https://github.com/EijiAC24/haggle-protocol
- Base Dashboard: https://haggle.dev/base
- npm: https://www.npmjs.com/org/haggle-protocol
