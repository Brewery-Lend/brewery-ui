'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import { useBrewLend } from '../../hooks/useBrewLend';

export default function AssetsPage() {
  const { usdcBalance } = useBrewLend();
  const [activeTab, setActiveTab] = useState<'real-estate' | 'invoices' | 'commodities' | 'revenue'>('real-estate');
  
  // Example RWA assets categorized by type
  const assetCategories = {
    'real-estate': [
      { id: 1, name: 'Manhattan Office Complex', value: '$4.2M', yield: '5.8%', verified: true, tokenId: 101 },
      { id: 2, name: 'Miami Residential Tower', value: '$7.5M', yield: '4.9%', verified: true, tokenId: 102 },
      { id: 3, name: 'San Francisco Commercial Space', value: '$3.1M', yield: '6.2%', verified: true, tokenId: 103 },
    ],
    'invoices': [
      { id: 4, name: 'Fortune 500 Invoice Bundle', value: '$1.2M', yield: '7.1%', verified: true, tokenId: 201 },
      { id: 5, name: 'Healthcare Provider Receivables', value: '$2.4M', yield: '6.8%', verified: true, tokenId: 202 },
      { id: 6, name: 'Government Contract Payments', value: '$3.3M', yield: '5.2%', verified: true, tokenId: 203 },
    ],
    'commodities': [
      { id: 7, name: 'Gold Reserve Token', value: '$2.7M', yield: '3.9%', verified: true, tokenId: 301 },
      { id: 8, name: 'Agricultural Futures Bundle', value: '$1.9M', yield: '8.2%', verified: true, tokenId: 302 },
      { id: 9, name: 'Rare Metals Index', value: '$4.5M', yield: '4.6%', verified: true, tokenId: 303 },
    ],
    'revenue': [
      { id: 10, name: 'Tech Startup Revenue Share', value: '$850K', yield: '9.3%', verified: true, tokenId: 401 },
      { id: 11, name: 'Music Royalties Bundle', value: '$1.5M', yield: '7.8%', verified: true, tokenId: 402 },
      { id: 12, name: 'Franchise Revenue Stream', value: '$2.2M', yield: '6.4%', verified: true, tokenId: 403 },
    ]
  };
  
  const displayAssets = assetCategories[activeTab as keyof typeof assetCategories];
  
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tokenized Real-World Assets</h1>
            <p className="text-gray-400">Explore verified RWA tokens available on our specialized DeFi rollup with ultra-fast settlement.</p>
          </div>
          
          {/* RWA Asset Types Navigation */}
          <div className="flex flex-wrap border-b border-[#303030] mb-8">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'real-estate' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('real-estate')}
            >
              Real Estate
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'invoices' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('invoices')}
            >
              Invoice Factoring
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'commodities' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('commodities')}
            >
              Commodities
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'revenue' 
                  ? 'text-[#D48C3D] border-b-2 border-[#D48C3D]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('revenue')}
            >
              Revenue Shares
            </button>
          </div>
          
          {/* Info Banner */}
          <div className="mb-6 espresso-card p-4 border border-[#303030]">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-10 h-10 bg-[#1A1A1A] border border-[#D48C3D] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D48C3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Verified Real-World Assets</h2>
                <p className="text-gray-300 text-sm">
                  All assets are legally verified and backed by enforceable off-chain agreements. Transactions settle in ~1.2 seconds with Espresso confirmations.
                </p>
              </div>
            </div>
          </div>
          
          {/* RWA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayAssets.map((asset) => (
              <div key={asset.id} className="espresso-card border border-[#303030] overflow-hidden bg-[#1A1A1A]">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                    <div className="bg-[#121212] px-2 py-1 rounded text-[#D48C3D] text-sm font-medium">
                      Token #{asset.tokenId}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#121212] p-3 rounded-md border border-[#303030]">
                      <div className="text-gray-400 text-xs">Asset Value</div>
                      <div className="text-white font-medium">{asset.value}</div>
                    </div>
                    <div className="bg-[#121212] p-3 rounded-md border border-[#303030]">
                      <div className="text-gray-400 text-xs">Expected Yield</div>
                      <div className="text-[#D48C3D] font-medium">{asset.yield}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-green-500 mr-3 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Settlement: 1.2s</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/lend?asset=${asset.id}`}
                      className="flex-1 px-4 py-2 bg-[#D48C3D] hover:bg-[#9B4D1F] text-[#121212] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-center"
                    >
                      Lend Against
                    </Link>
                    <Link 
                      href={`/assets/${asset.id}`}
                      className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-[#303030] hover:border-[#D48C3D] text-white font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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