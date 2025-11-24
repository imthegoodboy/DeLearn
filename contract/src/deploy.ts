import 'dotenv/config';
import {
  Account,
  Args,
  Mas,
  SmartContract,
  JsonRpcProvider,
  MAX_GAS_EXECUTE,
} from '@massalabs/massa-web3';
import { getScByteCode } from './utils';

const account = await Account.fromEnv();
const rpcUrl = process.env.MASSA_RPC_URL;
const network = (process.env.MASSA_NETWORK ?? 'buildnet').toLowerCase();

let provider: JsonRpcProvider;
if (rpcUrl) {
  provider = JsonRpcProvider.fromRPCUrl(rpcUrl, account);
} else if (network === 'mainnet') {
  provider = JsonRpcProvider.mainnet(account);
} else {
  provider = JsonRpcProvider.buildnet(account);
}

const byteCode = getScByteCode('build', 'main.wasm');
const platformName = process.env.MASSA_PLATFORM_NAME ?? 'Massa DeAds';
const deployFee = process.env.MASSA_DEPLOY_FEE ?? '0.05';
const deployCoins = process.env.MASSA_DEPLOY_COINS ?? '0.01';
const deployGas =
  process.env.MASSA_DEPLOY_GAS != null
    ? BigInt(process.env.MASSA_DEPLOY_GAS)
    : (MAX_GAS_EXECUTE ?? 0n) > 1000n
      ? MAX_GAS_EXECUTE - 1000n
      : (MAX_GAS_EXECUTE ?? 1000000000n);

console.log(`Deploying Massa DeAds contract as ${account.address}`);
console.log(`Network: ${rpcUrl ? rpcUrl : network}, Platform name: ${platformName}`);
console.log(`Using maxGas: ${deployGas.toString()} units`);

const constructorArgs = new Args().addString(platformName);

const contract = await SmartContract.deploy(
  provider,
  byteCode,
  constructorArgs,
  {
    coins: Mas.fromString(deployCoins),
    fee: Mas.fromString(deployFee),
    maxGas: deployGas,
  },
);

console.log('Contract deployed at:', contract.address);
console.log('Waiting for deployment events...');

const events = await provider.getEvents({
  smartContractAddress: contract.address,
});

for (const event of events) {
  console.log('Event message:', event.data);
}

console.log('\nUpdate your frontend .env file with:');
console.log(`VITE_MASSA_CONTRACT_ADDRESS=${contract.address}`);
