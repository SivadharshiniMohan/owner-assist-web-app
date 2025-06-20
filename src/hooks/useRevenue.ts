
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "../config/env";

interface RevenueData {
  date: string;
  count: number;
}

export const useRevenue = (startDate: string, endDate: string, zones: string = '1,2,3') => {
  return useQuery({
    queryKey: ['revenue', startDate, endDate, zones],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REVENUE}?startDate=${startDate}&endDate=${endDate}&zones=${zones}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      const data = await response.json();
      return data.data || [];
    },
  });
};
