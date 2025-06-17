
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Truck, MapPin, Calendar } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock data - will be replaced with React Query API calls
  const todayEarnings = "₹56,000.00";
  const currentDate = "Thu, 5 Sep 2024";
  
  const fleetData = {
    total: 10,
    onTrip: 4,
    online: 3,
    offline: 2,
    suspended: 1
  };

  const vehicles = [
    { id: 1, name: "Driver name", number: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip" },
    { id: 2, name: "Driver name", number: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "ontrip" },
    { id: 3, name: "Driver name", number: "XX 00 ZZ 0000", earnings: "₹00,000.00", location: "4th block, Koramangala", status: "online" },
  ];

  const transactions = [
    { id: 1, type: "Trip earnings", time: "10:10 AM", source: "Cash", amount: "₹1,200.00", positive: true },
    { id: 2, type: "Incentives", time: "09:00 PM", source: "Online", amount: "₹100.00", positive: true },
    { id: 3, type: "Penalty", time: "09:15 AM", source: "", amount: "₹60.00", positive: false },
    { id: 4, type: "Recharge success", time: "07:16 AM", source: "", amount: "₹1,800.00", positive: true },
    { id: 5, type: "Recharge failed", time: "06:30 PM", source: "", amount: "₹600.00", positive: false },
  ];

  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
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
        <Card className="bg-white text-black rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">My Fleet ({fleetData.total})</h2>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
                onClick={() => setCurrentView("fleet")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500 text-white rounded-xl p-4 relative overflow-hidden">
                <div className="text-2xl font-bold">{fleetData.onTrip}</div>
                <div className="text-xs opacity-90">/10</div>
                <div className="text-sm mt-1">On Trip</div>
                <Truck className="absolute bottom-2 right-2 h-8 w-8 opacity-30" />
              </div>
              
              <div className="bg-green-500 text-white rounded-xl p-4 relative overflow-hidden">
                <div className="text-2xl font-bold">{fleetData.online}</div>
                <div className="text-xs opacity-90">/10</div>
                <div className="text-sm mt-1">Online</div>
                <MapPin className="absolute bottom-2 right-2 h-8 w-8 opacity-30" />
              </div>
              
              <div className="bg-gray-500 text-white rounded-xl p-4 relative overflow-hidden">
                <div className="text-2xl font-bold">{fleetData.offline}</div>
                <div className="text-xs opacity-90">/10</div>
                <div className="text-sm mt-1">Offline</div>
                <div className="absolute bottom-2 right-2 h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-white rounded-full opacity-60"></div>
                </div>
              </div>
              
              <div className="bg-red-500 text-white rounded-xl p-4 relative overflow-hidden">
                <div className="text-2xl font-bold">{fleetData.suspended}</div>
                <div className="text-xs opacity-90">/10</div>
                <div className="text-sm mt-1">Suspended</div>
                <div className="absolute bottom-2 right-2 h-8 w-8 bg-white bg-opacity-20 rounded-xl"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FleetView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="bg-white rounded-t-3xl mt-16 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-md">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" className="rounded-full bg-blue-50 border-blue-200">All</Button>
            <Button variant="outline" size="sm" className="rounded-full">On Trip (2)</Button>
            <Button variant="outline" size="sm" className="rounded-full">Online (2)</Button>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setCurrentView("vehicle");
                    }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.number}</div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      vehicle.status === 'ontrip' ? 'bg-blue-500' : 
                      vehicle.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xl font-bold">{vehicle.earnings}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {vehicle.location}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-center max-w-md mx-auto">
              <div className="flex space-x-8">
                <Button variant="ghost" className="flex flex-col items-center py-2" onClick={() => setCurrentView("dashboard")}>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-xs mt-1">Home</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center py-2 text-blue-600">
                  <Truck className="w-6 h-6" />
                  <span className="text-xs mt-1">My Fleet</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center py-2" onClick={() => setCurrentView("ledger")}>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-xs mt-1">Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LedgerView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold leading-tight">
            Clear and transparent<br />
            transaction records!
          </h1>
        </div>

        <Card className="bg-white text-black rounded-2xl shadow-lg">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Ledger
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-600">Balance: ₹500.00</div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              <Button variant="default" size="sm" className="rounded-full bg-blue-900 text-white">Today</Button>
              <Button variant="outline" size="sm" className="rounded-full">Weekly</Button>
              <Button variant="outline" size="sm" className="rounded-full">Custom</Button>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Transactions (10)</h3>
                <Button variant="ghost" size="sm">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                </Button>
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
  );

  const VehicleDetailView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="bg-white rounded-t-3xl mt-16 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("fleet")}>
              <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
              Back
            </Button>
          </div>

          {selectedVehicle && (
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{selectedVehicle.name}</div>
                      <div className="text-gray-500">{selectedVehicle.number}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${
                    selectedVehicle.status === 'ontrip' ? 'bg-blue-500' : 
                    selectedVehicle.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-bold">{selectedVehicle.earnings}</div>
                  <div className="flex items-center text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedVehicle.location}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium capitalize ${
                      selectedVehicle.status === 'ontrip' ? 'text-blue-600' : 
                      selectedVehicle.status === 'online' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {selectedVehicle.status === 'ontrip' ? 'On Trip' : selectedVehicle.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Today's Earnings</span>
                    <span className="font-medium">{selectedVehicle.earnings}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-right">{selectedVehicle.location}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentView("ledger")}>
                  View Transaction History
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // Render based on current view
  switch (currentView) {
    case "fleet":
      return <FleetView />;
    case "ledger":
      return <LedgerView />;
    case "vehicle":
      return <VehicleDetailView />;
    default:
      return <DashboardView />;
  }
};

export default Index;
