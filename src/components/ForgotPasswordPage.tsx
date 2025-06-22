
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

interface ForgotPasswordPageProps {
  onContinue: (phoneNumber: string, isNewUser: boolean) => void;  
}

const ForgotPasswordPage = ({ onContinue }: ForgotPasswordPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContinue = async () => {
    if (phoneNumber.length !== 10) return;
    
    setIsLoading(true);
    
    try {
      const response = await apiService.isNewUser(phoneNumber);
      
      // Check if user is new based on API response
      const isNewUser = response.isNew || response.data?.isNew || false;
      
      if (isNewUser) {
        toast({
          title: "New User",
          description: "This phone number is not registered. Please sign up first.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Found",
          description: "Redirecting to OTP verification...",
          variant: "default",
        });
        onContinue(phoneNumber, isNewUser);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600">Enter your phone number to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                className="mt-2 h-12 border-gray-300 rounded-lg"
              />
            </div>
            
            <Button 
              onClick={handleContinue}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              disabled={phoneNumber.length !== 10 || isLoading}
            >
              {isLoading ? "Checking..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
