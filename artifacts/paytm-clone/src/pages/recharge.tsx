import { useState } from "react";
import { useListBillers, useCreateRecharge, getGetWalletQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, Smartphone, Zap, Wifi, Droplet, Flame, Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Category = "mobile_recharge" | "dth" | "electricity" | "water" | "gas" | "broadband" | "insurance" | "loan_payment";

const CATEGORY_CONFIG: Record<Category, { name: string; icon: any; color: string }> = {
  mobile_recharge: { name: "Mobile", icon: Smartphone, color: "text-blue-500 bg-blue-50" },
  electricity: { name: "Electricity", icon: Zap, color: "text-yellow-500 bg-yellow-50" },
  dth: { name: "DTH", icon: Home, color: "text-purple-500 bg-purple-50" },
  broadband: { name: "Broadband", icon: Wifi, color: "text-green-500 bg-green-50" },
  water: { name: "Water", icon: Droplet, color: "text-cyan-500 bg-cyan-50" },
  gas: { name: "Gas", icon: Flame, color: "text-orange-500 bg-orange-50" },
  insurance: { name: "Insurance", icon: Shield, color: "text-indigo-500 bg-indigo-50" },
  loan_payment: { name: "Loan EMI", icon: Home, color: "text-red-500 bg-red-50" },
};

export function Recharge() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeCategory, setActiveCategory] = useState<Category>("mobile_recharge");
  const [selectedBillerId, setSelectedBillerId] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const { data: billers, isLoading: billersLoading } = useListBillers({ category: activeCategory });
  const billersList: any[] = Array.isArray(billers)
  ? billers
  : [];

  const recharge = useCreateRecharge({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Payment Successful",
          description: `Your ${CATEGORY_CONFIG[activeCategory].name} bill of ₹${amount} was paid.`,
        });
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Payment Failed",
          description: error.error || "Could not complete payment",
          variant: "destructive",
        });
      }
    }
  });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillerId || !accountNumber || !amount) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    const amountCents = parseInt(amount) * 100;
    if (isNaN(amountCents) || amountCents < 10) {
      toast({ title: "Invalid Amount", variant: "destructive" });
      return;
    }

    recharge.mutate({
      data: {
        billerId: selectedBillerId,
        accountNumber,
        amountCents
      }
    });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center p-4 bg-primary text-primary-foreground shadow-sm sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2">Recharge & Pay Bills</h1>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
          {(Object.entries(CATEGORY_CONFIG) as [Category, any][]).map(([cat, config]) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedBillerId("");
                setAccountNumber("");
                setAmount("");
              }}
              className={`flex flex-col items-center gap-2 min-w-[72px] transition-transform ${activeCategory === cat ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${activeCategory === cat ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background' : 'bg-muted text-muted-foreground'}`}>
                <config.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold text-center leading-tight ${activeCategory === cat ? 'text-foreground' : 'text-muted-foreground'}`}>
                {config.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1">
        <form onSubmit={handlePay} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Select Provider</Label>
            {billersLoading ? (
              <div className="h-14 bg-muted animate-pulse rounded-xl" />
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {billersList.map(biller => (
                  <label 
                    key={biller.id}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBillerId === biller.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 bg-card hover:bg-muted/50'}`}
                  >
                    <input 
                      type="radio" 
                      name="biller" 
                      value={biller.id}
                      checked={selectedBillerId === biller.id}
                      onChange={(e) => setSelectedBillerId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1 font-semibold text-foreground">{biller.name}</div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBillerId === biller.id ? 'border-primary' : 'border-muted-foreground'}`}>
                      {selectedBillerId === biller.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedBillerId && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">
                  {activeCategory === "mobile_recharge" ? "Mobile Number" : "Account / Consumer Number"}
                </Label>
                <Input
                  id="accountNumber"
                  type={activeCategory === "mobile_recharge" ? "tel" : "text"}
                  className="h-14 text-lg font-medium rounded-xl bg-card shadow-sm"
                  placeholder={activeCategory === "mobile_recharge" ? "10-digit mobile number" : "Enter account details"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  maxLength={activeCategory === "mobile_recharge" ? 10 : undefined}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="tel"
                    className="h-16 pl-10 text-2xl font-bold rounded-xl bg-card shadow-sm border-2 focus-visible:ring-primary"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedBillerId && accountNumber && amount && (
            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full h-14 text-lg font-bold shadow-lg"
                disabled={recharge.isPending}
              >
                {recharge.isPending ? "Processing..." : `Pay ₹${amount}`}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
