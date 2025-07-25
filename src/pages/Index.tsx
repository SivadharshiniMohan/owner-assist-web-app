import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import Sidebar from "@/components/Sidebar";
import FleetPage from "@/components/FleetPage";
import DriverDetailPage from "@/components/DriverDetailPage";
import TripDetailsPage from "@/components/TripDetailsPage";
import ProfilePage from "@/components/ProfilePage";
import LoginPage from "@/components/LoginPage";
import CalendarView from "@/components/CalendarView";
import LedgerPage from "@/components/LedgerPage";
import ReportPage from "@/components/ReportPage";
import RevenueChart from "@/components/RevenueChart";
import Header from "@/components/Header";
import { format } from "date-fns";
import TripListPage from "@/components/TripListPage";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriverDetails, setSelectedDriverDetails] = useState<{driverID: number, driverName: string} | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check authentication status on component mount
  useEffect(() => {
    const isAuthenticated = apiService.isAuthenticated();
    setIsLoggedIn(isAuthenticated);
  }, []);

  // Get user data for API calls
  const userData = apiService.getUserData();
  const oaId = userData?.oaId || 13;

  // Fetch fleet status using API service
  const { data: fleetStats } = useQuery({
    queryKey: ['fleetStatus'],
    queryFn: async () => {
      const response = await apiService.getFleetStatus(oaId);
      return response.data || { onTrip: 0, online: 0, offline: 0 };
    },
    enabled: isLoggedIn === true, // Only fetch when logged in
  });

  // Mock data for different dates
  const dateEarnings: { [key: string]: string } = {
    [format(new Date(), "yyyy-MM-dd")]: "₹56,000.00",
    "2024-06-17": "₹42,500.00",
    "2024-06-16": "₹38,200.00",
    "2024-06-15": "₹51,800.00",
    "2024-06-14": "₹47,300.00",
  };

  const getEarningsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dateEarnings[dateStr] || "₹0.00";
  };

  const currentEarnings = getEarningsForDate(selectedDate);
  const currentDateString = format(selectedDate, "EEE, d MMM yyyy");
  
  const fleetData = fleetStats || { onTrip: 0, online: 0, offline: 0 };
  const totalFleet = fleetData.onTrip + fleetData.online + fleetData.offline;

  const DashboardView = () => (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      <Header />
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Earnings Section */}
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Today's Earnings</div>
            <div className="text-3xl font-bold text-black mb-2">{currentEarnings}</div>
            <div className="flex items-center gap-2 mb-3">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {currentDateString}
              </button>
            </div>
            <hr className="border-gray-200 mb-4" />
          </div>

          {/* Calendar Overlay */}
          {showCalendar && (
            <Card className="mb-4 bg-white relative z-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Select Date</h3>
                    <div className="text-sm text-gray-600">
                      Selected: {format(selectedDate, "dd MMM yyyy")} - {getEarningsForDate(selectedDate)}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCalendar(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {/* Simple calendar grid */}
                  <div className="text-xs font-medium text-gray-500 py-2">Sun</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Mon</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Tue</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Wed</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Thu</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Fri</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Sat</div>
                  
                  {/* Calendar dates */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(2024, 5, i - 5); // June 2024
                    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    const hasEarnings = dateEarnings[format(date, "yyyy-MM-dd")];
                    
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(date);
                          setShowCalendar(false);
                        }}
                        className={`
                          w-8 h-8 text-sm rounded-full flex items-center justify-center
                          ${isSelected ? 'bg-green-600 text-white' : ''}
                          ${isToday && !isSelected ? 'bg-green-100 text-green-600' : ''}
                          ${hasEarnings && !isSelected && !isToday ? 'bg-green-100 text-green-600' : ''}
                          ${!hasEarnings && !isSelected && !isToday ? 'text-gray-400' : ''}
                          hover:bg-gray-100 transition-colors
                        `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fleet Overview */}
          <div className="bg-white rounded-2xl shadow-sm mb-4">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Fleet ({totalFleet})</h2>
                <button 
                  onClick={() => setCurrentView("fleet")}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-500 text-white rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-2xl font-bold">{fleetData.onTrip}</div>
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
                    <div className="text-2xl font-bold">{fleetData.online}</div>
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
                    <div className="text-2xl font-bold">{fleetData.offline}</div>
                    <div className="text-sm mt-1">Offline</div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="20" fill="white" fillOpacity="0.3"/>
                      <rect x="25" y="25" width="10" height="10" fill="white" fillOpacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <RevenueChart />
        </div>
      </div>
    </div>
  );

  // Handle login
  if (isLoggedIn === null) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Render based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "fleet":
        return (
          <>
            <Header />
            <FleetPage 
              onVehicleSelect={(vehicle) => {
                setSelectedVehicle(vehicle);
                setCurrentView("vehicle");
              }} 
            />
          </>
        );
      case "trips":
        return (
          <>
            <Header />
            <TripListPage onBack={() => setCurrentView("dashboard")} />
          </>
        );
      case "profile":
        return (
          <>
            <Header />
            <ProfilePage />
          </>
        );
      case "report":
        return (
          <>
            <Header />
            <ReportPage onBack={() => setCurrentView("dashboard")} />
          </>
        );
      case "vehicle":
        return selectedVehicle ? (
          <>
            <Header />
            <DriverDetailPage 
              vehicle={selectedVehicle}
              onBack={() => setCurrentView("fleet")}
              onViewLedger={() => setCurrentView("ledger")}
              onViewTripDetails={(driverID, driverName) => {
                setSelectedDriverDetails({ driverID, driverName });
                setCurrentView("tripDetails");
              }}
              onViewTripList={() => setCurrentView("trips")}
            />
          </>
        ) : (
          <DashboardView />
        );
      case "tripDetails":
        return selectedDriverDetails ? (
          <>
            <Header />
            <TripDetailsPage 
              driverID={selectedDriverDetails.driverID}
              driverName={selectedDriverDetails.driverName}
              onBack={() => setCurrentView("vehicle")}
            />
          </>
        ) : (
          <DashboardView />
        );
      case "calendar":
        return (
          <>
            <Header />
            <CalendarView onBack={() => setCurrentView("dashboard")} />
          </>
        );
      case "ledger":
        return (
          <>
            <Header />
            <LedgerPage onBack={() => setCurrentView("vehicle")} />
          </>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="w-full font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
