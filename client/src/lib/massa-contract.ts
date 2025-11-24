import {
  Args,
  JsonRpcPublicProvider,
  Mas,
  Provider,
  SmartContract,
} from '@massalabs/massa-web3';
import type {
  AdCampaign,
  CampaignFilters,
  CreateCampaignInput,
  DeveloperProfile,
  HosterProfile,
  PlatformStats,
  RegisterDeveloperInput,
  RegisterHosterInput,
} from '@shared/schema';
import {
  sampleCampaigns,
  sampleDeveloper,
  sampleHoster,
  sampleStats,
} from '@/data/sampleData';
import { masToNano, nanoToMasNumber } from './units';

const CONTRACT_ADDRESS = import.meta.env.VITE_MASSA_CONTRACT_ADDRESS;
const RPC_URL =
  import.meta.env.VITE_MASSA_RPC_URL ?? 'https://buildnet.massa.net/api/v2';
const DEFAULT_MAX_GAS = BigInt(
  import.meta.env.VITE_MASSA_MAX_GAS ?? '160000000',
);
export const contractConfigured = Boolean(CONTRACT_ADDRESS);

let reader: SmartContract | null = null;

function getReader(): SmartContract {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Smart contract address is not configured.');
  }
  if (!reader) {
    const provider = JsonRpcPublicProvider.fromRPCUrl(RPC_URL);
    reader = new SmartContract(provider, CONTRACT_ADDRESS);
  }
  return reader;
}

async function read(functionName: string, args?: Args): Promise<Args> {
  const sc = getReader();
  const payload = await sc.read(functionName, args ?? new Args());
  return new Args(payload.value);
}

function decodeCampaign(args: Args): AdCampaign {
  const id = Number(args.nextU32());
  const owner = args.nextString();
  const title = args.nextString();
  const description = args.nextString();
  const category = args.nextString();
  const targetUrl = args.nextString();
  const creativeUri = args.nextString();
  const pricingModel = args.nextString();
  const rateRaw = args.nextU64();
  const budgetRaw = args.nextU64();
  const spentRaw = args.nextU64();
  const status = args.nextString();
  const impressions = Number(args.nextU64());
  const clicks = Number(args.nextU64());
  const createdAt = Number(args.nextU64());
  const updatedAt = Number(args.nextU64());

  const rateMas = nanoToMasNumber(rateRaw);
  const budget = nanoToMasNumber(budgetRaw);
  const spent = nanoToMasNumber(spentRaw);

  return {
    id,
    owner,
    title,
    description,
    category: category as AdCampaign['category'],
    imageUrl: undefined,
    videoUrl: null,
    htmlSnippet: null,
    targetUrl,
    creativeUri,
    pricingModel: pricingModel as AdCampaign['pricingModel'],
    costPerClick: pricingModel === 'cpc' ? rateMas : null,
    costPerImpression: pricingModel === 'cpm' ? rateMas : null,
    budget,
    spent,
    status: status as AdCampaign['status'],
    impressions,
    clicks,
    createdAt,
    updatedAt,
  };
}

function decodeHoster(args: Args): HosterProfile {
  const address = args.nextString();
  const name = args.nextString();
  const businessName = args.nextString();
  const categories = args.nextString();
  const totalBudget = nanoToMasNumber(args.nextU64());
  const totalSpent = nanoToMasNumber(args.nextU64());
  const activeCampaigns = Number(args.nextU32());
  const createdAt = Number(args.nextU64());
  const updatedAt = Number(args.nextU64());

  return {
    address,
    name,
    businessName,
    categories: categories ? categories.split('|') : [],
    totalBudget,
    totalSpent,
    activeCampaigns,
    createdAt,
    updatedAt,
  };
}

function decodeDeveloper(args: Args): DeveloperProfile {
  const address = args.nextString();
  const name = args.nextString();
  const website = args.nextString();
  const categories = args.nextString();
  const reputation = Number(args.nextI32());
  const impressions = Number(args.nextU64());
  const clicks = Number(args.nextU64());
  const pendingPayout = nanoToMasNumber(args.nextU64());
  const lifetimeEarnings = nanoToMasNumber(args.nextU64());
  const lastPayoutAt = Number(args.nextU64());
  const fraudCount = Number(args.nextU32());
  const createdAt = Number(args.nextU64());
  const updatedAt = Number(args.nextU64());

  return {
    address,
    name,
    website,
    categories: categories ? categories.split('|') : [],
    reputation,
    impressions,
    clicks,
    pendingPayout,
    lifetimeEarnings,
    lastPayoutAt,
    fraudCount,
    createdAt,
    updatedAt,
  };
}

function cloneCampaigns(): AdCampaign[] {
  return sampleCampaigns.map((campaign) => ({ ...campaign }));
}

function fallbackHoster(address?: string): HosterProfile {
  return {
    ...sampleHoster,
    address: address ?? sampleHoster.address,
    categories: [...sampleHoster.categories],
  };
}

function fallbackDeveloper(address?: string): DeveloperProfile {
  return {
    ...sampleDeveloper,
    address: address ?? sampleDeveloper.address,
    categories: [...sampleDeveloper.categories],
  };
}

async function safeFetch<T>(task: () => Promise<T>, fallback: () => T) {
  if (!contractConfigured) {
    return fallback();
  }
  try {
    return await task();
  } catch (error) {
    console.warn('Falling back to demo data:', error);
    return fallback();
  }
}

export async function fetchCampaigns(
  filters: CampaignFilters = {},
): Promise<AdCampaign[]> {
  return safeFetch(async () => {
    const args = new Args()
      .addU32(BigInt(filters.offset ?? 0))
      .addU32(BigInt(filters.limit ?? 24))
      .addString(filters.category ?? '')
      .addString(filters.status ?? '');
    const response = await read('listCampaigns', args);
    const count = Number(response.nextU32());
    const campaigns: AdCampaign[] = [];
    for (let i = 0; i < count; i++) {
      campaigns.push(decodeCampaign(response));
    }
    return campaigns;
  }, cloneCampaigns);
}

export async function fetchCampaignById(id: number): Promise<AdCampaign> {
  return safeFetch(async () => {
    const args = new Args().addU32(BigInt(id));
    const payload = await read('getCampaign', args);
    return decodeCampaign(payload);
  }, () => ({ ...sampleCampaigns[0], id }));
}

export async function fetchHosterProfile(
  address?: string,
): Promise<HosterProfile> {
  return safeFetch(async () => {
    const args = address ? new Args().addString(address) : new Args();
    const payload = await read('getHosterProfile', args);
    return decodeHoster(payload);
  }, () => fallbackHoster(address));
}

export async function fetchDeveloperProfile(
  address?: string,
): Promise<DeveloperProfile> {
  return safeFetch(async () => {
    const args = address ? new Args().addString(address) : new Args();
    const payload = await read('getDeveloperProfile', args);
    return decodeDeveloper(payload);
  }, () => fallbackDeveloper(address));
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  return safeFetch(async () => {
    const payload = await read('getPlatformStats');
    return {
      hosters: Number(payload.nextU32()),
      developers: Number(payload.nextU32()),
      campaigns: Number(payload.nextU32()),
      activeCampaigns: Number(payload.nextU32()),
      lockedBudget: nanoToMasNumber(payload.nextU64()),
      spent: nanoToMasNumber(payload.nextU64()),
      impressions: Number(payload.nextU64()),
      clicks: Number(payload.nextU64()),
    };
  }, () => ({ ...sampleStats }));
}

function ensureAccount(provider: Provider | null | undefined): Provider {
  if (!provider) {
    throw new Error('Wallet account is not connected');
  }
  return provider;
}

function categoriesToString(categories: string[]): string {
  return categories.filter(Boolean).join('|');
}

const DEFAULT_CALL_OPTIONS = {
  fee: Mas.fromString('0.02'),
  maxGas: DEFAULT_MAX_GAS,
};

function simulateNetworkLatency(delay = 600) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function registerHosterOnChain(
  account: Provider | null,
  input: RegisterHosterInput,
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  const args = new Args()
    .addString(input.name)
    .addString(input.businessName ?? '')
    .addString(categoriesToString(input.categories));

  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'registerHoster',
    parameter: args,
    ...DEFAULT_CALL_OPTIONS,
  });
}

export async function registerDeveloperOnChain(
  account: Provider | null,
  input: RegisterDeveloperInput,
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  const args = new Args()
    .addString(input.name)
    .addString(input.website ?? '')
    .addString(categoriesToString(input.categories));

  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'registerDeveloper',
    parameter: args,
    ...DEFAULT_CALL_OPTIONS,
  });
}

export async function createCampaignOnChain(
  account: Provider | null,
  input: CreateCampaignInput,
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  const args = new Args()
    .addString(input.title)
    .addString(input.description)
    .addString(input.category)
    .addString(input.targetUrl)
    .addString(input.creativeUri)
    .addString(input.pricingModel)
    .addU64(masToNano(input.rate))
    .addU64(masToNano(input.budget));

  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'createCampaign',
    parameter: args,
    coins: Mas.fromString(input.budget.toString()),
    fee: Mas.fromString('0.05'),
    maxGas: DEFAULT_MAX_GAS,
  });
}

export async function updateCampaignStatusOnChain(
  account: Provider | null,
  id: number,
  status: AdCampaign['status'],
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  const args = new Args().addU32(BigInt(id)).addString(status);
  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'updateCampaignStatus',
    parameter: args,
    ...DEFAULT_CALL_OPTIONS,
  });
}

export async function claimDeveloperEarningsOnChain(
  account: Provider | null,
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'claimDeveloperEarnings',
    parameter: new Args(),
    ...DEFAULT_CALL_OPTIONS,
  });
}

export async function triggerScheduledPayoutsOnChain(
  account: Provider | null,
  batchSize = 25,
): Promise<void> {
  if (!contractConfigured) {
    await simulateNetworkLatency();
    return;
  }
  const provider = ensureAccount(account);
  const args = new Args().addU32(BigInt(batchSize));
  await provider.callSC({
    target: CONTRACT_ADDRESS!,
    func: 'triggerScheduledPayouts',
    parameter: args,
    ...DEFAULT_CALL_OPTIONS,
  });
}

