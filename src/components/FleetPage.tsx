
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
  rating: number;
  phone: string;
}

interface FleetPageProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const FleetPage = ({ onVehicleSelect }: FleetPageProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const vehicles: Vehicle[] = [
    { id: 1, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip", rating: 4.8, phone: "+91 9876543210" },
    { id: 2, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "online", rating: 4.5, phone: "+91 9876543211" },
    { id: 3, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "offline", rating: 4.2, phone: "+91 9876543212" },
    { id: 4, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip", rating: 4.9, phone: "+91 9876543213" },
    { id: 5, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "online", rating: 4.3, phone: "+91 9876543214" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ontrip": return "bg-blue-500";
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeTab === "all") return true;
    if (activeTab === "ontrip") return vehicle.status === "ontrip";
    if (activeTab === "online") return vehicle.status === "online";
    return false;
  });

  const getTabCount = (tab: string) => {
    if (tab === "all") return vehicles.length;
    return vehicles.filter(v => v.status === tab).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Filter Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-full p-1 shadow-sm">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-6 py-2 text-sm font-medium",
                activeTab === "all" 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              variant={activeTab === "ontrip" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-6 py-2 text-sm font-medium",
                activeTab === "ontrip" 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("ontrip")}
            >
              🔵 On Trip ({vehicles.filter(v => v.status === 'ontrip').length})
            </Button>
            <Button
              variant={activeTab === "online" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-6 py-2 text-sm font-medium",
                activeTab === "online" 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("online")}
            >
              🟢 Online ({vehicles.filter(v => v.status === 'online').length})
            </Button>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4 pb-20 md:pb-4">
            {filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-0 shadow-sm"
                onClick={() => onVehicleSelect(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Truck Icon */}
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                        <div className="text-xl">🚛</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-base">{vehicle.driverName}</h3>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{vehicle.vehicleNumber}</p>
                        <div className="text-xl font-bold text-gray-900 mb-2">{vehicle.earnings}</div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{vehicle.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Icon */}
                    <div className="ml-3 mt-1">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
