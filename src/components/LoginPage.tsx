
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordPage from "./ForgotPasswordPage";
import OTPVerificationPage from "./OTPVerificationPage";
import ResetPasswordPage from "./ResetPasswordPage";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "forgot" | "otp" | "reset">("login");
  const [forgotPhoneNumber, setForgotPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (phoneNumber.length !== 10 || password.length === 0) return;
  
    setIsLoading(true);
    
    try {
      const response = await apiService.login(phoneNumber, password);
      
      if (response.data.oaId || response.status==="sucess") {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default",
          duration: 2000,
        });
        onLogin();
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Please check your credentials and try again",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordContinue = async (phone: string, isNewUser: boolean) => {
    setForgotPhoneNumber(phone);
    if (!isNewUser) {
      setCurrentView("otp");
    }
  };

  const handleOTPVerified = () => {
    setCurrentView("reset");
  };

  const handleResetSuccess = () => {
    setCurrentView("login");
  };

  const handleLogout = () => {
    apiService.removeAuthToken();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default",
    });
  };

  if (currentView === "forgot") {
    return <ForgotPasswordPage onContinue={handleForgotPasswordContinue} />;
  }

  if (currentView === "otp") {
    return <OTPVerificationPage phoneNumber={forgotPhoneNumber} onVerified={handleOTPVerified} />;
  }

  if (currentView === "reset") {
    return <ResetPasswordPage phoneNumber={forgotPhoneNumber} onSuccess={handleResetSuccess} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to e-cargo Owner</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <button 
                onClick={() => setCurrentView("forgot")}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot Password?
              </button>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={phoneNumber.length !== 10 || password.length === 0 || isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
