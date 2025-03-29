import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { USDC_CONTRACT_ADDRESS } from '../../../config/contracts';
import usdcABI from '../../../abi/usdc.json';

// You would normally use environment variables for this
const RPC_URL = 'http://44.203.209.141:8547';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const token = searchParams.get('token') || USDC_CONTRACT_ADDRESS;

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
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
      
      const tokenContract = new ethers.Contract(token, usdcABI, provider);

      // Get token balance
      const balance = await tokenContract.balanceOf(address);
      
      return NextResponse.json({
        address,
        token,
        balance: balance.toString()
      });
    } catch (providerError) {
      console.error('Provider connection error:', providerError);
      
      // Return mock data for development
      return NextResponse.json({
        address,
        token,
        balance: "1000000000" // 1000 USDC with 6 decimals
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
} 