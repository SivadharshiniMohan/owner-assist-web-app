
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "fleet", label: "My Fleet", icon: Truck },
    { id: "profile", label: "Profile", icon: User },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={currentView === item.id ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-12",
            currentView === item.id ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
          )}
          onClick={() => {
            onViewChange(item.id);
            setIsMobileMenuOpen(false);
          }}
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
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-blue-600">Porter Owner</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-2">
            <NavContent />
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-600">Porter Owner</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white">
            <div className="pt-16 pb-4 px-2 space-y-2">
              <NavContent />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-3 min-h-[60px]",
                currentView === item.id ? "text-blue-600" : "text-gray-600"
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
