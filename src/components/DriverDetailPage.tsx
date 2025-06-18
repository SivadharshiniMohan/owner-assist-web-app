
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
      <div className="md:ml-20 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          {/* Header with better alignment */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-blue-600 h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Driver Details</h1>
            </div>
          </div>

          {/* Driver Info Card */}
          <Card className="bg-white rounded-2xl shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">KA 51 AH 7654</h2>
                  <p className="text-sm text-gray-500 mb-3">Tata Ace</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">4th block, Koramangala</span>
                  </div>
                </div>
              </div>
              
              {/* HR line */}
              <hr className="border-gray-200 my-4" />
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Driver Name</p>
                <p className="text-base font-medium text-gray-900">Rajesh Kumar</p>
              </div>
            </CardContent>
          </Card>

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
                <button 
                  onClick={onViewLedger}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  →
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Performance */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
          </div>

          <div className="flex gap-4">
            {/* Updated Earnings Card to match the design */}
            <Card className="bg-blue-600 text-white rounded-2xl shadow-lg flex-1 relative overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="text-2xl font-bold mb-1">₹2,609.00</div>
                <div className="text-sm text-blue-100 mb-4">Earnings</div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M20 80 L40 20 L60 60 L80 10" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
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
