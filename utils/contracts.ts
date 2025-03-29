import { ethers } from 'ethers';
import { BREWLEND_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '../config/contracts';
import brewLendABI from '../abi/brewLend.json';
import usdcABI from '../abi/usdc.json';
import erc721ABI from '../abi/erc721.json';

// Type definitions
export interface LoanOrder {
  orderId: number;
  borrower: string;
  lender: string;
  nftContract: string;
  tokenId: number;
  loanAmount: bigint;
  interestRate: number;
  duration: number;
  createdAt: number;
  fundedAt: number;
  repaymentDeadline: number;
  status: number; // 0 = OPEN, 1 = FUNDED, 2 = REPAID, 3 = DEFAULTED, 4 = CANCELLED
}

export enum LoanStatus {
  OPEN = 0,
  FUNDED = 1,
  REPAID = 2,
  DEFAULTED = 3,
  CANCELLED = 4
}

// Get contract instances
export function getBrewLendContract(provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(BREWLEND_CONTRACT_ADDRESS, brewLendABI, provider);
}

export function getUSDCContract(provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(USDC_CONTRACT_ADDRESS, usdcABI, provider);
}

export function getERC721Contract(contractAddress: string, provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(contractAddress, erc721ABI, provider);
}

// Helper function to format USDC amounts (6 decimals)
export function formatUSDC(amount: bigint): string {
  return ethers.formatUnits(amount, 6);
}

// Helper function to parse USDC amounts (6 decimals)
export function parseUSDC(amount: string): bigint {
  return ethers.parseUnits(amount, 6);
}

// Helper function to format interest rates (basis points to percentage)
export function formatInterestRate(basisPoints: number): string {
  return (basisPoints / 100).toFixed(2) + '%';
}

// Helper function to format duration (seconds to days)
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

// Helper function to format deadline (timestamp to date)
export function formatDeadline(timestamp: number): string {
  if (timestamp === 0) return 'N/A';
  return new Date(timestamp * 1000).toLocaleDateString();
}

// Helper function to get loan status as a string
export function getLoanStatusString(status: number): string {
  switch (status) {
    case LoanStatus.OPEN:
      return 'Open';
    case LoanStatus.FUNDED:
      return 'Funded';
    case LoanStatus.REPAID:
      return 'Repaid';
    case LoanStatus.DEFAULTED:
      return 'Defaulted';
    case LoanStatus.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
} 