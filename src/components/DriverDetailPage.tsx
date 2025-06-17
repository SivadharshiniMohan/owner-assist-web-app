
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, MapPin, Star, Clock, Truck, IndianRupee } from "lucide-react";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
}

interface DriverDetailPageProps {
  vehicle: Vehicle;
  onBack: () => void;
  onViewLedger: () => void;
}

const DriverDetailPage = ({ vehicle, onBack, onViewLedger }: DriverDetailPageProps) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="bg-white rounded-t-3xl md:rounded-none min-h-screen md:mt-0 mt-4">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Details</h1>
                <p className="text-gray-600">Vehicle and performance information</p>
              </div>
            </div>

            {/* Driver Profile Card */}
            <Card className="mb-6 border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {vehicle.driverName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{vehicle.driverName}</h2>
                    <p className="text-gray-600">{vehicle.vehicleNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                      <span className="text-sm text-gray-600">{getStatusText(vehicle.status)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{vehicle.earnings}</div>
                    <div className="text-sm text-gray-500">Today's Earnings</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Driver
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={onViewLedger}
                  >
                    <IndianRupee className="w-4 h-4 mr-2" />
                    View Ledger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-600">4.8</div>
                  <div className="text-sm text-blue-700">Rating</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-600">23</div>
                  <div className="text-sm text-green-700">Trips Today</div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">8.5h</div>
                  <div className="text-sm text-purple-700">Online Time</div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-600">127km</div>
                  <div className="text-sm text-orange-700">Distance</div>
                </CardContent>
              </Card>
            </div>

            {/* Location and Trip Info */}
            <Card className="mb-6 border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{vehicle.location}</span>
                </div>
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-gray-500">Map View (Integration Required)</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mb-20 md:mb-6 border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { time: "2:30 PM", action: "Trip completed", location: "Connaught Place to Karol Bagh", amount: "+₹250" },
                    { time: "1:45 PM", action: "Trip started", location: "Connaught Place", amount: "" },
                    { time: "12:30 PM", action: "Trip completed", location: "India Gate to Connaught Place", amount: "+₹180" },
                    { time: "11:15 AM", action: "Came online", location: "India Gate", amount: "" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.action}</div>
                          <div className="text-sm text-gray-500">{activity.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <div className="font-semibold text-green-600">{activity.amount}</div>
                        )}
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailPage;
