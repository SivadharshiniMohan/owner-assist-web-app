
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Truck, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "./../../public/e-cargo-logo.png"

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "fleet", label: "My Fleet", icon: Truck },
        { id: "report", label: "Report", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];

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
            "w-full justify-start gap-3 h-12",
            activeItem === item.id ? "bg-green-600 text-white hover:bg-green-700" : "text-gray-600 hover:text-green-600 hover:bg--50"
          )}
          onClick={() => onViewChange(item.id)}
        >
          <item.icon className="h-5 w-5" />
          <span className="hidden md:block">{item.label}</span>
        </Button>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r border-gray-200 shadow-lg md:w-60">
        <div className="flex justify-center mt-4">
          <img src={logo} alt="e-cargo logo" style={{width:"80px", height:"30px"}}/>
       
           </div>
          <nav className="mt-4 flex-1 space-y-2 px-2">
            <NavContent />
          </nav>
        </div>
   

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-3 min-h-[60px] flex-1",
                activeItem === item.id ? "text-green-600" : "text-gray-600 hover:text-green-600",
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
