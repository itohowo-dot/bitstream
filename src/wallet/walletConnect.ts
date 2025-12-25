import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

/**
 * Initialize WalletConnect SDK for Stacks blockchain integration
 * Supports Stacks mainnet, testnet, and devnet
 */

export interface WalletConnectConfig {
  projectId: string;
  appName?: string;
  appDescription?: string;
  appUrl?: string;
  appIcon?: string;
}

export class WalletConnectManager {
  private core: Core;
  private walletKit: WalletKit;
  private projectId: string;

  constructor(config: WalletConnectConfig) {
    this.projectId = config.projectId;

    // Initialize Core client
    this.core = new Core({
      projectId: config.projectId,
      relayUrl: "wss://relay.walletconnect.com",
    });

    // Initialize WalletKit
    this.walletKit = new WalletKit({
      core: this.core,
      metadata: {
        name: config.appName || "BitStream",
        description:
          config.appDescription || "Off-chain payment channel protocol",
        url: config.appUrl || "https://bitstream.app",
        icons: config.appIcon ? [config.appIcon] : [],
      },
    });
  }

  /**
   * Get the WalletKit instance
   */
  getWalletKit(): WalletKit {
    return this.walletKit;
  }

  /**
   * Get the Core instance
   */
  getCore(): Core {
    return this.core;
  }

  /**
   * Get the project ID
   */
  getProjectId(): string {
    return this.projectId;
  }

  /**
   * Initialize WalletConnect session
   */
  async initializeSession(): Promise<void> {
    try {
      await this.walletKit.init();
      console.log("WalletConnect initialized successfully");
    } catch (error) {
      console.error("Failed to initialize WalletConnect:", error);
      throw error;
    }
  }

  /**
   * Pair with a wallet
   */
  async pair(uri: string): Promise<void> {
    try {
      await this.core.pairing.pair({ uri });
    } catch (error) {
      console.error("Failed to pair with wallet:", error);
      throw error;
    }
  }

  /**
   * Disconnect session
   */
  async disconnect(sessionTopic: string): Promise<void> {
    try {
      await this.walletKit.disconnectSession({
        topic: sessionTopic,
        reason: {
          code: 5000,
          message: "User disconnected",
        },
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  }
}

/**
 * Factory function to create WalletConnect manager
 */
export function createWalletConnectManager(
  config: WalletConnectConfig
): WalletConnectManager {
  return new WalletConnectManager(config);
}
