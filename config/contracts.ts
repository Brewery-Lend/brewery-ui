import { Chain } from 'viem';

// Define custom chain (this could be replaced with real network info)
export const breweryTestnet: Chain = {
  id: 31337, // This is the default Hardhat chain ID
  name: 'Brewery Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
    public: {
      http: ['http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Brewery Explorer',
      url: 'http://localhost:8545',
    },
  },
};

// Contract addresses
export const BREWLEND_CONTRACT_ADDRESS = '0x567D29D537aCc71bDAea0042168Bc110287a59f2'; // Example address, replace with actual deployed address
export const USDC_CONTRACT_ADDRESS = '0xDC9CFD00e9f6D066D9BcCd1A4aCCcEbc6EbCA71c'; // Example address, replace with actual deployed address

// Contract deployment block numbers (for event indexing efficiency)
export const BREWLEND_DEPLOYMENT_BLOCK = 0; // Set to actual deployment block 