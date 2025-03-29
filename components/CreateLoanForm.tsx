'use client';

import { useState, FormEvent } from 'react';
import { useAccount } from 'wagmi';

interface CreateLoanFormProps {
  onSubmit: (nftContract: string, tokenId: number, loanAmount: string, interestRate: number, durationInDays: number) => Promise<any>;
  isLoading: boolean;
}

export default function CreateLoanForm({ onSubmit, isLoading }: CreateLoanFormProps) {
  const { isConnected } = useAccount();
  
  const [nftContract, setNftContract] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [durationInDays, setDurationInDays] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!nftContract) {
      setError('NFT contract address is required');
      return;
    }
    
    if (!tokenId || isNaN(Number(tokenId)) || Number(tokenId) <= 0) {
      setError('Valid token ID is required');
      return;
    }
    
    if (!loanAmount || isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      setError('Valid loan amount is required');
      return;
    }
    
    if (!interestRate || isNaN(Number(interestRate)) || Number(interestRate) <= 0 || Number(interestRate) > 50) {
      setError('Interest rate must be between 0 and 50');
      return;
    }
    
    if (!durationInDays || isNaN(Number(durationInDays)) || Number(durationInDays) < 1 || Number(durationInDays) > 365) {
      setError('Duration must be between 1 and 365 days');
      return;
    }
    
    // Convert interest rate from percentage to basis points
    const interestRateBasisPoints = Math.round(Number(interestRate) * 100);
    
    try {
      await onSubmit(
        nftContract,
        Number(tokenId),
        loanAmount,
        interestRateBasisPoints,
        Number(durationInDays)
      );
      
      // Reset form on success
      setNftContract('');
      setTokenId('');
      setLoanAmount('');
      setInterestRate('');
      setDurationInDays('');
    } catch (err: any) {
      setError(err.message || 'Failed to create loan order');
    }
  };
  
  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 text-center">
        <p className="text-white mb-4">Connect your wallet to create a loan order</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Create Loan Order</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <label htmlFor="nftContract" className="block text-gray-300 text-sm font-medium mb-2">
              NFT Contract Address
            </label>
            <input
              type="text"
              id="nftContract"
              value={nftContract}
              onChange={(e) => setNftContract(e.target.value)}
              placeholder="0x..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="tokenId" className="block text-gray-300 text-sm font-medium mb-2">
              Token ID
            </label>
            <input
              type="number"
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="1"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              min="0"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div>
            <label htmlFor="loanAmount" className="block text-gray-300 text-sm font-medium mb-2">
              Loan Amount (USDC)
            </label>
            <input
              type="number"
              id="loanAmount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="100"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="interestRate" className="block text-gray-300 text-sm font-medium mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="5"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              min="0.01"
              max="50"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="durationInDays" className="block text-gray-300 text-sm font-medium mb-2">
              Duration (Days)
            </label>
            <input
              type="number"
              id="durationInDays"
              value={durationInDays}
              onChange={(e) => setDurationInDays(e.target.value)}
              placeholder="30"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              min="1"
              max="365"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium rounded-lg"
        >
          {isLoading ? 'Creating...' : 'Create Loan Order'}
        </button>
      </form>
    </div>
  );
} 