/**
 * Example usage of WalletConnect integration with BitStream
 * This demonstrates how to initialize and use wallet connection in your dApp
 */

import {
  createWalletConnectManager,
  createStacksWalletConnectBridge,
  getStacksChainInfo,
} from "./wallet";

/**
 * Example: Initialize WalletConnect manager
 */
export async function initializeWalletConnect(): Promise<void> {
  // Create WalletConnect manager with your project ID
  // Get your project ID from: https://cloud.walletconnect.com
  const walletManager = createWalletConnectManager({
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "your-project-id",
    appName: "BitStream",
    appDescription: "Off-chain payment channel protocol",
    appUrl: "https://bitstream.app",
    appIcon: "https://bitstream.app/icon.png",
  });

  try {
    // Initialize WalletConnect
    await walletManager.initializeSession();

    // Get testnet chain info
    const testnetChain = getStacksChainInfo("testnet");
    console.log("Connected to:", testnetChain.name);
    console.log("RPC URL:", testnetChain.rpcUrl);

    // Create Stacks-specific bridge
    const stacksBridge = createStacksWalletConnectBridge(
      walletManager.getWalletKit(),
      testnetChain
    );

    // Connect wallet
    // await stacksBridge.connectStacksWallet();

    return;
  } catch (error) {
    console.error("Failed to initialize WalletConnect:", error);
    throw error;
  }
}

/**
 * Example: Handle wallet connection
 */
export async function connectWallet(): Promise<void> {
  const walletManager = createWalletConnectManager({
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "your-project-id",
  });

  try {
    await walletManager.initializeSession();

    // The pairing URI would be displayed to the user as a QR code
    // Users scan this with their wallet app to establish connection
    // Example: await walletManager.pair(pairingUri);

    console.log("Wallet connection initialized");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

/**
 * Example: Sign a transaction
 */
export async function signTransaction(transactionHex: string): Promise<void> {
  const walletManager = createWalletConnectManager({
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "your-project-id",
  });

  const stacksBridge = createStacksWalletConnectBridge(
    walletManager.getWalletKit(),
    getStacksChainInfo("testnet")
  );

  try {
    // Sign the transaction
    // const signedTx = await stacksBridge.signStacksTransaction({
    //   transaction: transactionHex,
    //   broadcast: false,
    // });
    //
    // console.log("Transaction signed:", signedTx);
  } catch (error) {
    console.error("Transaction signing failed:", error);
  }
}

/**
 * Example: Sign a message
 */
export async function signMessage(message: string): Promise<void> {
  const walletManager = createWalletConnectManager({
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "your-project-id",
  });

  const stacksBridge = createStacksWalletConnectBridge(
    walletManager.getWalletKit(),
    getStacksChainInfo("testnet")
  );

  try {
    // Sign a message for authentication or verification
    // const signature = await stacksBridge.signStacksMessage({
    //   message: message,
    // });
    //
    // console.log("Message signed:", signature);
  } catch (error) {
    console.error("Message signing failed:", error);
  }
}
