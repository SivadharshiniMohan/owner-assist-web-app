
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import FleetPage from "@/components/FleetPage";
import DriverDetailPage from "@/components/DriverDetailPage";
import ProfilePage from "@/components/ProfilePage";

interface Vehicle {
  id: number;
  driverName: string;
  vehicleNumber: string;
  earnings: string;
  location: string;
  status: "ontrip" | "online" | "offline";
}

const Index = () => {
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

  const transactions = [
    { id: 1, type: "Trip earnings", time: "10:10 AM", source: "Cash", amount: "₹1,200.00", positive: true },
    { id: 2, type: "Incentives", time: "09:00 PM", source: "Online", amount: "₹100.00", positive: true },
    { id: 3, type: "Penalty", time: "09:15 AM", source: "", amount: "₹60.00", positive: false },
    { id: 4, type: "Recharge success", time: "07:16 AM", source: "", amount: "₹1,800.00", positive: true },
    { id: 5, type: "Recharge failed", time: "06:30 PM", source: "", amount: "₹600.00", positive: false },
  ];

  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold leading-tight">
              Track your earnings &<br />
              engagement real<br />
              time!
            </h1>
          </div>

          {/* Earnings Card */}
          <Card className="bg-white text-black rounded-2xl mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Today's Earnings</div>
              <div className="text-3xl font-bold mb-4">{todayEarnings}</div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                {currentDate}
              </div>
            </CardContent>
          </Card>

          {/* Fleet Overview */}
          <Card className="bg-white text-black rounded-2xl shadow-lg mb-20 md:mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">My Fleet ({fleetData.total})</h2>
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

  const LedgerView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold leading-tight">
              Clear and transparent<br />
              transaction records!
            </h1>
          </div>

          <Card className="bg-white text-black rounded-2xl shadow-lg mb-20 md:mb-6">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-sm text-gray-600">Balance: ₹500.00</div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                <button className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm">Today</button>
                <button className="px-4 py-2 border border-gray-300 rounded-full text-sm">Weekly</button>
                <button className="px-4 py-2 border border-gray-300 rounded-full text-sm">Custom</button>
              </div>

              {/* Transactions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Transactions (10)</h3>
                </div>

                <div className="text-sm text-gray-500 mb-4">{currentDate}</div>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.positive ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.positive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{transaction.type}</div>
                          <div className="text-xs text-gray-500">
                            {transaction.time}{transaction.source && ` • ${transaction.source}`}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.positive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.positive ? '' : '- '}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

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
      case "ledger":
        return <LedgerView />;
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
