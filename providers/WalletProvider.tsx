'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain } from 'viem';

// Define custom chain directly as a Chain object instead of using createChain
export const breweryTestnet: Chain = {
  id: 63639144, // This is the default Hardhat chain ID
  name: 'Brewery Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BREW',
    symbol: 'BREW',
  },
  rpcUrls: {
    default: {
      http: ['http://44.203.209.141:8547'],
    },
    public: {
      http: ['http://44.203.209.141:8547'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Brewery Explorer',
      url: '',
    },
  },
};

// Create wagmi config
const config = createConfig({
  chains: [breweryTestnet, mainnet],
  transports: {
    [breweryTestnet.id]: http(),
    [mainnet.id]: http(),
  },
});

// Create query client
const queryClient = new QueryClient();

// Define the props for the provider component
interface WalletProviderProps {
  children: ReactNode;
}

// Create the wallet provider component
export function WalletProvider({ children }: WalletProviderProps) {
  const [mounted, setMounted] = useState(false);

  // To avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} coolMode>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 