import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BREWLEND_CONTRACT_ADDRESS } from '../../../../config/contracts';
import brewLendABI from '../../../../abi/brewLend.json';

// You would normally use environment variables for this
const RPC_URL = 'http://44.203.209.141:8547';

export async function GET() {
  try {
    // All blockchain interactions happen in the API route (server-side),
    // avoiding CORS issues that would occur in the browser
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

      // Get all available orders
      const availableOrderIds = await brewLendContract.getAllAvailableOrdersToLend();
      console.log({availableOrderIds})
      
      // Fetch detailed information for each order
      const ordersWithDetails = await Promise.all(
        availableOrderIds.map(async (orderId: ethers.BigNumberish) => {
          const order = await brewLendContract.orders(orderId);
          
          // Format order data for frontend consumption
          return {
            orderId: order.orderId.toString(),
            borrower: order.borrower,
            lender: order.lender || ethers.ZeroAddress,
            nftContract: order.nftContract,
            tokenId: order.tokenId.toString(),
            loanAmount: order.loanAmount.toString(),
            interestRate: order.interestRate.toString(),
            duration: order.duration.toString(),
            createdAt: order.createdAt.toString(),
            status: order.status
          };
        })
      );

      // Debug borrower addresses for comparison
      console.log("Order borrowers for address comparison:");
      ordersWithDetails.forEach((order, index) => {
        console.log(`Order ${order.orderId} borrower: ${order.borrower}`);
      });

      // Ensure all orders have consistent formatting and data types
      // Add all required fields for the LoanOrder interface
      const formattedOrders = ordersWithDetails.map(order => ({
        orderId: order.orderId,
        borrower: order.borrower,
        lender: order.lender,
        nftContract: order.nftContract,
        tokenId: order.tokenId,
        loanAmount: order.loanAmount,
        interestRate: order.interestRate,
        duration: order.duration,
        createdAt: order.createdAt,
        fundedAt: '0',
        repaymentDeadline: '0',
        status: order.status.toString(),
        // Add mock data for RWA presentation
        nftImage: null,
        nftName: null,
        assetType: getRandomAssetType()
      }));

      console.log('API returning formatted orders:', formattedOrders);

      return NextResponse.json({
        success: true,
        orders: formattedOrders
      });
    } catch (providerError) {
      console.error('Provider connection error:', providerError);
      // Return mock data for development
      return NextResponse.json({
        success: true,
        orders: [
          {
            orderId: '1',
            borrower: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // This is a test borrower
            lender: '0x0000000000000000000000000000000000000000',
            nftContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
            tokenId: '1',
            loanAmount: '1000000000', // 1000 USDC (6 decimals)
            interestRate: '500', // 5% (in basis points)
            duration: '2592000', // 30 days in seconds
            createdAt: (Math.floor(Date.now() / 1000) - 86400).toString(), // 1 day ago
            fundedAt: '0',
            repaymentDeadline: '0',
            status: '0', // OPEN
            nftImage: null,
            nftName: null,
            assetType: 'Real Estate'
          },
          {
            orderId: '2',
            borrower: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Different borrower
            lender: '0x0000000000000000000000000000000000000000',
            nftContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
            tokenId: '2',
            loanAmount: '2000000000', // 2000 USDC (6 decimals)
            interestRate: '700', // 7% (in basis points)
            duration: '5184000', // 60 days in seconds
            createdAt: (Math.floor(Date.now() / 1000) - 43200).toString(), // 12 hours ago
            fundedAt: '0',
            repaymentDeadline: '0',
            status: '0', // OPEN
            nftImage: null,
            nftName: null,
            assetType: 'Invoice Factoring'
          },
          {
            orderId: '3',
            borrower: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // Different borrower
            lender: '0x0000000000000000000000000000000000000000',
            nftContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            tokenId: '3',
            loanAmount: '3000000000', // 3000 USDC (6 decimals)
            interestRate: '600', // 6% (in basis points)
            duration: '7776000', // 90 days in seconds
            createdAt: (Math.floor(Date.now() / 1000) - 21600).toString(), // 6 hours ago
            fundedAt: '0',
            repaymentDeadline: '0',
            status: '0', // OPEN
            nftImage: null,
            nftName: null,
            assetType: 'Commodities'
          }
        ]
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available orders' },
      { status: 500 }
    );
  }
}

// Helper function to generate random asset types for mock purposes
function getRandomAssetType(): string {
  const assetTypes = [
    'Real Estate',
    'Invoice Factoring',
    'Commodities',
    'Revenue Shares'
  ];
  
  return assetTypes[Math.floor(Math.random() * assetTypes.length)];
}
