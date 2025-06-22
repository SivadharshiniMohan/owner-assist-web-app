
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

interface ForgotPasswordPageProps {
  onContinue: (phoneNumber: string, isNewUser: boolean) => void;
}

const ForgotPasswordPage = ({ onContinue }: ForgotPasswordPageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (number: string) => {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number })
      });
      if (!response.ok) throw new Error('Failed to send request');
      return response.json();
    },
    onSuccess: (data) => {
      onContinue(phoneNumber, data.isNewUser);
    }
  });

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      forgotPasswordMutation.mutate(phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
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
              disabled={phoneNumber.length !== 10 || forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Loading..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
