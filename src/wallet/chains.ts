/**
 * Stacks blockchain chain configurations for WalletConnect
 * Reference: https://docs.walletconnect.network/wallet-sdk/chain-support/stacks
 */

export interface StacksChainInfo {
  chainId: string;
  network: "mainnet" | "testnet" | "devnet";
  name: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorerUrl: string;
}

export const STACKS_CHAINS: Record<string, StacksChainInfo> = {
  mainnet: {
    chainId: "stacks:mainnet",
    network: "mainnet",
    name: "Stacks Mainnet",
    rpcUrl: "https://api.mainnet.hiro.so",
    nativeCurrency: {
      name: "STX",
      symbol: "STX",
      decimals: 6,
    },
    explorerUrl: "https://explorer.hiro.so",
  },
  testnet: {
    chainId: "stacks:testnet",
    network: "testnet",
    name: "Stacks Testnet",
    rpcUrl: "https://api.testnet.hiro.so",
    nativeCurrency: {
      name: "STX",
      symbol: "STX",
      decimals: 6,
    },
    explorerUrl: "https://testnet-explorer.hiro.so",
  },
  devnet: {
    chainId: "stacks:devnet",
    network: "devnet",
    name: "Stacks Devnet",
    rpcUrl: "http://localhost:3999",
    nativeCurrency: {
      name: "STX",
      symbol: "STX",
      decimals: 6,
    },
    explorerUrl: "http://localhost:3000",
  },
};

/**
 * Get chain info by network name
 */
export function getStacksChainInfo(
  network: "mainnet" | "testnet" | "devnet" = "testnet"
): StacksChainInfo {
  const chain = STACKS_CHAINS[network];
  if (!chain) {
    throw new Error(`Unknown Stacks network: ${network}`);
  }
  return chain;
}

/**
 * Get all supported Stacks chains for WalletConnect
 */
export function getStacksChainsForWalletConnect(): StacksChainInfo[] {
  return Object.values(STACKS_CHAINS);
}
