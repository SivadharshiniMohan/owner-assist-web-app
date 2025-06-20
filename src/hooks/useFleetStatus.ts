
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "../config/env";

interface FleetStatus {
  onTrip: number;
  online: number;
  offline: number;
}

export const useFleetStatus = (oaId: number) => {
  return useQuery({
    queryKey: ['fleetStatus', oaId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FLEET_STATUS}?oaId=${oaId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fleet status');
      }
      const data = await response.json();
      return data.data || { onTrip: 0, online: 0, offline: 0 };
    },
  });
};
