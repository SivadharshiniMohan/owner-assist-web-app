
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Star } from "lucide-react";

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
    { id: 1, driverName: "Rajesh Kumar", vehicleNumber: "DL 8C 5555", earnings: "₹2,500", location: "Connaught Place", status: "ontrip", rating: 4.8, phone: "+91 9876543210" },
    { id: 2, driverName: "Amit Singh", vehicleNumber: "DL 7B 1234", earnings: "₹1,800", location: "Karol Bagh", status: "online", rating: 4.5, phone: "+91 9876543211" },
    { id: 3, driverName: "Suresh Yadav", vehicleNumber: "DL 9A 7890", earnings: "₹0", location: "Lajpat Nagar", status: "offline", rating: 4.2, phone: "+91 9876543212" },
    { id: 4, driverName: "Vikas Sharma", vehicleNumber: "DL 6D 4567", earnings: "₹3,200", location: "Dwarka", status: "ontrip", rating: 4.9, phone: "+91 9876543213" },
    { id: 5, driverName: "Manoj Gupta", vehicleNumber: "DL 5E 8901", earnings: "₹1,200", location: "Rohini", status: "online", rating: 4.3, phone: "+91 9876543214" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ontrip": return "bg-blue-500";
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ontrip": return "On Trip";
      case "online": return "Online";
      case "offline": return "Offline";
      default: return "Unknown";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="bg-white rounded-t-3xl md:rounded-none min-h-screen md:mt-0 mt-4">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Fleet</h1>
              <p className="text-gray-600">Manage your vehicles and drivers</p>
            </div>

            {/* Fleet Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
                  <div className="text-sm text-blue-700">Total</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.status === 'ontrip').length}</div>
                  <div className="text-sm text-green-700">On Trip</div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{vehicles.filter(v => v.status === 'online').length}</div>
                  <div className="text-sm text-emerald-700">Online</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{vehicles.filter(v => v.status === 'offline').length}</div>
                  <div className="text-sm text-gray-700">Offline</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: "all", label: "All" },
                { id: "ontrip", label: "On Trip" },
                { id: "online", label: "Online" }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className={cn(
                    "flex-1 md:flex-none px-6",
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-blue-600 border-blue-200 hover:bg-blue-50"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} ({getTabCount(tab.id)})
                </Button>
              ))}
            </div>

            {/* Vehicle List */}
            <div className="space-y-4 pb-20 md:pb-4">
              {filteredVehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-gray-200"
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {vehicle.driverName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{vehicle.driverName}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-600">{vehicle.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{vehicle.vehicleNumber}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{vehicle.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                              <span className="text-xs text-gray-600">{getStatusText(vehicle.status)}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-600">{vehicle.earnings}</div>
                              <div className="text-xs text-gray-500">Today</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-2">→</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
