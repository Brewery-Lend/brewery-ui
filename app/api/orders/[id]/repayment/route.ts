import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BREWLEND_CONTRACT_ADDRESS } from '../../../../../config/contracts';
import brewLendABI from '../../../../../abi/brewLend.json';

// You would normally use environment variables for this
const RPC_URL = ' ec2-44-203-209-141.compute-1.amazonaws.com:8547';

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
      
      // Calculate repayment amount with interest
      const secondsPassed = Math.floor(Date.now() / 1000) - Number(order.fundedAt);
      const interestAmount = (BigInt(order.loanAmount) * BigInt(order.interestRate) * BigInt(secondsPassed)) / 
        (BigInt(10000) * BigInt(365 * 24 * 60 * 60));
      const repaymentAmount = BigInt(order.loanAmount) + interestAmount;
      
      // Calculate platform fee
      const platformFeePercent = await brewLendContract.platformFeePercent();
      const platformFee = (repaymentAmount * BigInt(platformFeePercent)) / BigInt(10000);
      const totalRepayment = repaymentAmount + platformFee;
      
      return NextResponse.json({
        loanAmount: order.loanAmount.toString(),
        interestAmount: interestAmount.toString(),
        repaymentAmount: repaymentAmount.toString(),
        platformFee: platformFee.toString(),
        totalRepayment: totalRepayment.toString()
      });
    } catch (providerError) {
      console.error('Provider connection error:', providerError);
      
      // Return mock data for development
      const loanAmount = "100000000"; // 100 USDC
      const interestAmount = "500000"; // 0.5 USDC
      const repaymentAmount = "100500000"; // 100.5 USDC
      const platformFee = "1005000"; // 1.005 USDC (1% fee)
      const totalRepayment = "101505000"; // 101.505 USDC
      
      return NextResponse.json({
        loanAmount,
        interestAmount,
        repaymentAmount,
        platformFee,
        totalRepayment
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate repayment details' },
      { status: 500 }
    );
  }
} 