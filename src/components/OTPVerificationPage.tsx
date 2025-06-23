
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";

const OTP_AUTH_KEY = "433024Acptrq5KdUUc671b9bcbP1"; // Replace with actual key

interface OTPVerificationPageProps {
  phoneNumber: string;
  onVerified: () => void;
}

const OTPVerificationPage = ({ phoneNumber, onVerified }: OTPVerificationPageProps) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Send initial OTP
    sendOtpMutation.mutate(phoneNumber);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // const sendOtpMutation = useMutation({
  //   mutationFn: async (phoneNumber: string) => {
  //     const response = await fetch('https://control.msg91.com/api/v5/otp', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         authkey: OTP_AUTH_KEY,
  //         template_id: "671b9b39d6fc0539636ec732",
  //         otp_expiry: 2,
  //         mobile: `91${phoneNumber}`
  //       })
  //     });
  //     if (!response.ok) throw new Error('Failed to send OTP');
  //     return response.json();
  //   }
  // });
  const sendOtpMutation = useMutation({
  mutationFn: async (phoneNumber: string) => {
    const formData = new URLSearchParams();
    formData.append('authkey', OTP_AUTH_KEY);
    formData.append('template_id', '671b9b39d6fc0539636ec732');
    formData.append('otp_expiry', '2');
    formData.append('mobile', `91${phoneNumber}`);

    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) throw new Error('Failed to send OTP');
    return response.json();
  },
});


  const resendOtpMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await fetch(`https://control.msg91.com/api/v5/otp?authkey=${OTP_AUTH_KEY}&mobile=91${phoneNumber}&retrytype=text`);
      if (!response.ok) throw new Error('Failed to resend OTP');
      return response.json();
    },
    onSuccess: () => {
      setCountdown(59);
      setCanResend(false);
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { mobile: string; otp: string }) => {
      const response = await fetch(`https://control.msg91.com/api/v5/otp/verify?mobile=91${data.mobile}&otp=${data.otp}`, {
        headers: { 'authkey': OTP_AUTH_KEY }
      });
      if (!response.ok) throw new Error('Failed to verify OTP');
      return response.json();
    },
    onSuccess: () => {
      onVerified();
    }
  });

  const handleVerify = () => {
    if (otp.length === 4) {
      verifyOtpMutation.mutate({ mobile: phoneNumber, otp });
    }
  };

  const handleResend = () => {
    if (canResend) {
      resendOtpMutation.mutate(phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h1>
            <p className="text-gray-600 text-sm">
              Please enter the 4 digit code sent to the provided number
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 border-2 border-green-500 rounded-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 border-2 border-gray-300 rounded-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 border-2 border-gray-300 rounded-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 border-2 border-gray-300 rounded-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={!canResend || resendOtpMutation.isPending}
                className={`text-sm ${canResend ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400'}`}
              >
                {resendOtpMutation.isPending ? 'Sending...' : `Resend OTP in ${countdown} seconds`}
              </button>
            </div>
            
            <Button 
              onClick={handleVerify}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              disabled={otp.length !== 4 || verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerificationPage;
