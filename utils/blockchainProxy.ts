import { ethers } from 'ethers';

/**
 * A custom provider that routes JSON-RPC requests through our Next.js API proxy
 * to avoid CORS issues when connecting to the blockchain from the browser
 */
export class ProxyProvider extends ethers.JsonRpcProvider {
  private requestId = 1;

  constructor() {
    // We don't need an actual URL here as we'll override the send method
    super('http://localhost:3000');
  }

  async send(method: string, params: Array<any>): Promise<any> {
    const requestData = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params
    };

    const response = await fetch('/api/blockchain/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Blockchain proxy error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`RPC Error: ${JSON.stringify(data.error)}`);
    }
    
    return data.result;
  }
}

/**
 * Create a contract instance that works through our proxy
 */
export function createProxyContract(address: string, abi: any) {
  const provider = new ProxyProvider();
  return new ethers.Contract(address, abi, provider);
}

/**
 * Executes a read-only blockchain call through our proxy
 */
export async function proxyCall(contractAddress: string, abi: any, functionName: string, args: any[] = []) {
  try {
    const contract = createProxyContract(contractAddress, abi);
    return await contract[functionName](...args);
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
} 