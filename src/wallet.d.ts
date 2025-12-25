/**
 * WalletConnect SDK Type Definitions and Documentation
 * 
 * This file provides TypeScript definitions for the WalletConnect integration
 * used with BitStream payment channels on Stacks blockchain.
 */

/**
 * Core Configuration
 */
export interface WalletConnectConfig {
  /** Your WalletConnect Project ID from https://cloud.walletconnect.com */
  projectId: string;

  /** Application name displayed to wallet users */
  appName?: string;

  /** Application description */
  appDescription?: string;

  /** Application URL */
  appUrl?: string;

  /** Application icon URL */
  appIcon?: string;
}

/**
 * Stacks Account Information
 */
export interface StacksAccount {
  /** Stacks wallet address (S-prefixed) */
  address: string;

  /** Account public key for verification */
  publicKey: string;

  /** Connected network */
  chainId: "mainnet" | "testnet" | "devnet";
}

/**
 * Stacks Transaction Signing Request
 */
export interface SignStacksTransactionRequest {
  /** Transaction hex string */
  transaction: string;

  /** Whether to broadcast immediately after signing */
  broadcast?: boolean;
}

/**
 * Stacks Message Signing Request
 */
export interface SignStacksMessageRequest {
  /** Message to sign */
  message: string;

  /** Domain for signature verification */
  domain?: string;
}

/**
 * Stacks Blockchain Chain Information
 */
export interface StacksChainInfo {
  /** Chain identifier (e.g., "stacks:testnet") */
  chainId: string;

  /** Network name */
  network: "mainnet" | "testnet" | "devnet";

  /** Display name */
  name: string;

  /** RPC endpoint URL */
  rpcUrl: string;

  /** Native currency information */
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };

  /** Block explorer URL */
  explorerUrl: string;
}

/**
 * WalletConnect Manager Class
 * 
 * Main entry point for WalletConnect functionality.
 * 
 * @example
 * ```typescript
 * const manager = createWalletConnectManager({
 *   projectId: process.env.WALLETCONNECT_PROJECT_ID!,
 *   appName: "BitStream"
 * });
 * await manager.initializeSession();
 * ```
 */
export declare class WalletConnectManager {
  constructor(config: WalletConnectConfig);

  /** Initialize WalletConnect session */
  initializeSession(): Promise<void>;

  /** Pair with wallet using connection URI */
  pair(uri: string): Promise<void>;

  /** Disconnect an active session */
  disconnect(sessionTopic: string): Promise<void>;

  /** Get WalletKit SDK instance */
  getWalletKit(): any;

  /** Get Core client instance */
  getCore(): any;

  /** Get project ID */
  getProjectId(): string;
}

/**
 * Stacks-specific WalletConnect Bridge
 * 
 * Handles Stacks transactions and message signing via WalletConnect.
 * 
 * @example
 * ```typescript
 * const bridge = createStacksWalletConnectBridge(
 *   walletKit,
 *   getStacksChainInfo("testnet")
 * );
 * const signature = await bridge.signStacksTransaction({
 *   transaction: txHex
 * });
 * ```
 */
export declare class StacksWalletConnectBridge {
  constructor(walletKit: any, chainInfo: StacksChainInfo);

  /** Connect to Stacks wallet */
  connectStacksWallet(): Promise<StacksAccount>;

  /** Sign a Stacks transaction */
  signStacksTransaction(
    request: SignStacksTransactionRequest
  ): Promise<string>;

  /** Sign a message with Stacks wallet */
  signStacksMessage(request: SignStacksMessageRequest): Promise<string>;

  /** Get connected chain information */
  getChainInfo(): StacksChainInfo;
}

/**
 * Factory Functions
 */

/**
 * Create a new WalletConnect manager
 * 
 * @param config - WalletConnect configuration
 * @returns Initialized WalletConnect manager
 * 
 * @example
 * ```typescript
 * const manager = createWalletConnectManager({
 *   projectId: "your-project-id"
 * });
 * ```
 */
export declare function createWalletConnectManager(
  config: WalletConnectConfig
): WalletConnectManager;

/**
 * Create a Stacks-specific WalletConnect bridge
 * 
 * @param walletKit - WalletKit instance
 * @param chainInfo - Stacks chain information
 * @returns Stacks integration bridge
 * 
 * @example
 * ```typescript
 * const bridge = createStacksWalletConnectBridge(
 *   manager.getWalletKit(),
 *   getStacksChainInfo("testnet")
 * );
 * ```
 */
export declare function createStacksWalletConnectBridge(
  walletKit: any,
  chainInfo: StacksChainInfo
): StacksWalletConnectBridge;

/**
 * Get Stacks chain information by network name
 * 
 * @param network - Network name (mainnet, testnet, or devnet)
 * @returns Chain information for the requested network
 * 
 * @example
 * ```typescript
 * const testnet = getStacksChainInfo("testnet");
 * console.log(testnet.rpcUrl); // https://api.testnet.hiro.so
 * ```
 */
export declare function getStacksChainInfo(
  network?: "mainnet" | "testnet" | "devnet"
): StacksChainInfo;

/**
 * Get all supported Stacks chains
 * 
 * @returns Array of all supported Stacks chain configurations
 * 
 * @example
 * ```typescript
 * const chains = getStacksChainsForWalletConnect();
 * chains.forEach(chain => {
 *   console.log(chain.name); // Stacks Mainnet, Stacks Testnet, etc.
 * });
 * ```
 */
export declare function getStacksChainsForWalletConnect(): StacksChainInfo[];

/**
 * Environment Variables
 * 
 * Set these in your .env file:
 * 
 * WALLETCONNECT_PROJECT_ID - Your WalletConnect project ID (required)
 * STACKS_NETWORK - Target network: mainnet, testnet, or devnet (default: testnet)
 * STACKS_RPC_URL - Custom Stacks RPC URL (optional, uses defaults if not set)
 */

/**
 * Networks and Endpoints
 * 
 * Mainnet:
 * - RPC: https://api.mainnet.hiro.so
 * - Explorer: https://explorer.hiro.so
 * 
 * Testnet (recommended for development):
 * - RPC: https://api.testnet.hiro.so
 * - Explorer: https://testnet-explorer.hiro.so
 * - Faucet: https://testnet.coins.stackswap.org/
 * 
 * Devnet (local):
 * - RPC: http://localhost:3999
 * - Explorer: http://localhost:3000
 * - Start with: clarinet integrate
 */

/**
 * Supported Wallets
 * 
 * These wallets support WalletConnect with Stacks:
 * - Xverse Wallet (https://www.xverse.app/)
 * - Hiro Wallet (https://www.hiro.so/wallet)
 * - Leather Wallet (https://leather.io/)
 * - Any wallet supporting WalletConnect v2.0
 */

/**
 * Resources
 * 
 * - WalletConnect: https://docs.walletconnect.com/
 * - WalletConnect Stacks: https://docs.walletconnect.network/wallet-sdk/chain-support/stacks
 * - Stacks: https://docs.stacks.co/
 * - Hiro API: https://docs.hiro.so/
 */
