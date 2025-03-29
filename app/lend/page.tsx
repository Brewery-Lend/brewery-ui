'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Header from '../../components/Header';
import LoanOrderCard from '../../components/LoanOrder';
import { useBrewLend } from '../../hooks/useBrewLend';
import { LoanOrder, LoanStatus } from '../../utils/contracts';
import Image from 'next/image';

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
    fetchAvailableOrdersToLend,
  } = useBrewLend();

  const [availableOrders, setAvailableOrders] = useState<LoanOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'funded'>('available');
  const [fetchingOrders, setFetchingOrders] = useState(false);
  
  // Fetch available orders from the mock API
  useEffect(() => {
    const getAvailableOrders = async () => {
      try {
        setFetchingOrders(true);
        const orders = await fetchAvailableOrdersToLend();
        
        if (!orders || !Array.isArray(orders) || orders.length === 0) {
          setAvailableOrders([]);
          setFetchingOrders(false);
          return;
        }
        
        // Filter out orders that belong to the current user
        // But only if the user is connected - otherwise show all orders
        const filteredOrders = address ? 
          orders.filter((order: LoanOrder) => {
            // Helper for normalizing addresses
            const normalizeAddress = (addr: string) => addr ? addr.toLowerCase() : '';
            
            // Check if borrower address matches the current user address
            const isUserOrder = order.borrower && 
              address && 
              normalizeAddress(order.borrower) === normalizeAddress(address);
            
            // We want to filter OUT the user's own orders (return true to keep non-user orders)
            return !isUserOrder;
          }) : orders;
        
        // If filtering removed all orders, revert to showing all orders
        if (filteredOrders.length === 0) {
          setAvailableOrders(orders);
        } else {
          setAvailableOrders(filteredOrders);
        }
      } catch (err) {
        setAvailableOrders([]);
      } finally {
        setFetchingOrders(false);
      }
    };
    
    getAvailableOrders();
  }, [address, fetchAvailableOrdersToLend]);
  
  // Filter orders for funded tab
  const fundedOrders = lenderOrders.filter(
    order => order.lender.toLowerCase() === address?.toLowerCase() && order.status === LoanStatus.FUNDED
  );
  
  // Ensure availableOrders is an array before attempting to sort it
  const validAvailableOrders = Array.isArray(availableOrders) ? availableOrders : [];
  
  // Sort by creation time (newest first)
  const sortedAvailableOrders = [...validAvailableOrders]
    .filter(order => order && typeof order === 'object') // Ensure each order is valid
    .sort((a, b) => b.createdAt - a.createdAt);
  
  const sortedFundedOrders = [...fundedOrders]
    .filter(order => order && typeof order === 'object')
    .sort((a, b) => b.createdAt - a.createdAt);

  // Handle order funding
  const handleFundOrder = async (orderId: number) => {
    await fundLoanOrder(orderId);
    // Refresh the available orders after funding
    const orders = await fetchAvailableOrdersToLend();
    
    // Helper for normalizing addresses
    const normalizeAddress = (addr: string) => addr ? addr.toLowerCase() : '';
    
    const filteredOrders = orders.filter(
      (order: LoanOrder) => !address || normalizeAddress(order.borrower) !== normalizeAddress(address)
    );
    setAvailableOrders(filteredOrders);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">RWA Lending Platform</h1>
            <p className="text-gray-400">Earn yield by lending against tokenized real-world assets with near-instant settlements.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-[#303030] mb-8">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'available' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('available')}
            >
              Available RWA Loans {sortedAvailableOrders.length > 0 && `(${sortedAvailableOrders.length})`}
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'funded' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
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
              <div className="mb-6 espresso-card p-4 border border-[#303030]">
                <h2 className="text-xl font-bold text-white mb-2">Ultra-Fast RWA Lending</h2>
                <p className="text-gray-300 mb-2">
                  Fund loan requests backed by verified real-world assets and earn yield. Our specialized DeFi rollup with Espresso confirmations ensures near-instant settlement of all transactions.
                </p>
                <div className="bg-[#1A1A1A] rounded-lg p-3 text-sm">
                  <div className="flex items-center text-[#D48C3D] mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Settlement Time:</span>
                    <span className="ml-2 font-bold">~1.2 seconds</span>
                  </div>
                </div>
              </div>
              
              {isLoading || fetchingOrders ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D48C3D]"></div>
                </div>
              ) : sortedAvailableOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedAvailableOrders.map(order => (
                    <LoanOrderCard
                      key={order.orderId}
                      order={order}
                      userAddress={address}
                      onFund={handleFundOrder}
                      onRepay={() => Promise.resolve()}
                      onCancel={() => Promise.resolve()}
                      onClaim={() => Promise.resolve()}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 espresso-card border border-[#303030]">
                  <div className="mb-4">
                    <Image 
                      src="/espresso-logo.png" 
                      alt="No orders" 
                      width={80} 
                      height={80} 
                      className="mx-auto opacity-30" 
                    />
                  </div>
                  <p className="text-gray-400 mb-2">
                    There are no available RWA loan requests at the moment.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Check back soon as new loan opportunities are added frequently.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'funded' && (
            <div>
              {isConnected ? (
                <>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D48C3D]"></div>
                    </div>
                  ) : sortedFundedOrders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {sortedFundedOrders.map(order => (
                        <LoanOrderCard
                          key={order.orderId}
                          order={order}
                          userAddress={address}
                          onFund={() => Promise.resolve()}
                          onRepay={() => Promise.resolve()}
                          onCancel={() => Promise.resolve()}
                          onClaim={claimDefaultedNFT}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 espresso-card border border-[#303030]">
                      <div className="mb-4">
                        <Image 
                          src="/espresso-logo.png" 
                          alt="No orders" 
                          width={80} 
                          height={80} 
                          className="mx-auto opacity-30" 
                        />
                      </div>
                      <p className="text-gray-400 mb-4">
                        You haven't funded any RWA loans yet.
                      </p>
                      <button
                        onClick={() => setActiveTab('available')}
                        className="px-4 py-2 bg-[#D48C3D] hover:bg-[#9B4D1F] text-[#121212] font-medium rounded-lg transition-all duration-200"
                      >
                        Browse Available Loans
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-12 espresso-card border border-[#303030]">
                  <div className="mb-4">
                    <Image 
                      src="/espresso-logo.png" 
                      alt="Connect wallet" 
                      width={80} 
                      height={80} 
                      className="mx-auto opacity-30" 
                    />
                  </div>
                  <p className="text-gray-400 mb-4">
                    Connect your wallet to see your funded loans.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-[#121212] border-t border-[#303030] py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/espresso-logo.png"
              alt="Espresso RWA Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="text-[#D48C3D] font-bold">Espresso</span>
            <span className="text-white font-bold ml-1">RWA</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Espresso RWA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 