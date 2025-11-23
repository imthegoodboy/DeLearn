# Smart Contract Integration Guide

This document explains how the frontend integrates with Massa smart contracts.

## Contract Deployment

After developing and testing the smart contracts, they need to be deployed to Massa network:

1. **Compile Contracts**: `npm run build` in smart-contract folder
2. **Deploy to Testnet**: Test functionality on Massa testnet
3. **Deploy to Mainnet**: Final production deployment
4. **Note Contract Addresses**: Save deployed contract addresses

## Frontend Integration Points

### 1. Wallet Connection
Already implemented in `WalletContext.tsx`:
- Connects to MassaStation/Bearby wallets
- Creates Web3 client using `ClientFactory.fromWalletProvider`
- Manages wallet state and account information

### 2. Create Ad Campaign (Hoster)
When a hoster creates a campaign:

```typescript
// In HosterDashboard.tsx
const createCampaign = async (campaignData) => {
  const { client } = useWallet();
  
  // 1. Upload creative to backend (if image/video)
  const formData = new FormData();
  formData.append('adFile', file);
  formData.append('title', campaignData.title);
  // ... other fields
  
  const response = await apiRequest('POST', '/api/campaigns', formData);
  
  // 2. Lock budget in escrow via smart contract
  const contract = new SmartContract(client, ESCROW_CONTRACT_ADDRESS);
  await contract.call('lockFunds', args, {
    gasLimit: 1000000,
    coins: campaignData.budget * 1000000000 // Convert MAS to nanoMAS
  });
  
  // 3. Register campaign in smart contract
  const registryContract = new SmartContract(client, REGISTRY_CONTRACT_ADDRESS);
  await registryContract.call('createCampaign', campaignArgs, {
    gasLimit: 2000000
  });
};
```

### 3. Browse Ads (Developer)
Developers fetch active campaigns:

```typescript
// In DeveloperDashboard.tsx
const fetchActiveCampaigns = async () => {
  const { client } = useWallet();
  
  // Read from smart contract
  const contract = new SmartContract(client, REGISTRY_CONTRACT_ADDRESS);
  const campaigns = await contract.read('getAllActiveCampaigns');
  
  // Combine with backend metadata (images, etc.)
  const enrichedCampaigns = await Promise.all(
    campaigns.map(async (campaign) => {
      const metadata = await fetch(`/api/campaigns/${campaign.id}`);
      return { ...campaign, ...metadata };
    })
  );
  
  return enrichedCampaigns;
};
```

### 4. Record Interactions
When ads are displayed/clicked:

```typescript
// In ad display component
const recordInteraction = async (campaignId, type) => {
  const { client, account } = useWallet();
  
  // Record on smart contract
  const contract = new SmartContract(client, INTERACTION_CONTRACT_ADDRESS);
  await contract.call(
    type === 'impression' ? 'recordImpression' : 'recordClick',
    new Args().addString(campaignId).addString(account.address),
    { gasLimit: 500000 }
  );
  
  // Also record in backend for analytics
  await apiRequest('POST', '/api/interactions', {
    adCampaignId: campaignId,
    developerId: account.address,
    interactionType: type
  });
};
```

### 5. Track Earnings
Developers view their earnings:

```typescript
// In DeveloperDashboard.tsx
const fetchEarnings = async () => {
  const { client, account } = useWallet();
  
  // Read from smart contract
  const contract = new SmartContract(client, PAYMENT_CONTRACT_ADDRESS);
  const earnings = await contract.read(
    'getDeveloperEarnings',
    new Args().addString(account.address)
  );
  
  return earnings;
};
```

### 6. Claim Payouts
Developers claim their earnings:

```typescript
const claimEarnings = async () => {
  const { client, account } = useWallet();
  
  const contract = new SmartContract(client, PAYMENT_CONTRACT_ADDRESS);
  const tx = await contract.call(
    'claimEarnings',
    new Args().addString(account.address),
    { gasLimit: 1000000 }
  );
  
  // Show success message
  toast({
    title: 'Earnings claimed!',
    description: `Transaction: ${tx.id}`
  });
};
```

## Environment Variables

Add contract addresses to environment:

```env
VITE_REGISTRY_CONTRACT_ADDRESS=AS...
VITE_ESCROW_CONTRACT_ADDRESS=AS...
VITE_INTERACTION_CONTRACT_ADDRESS=AS...
VITE_PAYMENT_CONTRACT_ADDRESS=AS...
VITE_REPUTATION_CONTRACT_ADDRESS=AS...
```

## Transaction States

Handle transaction lifecycle:

```typescript
const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

const executeContractCall = async () => {
  try {
    setTxState('pending');
    const result = await contract.call(...);
    setTxState('success');
    return result;
  } catch (error) {
    setTxState('error');
    throw error;
  }
};
```

## Error Handling

```typescript
try {
  await contract.call(...);
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    toast({ title: 'Insufficient MAS balance' });
  } else if (error.message.includes('gas limit')) {
    toast({ title: 'Transaction failed - try increasing gas limit' });
  } else {
    toast({ title: 'Transaction failed', description: error.message });
  }
}
```

## Gas Estimation

Estimate gas before transactions:

```typescript
const estimateGas = async (operation) => {
  // Typical gas amounts:
  const gasEstimates = {
    createCampaign: 2000000,
    recordImpression: 500000,
    recordClick: 600000,
    claimEarnings: 1000000,
  };
  
  return gasEstimates[operation] || 1000000;
};
```

## Next Steps for Full Integration

1. **Deploy Smart Contracts**: Follow smart-contract/README.md
2. **Update Environment**: Add contract addresses
3. **Implement Contract Calls**: Replace mock data with real contract interactions
4. **Add Transaction UI**: Loading states, confirmations, error handling
5. **Test on Testnet**: Verify all operations work correctly
6. **Deploy to Mainnet**: Production release

## Testing Checklist

- [ ] Wallet connection works
- [ ] Campaign creation locks funds in escrow
- [ ] Ads are registered on-chain
- [ ] Impressions/clicks are recorded
- [ ] Earnings are tracked correctly
- [ ] Payouts execute successfully
- [ ] Gas costs are reasonable
- [ ] Error handling works properly
- [ ] Transaction confirmations appear
- [ ] User experience is smooth
