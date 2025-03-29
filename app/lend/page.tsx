'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Header from '../../components/Header';
import LoanOrderCard from '../../components/LoanOrder';
import { useBrewLend } from '../../hooks/useBrewLend';
import { LoanOrder, LoanStatus } from '../../utils/contracts';

export default function LendPage() {
  const { address, isConnected } = useAccount();
  const {
    borrowerOrders,
    lenderOrders,
    usdcBalance,
    isLoading,
    error,
    fundLoanOrder,
    claimDefaultedNFT,
    fetchData,
  } = useBrewLend();

  const [openOrders, setOpenOrders] = useState<LoanOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'funded'>('available');
  
  // Get all unique orders from all users (for the available tab)
  useEffect(() => {
    const fetchOpenOrders = async () => {
      try {
        // In a real implementation, you would fetch all open orders from the contract events
        // or from a subgraph/indexer
        // For now, we're just using the borrower orders that we already have
        const availableOrders = borrowerOrders.filter(
          order => order.status === LoanStatus.OPEN && order.borrower.toLowerCase() !== address?.toLowerCase()
        );
        setOpenOrders(availableOrders);
      } catch (err) {
        console.error('Error fetching open orders:', err);
      }
    };
    
    fetchOpenOrders();
  }, [borrowerOrders, address]);
  
  // Filter orders for funded tab
  const fundedOrders = lenderOrders.filter(
    order => order.lender.toLowerCase() === address?.toLowerCase() && order.status === LoanStatus.FUNDED
  );
  
  // Sort by creation time (newest first)
  const sortedOpenOrders = [...openOrders].sort((a, b) => b.createdAt - a.createdAt);
  const sortedFundedOrders = [...fundedOrders].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col min-h-screen">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Lend and Earn Interest</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'available' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('available')}
            >
              Available Loans {sortedOpenOrders.length > 0 && `(${sortedOpenOrders.length})`}
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'funded' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('funded')}
            >
              Your Funded Loans {sortedFundedOrders.length > 0 && `(${sortedFundedOrders.length})`}
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'available' && (
            <div>
              <p className="text-gray-300 mb-6">
                Browse open loan requests and fund them to earn interest. If a borrower fails to repay
                their loan before the deadline, you can claim their NFT collateral.
              </p>
              
              {sortedOpenOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedOpenOrders.map(order => (
                    <LoanOrderCard
                      key={order.orderId}
                      order={order}
                      userAddress={address}
                      onFund={fundLoanOrder}
                      onRepay={() => {}}
                      onCancel={() => {}}
                      onClaim={() => {}}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">
                    There are no available loan requests at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'funded' && (
            <div>
              {isConnected ? (
                <>
                  {sortedFundedOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sortedFundedOrders.map(order => (
                        <LoanOrderCard
                          key={order.orderId}
                          order={order}
                          userAddress={address}
                          onFund={() => {}}
                          onRepay={() => {}}
                          onCancel={() => {}}
                          onClaim={claimDefaultedNFT}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 mb-4">
                        You haven't funded any loans yet.
                      </p>
                      <button
                        onClick={() => setActiveTab('available')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg"
                      >
                        Browse Available Loans
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 mb-4">
                    Connect your wallet to see your funded loans.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">
            &copy; {new Date().getFullYear()} Brewery Lend. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 