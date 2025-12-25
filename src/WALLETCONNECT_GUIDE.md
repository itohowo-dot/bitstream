# WalletConnect Integration Guide

This guide explains how to use WalletConnect with BitStream for wallet connectivity on the Stacks blockchain.

## Overview

WalletConnect enables dApps (decentralized applications) to connect with user wallets through a standard protocol. BitStream integrates WalletConnect v2.0 SDK to support Stacks wallet connections.

## Quick Start

### 1. Installation

Dependencies are already installed:
```bash
npm install @reown/walletkit @walletconnect/utils @walletconnect/core
```

### 2. Get Your Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy your **Project ID**

### 3. Configure Environment

Create `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set your Project ID:

```env
WALLETCONNECT_PROJECT_ID=your_project_id_here
STACKS_NETWORK=testnet
```

### 4. Use in Your Application

```typescript
import {
  createWalletConnectManager,
  createStacksWalletConnectBridge,
  getStacksChainInfo,
} from "./src/wallet";

// Initialize WalletConnect
const walletManager = createWalletConnectManager({
  projectId: process.env.WALLETCONNECT_PROJECT_ID!,
  appName: "BitStream",
  appDescription: "Off-chain payment channel protocol",
});

// Initialize session
await walletManager.initializeSession();

// Get chain info for Stacks testnet
const chainInfo = getStacksChainInfo("testnet");

// Create Stacks integration bridge
const stacksBridge = createStacksWalletConnectBridge(
  walletManager.getWalletKit(),
  chainInfo
);

// Connect wallet (displays pairing QR code to user)
// User scans with their wallet app to establish connection
```

## Supported Wallets

WalletConnect works with major Stacks wallets:

- **Xverse** (formerly Stacks Wallet) - https://www.xverse.app/
- **Hiro Wallet** - https://www.hiro.so/wallet
- **Leather Wallet** - https://leather.io/
- Any wallet supporting WalletConnect v2.0

## Stacks Networks

### Testnet (Recommended for Development)

```typescript
import { getStacksChainInfo } from "./src/wallet";

const testnet = getStacksChainInfo("testnet");
// RPC: https://api.testnet.hiro.so
// Explorer: https://testnet-explorer.hiro.so
```

**Get test STX tokens:**
- Visit [Stacks Testnet Faucet](https://testnet.coins.stackswap.org/)
- Enter your wallet address
- Receive test STX

### Mainnet (Production)

```typescript
const mainnet = getStacksChainInfo("mainnet");
// RPC: https://api.mainnet.hiro.so
// Explorer: https://explorer.hiro.so
```

### Devnet (Local Development)

```typescript
const devnet = getStacksChainInfo("devnet");
// RPC: http://localhost:3999
// Explorer: http://localhost:3000
```

Run local Stacks devnet:
```bash
clarinet integrate
```

## API Reference

### WalletConnectManager

Main class for WalletConnect initialization and management.

```typescript
interface WalletConnectConfig {
  projectId: string;           // Your WalletConnect Project ID
  appName?: string;            // Application name
  appDescription?: string;     // Application description
  appUrl?: string;             // Application URL
  appIcon?: string;            // Application icon URL
}

class WalletConnectManager {
  // Initialize WalletConnect session
  initializeSession(): Promise<void>

  // Pair with a wallet (using connection URI)
  pair(uri: string): Promise<void>

  // Disconnect an active session
  disconnect(sessionTopic: string): Promise<void>

  // Get WalletKit instance
  getWalletKit(): WalletKit

  // Get Core instance
  getCore(): Core

  // Get Project ID
  getProjectId(): string
}
```

### StacksWalletConnectBridge

Stacks-specific functionality for signing transactions and messages.

```typescript
class StacksWalletConnectBridge {
  // Connect to Stacks wallet
  connectStacksWallet(): Promise<StacksAccount>

  // Sign a transaction
  signStacksTransaction(request: SignStacksTransactionRequest): Promise<string>

  // Sign a message
  signStacksMessage(request: SignStacksMessageRequest): Promise<string>

  // Get chain information
  getChainInfo(): StacksChainInfo
}

interface StacksAccount {
  address: string;              // Stacks wallet address
  publicKey: string;            // Public key for verification
  chainId: "mainnet" | "testnet" | "devnet"
}
```

### Chain Configuration

```typescript
interface StacksChainInfo {
  chainId: string;              // e.g., "stacks:testnet"
  network: "mainnet" | "testnet" | "devnet"
  name: string;                 // Display name
  rpcUrl: string;               // RPC endpoint
  nativeCurrency: {
    name: string;               // "STX"
    symbol: string;             // "STX"
    decimals: number;           // 6
  }
  explorerUrl: string;          // Block explorer URL
}

// Get chain info by network
getStacksChainInfo(network: "mainnet" | "testnet" | "devnet"): StacksChainInfo

// Get all supported chains
getStacksChainsForWalletConnect(): StacksChainInfo[]
```

## Usage Examples

See [src/examples.ts](src/examples.ts) for complete examples including:
- Initializing WalletConnect
- Connecting wallets
- Signing transactions
- Signing messages

## Architecture

```
src/
├── wallet/
│   ├── walletConnect.ts       # Core WalletConnect manager
│   ├── stacksIntegration.ts   # Stacks-specific bridge
│   ├── chains.ts              # Stacks chain configurations
│   └── index.ts               # Public exports
├── walletConnectConfig.ts     # Configuration and setup
└── examples.ts                # Usage examples
```

## Important Notes

### Environment Variables

Always set `WALLETCONNECT_PROJECT_ID` before using WalletConnect:

```typescript
if (!process.env.WALLETCONNECT_PROJECT_ID) {
  throw new Error("WALLETCONNECT_PROJECT_ID not set");
}
```

### Security Considerations

1. **Never hardcode Project ID** - Always use environment variables
2. **Validate responses** - Verify wallet signatures before processing
3. **Use HTTPS** - WalletConnect requires secure connections in production
4. **Test on testnet first** - Always test on testnet before mainnet
5. **Keep SDK updated** - Regularly update @reown/walletkit and related packages

### Transaction Signing

When signing transactions for BitStream payment channels:

1. Create the transaction using Stacks SDK
2. Request wallet signature via WalletConnect
3. Verify signature validity
4. Submit to blockchain or use off-chain

```typescript
// Example: Sign BitStream channel transaction
const tx = await createChannelTransaction({
  channelId,
  amount,
  recipient,
});

const signature = await stacksBridge.signStacksTransaction({
  transaction: tx.serialize(),
  broadcast: false, // Don't broadcast yet
});

// Verify and process...
```

## Troubleshooting

### WalletConnect won't connect

1. Check `WALLETCONNECT_PROJECT_ID` is set correctly
2. Verify wallet supports WalletConnect v2.0
3. Check relay URL is accessible: `wss://relay.walletconnect.com`

### Transaction signing fails

1. Verify wallet is connected
2. Check transaction format is valid
3. Ensure wallet supports Stacks transactions
4. Try on testnet first

### Wrong network shown

1. Verify `STACKS_NETWORK` environment variable
2. Check wallet is configured for correct network
3. Ensure RPC endpoint is accessible

## Resources

- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [WalletConnect Stacks Support](https://docs.walletconnect.network/wallet-sdk/chain-support/stacks)
- [Stacks Documentation](https://docs.stacks.co/)
- [Hiro API Documentation](https://docs.hiro.so/)
- [Stacks Explorer](https://explorer.hiro.so/)

## Support

For issues or questions:
1. Check WalletConnect documentation
2. Review examples in [src/examples.ts](src/examples.ts)
3. Check environment variables are set
4. Test on testnet before mainnet
