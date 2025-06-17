
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, HelpCircle, LogOut, Bell, Shield } from "lucide-react";

const ProfilePage = () => {
  const profileMenuItems = [
    { icon: User, label: "Personal Information", description: "Update your profile details" },
    { icon: Bell, label: "Notifications", description: "Manage notification preferences" },
    { icon: Shield, label: "Security", description: "Password and security settings" },
    { icon: Settings, label: "Settings", description: "App preferences and configurations" },
    { icon: HelpCircle, label: "Help & Support", description: "Get help and contact support" },
    { icon: LogOut, label: "Logout", description: "Sign out of your account", danger: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="bg-white rounded-t-3xl md:rounded-none min-h-screen md:mt-0 mt-4">
          <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            {/* Profile Summary Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                    <p className="text-gray-600">Porter Owner</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">10</div>
                  <div className="text-sm text-gray-600">Total Vehicles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">₹2.5L</div>
                  <div className="text-sm text-gray-600">Monthly Earnings</div>
                </CardContent>
              </Card>
            </div>

            {/* Menu Items */}
            <div className="space-y-2 pb-20 md:pb-4">
              {profileMenuItems.map((item, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.danger ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          item.danger ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          item.danger ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
