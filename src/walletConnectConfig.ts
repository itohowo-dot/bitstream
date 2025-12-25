/**
 * WalletConnect Configuration
 * Environment variables and setup instructions for WalletConnect integration
 */

/**
 * Required environment variables:
 * 
 * WALLETCONNECT_PROJECT_ID - Your WalletConnect Cloud project ID
 *   Get it from: https://cloud.walletconnect.com
 *
 * Optional environment variables:
 * 
 * STACKS_NETWORK - Stacks network to connect to
 *   Options: mainnet, testnet, devnet
 *   Default: testnet
 *
 * STACKS_RPC_URL - Custom RPC URL for Stacks
 *   Default: Uses standard Hiro API endpoints
 */

export const WALLETCONNECT_CONFIG = {
  // Your project ID from WalletConnect Cloud
  projectId: process.env.WALLETCONNECT_PROJECT_ID || "",

  // Relay server (default is WalletConnect public relay)
  relayUrl: "wss://relay.walletconnect.com",

  // App metadata
  appMetadata: {
    name: "BitStream",
    description: "Off-chain payment channel protocol on Stacks",
    url: typeof window !== "undefined" ? window.location.origin : "",
    icons: [],
  },

  // Stacks configuration
  stacks: {
    network: (process.env.STACKS_NETWORK as "mainnet" | "testnet" | "devnet") || "testnet",
    rpcUrl: process.env.STACKS_RPC_URL,
  },
};

/**
 * Setup Instructions
 * 
 * 1. Create WalletConnect Project:
 *    - Go to https://cloud.walletconnect.com
 *    - Sign up or log in
 *    - Create a new project
 *    - Copy your Project ID
 *
 * 2. Set Environment Variables:
 *    Create a .env file in the project root:
 *    
 *    WALLETCONNECT_PROJECT_ID=your_project_id_here
 *    STACKS_NETWORK=testnet
 *
 * 3. Supported Wallets:
 *    WalletConnect SDK supports these Stacks wallets:
 *    - Stacks Wallet (https://www.xverse.app/)
 *    - Hiro Wallet (https://www.hiro.so/wallet)
 *    - Leather Wallet
 *    - And any other wallet supporting WalletConnect v2.0
 *
 * 4. Stacks Testnet Setup:
 *    - Request STX testnet tokens from faucet
 *    - Set STACKS_NETWORK=testnet in .env
 *    - RPC: https://api.testnet.hiro.so
 *    - Explorer: https://testnet-explorer.hiro.so
 *
 * 5. Local Development (Devnet):
 *    - Run Stacks devnet: clarinet integrate
 *    - Set STACKS_NETWORK=devnet
 *    - RPC: http://localhost:3999
 *    - Explorer: http://localhost:3000
 */

// Validate required config
if (!WALLETCONNECT_CONFIG.projectId) {
  console.warn(
    "⚠️  WALLETCONNECT_PROJECT_ID not set. Please set this environment variable."
  );
  console.warn("Get your project ID from: https://cloud.walletconnect.com");
}
