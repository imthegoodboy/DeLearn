// The entry file of your WebAssembly module.
import {
  Address,
  Context,
  Storage,
  generateEvent,
  transferCoins,
} from '@massalabs/massa-as-sdk';
import {
  PersistentMap,
  _KEY_ELEMENT_SUFFIX,
} from '@massalabs/massa-as-sdk/assembly/collections';
import {
  Args,
  Result,
  Serializable,
  bytesToString,
  stringToBytes,
} from '@massalabs/as-types';

export const PLATFORM_KEY = 'platform:name';
const PLATFORM_OWNER_KEY = 'platform:owner';
const CAMPAIGN_COUNTER_KEY = 'platform:campaign:counter';
const CLICK_PREFIX = 'click::';

const CAMPAIGN_PREFIX = 'campaign';
const HOSTER_PREFIX = 'hoster';
const DEVELOPER_PREFIX = 'developer';

const MIN_RATE: u64 = 1;
const FRAUD_WINDOW_MS: u64 = 60000; // 60 seconds
const PAYOUT_INTERVAL_MS: u64 = 86400000; // 24 hours
const ONE_THOUSAND: u32 = 1000;

const campaigns = new PersistentMap<string, Campaign>(CAMPAIGN_PREFIX);
const hosters = new PersistentMap<string, HosterProfile>(HOSTER_PREFIX);
const developers = new PersistentMap<string, DeveloperProfile>(DEVELOPER_PREFIX);

class Campaign implements Serializable {
  constructor(
    public id: u32 = 0,
    public owner: string = '',
    public title: string = '',
    public description: string = '',
    public category: string = '',
    public targetUrl: string = '',
    public creativeUri: string = '',
    public pricingModel: string = 'cpc',
    public rate: u64 = 0,
    public budget: u64 = 0,
    public spent: u64 = 0,
    public status: string = 'active',
    public impressions: u64 = 0,
    public clicks: u64 = 0,
    public impressionBuffer: u32 = 0,
    public createdAt: u64 = 0,
    public updatedAt: u64 = 0,
  ) {}

  serialize(): StaticArray<u8> {
    return new Args()
      .add<u32>(this.id)
      .add(this.owner)
      .add(this.title)
      .add(this.description)
      .add(this.category)
      .add(this.targetUrl)
      .add(this.creativeUri)
      .add(this.pricingModel)
      .add<u64>(this.rate)
      .add<u64>(this.budget)
      .add<u64>(this.spent)
      .add(this.status)
      .add<u64>(this.impressions)
      .add<u64>(this.clicks)
      .add<u32>(this.impressionBuffer)
      .add<u64>(this.createdAt)
      .add<u64>(this.updatedAt)
      .serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32 = 0): Result<i32> {
    const args = new Args(data, offset);

    const id = args.nextU32();
    if (id.isErr()) {
      return new Result(0, "Can't deserialize campaign id.");
    }

    const owner = args.nextString();
    if (owner.isErr()) {
      return new Result(0, "Can't deserialize campaign owner.");
    }

    const title = args.nextString();
    const desc = args.nextString();
    const category = args.nextString();
    const target = args.nextString();
    const creative = args.nextString();
    const pricing = args.nextString();
    const rate = args.nextU64();
    const budget = args.nextU64();
    const spent = args.nextU64();
    const status = args.nextString();
    const impressions = args.nextU64();
    const clicks = args.nextU64();
    const buffer = args.nextU32();
    const created = args.nextU64();
    const updated = args.nextU64();

    this.id = id.unwrap();
    this.owner = owner.unwrap();
    this.title = title.unwrap();
    this.description = desc.unwrap();
    this.category = category.unwrap();
    this.targetUrl = target.unwrap();
    this.creativeUri = creative.unwrap();
    this.pricingModel = pricing.unwrap();
    this.rate = rate.unwrap();
    this.budget = budget.unwrap();
    this.spent = spent.unwrap();
    this.status = status.unwrap();
    this.impressions = impressions.unwrap();
    this.clicks = clicks.unwrap();
    this.impressionBuffer = buffer.unwrap();
    this.createdAt = created.unwrap();
    this.updatedAt = updated.unwrap();

    return new Result(args.offset);
  }
}

class HosterProfile implements Serializable {
  constructor(
    public address: string = '',
    public name: string = '',
    public businessName: string = '',
    public categories: string = '',
    public createdAt: u64 = 0,
    public updatedAt: u64 = 0,
    public totalBudget: u64 = 0,
    public totalSpent: u64 = 0,
    public activeCampaigns: u32 = 0,
  ) {}

  serialize(): StaticArray<u8> {
    return new Args()
      .add(this.address)
      .add(this.name)
      .add(this.businessName)
      .add(this.categories)
      .add<u64>(this.createdAt)
      .add<u64>(this.updatedAt)
      .add<u64>(this.totalBudget)
      .add<u64>(this.totalSpent)
      .add<u32>(this.activeCampaigns)
      .serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32 = 0): Result<i32> {
    const args = new Args(data, offset);
    const addr = args.nextString();
    if (addr.isErr()) {
      return new Result(0, "Can't deserialize hoster address.");
    }
    this.address = addr.unwrap();
    this.name = args.nextString().unwrap();
    this.businessName = args.nextString().unwrap();
    this.categories = args.nextString().unwrap();
    this.createdAt = args.nextU64().unwrap();
    this.updatedAt = args.nextU64().unwrap();
    this.totalBudget = args.nextU64().unwrap();
    this.totalSpent = args.nextU64().unwrap();
    this.activeCampaigns = args.nextU32().unwrap();
    return new Result(args.offset);
  }
}

class DeveloperProfile implements Serializable {
  constructor(
    public address: string = '',
    public name: string = '',
    public website: string = '',
    public categories: string = '',
    public createdAt: u64 = 0,
    public updatedAt: u64 = 0,
    public reputation: i32 = 50,
    public impressions: u64 = 0,
    public clicks: u64 = 0,
    public pendingPayout: u64 = 0,
    public lifetimeEarnings: u64 = 0,
    public lastPayoutAt: u64 = 0,
    public fraudCount: u32 = 0,
  ) {}

  serialize(): StaticArray<u8> {
    return new Args()
      .add(this.address)
      .add(this.name)
      .add(this.website)
      .add(this.categories)
      .add<u64>(this.createdAt)
      .add<u64>(this.updatedAt)
      .add<i32>(this.reputation)
      .add<u64>(this.impressions)
      .add<u64>(this.clicks)
      .add<u64>(this.pendingPayout)
      .add<u64>(this.lifetimeEarnings)
      .add<u64>(this.lastPayoutAt)
      .add<u32>(this.fraudCount)
      .serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32 = 0): Result<i32> {
    const args = new Args(data, offset);
    const addr = args.nextString();
    if (addr.isErr()) {
      return new Result(0, "Can't deserialize developer address.");
    }
    this.address = addr.unwrap();
    this.name = args.nextString().unwrap();
    this.website = args.nextString().unwrap();
    this.categories = args.nextString().unwrap();
    this.createdAt = args.nextU64().unwrap();
    this.updatedAt = args.nextU64().unwrap();
    this.reputation = args.nextI32().unwrap();
    this.impressions = args.nextU64().unwrap();
    this.clicks = args.nextU64().unwrap();
    this.pendingPayout = args.nextU64().unwrap();
    this.lifetimeEarnings = args.nextU64().unwrap();
    this.lastPayoutAt = args.nextU64().unwrap();
    this.fraudCount = args.nextU32().unwrap();
    return new Result(args.offset);
  }
}

function getTimestamp(): u64 {
  return Context.timestamp();
}

function parseU32(value: string): u32 {
  if (value.length === 0) {
    return 0;
  }
  let result: u32 = 0;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 48 || code > 57) {
      continue;
    }
    result = result * 10 + <u32>(code - 48);
  }
  return result;
}

function readCampaignCounter(): u32 {
  if (!Storage.has(CAMPAIGN_COUNTER_KEY)) {
    return 0;
  }
  const raw = Storage.get<string>(CAMPAIGN_COUNTER_KEY);
  return parseU32(raw);
}

function writeCampaignCounter(value: u32): void {
  Storage.set<string>(CAMPAIGN_COUNTER_KEY, value.toString());
}

function unwrapOr<T>(result: Result<T>, fallback: T): T {
  return result.isOk() ? result.unwrap() : fallback;
}

function nextCampaignId(): u32 {
  const current = readCampaignCounter();
  const next = current + 1;
  writeCampaignCounter(next);
  return next;
}

function saveCampaign(campaign: Campaign): void {
  campaigns.set(campaign.id.toString(), campaign);
}

function requireCampaign(id: u32): Campaign {
  const stored = campaigns.getSome(id.toString(), new Campaign());
  return stored.expect('Campaign not found');
}

function saveHoster(profile: HosterProfile): void {
  hosters.set(profile.address, profile);
}

function requireHoster(address: string): HosterProfile {
  const stored = hosters.getSome(address, new HosterProfile());
  return stored.expect('Hoster profile not found');
}

function saveDeveloper(profile: DeveloperProfile): void {
  developers.set(profile.address, profile);
}

function requireDeveloper(address: string): DeveloperProfile {
  const stored = developers.getSome(address, new DeveloperProfile());
  return stored.expect('Developer profile not found');
}

function encodeCampaign(args: Args, campaign: Campaign): void {
  args
    .add<u32>(campaign.id)
    .add(campaign.owner)
    .add(campaign.title)
    .add(campaign.description)
    .add(campaign.category)
    .add(campaign.targetUrl)
    .add(campaign.creativeUri)
    .add(campaign.pricingModel)
    .add<u64>(campaign.rate)
    .add<u64>(campaign.budget)
    .add<u64>(campaign.spent)
    .add(campaign.status)
    .add<u64>(campaign.impressions)
    .add<u64>(campaign.clicks)
    .add<u64>(campaign.createdAt)
    .add<u64>(campaign.updatedAt);
}

function encodeHoster(args: Args, profile: HosterProfile): void {
  args
    .add(profile.address)
    .add(profile.name)
    .add(profile.businessName)
    .add(profile.categories)
    .add<u64>(profile.totalBudget)
    .add<u64>(profile.totalSpent)
    .add<u32>(profile.activeCampaigns)
    .add<u64>(profile.createdAt)
    .add<u64>(profile.updatedAt);
}

function encodeDeveloper(args: Args, profile: DeveloperProfile): void {
  args
    .add(profile.address)
    .add(profile.name)
    .add(profile.website)
    .add(profile.categories)
    .add<i32>(profile.reputation)
    .add<u64>(profile.impressions)
    .add<u64>(profile.clicks)
    .add<u64>(profile.pendingPayout)
    .add<u64>(profile.lifetimeEarnings)
    .add<u64>(profile.lastPayoutAt)
    .add<u32>(profile.fraudCount)
    .add<u64>(profile.createdAt)
    .add<u64>(profile.updatedAt);
}

function isCpc(pricing: string): bool {
  return pricing == 'cpc';
}

function isCpm(pricing: string): bool {
  return pricing == 'cpm';
}

function enforcePositive(value: u64, message: string): void {
  assert(value >= MIN_RATE, message);
}

function adjustReputation(profile: DeveloperProfile, delta: i32): void {
  let next = profile.reputation + delta;
  if (next > 100) {
    next = 100;
  }
  if (next < 0) {
    next = 0;
  }
  profile.reputation = next;
}

function creditDeveloper(
  developer: DeveloperProfile,
  amount: u64,
  genuine: bool,
): void {
  developer.pendingPayout += amount;
  developer.lifetimeEarnings += amount;
  developer.updatedAt = getTimestamp();
  if (genuine) {
    adjustReputation(developer, 2);
  } else {
    developer.fraudCount += 1;
    adjustReputation(developer, -5);
  }
  saveDeveloper(developer);
}

function debitCampaign(campaign: Campaign, amount: u64): void {
  if (campaign.budget < campaign.spent + amount) {
    campaign.status = 'stopped';
    generateEvent(`Campaign budget exhausted: ${campaign.id.toString()}`);
    return;
  }
  campaign.spent += amount;
  campaign.updatedAt = getTimestamp();
  saveCampaign(campaign);
}

function rewardPublisher(
  campaign: Campaign,
  developer: DeveloperProfile,
  amount: u64,
  genuine: bool = true,
): void {
  if (campaign.status != 'active') {
    return;
  }
  if (campaign.spent + amount > campaign.budget) {
    campaign.status = 'stopped';
    campaign.updatedAt = getTimestamp();
    saveCampaign(campaign);
    generateEvent(
      `CAMPAIGN_HALTED:${campaign.id.toString()}:insufficient_budget`,
    );
    return;
  }
  debitCampaign(campaign, amount);
  creditDeveloper(developer, amount, genuine);
}

function recordClickFingerprint(
  campaignId: u32,
  publisher: string,
  fingerprint: string,
  timestamp: u64,
): bool {
  const key = `${CLICK_PREFIX}${campaignId.toString()}:${publisher}:${fingerprint}`;
  if (Storage.has(key)) {
    const previous = Storage.get<string>(key);
    const lastTs = <u64>parseU32(previous);
    if (timestamp - lastTs < FRAUD_WINDOW_MS) {
      return false;
    }
  }
  Storage.set(key, timestamp.toString());
  return true;
}

function getPrefixKeys(prefix: string): Array<string> {
  const keys = Storage.getKeys(stringToBytes(prefix));
  const trimmed = new Array<string>();
  for (let i = 0; i < keys.length; i++) {
    const raw = bytesToString(keys[i]);
    if (raw.startsWith(prefix)) {
      trimmed.push(raw.slice(prefix.length));
    }
  }
  return trimmed;
}

/**
 * Initializes the platform metadata.
 */
export function constructor(binaryArgs: StaticArray<u8>): void {
  assert(Context.isDeployingContract(), 'Constructor can only be called once');
  const args = new Args(binaryArgs);
  const name = args.nextString().expect('Missing platform name');
  const ownerAddress = Context.caller().toString();
  Storage.set(PLATFORM_KEY, name);
  Storage.set(PLATFORM_OWNER_KEY, ownerAddress);
  if (!Storage.has(CAMPAIGN_COUNTER_KEY)) {
    Storage.set(CAMPAIGN_COUNTER_KEY, '0');
  }
  generateEvent(`PLATFORM_READY:${name}`);
}

/**
 * Lightweight health-check function.
 */
export function hello(_: StaticArray<u8>): StaticArray<u8> {
  const name = Storage.has(PLATFORM_KEY)
    ? Storage.get<string>(PLATFORM_KEY)
    : 'Massa DeAds';
  const response = `Massa DeAds ready - ${name}`;
  return stringToBytes(response);
}

/**
 * Allows an advertiser to register or update their profile.
 */
export function registerHoster(binaryArgs: StaticArray<u8>): void {
  const caller = Context.caller().toString();
  const args = new Args(binaryArgs);
  const name = args.nextString().expect('Missing hoster name');
  const business = args.nextString().unwrap();
  const categories = args.nextString().unwrap();
  const timestamp = getTimestamp();

  let profile: HosterProfile;
  if (hosters.contains(caller)) {
    profile = requireHoster(caller);
  } else {
    profile = new HosterProfile();
    profile.address = caller;
    profile.createdAt = timestamp;
  }

  profile.name = name;
  profile.businessName = business;
  profile.categories = categories;
  profile.updatedAt = timestamp;

  saveHoster(profile);
  generateEvent(`HOSTER_REGISTERED:${caller}`);
}

/**
 * Allows a developer/publisher to register or update their profile.
 */
export function registerDeveloper(binaryArgs: StaticArray<u8>): void {
  const caller = Context.caller().toString();
  const args = new Args(binaryArgs);
  const name = args.nextString().expect('Missing developer name');
  const website = args.nextString().unwrap();
  const categories = args.nextString().unwrap();
  const timestamp = getTimestamp();

  let profile: DeveloperProfile;
  if (developers.contains(caller)) {
    profile = requireDeveloper(caller);
  } else {
    profile = new DeveloperProfile();
    profile.address = caller;
    profile.createdAt = timestamp;
    profile.lastPayoutAt = timestamp;
  }

  profile.name = name;
  profile.website = website;
  profile.categories = categories;
  profile.updatedAt = timestamp;

  saveDeveloper(profile);
  generateEvent(`DEVELOPER_REGISTERED:${caller}`);
}

/**
 * Creates a new ad campaign. Caller must be a registered hoster and must send coins equal to the declared budget.
 */
export function createCampaign(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const caller = Context.caller().toString();
  const args = new Args(binaryArgs);

  const title = args.nextString().expect('Missing title');
  const description = args.nextString().expect('Missing description');
  const category = args.nextString().expect('Missing category');
  const targetUrl = args.nextString().expect('Missing target URL');
  const creativeUri = args.nextString().unwrap();
  const pricingModel = args.nextString().expect('Missing pricing model');
  const rate = args.nextU64().expect('Missing rate');
  const declaredBudget = args.nextU64().expect('Missing budget');

  assert(isCpc(pricingModel) || isCpm(pricingModel), 'Invalid pricing model');
  enforcePositive(rate, 'Rate must be positive');

  const coins = Context.transferredCoins();
  assert(coins >= declaredBudget, 'Transferred coins must cover the budget');

  const hoster = requireHoster(caller);

  const id = nextCampaignId();
  const timestamp = getTimestamp();

  const campaign = new Campaign();
  campaign.id = id;
  campaign.owner = caller;
  campaign.title = title;
  campaign.description = description;
  campaign.category = category;
  campaign.targetUrl = targetUrl;
  campaign.creativeUri = creativeUri;
  campaign.pricingModel = pricingModel;
  campaign.rate = rate;
  campaign.budget = declaredBudget;
  campaign.createdAt = timestamp;
  campaign.updatedAt = timestamp;

  saveCampaign(campaign);

  hoster.totalBudget += declaredBudget;
  hoster.activeCampaigns += 1;
  hoster.updatedAt = timestamp;
  saveHoster(hoster);

  generateEvent(`CAMPAIGN_CREATED:${caller}:${id.toString()}`);
  return new Args().add<u32>(id).serialize();
}

/**
 * Updates the status of a campaign (pause, resume, stop).
 */
export function updateCampaignStatus(binaryArgs: StaticArray<u8>): void {
  const caller = Context.caller().toString();
  const args = new Args(binaryArgs);
  const campaignId = args.nextU32().expect('Missing campaign id');
  const nextStatus = args.nextString().expect('Missing status');

  assert(
    nextStatus == 'active' ||
      nextStatus == 'paused' ||
      nextStatus == 'stopped',
    'Unsupported status',
  );

  const campaign = requireCampaign(campaignId);
  assert(campaign.owner == caller, 'Only owner can update the campaign');

  campaign.status = nextStatus;
  campaign.updatedAt = getTimestamp();
  saveCampaign(campaign);

  if (nextStatus == 'stopped') {
    const hoster = requireHoster(caller);
    if (hoster.activeCampaigns > 0) {
      hoster.activeCampaigns -= 1;
    }
    hoster.updatedAt = getTimestamp();
    saveHoster(hoster);
  }

  generateEvent(`CAMPAIGN_STATUS:${campaignId.toString()}:${nextStatus}`);
}

/**
 * Records an impression delivered by a developer.
 */
export function recordImpression(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);
  const campaignId = args.nextU32().expect('Missing campaign id');
  const publisher = args.nextString().expect('Missing publisher address');

  const campaign = requireCampaign(campaignId);
  assert(campaign.status == 'active', 'Campaign inactive');
  const developer = requireDeveloper(publisher);

  campaign.impressions += 1;
  campaign.updatedAt = getTimestamp();
  developer.impressions += 1;
  developer.updatedAt = campaign.updatedAt;

  if (isCpm(campaign.pricingModel)) {
    campaign.impressionBuffer += 1;
    if (campaign.impressionBuffer >= ONE_THOUSAND) {
      campaign.impressionBuffer -= ONE_THOUSAND;
      rewardPublisher(campaign, developer, campaign.rate);
    } else {
      saveCampaign(campaign);
      saveDeveloper(developer);
    }
  } else {
    saveCampaign(campaign);
    saveDeveloper(developer);
  }
}

/**
 * Records a click, applying anti-fraud protections.
 */
export function recordClick(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);
  const campaignId = args.nextU32().expect('Missing campaign id');
  const publisher = args.nextString().expect('Missing publisher address');
  const fingerprint = args.nextString().expect('Missing fingerprint');

  const campaign = requireCampaign(campaignId);
  assert(campaign.status == 'active', 'Campaign inactive');
  assert(isCpc(campaign.pricingModel), 'Campaign is not CPC');

  const developer = requireDeveloper(publisher);
  const timestamp = getTimestamp();
  const isUnique = recordClickFingerprint(
    campaignId,
    publisher,
    fingerprint,
    timestamp,
  );

  campaign.updatedAt = timestamp;
  developer.updatedAt = timestamp;
  developer.clicks += 1;

  if (!isUnique) {
    developer.fraudCount += 1;
    adjustReputation(developer, -10);
    saveDeveloper(developer);
    return;
  }

  campaign.clicks += 1;
  rewardPublisher(campaign, developer, campaign.rate);
}

/**
 * Allows developers to withdraw their pending earnings.
 */
export function claimDeveloperEarnings(_: StaticArray<u8>): void {
  const caller = Context.caller().toString();
  const developer = requireDeveloper(caller);
  assert(developer.pendingPayout > 0, 'Nothing to claim');
  const amount = developer.pendingPayout;
  developer.pendingPayout = 0;
  developer.lastPayoutAt = getTimestamp();
  saveDeveloper(developer);

  const recipient = new Address(caller);
  transferCoins(recipient, amount);
  generateEvent(`PAYOUT_SENT:${caller}:${amount.toString()}`);
}

/**
 * Triggers batch payouts for developers whose earnings reached the daily threshold.
 */
export function triggerScheduledPayouts(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);
  const maxBatch = unwrapOr<u32>(args.nextU32(), 25);
  const now = getTimestamp();

  const prefixed = `${DEVELOPER_PREFIX}${_KEY_ELEMENT_SUFFIX}`;
  const keys = getPrefixKeys(prefixed);
  let processed: u32 = 0;
  for (let i = 0; i < keys.length; i++) {
    if (processed >= maxBatch) {
      break;
    }
    const address = keys[i];
    const profile = requireDeveloper(address);
    if (
      profile.pendingPayout == 0 ||
      now - profile.lastPayoutAt < PAYOUT_INTERVAL_MS
    ) {
      continue;
    }
    const amount = profile.pendingPayout;
    profile.pendingPayout = 0;
    profile.lastPayoutAt = now;
    saveDeveloper(profile);
    transferCoins(new Address(address), amount);
    generateEvent(`PAYOUT_SENT:${address}:${amount.toString()}`);
    processed += 1;
  }
}

/**
 * Returns paginated campaigns.
 */
export function listCampaigns(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  const offset = unwrapOr<u32>(args.nextU32(), 0);
  const limit = unwrapOr<u32>(args.nextU32(), 12);
  const maxResults = <i32>limit;
  const categoryFilter = unwrapOr<string>(args.nextString(), '');
  const statusFilter = unwrapOr<string>(args.nextString(), '');

  const total = readCampaignCounter();
  const selected = new Array<Campaign>();
  let skipped: u32 = 0;
  let current = total;

  while (current > 0 && selected.length < maxResults) {
    const key = current.toString();
    if (!campaigns.contains(key)) {
      current -= 1;
      continue;
    }
    const campaign = requireCampaign(current);
    if (
      categoryFilter.length > 0 &&
      campaign.category != categoryFilter
    ) {
      current -= 1;
      continue;
    }
    if (statusFilter.length > 0 && campaign.status != statusFilter) {
      current -= 1;
      continue;
    }
    if (skipped < offset) {
      skipped += 1;
      current -= 1;
      continue;
    }
    selected.push(campaign);
    current -= 1;
  }

  const encoded = new Args().add<u32>(<u32>selected.length);
  for (let i = 0; i < selected.length; i++) {
    encodeCampaign(encoded, selected[i]);
  }
  return encoded.serialize();
}

/**
 * Returns a single campaign.
 */
export function getCampaign(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  const campaignId = args.nextU32().expect('Missing campaign id');
  const campaign = requireCampaign(campaignId);
  const encoded = new Args();
  encodeCampaign(encoded, campaign);
  return encoded.serialize();
}

/**
 * Returns the hoster profile for the caller or for a provided address.
 */
export function getHosterProfile(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  let address = '';
  if (args.offset < args.serialize().length) {
    address = unwrapOr<string>(args.nextString(), '');
  }
  if (address.length === 0) {
    address = Context.caller().toString();
  }
  const profile = requireHoster(address);
  const encoded = new Args();
  encodeHoster(encoded, profile);
  return encoded.serialize();
}

/**
 * Returns the developer profile for the caller or for a provided address.
 */
export function getDeveloperProfile(
  binaryArgs: StaticArray<u8>,
): StaticArray<u8> {
  const args = new Args(binaryArgs);
  let address = '';
  if (args.offset < args.serialize().length) {
    address = unwrapOr<string>(args.nextString(), '');
  }
  if (address.length === 0) {
    address = Context.caller().toString();
  }
  const profile = requireDeveloper(address);
  const encoded = new Args();
  encodeDeveloper(encoded, profile);
  return encoded.serialize();
}

/**
 * Returns aggregated platform metrics.
 */
export function getPlatformStats(_: StaticArray<u8>): StaticArray<u8> {
  const prefixedHoster = `${HOSTER_PREFIX}${_KEY_ELEMENT_SUFFIX}`;
  const prefixedDeveloper = `${DEVELOPER_PREFIX}${_KEY_ELEMENT_SUFFIX}`;
  const hosterCount = <u32>getPrefixKeys(prefixedHoster).length;
  const developerCount = <u32>getPrefixKeys(prefixedDeveloper).length;
  const totalCampaigns = readCampaignCounter();

  let activeCampaigns: u32 = 0;
  let lockedBudget: u64 = 0;
  let spent: u64 = 0;
  let impressions: u64 = 0;
  let clicks: u64 = 0;

  let cursor = totalCampaigns;
  while (cursor > 0) {
    if (!campaigns.contains(cursor.toString())) {
      cursor -= 1;
      continue;
    }
    const campaign = requireCampaign(cursor);
    if (campaign.status == 'active') {
      activeCampaigns += 1;
    }
    lockedBudget += campaign.budget;
    spent += campaign.spent;
    impressions += campaign.impressions;
    clicks += campaign.clicks;
    cursor -= 1;
  }

  return new Args()
    .add<u32>(hosterCount)
    .add<u32>(developerCount)
    .add<u32>(totalCampaigns)
    .add<u32>(activeCampaigns)
    .add<u64>(lockedBudget)
    .add<u64>(spent)
    .add<u64>(impressions)
    .add<u64>(clicks)
    .serialize();
}

/**
 * Returns the highest bidding active ad for a category.
 */
export function requestAd(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  const category = args.nextString().expect('Missing category');

  let bestCampaign: Campaign | null = null;
  let cursor = readCampaignCounter();

  while (cursor > 0) {
    if (!campaigns.contains(cursor.toString())) {
      cursor -= 1;
      continue;
    }
    const campaign = requireCampaign(cursor);
    if (campaign.status != 'active' || campaign.category != category) {
      cursor -= 1;
      continue;
    }
    if (
      bestCampaign == null ||
      campaign.rate > (bestCampaign as Campaign).rate
    ) {
      bestCampaign = campaign;
    }
    cursor -= 1;
  }

  if (bestCampaign == null) {
    return new Args().add<u32>(0).serialize();
  }

  const encoded = new Args().add<u32>((bestCampaign as Campaign).id);
  encodeCampaign(encoded, bestCampaign as Campaign);
  return encoded.serialize();
}
