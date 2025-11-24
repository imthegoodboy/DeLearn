## Massa DeAds Deployment Guide

This project contains two deployable artifacts:

1. The AssemblyScript smart contract located in `contract/`
2. The Vite + React front-end located in `client/`

Follow the steps below to ship both pieces to Massa buildnet or mainnet.

---

### 1. Prerequisites

- Node.js 18+
- `npm install` at the repository root (installs dependencies for both workspaces)
- Massa wallet (MassaStation or Bearby) funded on the target network
- RPC endpoint:
  - Buildnet public RPC: `https://buildnet.massa.net/api/v2`
  - Or your own node URL

---

### 2. Build and Deploy the Smart Contract

1. **Install contract dependencies**

   ```bash
   cd contract
   npm install
   ```

2. **Compile to WebAssembly**

   ```bash
   npm run build
   # Output lives in contract/build/main.wasm
   ```

3. **Set deployment environment variables**

   Create `contract/.env`:

   ```ini
   MASSA_PRIVATE_KEY=<your_private_key>
   MASSA_PUBLIC_KEY=<optional_public_key>
   MASSA_NETWORK=buildnet        # or mainnet, custom
   MASSA_RPC_URL=https://buildnet.massa.net/api/v2
   MASSA_PLATFORM_NAME=Massa DeAds
   MASSA_DEPLOY_COINS=0.05       # escrow sent with constructor
   MASSA_DEPLOY_FEE=0.05
   MASSA_DEPLOY_GAS=180000000
   ```

4. **Deploy**

   ```bash
   npm run deploy
   ```

   The script prints `Contract deployed at: <address>`. Copy this value.

---

### 3. Wire the Front-end to the Contract

1. Create `client/.env` (or `.env.local`):

   ```ini
   VITE_MASSA_CONTRACT_ADDRESS=<address_from_step_2>
   VITE_MASSA_RPC_URL=https://buildnet.massa.net/api/v2
   VITE_MASSA_MAX_GAS=160000000
   ```

2. Install root dependencies and run the dev server:

   ```bash
   cd ..
   npm install
   npm run dev
   ```

   The wallet modal now uses the deployed contract for onboarding, campaign creation, payouts, etc.

---

### 4. Deploy the Front-end to Massa DeWeb

1. Build the static assets:

   ```bash
   npm run build
   # Output in client/dist
   ```

2. Upload to DeWeb (using massa-client or your node CLI):

   ```bash
   massa-client > wallet_add_secret_keys <your_private_key>
   massa-client > node_start_storing_data
   massa-client > datastore_store_data <your_address> <key=deads/index.html> <file=client/dist/index.html>
   # repeat for additional assets or use a helper script to upload the entire dist folder
   ```

3. Configure a DeWeb redirection (optional) so `https://deads.yourname.massa/` points to the uploaded bundle.

---

### 5. Useful Commands

| Action                         | Command                                                  |
| ------------------------------ | -------------------------------------------------------- |
| Build smart contract           | `npm run build --prefix contract`                        |
| Deploy smart contract          | `npm run deploy --prefix contract`                       |
| Run front-end locally          | `npm run dev`                                            |
| Build front-end                | `npm run build`                                          |
| Preview production build       | `npm run preview --prefix client`                        |
| Trigger payouts manually       | Use the Innovation Hub page or call `triggerScheduledPayouts` via wallet |

---

### Troubleshooting

- **Wallet not detected**: Ensure MassaStation or Bearby is running and unlocked.
- **Deployment fails with gas error**: Increase `MASSA_DEPLOY_GAS` or `MASSA_DEPLOY_FEE`.
- **Front-end shows empty stats**: Confirm `.env` values and rebuild (`npm run dev -- --force`).
- **On-chain reads failing**: RPC could be rate-limited; provide your own node via `VITE_MASSA_RPC_URL`.

Happy hacking! 🚀

