
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Driver Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-xl">🚛</div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">KA 51 AH 7654</h1>
              <p className="text-sm text-gray-500">Tata Ace</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">4th block, Koramangala</span>
          </div>

          {/* Ledger Balance Card */}
          <Card className="bg-gray-800 text-white rounded-2xl mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">₹549.86</div>
                  <div className="text-sm text-gray-300">Ledger Balance</div>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={onViewLedger}
                >
                  Withdraw
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                <span className="text-sm text-gray-300">Ledger Activity</span>
                <div className="text-gray-400">
                  →
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Performance */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
          </div>

          <div className="flex gap-4">
            {/* Earnings Card */}
            <Card className="bg-blue-600 text-white rounded-2xl shadow-lg flex-1">
              <CardContent className="p-6">
                <div className="text-2xl font-bold mb-1">₹2,609.00</div>
                <div className="text-sm text-blue-100 mb-4">Earnings</div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="flex flex-col gap-4 flex-1">
              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-500">Missed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-gray-900">1</div>
                  <div className="text-sm text-gray-500">Cancelled</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailPage;
