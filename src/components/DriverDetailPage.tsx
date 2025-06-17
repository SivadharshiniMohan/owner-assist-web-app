
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Truck } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="bg-white rounded-t-3xl md:rounded-none min-h-screen md:mt-0 mt-4">
          <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Driver Info Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{vehicle.vehicleNumber}</h1>
                    <p className="text-gray-600">{vehicle.driverName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{vehicle.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Ledger Balance Card */}
            <Card className="mb-6">
              <CardContent className="p-6 bg-gray-900 text-white rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold">₹549.86</div>
                    <div className="text-gray-400">Ledger Balance</div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Withdraw
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Ledger Activity</span>
                  <Button variant="ghost" size="sm" className="text-white p-0">
                    →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Performance */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Today's Performance</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Earnings Card */}
                  <div className="bg-blue-600 text-white rounded-xl p-6 relative overflow-hidden">
                    <div className="text-2xl font-bold mb-2">₹2,609.00</div>
                    <div className="text-blue-100">Earnings</div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-bold text-2xl">8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Missed</span>
                      <span className="font-bold text-2xl">3</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Cancelled</span>
                      <span className="font-bold text-2xl">1</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={onViewLedger}
                >
                  View Transaction History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailPage;
