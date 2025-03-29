import { useState, useEffect } from 'react';
import { createProxyContract, proxyCall } from '../utils/blockchainProxy';
import { BREWLEND_CONTRACT_ADDRESS } from '../config/contracts';
import brewLendABI from '../abi/brewLend.json';

/**
 * Hook to fetch available loan orders
 */
export function useAvailableOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Use the API route instead of direct blockchain connection
        const response = await fetch('/api/orders/available');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          throw new Error(data.error || 'Failed to fetch orders');
        }
        
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { orders, loading, error };
}

/**
 * Hook to interact with a specific loan order
 */
export function useLoanOrder(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.order);
        } else {
          throw new Error(data.error || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  return { order, loading, error };
}

/**
 * For advanced uses, this function allows direct interaction with the contract
 * through our proxy to avoid CORS issues
 */
export function useBrewLendContract() {
  // This function creates a contract instance that works through our proxy
  const getContract = () => {
    return createProxyContract(BREWLEND_CONTRACT_ADDRESS, brewLendABI);
  };

  // Function to call a read method on the contract
  const callMethod = async (methodName, ...args) => {
    return proxyCall(BREWLEND_CONTRACT_ADDRESS, brewLendABI, methodName, args);
  };

  return {
    getContract,
    callMethod
  };
} 