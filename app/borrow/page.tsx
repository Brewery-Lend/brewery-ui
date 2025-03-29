'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '../../components/Header';
import CreateLoanForm from '../../components/CreateLoanForm';
import LoanOrderCard from '../../components/LoanOrder';
import { useBrewLend } from '../../hooks/useBrewLend';
import { LoanStatus } from '../../utils/contracts';

export default function BorrowPage() {
  const { address, isConnected } = useAccount();
  const {
    borrowerOrders,
    usdcBalance,
    isLoading,
    error,
    createLoanOrder,
    repayLoan,
    cancelLoanOrder,
  } = useBrewLend();

  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'repaid'>('create');
  
  // Filter orders based on active tab
  const activeOrders = borrowerOrders.filter(order => 
    order.status === LoanStatus.OPEN || order.status === LoanStatus.FUNDED
  );
  
  const completedOrders = borrowerOrders.filter(order => 
    order.status === LoanStatus.REPAID || 
    order.status === LoanStatus.DEFAULTED || 
    order.status === LoanStatus.CANCELLED
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Borrow with NFT Collateral</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'create' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create New Loan
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'active' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Loans {activeOrders.length > 0 && `(${activeOrders.length})`}
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'repaid' 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('repaid')}
            >
              Completed Loans {completedOrders.length > 0 && `(${completedOrders.length})`}
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'create' && (
            <div>
              <p className="text-gray-300 mb-6">
                Create a loan request by depositing an NFT as collateral. Once a lender funds your request,
                you'll receive USDC that you can use however you want. Remember to repay your loan before
                the deadline to get your NFT back.
              </p>
              
              <CreateLoanForm 
                onSubmit={createLoanOrder}
                isLoading={isLoading}
              />
            </div>
          )}
          
          {activeTab === 'active' && (
            <div>
              {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeOrders.map(order => (
                    <LoanOrderCard
                      key={order.orderId}
                      order={order}
                      userAddress={address}
                      onFund={() => {}}
                      onRepay={repayLoan}
                      onCancel={cancelLoanOrder}
                      onClaim={() => {}}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 mb-4">
                    You don't have any active loan requests or loans.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg"
                  >
                    Create a Loan Request
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'repaid' && (
            <div>
              {completedOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedOrders.map(order => (
                    <LoanOrderCard
                      key={order.orderId}
                      order={order}
                      userAddress={address}
                      onFund={() => {}}
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
                    You don't have any completed loan transactions yet.
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