
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Phone } from "lucide-react";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
}

interface FleetPageProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const FleetPage = ({ onVehicleSelect }: FleetPageProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const vehicles: Vehicle[] = [
    { id: 1, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip" },
    { id: 2, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip" },
    { id: 3, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "online" },
    { id: 4, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "online" },
    { id: 5, driverName: "Driver name", vehicleNumber: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "offline" },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ontrip") return vehicle.status === "ontrip";
    if (activeFilter === "online") return vehicle.status === "online";
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ontrip": return "bg-blue-500";
      case "online": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const getFilterCount = (filter: string) => {
    if (filter === "all") return vehicles.length;
    return vehicles.filter(v => v.status === filter).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="bg-white rounded-t-3xl md:rounded-none min-h-screen md:mt-0 mt-4">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Fleet</h1>
              <p className="text-gray-600">Monitor live locations of all vehicles</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveFilter("all")}
              >
                All ({getFilterCount("all")})
              </Button>
              <Button
                variant={activeFilter === "ontrip" ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveFilter("ontrip")}
              >
                On Trip ({getFilterCount("ontrip")})
              </Button>
              <Button
                variant={activeFilter === "online" ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveFilter("online")}
              >
                Online ({getFilterCount("online")})
              </Button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 md:pb-4">
              {filteredVehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{vehicle.driverName}</div>
                          <div className="text-sm text-gray-500">{vehicle.vehicleNumber}</div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xl font-bold text-gray-900">{vehicle.earnings}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {vehicle.location}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        vehicle.status === 'ontrip' ? 'bg-blue-100 text-blue-700' : 
                        vehicle.status === 'online' ? 'bg-green-100 text-green-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {vehicle.status === 'ontrip' ? 'On Trip' : vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                      </Button>
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
