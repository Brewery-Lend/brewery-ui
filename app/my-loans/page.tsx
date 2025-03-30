'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '../../components/Header';
import LoanOrderCard from '../../components/LoanOrder';
import { useBrewLend } from '../../hooks/useBrewLend';
import { LoanStatus } from '../../utils/contracts';

export default function MyLoansPage() {
  const { address, isConnected } = useAccount();
  const {
    borrowerOrders,
    lenderOrders,
    usdcBalance,
    isLoading,
    error,
    repayLoan,
    cancelLoanOrder,
    claimDefaultedNFT,
    fundLoanOrder,
  } = useBrewLend();

  const [activeTab, setActiveTab] = useState<'borrowing' | 'lending'>('borrowing');
  
  // Sort by creation time (newest first)
  const sortedBorrowerOrders = [...borrowerOrders].sort((a, b) => b.createdAt - a.createdAt);
  const sortedLenderOrders = [...lenderOrders].sort((a, b) => b.createdAt - a.createdAt);
  
  const getBadgeText = (status: number) => {
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
  };
  
  const getBadgeColor = (status: number) => {
    switch (status) {
      case LoanStatus.OPEN:
        return 'bg-blue-500';
      case LoanStatus.FUNDED:
        return 'bg-green-500';
      case LoanStatus.REPAID:
        return 'bg-gray-500';
      case LoanStatus.DEFAULTED:
        return 'bg-red-500';
      case LoanStatus.CANCELLED:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Loans</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'borrowing' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('borrowing')}
            >
              Borrowing {sortedBorrowerOrders.length > 0 && `(${sortedBorrowerOrders.length})`}
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'lending' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('lending')}
            >
              Lending {sortedLenderOrders.length > 0 && `(${sortedLenderOrders.length})`}
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'borrowing' && (
            <div>
              {isConnected ? (
                <>
                  {sortedBorrowerOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sortedBorrowerOrders.map(order => (
                        <LoanOrderCard
                          key={order.orderId}
                          order={order}
                          userAddress={address}
                          onFund={():any => {}}
                          onRepay={repayLoan}
                          onCancel={cancelLoanOrder}
                          onClaim={():any => {}}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 mb-4">
                        You haven't created any loan requests yet.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 mb-4">
                    Connect your wallet to see your borrowing history.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'lending' && (
            <div>
              {isConnected ? (
                <>
                  {sortedLenderOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sortedLenderOrders.map(order => (
                        <LoanOrderCard
                          key={order.orderId}
                          order={order}
                          userAddress={address}
                          onFund={():any => {}}
                          onRepay={():any => {}}
                          onCancel={():any => {}}
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
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 mb-4">
                    Connect your wallet to see your lending history.
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