'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWalletClient } from 'wagmi';
import { 
  LoanOrder,
  parseUSDC,
  LoanStatus
} from '../utils/contracts';
import { BREWLEND_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '../config/contracts';
import brewLendABI from '../abi/brewLend.json';
import usdcABI from '../abi/usdc.json';
import erc721ABI from '../abi/erc721.json';

export function useBrewLend() {
  const { address } = useAccount();
  
  const [borrowerOrders, setBorrowerOrders] = useState<LoanOrder[]>([]);
  const [lenderOrders, setLenderOrders] = useState<LoanOrder[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Using wagmi's useWriteContract
  const { writeContractAsync: writeBrewLend } = useWriteContract();
  const { writeContractAsync: writeUSDC } = useWriteContract();
  const { writeContractAsync: writeERC721 } = useWriteContract();

  // Fetch borrower orders
  const fetchBorrowerOrders = useCallback(async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      
      const result = await fetch(`/api/orders?borrower=${address}`);
      if (!result.ok) throw new Error('Failed to fetch borrower orders');
      
      const data = await result.json();
      setBorrowerOrders(data.orders);
    } catch (err) {
      console.error('Error fetching borrower orders:', err);
      setError('Failed to fetch borrower orders');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch lender orders
  const fetchLenderOrders = useCallback(async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      
      const result = await fetch(`/api/orders?lender=${address}`);
      if (!result.ok) throw new Error('Failed to fetch lender orders');
      
      const data = await result.json();
      setLenderOrders(data.orders);
    } catch (err) {
      console.error('Error fetching lender orders:', err);
      setError('Failed to fetch lender orders');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch USDC balance
  const fetchUsdcBalance = useCallback(async () => {
    if (!address) return;
    
    try {
      const result = await fetch(`/api/balance?address=${address}&token=${USDC_CONTRACT_ADDRESS}`);
      if (!result.ok) throw new Error('Failed to fetch USDC balance');
      
      const data = await result.json();
      setUsdcBalance(BigInt(data.balance));
    } catch (err) {
      console.error('Error fetching USDC balance:', err);
      setError('Failed to fetch USDC balance');
    }
  }, [address]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    await Promise.all([
      fetchBorrowerOrders(),
      fetchLenderOrders(),
      fetchUsdcBalance()
    ]);
  }, [fetchBorrowerOrders, fetchLenderOrders, fetchUsdcBalance]);

  // Create a loan order
  const createLoanOrder = async (
    nftContract: string,
    tokenId: number,
    loanAmount: string,
    interestRate: number,
    durationInDays: number
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert loan amount to wei
      const loanAmountWei = parseUSDC(loanAmount);
      
      // Convert duration to seconds
      const durationInSeconds = durationInDays * 24 * 60 * 60;
      
      // First approve BrewLend contract to transfer the NFT
      const approveTxHash = await writeERC721({
        address: nftContract as `0x${string}`,
        abi: erc721ABI,
        functionName: 'approve',
        args: [BREWLEND_CONTRACT_ADDRESS, BigInt(tokenId)]
      });
      
      // Create loan order
      const txHash = await writeBrewLend({
        address: BREWLEND_CONTRACT_ADDRESS,
        abi: brewLendABI,
        functionName: 'createLoanOrder',
        args: [
          nftContract, 
          BigInt(tokenId), 
          loanAmountWei, 
          BigInt(interestRate), 
          BigInt(durationInSeconds)
        ]
      });
      
      // Refresh data
      await fetchData();
      
      return txHash;
    } catch (err: any) {
      console.error('Error creating loan order:', err);
      setError(err.message || 'Failed to create loan order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fund a loan order
  const fundLoanOrder = async (orderId: number) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the order details
      const result = await fetch(`/api/orders/${orderId}`);
      if (!result.ok) throw new Error('Failed to fetch order details');
      
      const orderData = await result.json();
      const order = orderData.order;
      
      // Approve USDC transfer
      const approveTxHash = await writeUSDC({
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcABI,
        functionName: 'approve',
        args: [BREWLEND_CONTRACT_ADDRESS, BigInt(order.loanAmount)]
      });
      
      // Fund the loan
      const txHash = await writeBrewLend({
        address: BREWLEND_CONTRACT_ADDRESS,
        abi: brewLendABI,
        functionName: 'fundLoanOrder',
        args: [BigInt(orderId)]
      });
      
      // Refresh data
      await fetchData();
      
      return txHash;
    } catch (err: any) {
      console.error('Error funding loan order:', err);
      setError(err.message || 'Failed to fund loan order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Repay a loan
  const repayLoan = async (orderId: number) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the order details and repayment amount from API
      const result = await fetch(`/api/orders/${orderId}/repayment`);
      if (!result.ok) throw new Error('Failed to fetch repayment details');
      
      const repaymentData = await result.json();
      const totalRepayment = BigInt(repaymentData.totalRepayment);
      
      // Approve USDC transfer
      const approveTxHash = await writeUSDC({
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcABI,
        functionName: 'approve',
        args: [BREWLEND_CONTRACT_ADDRESS, totalRepayment]
      });
      
      // Repay the loan
      const txHash = await writeBrewLend({
        address: BREWLEND_CONTRACT_ADDRESS,
        abi: brewLendABI,
        functionName: 'repayLoan',
        args: [BigInt(orderId)]
      });
      
      // Refresh data
      await fetchData();
      
      return txHash;
    } catch (err: any) {
      console.error('Error repaying loan:', err);
      setError(err.message || 'Failed to repay loan');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Claim defaulted NFT
  const claimDefaultedNFT = async (orderId: number) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const txHash = await writeBrewLend({
        address: BREWLEND_CONTRACT_ADDRESS,
        abi: brewLendABI,
        functionName: 'claimDefaultedNFT',
        args: [BigInt(orderId)]
      });
      
      // Refresh data
      await fetchData();
      
      return txHash;
    } catch (err: any) {
      console.error('Error claiming defaulted NFT:', err);
      setError(err.message || 'Failed to claim defaulted NFT');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a loan order
  const cancelLoanOrder = async (orderId: number) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const txHash = await writeBrewLend({
        address: BREWLEND_CONTRACT_ADDRESS,
        abi: brewLendABI,
        functionName: 'cancelLoanOrder',
        args: [BigInt(orderId)]
      });
      
      // Refresh data
      await fetchData();
      
      return txHash;
    } catch (err: any) {
      console.error('Error cancelling loan order:', err);
      setError(err.message || 'Failed to cancel loan order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when the component mounts or when the address changes
  useEffect(() => {
    if (address) {
      fetchData();
    }
  }, [address, fetchData]);

  return {
    borrowerOrders,
    lenderOrders,
    ownedNFTs,
    usdcBalance,
    isLoading,
    error,
    createLoanOrder,
    fundLoanOrder,
    repayLoan,
    claimDefaultedNFT,
    cancelLoanOrder,
    fetchData,
  };
} 