import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import apiService from "@/services";

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast({ title: "Error", description: "Please enter the full 6-digit OTP" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match" });
      return;
    }

    try {
      setIsLoading(true);
      // Simulating API call
      const resp = await apiService.resetPassword(email,otp,newPassword);
      toast({ 
        title: "Success", 
        description: resp.message 
      });
      navigate("/login");
    } catch (error) {
      toast({ title: "Error", description: "Verification failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-[440px] z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl mb-4 group transition-transform hover:scale-105 duration-300">
            <img
              src="https://pu.edu.pk/temp1/img/logo.png"
              alt="PU Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">University of the Punjab</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Verify your identity</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              We've sent a code to <span className="font-semibold text-slate-900 dark:text-white">{email || "your email"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-sm font-semibold self-start ml-1">One-Time Password</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                    <InputOTPSlot index={1} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                    <InputOTPSlot index={2} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                    <InputOTPSlot index={3} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                    <InputOTPSlot index={4} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                    <InputOTPSlot index={5} className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50 text-lg font-bold" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" size-sm font-semibold ml-1>New Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" size-sm font-semibold ml-1>Confirm New Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center flex flex-col gap-3">
              <button 
                type="button"
                className="text-sm text-primary hover:underline font-bold"
                onClick={() => toast({ title: "Resent", description: "A new OTP has been sent to your email." })}
                disabled={isLoading}
              >
                Resend code
              </button>
              <Link 
                to="/forgot-password" 
                className="inline-flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change email
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} Punjab University Transport Department
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
