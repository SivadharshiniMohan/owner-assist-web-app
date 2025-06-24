
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import Header from "./Header";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
  vehicleType:string;
  latitude:any;
  longitude:any
}

interface DriverDetailPageProps {
  vehicle: Vehicle;
  onBack: () => void;
  onViewLedger: () => void;
}

const DriverDetailPage = ({ vehicle, onBack, onViewLedger }: DriverDetailPageProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // // Check authentication status on component mount
    // useEffect(() => {
    //   const isAuthenticated = apiService.isAuthenticated();
    //   setIsLoggedIn(isAuthenticated);
    // }, []);
    
  const { data: walletBalance } = useQuery({
    queryKey: ['fleetBalance', vehicle.id],
    queryFn: async () => {
      const response = await apiService.getWalletBalance(vehicle.id);
      return response?.data?.walletBalance
    },
    // enabled: isLoggedIn, // Only fetch when logged in
  });
    const { data: driverStats } = useQuery({
    queryKey: ['fleetstats', vehicle.id],
    queryFn: async () => {
      const response = await apiService.getDriverstats(vehicle.id);
      return response?.stats
    },
    // enabled: isLoggedIn, // Only fetch when logged in
  });

  //   // Handle login
  // if (!isLoggedIn) {
  //   return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  // }
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      <Header/>
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Header with better alignment */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-green-600 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Driver Details</h1>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="9" width="18" height="9" rx="1.5" fill="#4B5563"/>
                <rect x="1.5" y="12" width="3" height="3" rx="1.5" fill="#374151"/>
                <rect x="19.5" y="12" width="3" height="3" rx="1.5" fill="#374151"/>
                <rect x="6" y="6" width="12" height="4.5" rx="0.75" fill="#6B7280"/>
                <circle cx="6.75" cy="19.5" r="2.25" fill="#1F2937"/>
                <circle cx="17.25" cy="19.5" r="2.25" fill="#1F2937"/>
                <circle cx="6.75" cy="19.5" r="1.125" fill="#9CA3AF"/>
                <circle cx="17.25" cy="19.5" r="1.125" fill="#9CA3AF"/>
              </svg> */}
              <img src={vehicle?.imageUrl} alt="vehicle" className="w-10 h-10 rounded-lg object-cover" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{vehicle.vehicleNumber}</h2>
              <p className="text-sm text-gray-500">{vehicle.vehicleType}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 mb-6">
            <MapPin className="w-4 h-4" />
               <div className="flex items-center gap-1 text-gray-500 min-w-0">
                          <a
                            className="text-sm truncate text-green-600 hover:underline cursor-pointer"
                            href={`https://www.google.com/maps/search/?api=1&query=${vehicle.latitude},${vehicle.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            Find a driver
                          </a> </div>
          </div>

          {/* Ledger Balance Card - Made clickable */}
          <Card 
            className="bg-gray-800 text-white rounded-2xl mb-6 shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
           
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">₹{walletBalance}</div>
                  <div className="text-sm text-gray-300">Ledger Balance</div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors" onClick={onViewLedger}>
                  →
                </div>
              </div>
              {/* <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                <span className="text-sm text-gray-300">Ledger Activity</span>
                <button className="text-gray-400 hover:text-white transition-colors">
                  →
                </button>
              </div> */}
            </CardContent>
          </Card>

          {/* Today's Performance */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
          </div>

          <div className="flex gap-4">
            {/* Updated Earnings Card - Made clickable */}
            <Card 
              className="bg-green-600 text-white rounded-2xl shadow-lg flex-1 relative overflow-hidden cursor-pointer hover:bg-green-700 transition-colors"
              
            >
              <CardContent className="p-6 relative">
                <div className="text-2xl font-bold mb-1">{vehicle.earnings}</div>
                <div className="text-sm text-green-100 mb-4">Earnings</div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
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
                  <div className="text-xl font-bold text-gray-900">{driverStats?.daily?.trips}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </CardContent>
              </Card>
              
              {/* <Card className="bg-white rounded-xl shadow-sm">
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
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailPage;
