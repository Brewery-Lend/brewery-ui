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
  onFund: (orderId: number) => Promise<any>;
  onRepay: (orderId: number) => Promise<any>;
  onCancel: (orderId: number) => Promise<any>;
  onClaim: (orderId: number) => Promise<any>;
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
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);
  
  // For a real implementation, you would fetch NFT metadata here
  // useEffect(() => {
  //   // Fetch NFT metadata
  // }, [order.nftContract, order.tokenId]);
  
  const isBorrower = userAddress && userAddress.toLowerCase() === order.borrower.toLowerCase();
  const isLender = userAddress && userAddress.toLowerCase() === order.lender.toLowerCase();
  const canBeRepaid = isBorrower && order.status === LoanStatus.FUNDED;
  const canBeFunded = !isBorrower && order.status === LoanStatus.OPEN;
  const canBeCancelled = isBorrower && order.status === LoanStatus.OPEN;
  const canBeClaimed = isLender && order.status === LoanStatus.FUNDED && 
    order.repaymentDeadline < Math.floor(Date.now() / 1000);
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const statusColors = {
    [LoanStatus.OPEN]: 'bg-blue-500',
    [LoanStatus.FUNDED]: 'bg-green-500',
    [LoanStatus.REPAID]: 'bg-gray-500',
    [LoanStatus.DEFAULTED]: 'bg-red-500',
    [LoanStatus.CANCELLED]: 'bg-yellow-500',
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Loan #{order.orderId}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColors[order.status]}`}>
                {getLoanStatusString(order.status)}
              </span>
              <span className="text-gray-400 text-sm">
                Created {new Date(order.createdAt * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-500">{formatUSDC(order.loanAmount)} USDC</div>
            <div className="text-gray-400 text-sm">Interest: {formatInterestRate(order.interestRate)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs">Collateral</div>
            <div className="text-white">
              {nftName || `NFT #${order.tokenId}`}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {truncateAddress(order.nftContract)}
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-xs">Duration</div>
            <div className="text-white">
              {formatDuration(order.duration)}
            </div>
            {order.status === LoanStatus.FUNDED && (
              <div className="text-gray-400 text-xs mt-1">
                Due: {formatDeadline(order.repaymentDeadline)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Borrower:</span>
            <span className="text-white">{truncateAddress(order.borrower)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lender:</span>
            <span className="text-white">
              {order.lender && order.lender !== '0x0000000000000000000000000000000000000000' 
                ? truncateAddress(order.lender) 
                : 'Not funded yet'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canBeRepaid && (
            <button
              onClick={() => onRepay(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
            >
              {isLoading ? 'Processing...' : 'Repay Loan'}
            </button>
          )}
          
          {canBeFunded && (
            <button
              onClick={() => onFund(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
            >
              {isLoading ? 'Processing...' : 'Fund Loan'}
            </button>
          )}
          
          {canBeCancelled && (
            <button
              onClick={() => onCancel(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
            >
              {isLoading ? 'Processing...' : 'Cancel Order'}
            </button>
          )}
          
          {canBeClaimed && (
            <button
              onClick={() => onClaim(order.orderId)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
            >
              {isLoading ? 'Processing...' : 'Claim NFT'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 