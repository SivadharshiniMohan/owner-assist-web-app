
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import FleetPage from "@/components/FleetPage";
import DriverDetailPage from "@/components/DriverDetailPage";
import ProfilePage from "@/components/ProfilePage";
import LoginPage from "@/components/LoginPage";
import CalendarView from "@/components/CalendarView";
import LedgerPage from "@/components/LedgerPage";
import RevenueChart from "@/components/RevenueChart";
import FleetOverview from "@/components/FleetOverview";
import MiniCalendar from "@/components/MiniCalendar";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const DashboardView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          <FleetOverview 
            onFleetClick={() => setCurrentView("fleet")}
            onEarningsClick={() => setCurrentView("ledger")}
            currentEarnings={currentEarnings}
          />

          <MiniCalendar 
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentDateString={currentDateString}
            dateEarnings={dateEarnings}
            getEarningsForDate={getEarningsForDate}
          />

          {/* Revenue Chart */}
          <RevenueChart />
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
        return <LedgerPage onBack={() => setCurrentView("dashboard")} />;
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
