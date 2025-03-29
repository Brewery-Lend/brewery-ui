'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';

interface ConnectWalletProps {
  usdcBalance?: bigint;
}

export default function ConnectWallet({ usdcBalance }: ConnectWalletProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
  });

  const [walletConnected, setWalletConnected] = useState(false);

  // Update connected state when wallet connection changes
  useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected]);

  // Format ETH balance to display only 4 decimal places
  const formattedEthBalance = ethBalance 
    ? Number(formatEther(ethBalance.value)).toFixed(4) 
    : '0.0000';

  // Format USDC balance to display with 2 decimal places (USDC has 6 decimals)
  const formattedUsdcBalance = usdcBalance 
    ? (Number(usdcBalance) / 1_000_000).toFixed(2)
    : '0.00';

  return (
    <div className="relative">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!walletConnected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-5 py-2.5 bg-[#D48C3D] hover:bg-[#9B4D1F] text-[#121212] font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain?.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Wrong Network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex text-sm space-x-2 items-center bg-[#1A1A1A] border border-[#303030] rounded-lg px-3 py-1.5">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-300">{chain?.name}</span>
                      </div>
                    </div>

                    <div className="bg-[#1A1A1A] border border-[#303030] rounded-lg text-sm px-3 py-1.5 hidden md:block">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">USDC Balance</span>
                        <span className="text-[#D48C3D] font-medium">${formattedUsdcBalance}</span>
                      </div>
                    </div>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#303030] rounded-lg px-4 py-2 transition-colors"
                    >
                      <span className="text-gray-200 font-medium">
                        {account?.displayName || address?.substring(0, 6) + '...' + address?.substring(address.length - 4)}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
} 