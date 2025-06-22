
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
  rating: number;
  phone: string;
  imageUrl?: string;
}

interface FleetPageProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const FleetPage = ({ onVehicleSelect }: FleetPageProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const { data: fleetList, isLoading } = useQuery({
    queryKey: ['fleetList', activeTab],
    queryFn: async () => {
      const filterParam = activeTab === "onTrip" ? "onTrip" : activeTab;
      const response = await fetch(`https://book.ecargo.co.in/v2/oa/stats/fleetList?oaId=13&filterBy=${filterParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fleet list');
      }
      const data = await response.json();
      return data.data || [];
    },
  });

  // Transform API data to match our interface
  const vehicles: Vehicle[] = fleetList?.map((item: any) => ({
    id: item.driverId || 0,
    driverName: item.name || "Driver name",
    vehicleNumber: item.vehicleNumber || "XX 00 ZZ 0000",
    earnings: `₹${Math.floor(Math.random() * 50000) + 10000}.00`, // Mock earnings since not in API
    location: "4th block, Koramangala", // Mock location since not in API
    status: item.status?.toLowerCase() === "ontrip" ? "ontrip" : 
            item.status?.toLowerCase() === "online" ? "online" : "offline",
    rating: 4.5, // Mock rating since not in API
    phone: "+91 9876543210", // Mock phone since not in API
    imageUrl: item.image || item.imageUrl // Get image from API
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ontrip": return "bg-blue-500";
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getFilteredVehicles = () => {
    if (activeTab === "all") return vehicles;
    return vehicles.filter(vehicle => {
      if (activeTab === "onTrip") return vehicle.status === "ontrip";
      return vehicle.status === activeTab;
    });
  };

  const filteredVehicles = getFilteredVehicles();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="md:ml-64 pt-4 md:pt-0">
          <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading fleet data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-20 md:pb-4">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Filter Tabs - Fully Responsive */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                activeTab === "all" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              variant={activeTab === "onTrip" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === "onTrip" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("onTrip")}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>On Trip ({vehicles.filter(v => v.status === 'ontrip').length})</span>
            </Button>
            <Button
              variant={activeTab === "online" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === "online" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("online")}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online ({vehicles.filter(v => v.status === 'online').length})</span>
            </Button>
            <Button
              variant={activeTab === "offline" ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === "offline" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("offline")}
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Offline ({vehicles.filter(v => v.status === 'offline').length})</span>
            </Button>
          </div>

          {/* Vehicle List - No scroll, proper height */}
          <div className="space-y-3">
            {filteredVehicles.length > 0 ? filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl"
                onClick={() => onVehicleSelect(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Vehicle Image or Icon */}
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {vehicle.imageUrl ? (
                          <img 
                            src={vehicle.imageUrl} 
                            alt="Vehicle"
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              // Fallback to default icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className={vehicle.imageUrl ? "hidden" : ""}
                        >
                          <rect x="3" y="9" width="18" height="9" rx="1.5" fill="#4B5563"/>
                          <rect x="1.5" y="12" width="3" height="3" rx="1.5" fill="#374151"/>
                          <rect x="19.5" y="12" width="3" height="3" rx="1.5" fill="#374151"/>
                          <rect x="6" y="6" width="12" height="4.5" rx="0.75" fill="#6B7280"/>
                          <circle cx="6.75" cy="19.5" r="2.25" fill="#1F2937"/>
                          <circle cx="17.25" cy="19.5" r="2.25" fill="#1F2937"/>
                          <circle cx="6.75" cy="19.5" r="1.125" fill="#9CA3AF"/>
                          <circle cx="17.25" cy="19.5" r="1.125" fill="#9CA3AF"/>
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-base truncate">{vehicle.driverName}</h3>
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(vehicle.status)}`}></div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2 truncate">{vehicle.vehicleNumber}</p>
                        <div className="text-lg font-bold text-gray-900 mb-2">{vehicle.earnings}</div>
                        <div className="flex items-center gap-1 text-gray-500 min-w-0">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">{vehicle.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Icon */}
                    <div className="ml-3 flex-shrink-0">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8 text-gray-500">
                No vehicles found for the selected filter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
