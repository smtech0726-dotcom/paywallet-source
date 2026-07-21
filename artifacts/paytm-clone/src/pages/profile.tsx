import { useGetCurrentSession, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, User, ShieldCheck, HelpCircle, Settings, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Profile() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: session } = useGetCurrentSession();
  
  const logout = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/login");
      }
    }
  });

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center p-4 bg-primary text-primary-foreground shadow-sm sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2">Profile & Settings</h1>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-card p-6 rounded-3xl shadow-md border border-border flex items-center gap-5">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-3xl shadow-inner border border-primary/20">
            {session?.user.name?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{session?.user.name || "User"}</h2>
            <p className="text-muted-foreground font-mono mt-1">+91 {session?.user.phone}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">
              KYC Verified
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer flex items-center gap-4 transition-colors">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Account Statement</h3>
              <p className="text-xs text-muted-foreground">Download past transactions</p>
            </div>
          </div>
          
          <div className="p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer flex items-center gap-4 transition-colors">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Security & Privacy</h3>
              <p className="text-xs text-muted-foreground">App lock, device limits</p>
            </div>
          </div>

          <div className="p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer flex items-center gap-4 transition-colors">
            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Payment Settings</h3>
              <p className="text-xs text-muted-foreground">Saved cards, UPI accounts</p>
            </div>
          </div>

          <div className="p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-4 transition-colors">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Help & Support</h3>
              <p className="text-xs text-muted-foreground">Customer care, FAQs</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-bold text-lg"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {logout.isPending ? "Logging out..." : "Log Out"}
          </Button>
        </div>

        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">SMTech v1.0.0</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">Made in India</p>
        </div>
      </div>
    </div>
  );
}
