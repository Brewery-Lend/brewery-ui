'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import { useBrewLend } from '../../../hooks/useBrewLend';
import { 
  LoanStatus, 
  formatUSDC, 
  formatInterestRate, 
  formatDuration, 
  formatDeadline, 
  getLoanStatusString 
} from '../../../utils/contracts';

type LoanOrder = {
  orderId: number;
  borrower: string;
  lender: string;
  nftContract: string;
  tokenId: number;
  loanAmount: string;
  interestRate: number;
  duration: number;
  createdAt: number;
  fundedAt: number;
  repaymentDeadline: number;
  status: number;
};

export default function LoanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  const {
    borrowerOrders,
    lenderOrders,
    usdcBalance,
    isLoading: hookLoading,
    error: hookError,
    repayLoan,
    cancelLoanOrder,
    claimDefaultedNFT,
    fundLoanOrder,
  } = useBrewLend();

  const [loan, setLoan] = useState<LoanOrder | null>(null);
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the loan details directly from the API
  useEffect(() => {
    async function fetchLoanDetails() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch loan details');
        }
        
        const data = await response.json();
        setLoan(data.order);
      } catch (err: any) {
        console.error('Error fetching loan details:', err);
        setError(err.message || 'Failed to fetch loan details');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchLoanDetails();
    }
  }, [id]);

  const isBorrower = loan && address && address.toLowerCase() === loan.borrower.toLowerCase();
  const isLender = loan && address && address.toLowerCase() === loan.lender.toLowerCase();
  const canBeRepaid = loan && isBorrower && loan.status === LoanStatus.FUNDED;
  const canBeFunded = loan && !isBorrower && loan.status === LoanStatus.OPEN;
  const canBeCancelled = loan && isBorrower && loan.status === LoanStatus.OPEN;
  const canBeClaimed = loan && isLender && loan.status === LoanStatus.FUNDED && 
    loan.repaymentDeadline < Math.floor(Date.now() / 1000);
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header usdcBalance={usdcBalance} />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center p-12">
            <h1 className="text-3xl font-bold text-white mb-8">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header usdcBalance={usdcBalance} />
        
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center p-12">
            <h1 className="text-3xl font-bold text-white mb-8">Loan Not Found</h1>
            <p className="text-gray-300 mb-8">
              {error || "The loan you're looking for doesn't exist or isn't available."}
            </p>
            <Link href="/" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header usdcBalance={usdcBalance} />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="text-gray-400 hover:text-white mr-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white">Loan Details #{loan.orderId}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: NFT Info */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">NFT Collateral</h2>
                
                <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  {nftMetadata?.image ? (
                    <img 
                      src={nftMetadata.image} 
                      alt={nftMetadata.name || `NFT #${loan.tokenId}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-3xl font-bold mb-2">#{loan.tokenId}</div>
                      <div>NFT Preview Not Available</div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">
                      {nftMetadata?.name || `NFT #${loan.tokenId}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="text-white font-medium">{loan.tokenId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract:</span>
                    <a 
                      href={`https://etherscan.io/token/${loan.nftContract}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {truncateAddress(loan.nftContract)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column: Loan Details */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Loan Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-3 py-1 text-sm font-medium text-white rounded-full ${
                      loan.status === LoanStatus.OPEN ? 'bg-blue-500' :
                      loan.status === LoanStatus.FUNDED ? 'bg-green-500' :
                      loan.status === LoanStatus.REPAID ? 'bg-gray-500' :
                      loan.status === LoanStatus.DEFAULTED ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}>
                      {getLoanStatusString(loan.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Loan Amount:</span>
                    <span className="text-white font-medium">{formatUSDC(BigInt(loan.loanAmount))} USDC</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Interest Rate:</span>
                    <span className="text-white font-medium">{formatInterestRate(loan.interestRate)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-medium">{formatDuration(loan.duration)}</span>
                  </div>
                  
                  {loan.status === LoanStatus.FUNDED && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Funded At:</span>
                        <span className="text-white font-medium">
                          {new Date(loan.fundedAt * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Repayment Deadline:</span>
                        <span className="text-white font-medium">
                          {formatDeadline(loan.repaymentDeadline)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created At:</span>
                    <span className="text-white font-medium">
                      {new Date(loan.createdAt * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Participants & Actions */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Participants</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Borrower:</span>
                    <a 
                      href={`https://etherscan.io/address/${loan.borrower}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {truncateAddress(loan.borrower)}
                      {isBorrower && <span className="text-white ml-2">(You)</span>}
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lender:</span>
                    {loan.lender && loan.lender !== '0x0000000000000000000000000000000000000000' ? (
                      <a 
                        href={`https://etherscan.io/address/${loan.lender}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:text-amber-400 font-medium"
                      >
                        {truncateAddress(loan.lender)}
                        {isLender && <span className="text-white ml-2">(You)</span>}
                      </a>
                    ) : (
                      <span className="text-white font-medium">Not funded yet</span>
                    )}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
                
                <div className="space-y-3">
                  {canBeFunded && (
                    <button
                      onClick={() => fundLoanOrder(loan.orderId)}
                      disabled={hookLoading}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
                    >
                      {hookLoading ? 'Processing...' : 'Fund Loan'}
                    </button>
                  )}
                  
                  {canBeRepaid && (
                    <button
                      onClick={() => repayLoan(loan.orderId)}
                      disabled={hookLoading}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
                    >
                      {hookLoading ? 'Processing...' : 'Repay Loan'}
                    </button>
                  )}
                  
                  {canBeCancelled && (
                    <button
                      onClick={() => cancelLoanOrder(loan.orderId)}
                      disabled={hookLoading}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
                    >
                      {hookLoading ? 'Processing...' : 'Cancel Order'}
                    </button>
                  )}
                  
                  {canBeClaimed && (
                    <button
                      onClick={() => claimDefaultedNFT(loan.orderId)}
                      disabled={hookLoading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
                    >
                      {hookLoading ? 'Processing...' : 'Claim NFT'}
                    </button>
                  )}
                  
                  {!canBeFunded && !canBeRepaid && !canBeCancelled && !canBeClaimed && (
                    <div className="text-center text-gray-400 py-3">
                      No actions available for this loan.
                    </div>
                  )}

                  {hookError && (
                    <div className="text-red-500 text-center mt-4">
                      {hookError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">
            &copy; {new Date().getFullYear()} Brewery Lend. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 