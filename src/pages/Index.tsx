
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
  const [showCalendar, setShowCalendar] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Earnings Section */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Today's Earnings</div>
            <div className="text-4xl font-bold text-black mb-3">{todayEarnings}</div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {currentDate}
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {showCalendar && (
            <Card className="mb-4 bg-white">
              <CardContent className="p-4">
                <CalendarView onBack={() => setShowCalendar(false)} />
              </CardContent>
            </Card>
          )}

          {/* Fleet Overview */}
          <div className="bg-white rounded-2xl shadow-sm mb-4">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Fleet ({fleetData.total})</h2>
                <button 
                  onClick={() => setCurrentView("fleet")}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-2xl font-bold">{fleetData.onTrip}<span className="text-sm font-normal opacity-90">/10</span></div>
                    <div className="text-sm mt-1">On Trip</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <path d="M8 20L20 8H40L52 20V40L40 52H20L8 40V20Z" fill="white" fillOpacity="0.3"/>
                      <circle cx="30" cy="30" r="15" fill="white" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
                
                <div className="bg-green-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-2xl font-bold">{fleetData.online}<span className="text-sm font-normal opacity-90">/10</span></div>
                    <div className="text-sm mt-1">Online</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="25" fill="white" fillOpacity="0.3"/>
                      <path d="M25 30L30 35L35 25" stroke="white" strokeWidth="3" fill="none" strokeOpacity="0.4"/>
                    </svg>
                  </div>
                </div>
                
                <div className="bg-gray-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-2xl font-bold">{fleetData.offline}<span className="text-sm font-normal opacity-90">/10</span></div>
                    <div className="text-sm mt-1">Offline</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="20" fill="white" fillOpacity="0.3"/>
                      <rect x="25" y="25" width="10" height="10" fill="white" fillOpacity="0.4"/>
                    </svg>
                  </div>
                </div>
                
                <div className="bg-red-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-2xl font-bold">{fleetData.suspended}<span className="text-sm font-normal opacity-90">/10</span></div>
                    <div className="text-sm mt-1">Suspended</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="20" fill="white" fillOpacity="0.3"/>
                      <path d="M20 20L40 40M40 20L20 40" stroke="white" strokeWidth="3" strokeOpacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
