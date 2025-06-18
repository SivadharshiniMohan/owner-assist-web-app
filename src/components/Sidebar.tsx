
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Truck, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "fleet", label: "My Fleet", icon: Truck },
    { id: "profile", label: "Profile", icon: User },
  ];

  // Determine if sidebar should be in icon mode (for ledger and driver detail pages)
  const isIconMode = currentView === "ledger" || currentView === "vehicle";
  
  // Determine active item for ledger and vehicle pages
  const getActiveItem = () => {
    if (currentView === "ledger" || currentView === "vehicle") {
      return "fleet";
    }
    return currentView;
  };

  const activeItem = getActiveItem();

  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeItem === item.id ? "default" : "ghost"}
          className={cn(
            isIconMode ? "w-12 h-12 p-0" : "w-full justify-start gap-3 h-12",
            activeItem === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          )}
          onClick={() => onViewChange(item.id)}
        >
          <item.icon className="h-5 w-5" />
          {!isIconMode && <span className="hidden md:block">{item.label}</span>}
        </Button>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r border-gray-200 shadow-lg",
        isIconMode ? "md:w-20" : "md:w-64"
      )}>
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className={cn("flex items-center flex-shrink-0", isIconMode ? "px-2 justify-center" : "px-4")}>
            {!isIconMode && <h1 className="text-xl font-bold text-blue-600">Porter Owner</h1>}
            {isIconMode && <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>}
          </div>
          <nav className={cn("mt-8 flex-1 space-y-2", isIconMode ? "px-2" : "px-2")}>
            <NavContent />
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation - removed background on home */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-3 min-h-[60px] flex-1",
                activeItem === item.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600",
                // Remove background color for mobile
                "hover:bg-transparent"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
