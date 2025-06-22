
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgotPasswordPage from "./ForgotPasswordPage";
import OTPVerificationPage from "./OTPVerificationPage";
import ResetPasswordPage from "./ResetPasswordPage";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [currentView, setCurrentView] = useState<"login" | "forgot" | "otp" | "reset">("login");
  const [forgotPhoneNumber, setForgotPhoneNumber] = useState("");

  const handleLogin = () => {
    if (phoneNumber.length === 10 && password.length > 0) {
      onLogin();
    }
  };

  const handleForgotPasswordContinue = (phone: string, isNewUser: boolean) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Porter Owner</h1>
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
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-right">
              <button 
                onClick={() => setCurrentView("forgot")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={phoneNumber.length !== 10 || password.length === 0}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
