'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Header from '../components/Header';
import { useBrewLend } from '../hooks/useBrewLend';
import { LoanOrder, LoanStatus } from '../utils/contracts';

export default function Home() {
  const { address, isConnected } = useAccount();
  const {
    borrowerOrders,
    lenderOrders,
    usdcBalance,
    isLoading,
    error,
    fetchData,
  } = useBrewLend();

  const [recentOrders, setRecentOrders] = useState<LoanOrder[]>([]);

  // Get recent orders by combining borrower and lender orders, sorting by creation time
  // and taking the 5 most recent orders
  useEffect(() => {
    const allOrders = [...borrowerOrders, ...lenderOrders];
    const uniqueOrders = allOrders.filter(
      (order, index, self) =>
        index === self.findIndex((o) => o.orderId === order.orderId)
    );
    
    const sorted = uniqueOrders.sort((a, b) => b.createdAt - a.createdAt);
    setRecentOrders(sorted.slice(0, 5));
  }, [borrowerOrders, lenderOrders]);

  // Stats for dashboard
  const borrowingStats = {
    activeLoans: borrowerOrders.filter(order => order.status === LoanStatus.FUNDED).length,
    totalBorrowed: borrowerOrders.filter(order => 
      order.status === LoanStatus.FUNDED || order.status === LoanStatus.REPAID
    ).length,
    defaulted: borrowerOrders.filter(order => order.status === LoanStatus.DEFAULTED).length,
  };

  const lendingStats = {
    activeLends: lenderOrders.filter(order => order.status === LoanStatus.FUNDED).length,
    totalLent: lenderOrders.filter(order => 
      order.status === LoanStatus.FUNDED || order.status === LoanStatus.REPAID
    ).length,
    gained: lenderOrders.filter(order => order.status === LoanStatus.DEFAULTED).length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Borrow and Lend with <span className="text-amber-500">NFT Collateral</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Use your NFTs as collateral to get instant loans in USDC, or earn interest by lending to borrowers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/borrow" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
                Borrow Now
              </Link>
              <Link href="/lend" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg">
                Start Lending
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              {isConnected ? 'Your Dashboard' : 'Welcome to Brewery Lend'}
            </h2>

            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Your Borrowing</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{borrowingStats.activeLoans}</div>
                      <div className="text-gray-400 text-sm">Active Loans</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{borrowingStats.totalBorrowed}</div>
                      <div className="text-gray-400 text-sm">Total Borrowed</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{borrowingStats.defaulted}</div>
                      <div className="text-gray-400 text-sm">Defaulted</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/borrow" className="text-amber-500 hover:text-amber-400 font-medium">
                      Create new loan request →
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Your Lending</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{lendingStats.activeLends}</div>
                      <div className="text-gray-400 text-sm">Active Lends</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{lendingStats.totalLent}</div>
                      <div className="text-gray-400 text-sm">Total Lent</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-500">{lendingStats.gained}</div>
                      <div className="text-gray-400 text-sm">NFTs Gained</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/lend" className="text-amber-500 hover:text-amber-400 font-medium">
                      Browse loan requests →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activities Section */}
            <h3 className="text-2xl font-bold text-white mb-6">
              {isConnected ? 'Your Recent Activity' : 'Recent Loans'}
            </h3>
            
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="text-xs uppercase text-gray-400 bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Loan ID</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Borrower</th>
                      <th className="px-4 py-3 text-left">Created</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentOrders.map((order) => (
                      <tr key={order.orderId} className="bg-gray-800 hover:bg-gray-700">
                        <td className="px-4 py-4 font-medium">#{order.orderId}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
                            order.status === LoanStatus.OPEN ? 'bg-blue-500' :
                            order.status === LoanStatus.FUNDED ? 'bg-green-500' :
                            order.status === LoanStatus.REPAID ? 'bg-gray-500' :
                            order.status === LoanStatus.DEFAULTED ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}>
                            {order.status === LoanStatus.OPEN ? 'Open' :
                             order.status === LoanStatus.FUNDED ? 'Funded' :
                             order.status === LoanStatus.REPAID ? 'Repaid' :
                             order.status === LoanStatus.DEFAULTED ? 'Defaulted' :
                             'Cancelled'}
                          </span>
                        </td>
                        <td className="px-4 py-4">{(Number(order.loanAmount) / 1e6).toFixed(2)} USDC</td>
                        <td className="px-4 py-4">
                          {order.borrower.slice(0, 6)}...{order.borrower.slice(-4)}
                        </td>
                        <td className="px-4 py-4">
                          {new Date(order.createdAt * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/loan/${order.orderId}`} className="text-amber-500 hover:text-amber-400">
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-800 rounded-lg">
                <p className="text-gray-400">
                  {isConnected
                    ? 'You have no recent activity. Create a loan request or fund one to get started!'
                    : 'Connect your wallet to see your recent activity'}
                </p>
              </div>
            )}
            
            {/* View All */}
            <div className="mt-6 text-center">
              <Link href="/my-loans" className="text-amber-500 hover:text-amber-400 font-medium">
                View all your loans →
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-bold text-white mb-2">For Borrowers</h3>
                <p className="text-gray-300">
                  Deposit your NFT as collateral and create a loan request. You'll receive USDC when a lender funds your request.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-bold text-white mb-2">For Lenders</h3>
                <p className="text-gray-300">
                  Browse open loan requests and fund them to earn interest. If a loan defaults, you'll receive the NFT collateral.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-bold text-white mb-2">Repayment</h3>
                <p className="text-gray-300">
                  Borrowers repay their loans with interest before the deadline to reclaim their NFT. Lenders receive their principal plus interest.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-amber-500">Brewery</span>
            <span className="ml-1 text-xl font-bold text-white">Lend</span>
          </div>
          <p className="mt-4 text-gray-400">
            NFT-backed loans on the blockchain
          </p>
          <div className="mt-6 text-gray-400">
            &copy; {new Date().getFullYear()} Brewery Lend. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
