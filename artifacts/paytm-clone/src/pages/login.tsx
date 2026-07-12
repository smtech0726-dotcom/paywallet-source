import { useState } from "react";
import { useLocation } from "wouter";
import { useRequestOtp, useVerifyOtp } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const requestOtp = useRequestOtp({
    mutation: {
      onSuccess: () => {
        setStep("otp");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.error || "Failed to send OTP",
          variant: "destructive",
        });
      }
    }
  });

  const verifyOtp = useVerifyOtp({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.error || "Invalid OTP",
          variant: "destructive",
        });
      }
    }
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({ title: "Invalid phone number", variant: "destructive" });
      return;
    }
    requestOtp.mutate({ data: { phone } });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    verifyOtp.mutate({ data: { phone, otp, name: name || undefined } });
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-6 sm:bg-muted/50">
      <Card className="w-full max-w-[420px] border-border/50 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              SMTech
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              India's most trusted payments app
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none font-medium">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="pl-12 h-12 text-lg"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={requestOtp.isPending || phone.length < 10}
              >
                {requestOtp.isPending ? "Sending..." : "Proceed securely"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>100% Secure Payments</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm font-medium text-foreground">OTP Sent</p>
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to +91 {phone}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Sent to +91 {phone}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="What should we call you?"
                  className="h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={verifyOtp.isPending || otp.length < 6}
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify & Login"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
