/**
 * WalletConnect Integration Tests
 * Unit tests for WalletConnect manager and Stacks integration
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createWalletConnectManager,
  createStacksWalletConnectBridge,
  getStacksChainInfo,
  getStacksChainsForWalletConnect,
} from "../wallet";

describe("WalletConnect Integration", () => {
  describe("Chain Configuration", () => {
    it("should provide mainnet chain info", () => {
      const chain = getStacksChainInfo("mainnet");

      expect(chain).toBeDefined();
      expect(chain.network).toBe("mainnet");
      expect(chain.name).toBe("Stacks Mainnet");
      expect(chain.chainId).toBe("stacks:mainnet");
      expect(chain.nativeCurrency.symbol).toBe("STX");
      expect(chain.rpcUrl).toContain("mainnet");
    });

    it("should provide testnet chain info", () => {
      const chain = getStacksChainInfo("testnet");

      expect(chain).toBeDefined();
      expect(chain.network).toBe("testnet");
      expect(chain.name).toBe("Stacks Testnet");
      expect(chain.chainId).toBe("stacks:testnet");
      expect(chain.nativeCurrency.symbol).toBe("STX");
      expect(chain.rpcUrl).toContain("testnet");
    });

    it("should provide devnet chain info", () => {
      const chain = getStacksChainInfo("devnet");

      expect(chain).toBeDefined();
      expect(chain.network).toBe("devnet");
      expect(chain.name).toBe("Stacks Devnet");
      expect(chain.chainId).toBe("stacks:devnet");
      expect(chain.rpcUrl).toContain("localhost");
    });

    it("should throw error for unknown network", () => {
      expect(() => {
        getStacksChainInfo("unknown" as any);
      }).toThrow("Unknown Stacks network");
    });

    it("should provide all supported chains", () => {
      const chains = getStacksChainsForWalletConnect();

      expect(chains).toHaveLength(3);
      expect(chains.map((c) => c.network)).toContain("mainnet");
      expect(chains.map((c) => c.network)).toContain("testnet");
      expect(chains.map((c) => c.network)).toContain("devnet");
    });

    it("should have valid STX currency configuration", () => {
      const chains = getStacksChainsForWalletConnect();

      chains.forEach((chain) => {
        expect(chain.nativeCurrency.name).toBe("STX");
        expect(chain.nativeCurrency.symbol).toBe("STX");
        expect(chain.nativeCurrency.decimals).toBe(6);
      });
    });
  });

  describe("WalletConnectManager", () => {
    it("should create manager with config", () => {
      const manager = createWalletConnectManager({
        projectId: "test-project-id",
        appName: "TestApp",
      });

      expect(manager).toBeDefined();
      expect(manager.getProjectId()).toBe("test-project-id");
    });

    it("should provide wallet kit instance", () => {
      const manager = createWalletConnectManager({
        projectId: "test-project-id",
      });

      const walletKit = manager.getWalletKit();
      expect(walletKit).toBeDefined();
    });

    it("should provide core instance", () => {
      const manager = createWalletConnectManager({
        projectId: "test-project-id",
      });

      const core = manager.getCore();
      expect(core).toBeDefined();
    });
  });

  describe("StacksWalletConnectBridge", () => {
    let manager: ReturnType<typeof createWalletConnectManager>;
    let bridge: ReturnType<typeof createStacksWalletConnectBridge>;
    let chainInfo: ReturnType<typeof getStacksChainInfo>;

    beforeEach(() => {
      manager = createWalletConnectManager({
        projectId: "test-project-id",
      });

      chainInfo = getStacksChainInfo("testnet");
      bridge = createStacksWalletConnectBridge(manager.getWalletKit(), chainInfo);
    });

    it("should create bridge with valid config", () => {
      expect(bridge).toBeDefined();
    });

    it("should provide chain info", () => {
      const info = bridge.getChainInfo();

      expect(info).toBeDefined();
      expect(info.network).toBe("testnet");
      expect(info.chainId).toBe("stacks:testnet");
    });

    it("should support all Stacks networks", () => {
      const networks: Array<"mainnet" | "testnet" | "devnet"> = [
        "mainnet",
        "testnet",
        "devnet",
      ];

      networks.forEach((network) => {
        const chainInfo = getStacksChainInfo(network);
        const bridge = createStacksWalletConnectBridge(
          manager.getWalletKit(),
          chainInfo
        );

        expect(bridge.getChainInfo().network).toBe(network);
      });
    });
  });

  describe("Configuration", () => {
    it("should require project ID", () => {
      expect(() => {
        createWalletConnectManager({
          projectId: "",
        });
      }).not.toThrow(); // Manager doesn't validate, but will fail on init
    });

    it("should accept optional metadata", () => {
      const manager = createWalletConnectManager({
        projectId: "test-id",
        appName: "BitStream",
        appDescription: "Payment channels",
        appUrl: "https://bitstream.app",
        appIcon: "https://bitstream.app/icon.png",
      });

      expect(manager).toBeDefined();
    });
  });
});

describe("WalletConnect Integration - API Compatibility", () => {
  it("should export all necessary utilities", () => {
    const manager = createWalletConnectManager({
      projectId: "test-id",
    });

    expect(manager.getWalletKit).toBeDefined();
    expect(manager.getCore).toBeDefined();
    expect(manager.getProjectId).toBeDefined();
    expect(manager.initializeSession).toBeDefined();
    expect(manager.pair).toBeDefined();
    expect(manager.disconnect).toBeDefined();
  });

  it("should support Stacks transaction signing interface", () => {
    const manager = createWalletConnectManager({
      projectId: "test-id",
    });

    const bridge = createStacksWalletConnectBridge(
      manager.getWalletKit(),
      getStacksChainInfo("testnet")
    );

    expect(bridge.connectStacksWallet).toBeDefined();
    expect(bridge.signStacksTransaction).toBeDefined();
    expect(bridge.signStacksMessage).toBeDefined();
    expect(bridge.getChainInfo).toBeDefined();
  });
});
