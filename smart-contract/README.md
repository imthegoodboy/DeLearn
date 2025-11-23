# Massa DeAds Smart Contracts

This folder contains the smart contracts for the Massa DeAds decentralized advertising platform.

## Overview

The smart contracts are written in AssemblyScript and compiled to WebAssembly for deployment on the Massa blockchain. They handle:

- **Ad Campaign Registry**: Store ad campaigns with metadata, budget, and targeting
- **Escrow System**: Lock hoster funds and track budget consumption
- **Interaction Tracking**: Record impressions and clicks with fraud prevention
- **Payment Distribution**: Autonomous Smart Contracts (ASC) for automatic daily payouts
- **Reputation Scoring**: Track platform reputation for hosters and developers

## Setup

To set up the smart contract development environment:

```bash
# Initialize the smart contract project
npx @massalabs/sc-project-initializer init massa-deads-contracts

# Install dependencies
cd massa-deads-contracts
npm install
```

## Project Structure

```
smart-contract/
├── assembly/
│   ├── contracts/
│   │   ├── AdRegistry.ts          # Main ad campaign storage
│   │   ├── EscrowManager.ts       # Budget escrow and tracking
│   │   ├── InteractionTracker.ts  # Click/impression recording
│   │   ├── PaymentDistributor.ts  # Autonomous payout system
│   │   └── ReputationScore.ts     # On-chain reputation
│   └── tests/
│       └── *.spec.ts              # Contract tests
├── package.json
└── README.md
```

## Development Workflow

1. **Write Contracts**: Implement contract logic in AssemblyScript
2. **Test Locally**: Run unit tests with `npm test`
3. **Compile**: Build contracts with `npm run build`
4. **Deploy**: Deploy to Massa testnet/mainnet
5. **Integrate**: Connect frontend to deployed contracts

## Key Concepts

### Autonomous Smart Contracts (ASC)
Massa's unique feature allows contracts to self-execute at specified intervals without external triggers. Perfect for automated daily payouts.

### Storage Structure
All data is stored on-chain using Massa's persistent key-value datastore:
- **Campaign Data**: Metadata, budget, status
- **Escrow Balances**: Locked funds per campaign
- **Interaction Events**: Impression/click history
- **Earnings**: Developer earnings by ad campaign

### Gas & Fees
- Operations consume gas based on computational complexity
- Storage incurs additional costs
- Budget management includes gas optimization

## Contract Interfaces

### AdRegistry
```typescript
createCampaign(metadata, budget): campaignId
updateCampaign(campaignId, updates): void
getCampaign(campaignId): Campaign
getAllActiveCampaigns(): Campaign[]
```

### EscrowManager
```typescript
lockFunds(campaignId, amount): void
consumeBudget(campaignId, amount): void
releaseFunds(campaignId, recipient, amount): void
getBudgetRemaining(campaignId): number
```

### InteractionTracker
```typescript
recordImpression(campaignId, developerId): void
recordClick(campaignId, developerId): void
getInteractionCount(campaignId): { impressions, clicks }
detectFraud(developerId): boolean
```

### PaymentDistributor (ASC)
```typescript
schedulePayout(developerId, amount, timestamp): void
executeDailyPayouts(): void  // Auto-triggered every 24h
claimEarnings(developerId): void
```

### ReputationScore
```typescript
updateScore(userId, delta): void
getScore(userId): number
getReputation(userId): ReputationLevel
```

## Deployment

Deploy contracts to Massa network:

```bash
# Testnet deployment
npm run deploy:testnet

# Mainnet deployment
npm run deploy:mainnet
```

## Integration with Frontend

The frontend connects to deployed contracts using `@massalabs/massa-web3`:

```typescript
import { ClientFactory, SmartContract } from '@massalabs/massa-web3';

// Connect to contract
const contract = new SmartContract(client, contractAddress);

// Create campaign
await contract.call('createCampaign', args, {
  gasLimit: 1000000,
  coins: budgetAmount
});

// Read data
const campaigns = await contract.read('getAllActiveCampaigns');
```

## Testing

Run contract tests:

```bash
npm test
```

## Resources

- [Massa Smart Contract Documentation](https://docs.massa.net/docs/build/smart-contract/intro)
- [AssemblyScript SDK](https://docs.massa.net/docs/build/smart-contract/sdk)
- [Massa Web3 Library](https://docs.massa.net/docs/build/massa-web3/intro)
- [Example Contracts](https://github.com/massalabs/massa-sc-examples)

## License

MIT License
