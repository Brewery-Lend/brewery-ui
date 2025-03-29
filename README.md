# Brewery Lend - NFT Lending Platform

Brewery Lend is a decentralized platform for borrowing and lending cryptocurrency using NFTs as collateral. The platform provides a seamless way for NFT owners to unlock liquidity from their assets without having to sell them.

## Features

- **Borrow**: Use your NFTs as collateral to take out USDC loans
- **Lend**: Fund loan requests and earn interest on your USDC
- **Transparent Terms**: Clear loan terms including amount, interest rate, and duration
- **Easy Management**: Monitor your borrowing and lending activities in one place
- **Secure Collateral**: NFTs are held in a secure escrow contract during the loan period

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain Integration**: ethers.js, wagmi, RainbowKit
- **Smart Contracts**: Solidity (BrewLend, CollateralEscrow)

## Getting Started

### Prerequisites

- Node.js (v16+)
- A web3 wallet (like MetaMask)
- Access to a blockchain with the deployed BrewLend contracts

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/brewery-lend.git
   cd brewery-lend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure contract addresses:
   - Update the contract addresses in `config/contracts.ts` with your deployed contract addresses

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

### For Borrowers

1. Connect your wallet and navigate to the "Borrow" page
2. Fill in the loan request form:
   - Specify the NFT contract address and token ID
   - Set the loan amount, interest rate, and duration
3. Create the loan order by approving the NFT transfer and confirming the transaction
4. Wait for a lender to fund your loan
5. Receive USDC in your wallet once funded
6. Repay the loan before the deadline to reclaim your NFT

### For Lenders

1. Connect your wallet and navigate to the "Lend" page
2. Browse available loan requests
3. Fund a loan by approving the USDC transfer and confirming the transaction
4. Monitor your funded loans
5. Receive your principal plus interest when the borrower repays
6. If a borrower defaults, claim their NFT collateral

## Contract Addresses

- BrewLend: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (example)
- USDC: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (example)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Ethereum community for support and resources
