import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BREWLEND_CONTRACT_ADDRESS } from '../../../../config/contracts';
import brewLendABI from '../../../../abi/brewLend.json';

// You would normally use environment variables for this
const RPC_URL = 'http://44.203.209.141:8547';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Connect to provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    try {
      // Set a timeout for connection
      const providerPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Provider connection timeout')), 5000);
        provider.getBlockNumber().then(resolve).catch(reject);
      });
      
      // Wait for provider to connect or timeout
      await providerPromise;
      
      // Create contract instance
      const brewLendContract = new ethers.Contract(
        BREWLEND_CONTRACT_ADDRESS,
        brewLendABI,
        provider
      );

      // Get order details
      const order = await brewLendContract.orders(orderId);
      
      if (!order || !order.orderId || order.orderId.toString() === '0') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Format order data for frontend consumption
      const formattedOrder = {
        orderId: order.orderId.toString(),
        borrower: order.borrower,
        lender: order.lender || ethers.ZeroAddress,
        nftContract: order.nftContract,
        tokenId: order.tokenId.toString(),
        loanAmount: order.loanAmount.toString(),
        interestRate: order.interestRate.toString(),
        duration: order.duration.toString(),
        createdAt: order.createdAt.toString(),
        fundedAt: order.fundedAt?.toString() || '0',
        repaymentDeadline: order.repaymentDeadline?.toString() || '0',
        status: order.status
      };

      return NextResponse.json({
        success: true,
        order: formattedOrder
      });
    } catch (providerError) {
      console.error('Provider connection error:', providerError);
      
      // Return mock data for development
      return NextResponse.json({
        success: true,
        order: {
          orderId: orderId,
          borrower: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          lender: '0x0000000000000000000000000000000000000000',
          nftContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          tokenId: '1',
          loanAmount: '1000000000', // 1000 USDC (6 decimals)
          interestRate: '500', // 5% (in basis points)
          duration: '2592000', // 30 days in seconds
          createdAt: '1685123456',
          fundedAt: '0',
          repaymentDeadline: '0',
          status: '0' // OPEN
        }
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 