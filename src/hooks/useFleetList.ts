
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "../config/env";

export interface Vehicle {
  isOnTrip: number;
  driverId: number;
  currentLongitude: number;
  imageUrl: string;
  name: string;
  currentLatitude: number;
  vehicleTypeAutoId: number;
  vehicleNumber: string;
  driverStatus: boolean;
  vehicleTypeName: string;
  status: "onTrip" | "online" | "offline";
}

export const useFleetList = (oaId: number, filterBy: string = 'all') => {
  return useQuery({
    queryKey: ['fleetList', oaId, filterBy],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FLEET_LIST}?oaId=${oaId}&filterBy=${filterBy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fleet list');
      }
      const data = await response.json();
      return data.data || [];
    },
  });
};
