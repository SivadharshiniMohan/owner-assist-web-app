
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 bg-white rounded-full p-1 shadow-sm">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium",
                activeTab === "all" 
                  ? "bg-gray-800 text-white hover:bg-gray-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              variant={activeTab === "ontrip" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2",
                activeTab === "ontrip" 
                  ? "bg-gray-800 text-white hover:bg-gray-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("ontrip")}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              On Trip ({vehicles.filter(v => v.status === 'ontrip').length})
            </Button>
            <Button
              variant={activeTab === "online" ? "default" : "ghost"}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2",
                activeTab === "online" 
                  ? "bg-gray-800 text-white hover:bg-gray-700 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
              onClick={() => setActiveTab("online")}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online ({vehicles.filter(v => v.status === 'online').length})
            </Button>
          </div>

          {/* Vehicle List */}
          <div className="space-y-3 pb-20 md:pb-4">
            {filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-0 shadow-sm rounded-2xl"
                onClick={() => onVehicleSelect(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Vehicle Image */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="12" width="24" height="12" rx="2" fill="#4B5563"/>
                          <rect x="2" y="16" width="4" height="4" rx="2" fill="#374151"/>
                          <rect x="26" y="16" width="4" height="4" rx="2" fill="#374151"/>
                          <rect x="8" y="8" width="16" height="6" rx="1" fill="#6B7280"/>
                          <circle cx="9" cy="26" r="3" fill="#1F2937"/>
                          <circle cx="23" cy="26" r="3" fill="#1F2937"/>
                          <circle cx="9" cy="26" r="1.5" fill="#9CA3AF"/>
                          <circle cx="23" cy="26" r="1.5" fill="#9CA3AF"/>
                        </svg>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-base">{vehicle.driverName}</h3>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{vehicle.vehicleNumber}</p>
                        <div className="text-lg font-bold text-gray-900 mb-2">{vehicle.earnings}</div>
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
