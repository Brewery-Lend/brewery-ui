import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// RPC URL - ideally this should be in an environment variable
const RPC_URL = 'http://44.203.209.141:8547';

export async function POST(request: NextRequest) {
  try {
    // Extract the JSON-RPC request from the request body
    const requestData = await request.json();
    
    // Create a provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Send the JSON-RPC request to the provider
    let response;
    
    // Handle different methods
    if (requestData.method === 'eth_call') {
      // For contract calls
      response = await provider.call(requestData.params[0]);
    } else if (requestData.method === 'eth_sendTransaction') {
      // For sending transactions (would need a signer)
      return NextResponse.json(
        { error: 'Direct transaction sending not supported via proxy' },
        { status: 400 }
      );
    } else {
      // For other RPC methods, use the provider's send method
      response = await provider.send(requestData.method, requestData.params || []);
    }
    
    return NextResponse.json({
      jsonrpc: '2.0',
      id: requestData.id,
      result: response
    });
    
  } catch (error) {
    console.error('Blockchain proxy error:', error);
    return NextResponse.json(
      { 
        jsonrpc: '2.0',
        id: 1,
        error: { 
          code: -32603, 
          message: 'Internal JSON-RPC error' 
        }
      },
      { status: 500 }
    );
  }
} 