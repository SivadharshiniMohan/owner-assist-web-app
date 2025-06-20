
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useFleetStatus } from "../hooks/useFleetStatus";

interface FleetOverviewProps {
  onFleetClick: () => void;
  onEarningsClick: () => void;
  currentEarnings: string;
}

const FleetOverview = ({ onFleetClick, onEarningsClick, currentEarnings }: FleetOverviewProps) => {
  const { data: fleetStats } = useFleetStatus(13);
  const fleetData = fleetStats || { onTrip: 0, online: 0, offline: 0 };
  const totalFleet = fleetData.onTrip + fleetData.online + fleetData.offline;

  return (
    <>
      {/* Earnings Section */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Today's Earnings</div>
        <button 
          onClick={onEarningsClick}
          className="text-3xl font-bold text-black mb-2 hover:text-blue-600 transition-colors cursor-pointer"
        >
          {currentEarnings}
        </button>
        <hr className="border-gray-200 mb-4" />
      </div>

      {/* Fleet Overview */}
      <div className="bg-white rounded-2xl shadow-sm mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Fleet ({totalFleet})</h2>
            <button 
              onClick={onFleetClick}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-500 text-white rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-2xl font-bold">{fleetData.onTrip}<span className="text-sm font-normal opacity-90">/{totalFleet}</span></div>
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
                <div className="text-2xl font-bold">{fleetData.online}<span className="text-sm font-normal opacity-90">/{totalFleet}</span></div>
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
                <div className="text-2xl font-bold">{fleetData.offline}<span className="text-sm font-normal opacity-90">/{totalFleet}</span></div>
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
    </>
  );
};

export default FleetOverview;
