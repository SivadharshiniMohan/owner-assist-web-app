
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordPageProps {
  phoneNumber: string;
  onSuccess: () => void;
}

const ResetPasswordPage = ({ phoneNumber, onSuccess }: ResetPasswordPageProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { number: string; password: string }) => {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to reset password');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
      }
    }
  });

  const handleResetPassword = () => {
    if (password && password === confirmPassword) {
      resetPasswordMutation.mutate({ number: phoneNumber, password });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter the password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Enter the confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 h-12 border-gray-300 rounded-lg"
              />
            </div>
            
            <Button 
              onClick={handleResetPassword}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              disabled={!password || password !== confirmPassword || resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center pt-4">
              <span className="text-gray-600">Already have an account? </span>
              <button className="text-green-600 font-medium hover:text-green-700">Sign In</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
