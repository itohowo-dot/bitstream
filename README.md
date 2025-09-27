# BitStream Channel Protocol

> Revolutionary off-chain transaction protocol enabling instant, gas-free transfers between participants through cryptographically secured bidirectional channels.

[![Clarity](https://img.shields.io/badge/Clarity-Smart%20Contract-blue)](https://clarity-lang.org/)
[![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange)](https://www.stacks.co/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

BitStream eliminates blockchain congestion by moving repetitive transactions off-chain while maintaining cryptographic proof of ownership. Partners can exchange thousands of micro-transactions instantly, settling only the final balance on-chain.

### Key Features

- **⚡ Instant Transactions**: Off-chain transfers with zero confirmation time
- **💰 Gas-Free Operations**: Eliminate transaction fees for micro-payments
- **🔒 Cryptographic Security**: Trustless protocol with signature verification
- **🤝 Bilateral Channels**: Bidirectional payment flows between participants
- **⚖️ Dispute Resolution**: Time-locked challenge mechanism for security
- **🛡️ Emergency Recovery**: Contract owner failsafe for extreme scenarios

## Architecture

### Core Components

1. **Channel Lifecycle Management**
   - Channel creation and funding
   - Cooperative closure with mutual consent
   - Unilateral closure with dispute resolution

2. **Cryptographic Layer**
   - Signature verification for transaction authenticity
   - Message hashing for secure state commitments
   - Buffer utilities for data serialization

3. **Security Framework**
   - Input validation for all parameters
   - Balance conservation enforcement
   - Time-locked dispute windows

## Contract Interface

### Public Functions

#### Channel Management

```clarity
;; Create a new payment channel
(define-public (create-channel
    (channel-id (buff 32))
    (participant-b principal)
    (initial-deposit uint)
))

;; Add funds to an existing channel
(define-public (fund-channel
    (channel-id (buff 32))
    (participant-b principal)
    (additional-funds uint)
))
```

#### Channel Closure

```clarity
;; Close channel with mutual agreement
(define-public (close-channel-cooperative
    (channel-id (buff 32))
    (participant-b principal)
    (balance-a uint)
    (balance-b uint)
    (signature-a (buff 65))
    (signature-b (buff 65))
))

;; Initiate unilateral closure
(define-public (initiate-unilateral-close
    (channel-id (buff 32))
    (participant-b principal)
    (proposed-balance-a uint)
    (proposed-balance-b uint)
    (signature (buff 65))
))

;; Finalize unilateral closure after dispute period
(define-public (resolve-unilateral-close
    (channel-id (buff 32))
    (participant-b principal)
))
```

#### Query Functions

```clarity
;; Get channel information
(define-read-only (get-channel-info
    (channel-id (buff 32))
    (participant-a principal)
    (participant-b principal)
))
```

#### Emergency Functions

```clarity
;; Emergency fund recovery (contract owner only)
(define-public (emergency-withdraw))
```

### Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `ERR-NOT-AUTHORIZED` | Caller not authorized for operation |
| u101 | `ERR-CHANNEL-EXISTS` | Channel already exists |
| u102 | `ERR-CHANNEL-NOT-FOUND` | Channel does not exist |
| u103 | `ERR-INSUFFICIENT-FUNDS` | Insufficient funds for operation |
| u104 | `ERR-INVALID-SIGNATURE` | Invalid cryptographic signature |
| u105 | `ERR-CHANNEL-CLOSED` | Channel is already closed |
| u106 | `ERR-DISPUTE-PERIOD` | Dispute period still active |
| u107 | `ERR-INVALID-INPUT` | Invalid input parameters |

## Usage Examples

### Creating a Payment Channel

```javascript
// Create a new channel with 1000 STX initial deposit
const channelId = "0x1234567890abcdef..."; // 32-byte channel identifier
const participantB = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7";
const initialDeposit = 1000000000; // 1000 STX in microSTX

await contractCall({
  contractAddress: "SP...",
  contractName: "bitstream",
  functionName: "create-channel",
  functionArgs: [
    bufferCV(channelId),
    principalCV(participantB),
    uintCV(initialDeposit)
  ]
});
```

### Cooperative Channel Closure

```javascript
// Close channel with mutual signatures
const balanceA = 600000000; // 600 STX
const balanceB = 400000000; // 400 STX
const signatureA = "0x..."; // Participant A's signature
const signatureB = "0x..."; // Participant B's signature

await contractCall({
  contractAddress: "SP...",
  contractName: "bitstream",
  functionName: "close-channel-cooperative",
  functionArgs: [
    bufferCV(channelId),
    principalCV(participantB),
    uintCV(balanceA),
    uintCV(balanceB),
    bufferCV(signatureA),
    bufferCV(signatureB)
  ]
});
```

## Security Considerations

### Cryptographic Security

- **Signature Verification**: All state transitions require valid cryptographic signatures
- **Message Authentication**: Channel states are committed using secure message hashing
- **Replay Protection**: Nonce-based mechanism prevents transaction replay attacks

### Economic Security

- **Balance Conservation**: Mathematical verification ensures funds are never created or destroyed
- **Dispute Resolution**: 1008-block challenge period allows honest participants to respond
- **Emergency Safeguards**: Contract owner can recover funds in extreme scenarios

### Best Practices

1. **Channel Funding**: Only deposit funds you can afford to lock for the dispute period
2. **Signature Management**: Keep private keys secure and never reuse signatures
3. **State Monitoring**: Regularly monitor channel state to detect malicious closure attempts
4. **Backup Strategies**: Maintain off-chain backup of channel states and signatures

## Development Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) - JavaScript runtime for testing
- [Stacks CLI](https://docs.stacks.co/docs/write-smart-contracts/clarinet) - Command line interface

### Installation

```bash
# Clone the repository
git clone https://github.com/itohowo-dot/bitstream.git
cd bitstream

# Install dependencies
npm install

# Check contract syntax
clarinet check
```

### Testing

```bash
# Run contract tests
npm test

# Run Clarinet tests
clarinet test
```

### Deployment

```bash
# Deploy to testnet
clarinet deploy --testnet

# Deploy to mainnet
clarinet deploy --mainnet
```

## Protocol Specification

### Channel State Structure

```clarity
{
  total-deposited: uint,    ;; Total funds in channel
  balance-a: uint,          ;; Participant A's balance
  balance-b: uint,          ;; Participant B's balance
  is-open: bool,            ;; Channel operational status
  dispute-deadline: uint,   ;; Block height for dispute resolution
  nonce: uint,              ;; Replay protection counter
}
```

### Message Format

State commitment messages follow this format:

```text
message = channel-id || balance-a || balance-b
```

Where `||` represents buffer concatenation.

### Dispute Resolution Process

1. **Initiation**: Participant initiates unilateral close with proposed final state
2. **Challenge Period**: 1008 blocks (~7 days) for counterparty to respond
3. **Resolution**: After deadline, funds are distributed according to proposed state

## Roadmap

- [ ] **Phase 1**: Core protocol implementation ✅
- [ ] **Phase 2**: Advanced signature schemes (secp256k1)
- [ ] **Phase 3**: Multi-hop payment routing
- [ ] **Phase 4**: Lightning Network compatibility
- [ ] **Phase 5**: Cross-chain channel support

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Stacks Foundation](https://stacks.org/) for the Clarity smart contract language
