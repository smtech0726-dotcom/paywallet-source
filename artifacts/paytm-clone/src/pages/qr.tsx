import { useState } from "react";
import { useGetCurrentSession } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { ChevronLeft, QrCode as QrIcon, Search, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A simple SVG QR code representation since we don't have a library
// In a real app we'd use `qrcode.react` or similar.
const FakeQRCode = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-foreground fill-current">
    <path d="M0,0 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
    <path d="M70,0 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
    <path d="M0,70 h30 v30 h-30 z m5,5 h20 v20 h-20 z m5,5 h10 v10 h-10 z" />
    <rect x="40" y="0" width="10" height="10" />
    <rect x="50" y="10" width="10" height="10" />
    <rect x="60" y="20" width="10" height="10" />
    <rect x="40" y="30" width="20" height="10" />
    <rect x="0" y="40" width="10" height="20" />
    <rect x="20" y="40" width="10" height="10" />
    <rect x="30" y="50" width="20" height="10" />
    <rect x="60" y="40" width="10" height="20" />
    <rect x="80" y="40" width="20" height="10" />
    <rect x="40" y="60" width="10" height="10" />
    <rect x="50" y="70" width="10" height="10" />
    <rect x="40" y="80" width="30" height="10" />
    <rect x="80" y="60" width="10" height="20" />
    <rect x="70" y="90" width="20" height="10" />
    <rect x="90" y="80" width="10" height="10" />
  </svg>
);

export function Qr() {
  const [, setLocation] = useLocation();
  const { data: session } = useGetCurrentSession();
  const [phone, setPhone] = useState("");

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      // In a real app we'd pass state to the send screen, 
      // but for this demo, navigating to send is enough, user types it there.
      // Or we can just redirect to send? Let's just do that for simplicity.
      setLocation(`/send`);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center p-4 bg-card text-foreground shadow-sm sticky top-0 z-10 border-b border-border">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2">Receive & Scan</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
        
        {/* QR Code Card */}
        <div className="w-full max-w-sm bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
          <div className="bg-primary p-6 text-center text-primary-foreground">
            <h2 className="text-xl font-bold">SMTech UPI</h2>
            <p className="text-primary-foreground/80 text-sm mt-1">Scan to pay directly</p>
          </div>
          
          <div className="p-8 flex flex-col items-center bg-white">
            <div className="w-48 h-48 bg-white border-4 border-muted rounded-xl p-2 mb-6">
              <FakeQRCode />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900">{session?.user.name || "User"}</h3>
            <p className="text-gray-500 font-mono tracking-wider mt-1">+91 {session?.user.phone}</p>
          </div>
          
          <div className="bg-muted/50 p-4 text-center border-t border-border flex justify-center gap-4">
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <Shield className="w-4 h-4 text-green-600" /> Secure
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 text-muted-foreground text-sm font-bold uppercase tracking-widest">
          <div className="h-px bg-border flex-1"></div>
          OR
          <div className="h-px bg-border flex-1"></div>
        </div>

        {/* Manual entry / Camera simulation block */}
        <div className="w-full max-w-sm bg-card p-6 rounded-3xl shadow-sm border border-border">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            Simulate Scan
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Since camera isn't available, enter a number directly to jump to the send flow.
          </p>
          
          <form onSubmit={handleManualEntry} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background h-12"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <Button type="submit" className="h-12 px-6 font-bold" disabled={phone.length < 10}>
              Proceed
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}

// Just a tiny shield icon for the layout above since it wasn't imported from lucide
function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
