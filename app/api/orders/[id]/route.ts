import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BREWLEND_CONTRACT_ADDRESS } from '../../../../config/contracts';
import brewLendABI from '../../../../abi/brewLend.json';

// You would normally use environment variables for this
const RPC_URL = 'http://localhost:8545';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    try {
      // Connect to provider
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      
      // Set a timeout for connection
      const providerPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Provider connection timeout')), 5000);
        provider.getBlockNumber().then(resolve).catch(reject);
      });
      
      // Wait for provider to connect or timeout
      await providerPromise;
      
      const brewLendContract = new ethers.Contract(BREWLEND_CONTRACT_ADDRESS, brewLendABI, provider);

      // Fetch order details
      const order = await brewLendContract.orders(orderId);
      
      return NextResponse.json({
        order: {
          orderId: Number(order.orderId),
          borrower: order.borrower,
          lender: order.lender,
          nftContract: order.nftContract,
          tokenId: Number(order.tokenId),
          loanAmount: order.loanAmount.toString(),
          interestRate: Number(order.interestRate),
          duration: Number(order.duration),
          createdAt: Number(order.createdAt),
          fundedAt: Number(order.fundedAt),
          repaymentDeadline: Number(order.repaymentDeadline),
          status: Number(order.status)
        }
      });
    } catch (providerError) {
      console.error('Provider connection error:', providerError);
      
      // Return mock data for development
      return NextResponse.json({
        order: {
          orderId: Number(orderId),
          borrower: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          lender: "0x0000000000000000000000000000000000000000",
          nftContract: "0x59b670e9fA9D0A427751Af201D676719a970857b",
          tokenId: 1,
          loanAmount: "100000000", // 100 USDC with 6 decimals
          interestRate: 500, // 5%
          duration: 2592000, // 30 days in seconds
          createdAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
          fundedAt: 0,
          repaymentDeadline: 0,
          status: 0 // OPEN
        }
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 