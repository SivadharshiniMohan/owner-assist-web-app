
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useFleetList, Vehicle } from "../hooks/useFleetList";

interface FleetPageProps {
  onVehicleSelect: (vehicle: any) => void;
}

const FleetPage = ({ onVehicleSelect }: FleetPageProps) => {
  const [filterBy, setFilterBy] = useState("all");
  
  const { data: vehicles = [], isLoading } = useFleetList(13, filterBy);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "onTrip": return "bg-blue-500";
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "onTrip": return "On Trip";
      case "online": return "Online";  
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="md:ml-64 pt-4 md:pt-0">
          <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="text-center py-8">Loading fleet...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Fleet</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {["all", "onTrip", "online", "offline"].map((filter) => (
              <Button
                key={filter}
                variant={filterBy === filter ? "default" : "outline"}
                className={`rounded-full px-6 whitespace-nowrap ${
                  filterBy === filter 
                    ? "bg-blue-900 text-white hover:bg-blue-800" 
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setFilterBy(filter)}
              >
                {filter === "onTrip" ? "On Trip" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          {/* Vehicle List */}
          <div className="space-y-4">
            {vehicles.map((vehicle: Vehicle) => (
              <Card key={vehicle.driverId} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={vehicle.imageUrl} 
                      alt={vehicle.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(vehicle.status)}`}>
                          {getStatusText(vehicle.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{vehicle.vehicleNumber}</p>
                      <p className="text-gray-500 text-sm">{vehicle.vehicleTypeName}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onVehicleSelect({
                          id: vehicle.driverId,
                          driverName: vehicle.name,
                          vehicleNumber: vehicle.vehicleNumber,
                          earnings: "₹1,250.00",
                          location: `${vehicle.currentLatitude}, ${vehicle.currentLongitude}`,
                          status: vehicle.status
                        })}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {vehicles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No vehicles found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
