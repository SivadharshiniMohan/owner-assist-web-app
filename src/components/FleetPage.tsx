
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
    <div className="min-h-screen bg-white font-sans">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Filter Tabs - Updated to match ledger page style */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "all" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              variant={activeTab === "ontrip" ? "default" : "outline"}
              className={`rounded-full px-6 flex items-center gap-2 ${
                activeTab === "ontrip" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("ontrip")}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              On Trip ({vehicles.filter(v => v.status === 'ontrip').length})
            </Button>
            <Button
              variant={activeTab === "online" ? "default" : "outline"}
              className={`rounded-full px-6 flex items-center gap-2 ${
                activeTab === "online" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
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
                className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl"
                onClick={() => onVehicleSelect(vehicle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Updated Vehicle Image */}
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{vehicle.driverName}</h3>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{vehicle.vehicleNumber}</p>
                        <div className="text-base font-bold text-gray-900 mb-1">{vehicle.earnings}</div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{vehicle.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Icon */}
                    <div className="ml-3">
                      <Phone className="w-4 h-4 text-gray-400" />
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
