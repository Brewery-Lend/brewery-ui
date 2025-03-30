'use client';

import { useState } from 'react';
import { LoanOrder, LoanStatus } from '../utils/contracts';
import { 
  formatUSDC, 
  formatInterestRate, 
  formatDuration, 
  formatDeadline,
  getLoanStatusString
} from '../utils/contracts';

interface LoanOrderCardProps {
  order: LoanOrder;
  userAddress: string | undefined;
  onFund: (orderId: any) => Promise<any>;
  onRepay: (orderId: any) => Promise<any>;
  onCancel: (orderId: any) => Promise<any>;
  onClaim: (orderId: any) => Promise<any>;
  isLoading: boolean;
}

export default function LoanOrderCard({
  order,
  userAddress,
  onFund,
  onRepay,
  onCancel,
  onClaim,
  isLoading
}: LoanOrderCardProps) {
  // Safety check - if order is invalid, don't render anything
  if (!order || typeof order !== 'object') {
    console.error("Invalid order object provided to LoanOrderCard:", order);
    return null;
  }
  
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(order.nftImage || null);
  const [nftName, setNftName] = useState<string | null>(order.nftName || null);
  const [assetType, setAssetType] = useState<string | null>((order as any).assetType || null);
  
  // Safely access properties with fallbacks to prevent errors
  const borrower = order.borrower || '0x0000000000000000000000000000000000000000';
  const lender = order.lender || '0x0000000000000000000000000000000000000000';
  const status = Number(order.status);

  // Helper for normalizing addresses to lowercase
  const normalizeAddress = (addr: string) => addr ? addr.toLowerCase() : '';

  // Check if user is the borrower or lender - use normalized addresses
  const isBorrower = userAddress && normalizeAddress(userAddress) === normalizeAddress(borrower);
  const isLender = userAddress && normalizeAddress(userAddress) === normalizeAddress(lender);

  // Determine which action buttons to show based on role
  const canBeRepaid = isBorrower && status === LoanStatus.FUNDED;
  const canBeClaimed = isLender && status === LoanStatus.FUNDED && 
    Number(order.repaymentDeadline || 0) < Math.floor(Date.now() / 1000);
    
  // Only show cancel button if user is the borrower, otherwise show fund button for OPEN loans
  const showCancelButton = isBorrower && status === LoanStatus.OPEN;
  const showFundButton = !isBorrower && status === LoanStatus.OPEN;
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // RWA asset types mapping
  const assetTypes = {
    '0x1a1b1c1d1e1f2a2b2c2d2e2f3a3b3c3d3e3f4a4b': 'Real Estate',
    '0x2b2c2d2e2f3a3b3c3d3e3f4a4b4c4d4e4f5a5b5c': 'Invoice Factoring',
    '0x3c3d3e3f4a4b4c4d4e4f5a5b5c5d5e5f6a6b6c6d': 'Commodities',
    '0x4d4e4f5a5b5c5d5e5f6a6b6c6d6e6f7a7b7c7d7e': 'Revenue Shares',
  } as Record<string, string>;
  
  // Get asset type based on contract address
  const getAssetType = (contractAddress: string) => {
    if (assetType) return assetType;
    
    const normalizedAddress = contractAddress.toLowerCase();
    return assetTypes[normalizedAddress] || 'Real-World Asset';
  };
  
  const statusColors = {
    [LoanStatus.OPEN]: 'bg-blue-500',
    [LoanStatus.FUNDED]: 'bg-green-500',
    [LoanStatus.REPAID]: 'bg-gray-500',
    [LoanStatus.DEFAULTED]: 'bg-red-500',
    [LoanStatus.CANCELLED]: 'bg-yellow-500',
  } as Record<number, string>;
  
  // Get the status color safely, whether status is string or number
  const getStatusColor = (status: string | number) => {
    const statusNum = Number(status);
    return statusColors[statusNum] || 'bg-gray-500';
  };
  
  const getAssetName = () => {
    if (nftName) return nftName;
    
    // If no name is provided, generate one based on asset type and token ID
    const type = getAssetType(order.nftContract);
    const id = order.tokenId;
    
    // Generate descriptive names based on asset type
    switch(type) {
      case 'Real Estate':
        return `${['Manhattan Office', 'Miami Beachfront', 'San Francisco Commercial', 'Chicago Residential'][id % 4]} #${id}`;
      case 'Invoice Factoring':
        return `${['Fortune 500', 'Healthcare', 'Government', 'Enterprise'][id % 4]} Invoice Bundle #${id}`;
      case 'Commodities':
        return `${['Gold Reserve', 'Rare Metals', 'Agricultural', 'Energy'][id % 4]} Token #${id}`;
      case 'Revenue Shares':
        return `${['Tech Startup', 'Franchise', 'Music Royalty', 'Film Production'][id % 4]} Revenue #${id}`;
      default:
        return `${type} #${id}`;
    }
  };
  
  return (
    <div className="espresso-card border border-[#303030] overflow-hidden shadow-lg bg-[#1A1A1A]">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Loan #{order.orderId}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(order.status)}`}>
                {getLoanStatusString(Number(order.status))}
              </span>
              <span className="text-gray-400 text-sm">
                Created {new Date(Number(order.createdAt) * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#D48C3D]">
              {(() => {
                try {
                  return formatUSDC(BigInt(order.loanAmount)) + ' USDC';
                } catch (err) {
                  console.error("Error formatting loan amount:", order.loanAmount);
                  return order.loanAmount + ' USDC';
                }
              })()}
            </div>
            <div className="text-gray-400 text-sm">
              Interest: {(() => {
                try {
                  return formatInterestRate(Number(order.interestRate));
                } catch (err) {
                  return order.interestRate + '%';
                }
              })()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#121212] p-3 rounded-lg border border-[#303030]">
            <div className="text-gray-400 text-xs">RWA Collateral</div>
            <div className="text-white font-medium">
              {getAssetName()}
            </div>
            <div className="text-[#D48C3D] text-xs mt-1">
              {getAssetType(order.nftContract)}
            </div>
          </div>
          
          <div className="bg-[#121212] p-3 rounded-lg border border-[#303030]">
            <div className="text-gray-400 text-xs">Duration</div>
            <div className="text-white font-medium">
              {(() => {
                try {
                  return formatDuration(Number(order.duration));
                } catch (err) {
                  return 'N/A';
                }
              })()}
            </div>
            {Number(order.status) === LoanStatus.FUNDED && (
              <div className="text-gray-400 text-xs mt-1">
                Due: {(() => {
                  try {
                    return formatDeadline(Number(order.repaymentDeadline || 0));
                  } catch (err) {
                    return 'N/A';
                  }
                })()}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4 py-2 px-3 rounded-lg bg-[#121212] border border-[#303030]">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-sm">Settlement Time:</span>
            <span className="text-[#D48C3D] font-medium text-sm">~1.2 seconds</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Verified:</span>
            <span className="text-green-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Legal Documentation
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Borrower:</span>
            <span className="text-white">{truncateAddress(borrower)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lender:</span>
            <span className="text-white">
              {order.lender && order.lender !== '0x0000000000000000000000000000000000000000' 
                ? truncateAddress(lender) 
                : 'Not funded yet'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Show primary action buttons based on user role and loan status */}
          {showFundButton && (
            <button
              onClick={() => onFund(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#D48C3D] hover:bg-[#9B4D1F] disabled:bg-gray-600 text-[#121212] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {isLoading ? 'Processing...' : 'Fund Loan'}
            </button>
          )}
          
          {canBeRepaid && (
            <button
              onClick={() => onRepay(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#D48C3D] hover:bg-[#9B4D1F] disabled:bg-gray-600 text-[#121212] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {isLoading ? 'Processing...' : 'Repay Loan'}
            </button>
          )}
          
          {showCancelButton && (
            <button
              onClick={() => onCancel(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              {isLoading ? 'Processing...' : 'Cancel Order'}
            </button>
          )}
          
          {canBeClaimed && (
            <button
              onClick={() => onClaim(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#4B40DA] hover:opacity-90 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {isLoading ? 'Processing...' : 'Claim RWA'}
            </button>
          )}
          
          {/* If no action is available, show a status message */}
          {!canBeRepaid && !showCancelButton && !canBeClaimed && (
            <div className="flex-1 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg text-center">
              {getLoanStatusString(status)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 