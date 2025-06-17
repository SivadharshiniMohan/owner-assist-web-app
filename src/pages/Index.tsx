
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import FleetPage from "@/components/FleetPage";
import DriverDetailPage from "@/components/DriverDetailPage";
import ProfilePage from "@/components/ProfilePage";
import LoginPage from "@/components/LoginPage";
import CalendarView from "@/components/CalendarView";
import LedgerPage from "@/components/LedgerPage";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Mock data
  const todayEarnings = "₹56,000.00";
  const currentDate = "Thu, 5 Sep 2024";
  
  const fleetData = {
    total: 10,
    onTrip: 4,
    online: 3,
    offline: 2,
    suspended: 1
  };

  const DashboardView = () => (
    <div className="min-h-screen bg-white">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Earnings Card */}
          <Card className="bg-white text-black rounded-2xl mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Today's Earnings</div>
              <div className="text-3xl font-bold mb-4">{todayEarnings}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {currentDate}
                </div>
                <button 
                  onClick={() => setCurrentView("calendar")}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Fleet Overview */}
          <Card className="bg-white text-black rounded-2xl shadow-lg mb-20 md:mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">My Fleet ({fleetData.total})</h2>
                <button 
                  onClick={() => setCurrentView("fleet")}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="text-2xl font-bold">{fleetData.onTrip}</div>
                  <div className="text-xs opacity-90">/10</div>
                  <div className="text-sm mt-1">On Trip</div>
                </div>
                
                <div className="bg-green-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="text-2xl font-bold">{fleetData.online}</div>
                  <div className="text-xs opacity-90">/10</div>
                  <div className="text-sm mt-1">Online</div>
                </div>
                
                <div className="bg-gray-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="text-2xl font-bold">{fleetData.offline}</div>
                  <div className="text-xs opacity-90">/10</div>
                  <div className="text-sm mt-1">Offline</div>
                </div>
                
                <div className="bg-red-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="text-2xl font-bold">{fleetData.suspended}</div>
                  <div className="text-xs opacity-90">/10</div>
                  <div className="text-sm mt-1">Suspended</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Handle login
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Render based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "fleet":
        return (
          <FleetPage 
            onVehicleSelect={(vehicle) => {
              setSelectedVehicle(vehicle);
              setCurrentView("vehicle");
            }} 
          />
        );
      case "profile":
        return <ProfilePage />;
      case "vehicle":
        return selectedVehicle ? (
          <DriverDetailPage 
            vehicle={selectedVehicle}
            onBack={() => setCurrentView("fleet")}
            onViewLedger={() => setCurrentView("ledger")}
          />
        ) : (
          <DashboardView />
        );
      case "calendar":
        return <CalendarView onBack={() => setCurrentView("dashboard")} />;
      case "ledger":
        return <LedgerPage onBack={() => setCurrentView("vehicle")} />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="w-full">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
