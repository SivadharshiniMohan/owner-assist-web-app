
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "../config/env";

export interface WalletTransaction {
  TRANSACTION_ID: number;
  TRANSACTION_TYPE: string;
  AMOUNT: number;
  CREATED_TIME: string;
  DESCRIPTION?: string;
  TRIP_ID?: number;
  DRIVER_ID: number;
}

export const useWalletTransactions = (driverId: number, pageNo: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['walletTransactions', driverId, pageNo, pageSize],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WALLET_TRANSACTIONS}?id=${driverId}&pageNo=${pageNo}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      return {
        transactions: data.data || [],
        totalCount: data.total_count || 0
      };
    },
  });
};
