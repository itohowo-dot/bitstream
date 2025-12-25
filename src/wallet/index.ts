/**
 * WalletConnect integration for BitStream
 * Provides wallet connection and transaction signing capabilities via WalletConnect SDK
 */

export {
  WalletConnectManager,
  createWalletConnectManager,
  type WalletConnectConfig,
} from "./walletConnect";

export {
  StacksWalletConnectBridge,
  createStacksWalletConnectBridge,
  type StacksAccount,
  type SignStacksTransactionRequest,
  type SignStacksMessageRequest,
} from "./stacksIntegration";

export {
  STACKS_CHAINS,
  getStacksChainInfo,
  getStacksChainsForWalletConnect,
  type StacksChainInfo,
} from "./chains";
