import { useState } from "react";
import { useLocation } from "wouter";
import { useAddMoney, getGetWalletQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Building2, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Method = "upi" | "debit_card" | "credit_card" | "netbanking";

export function AddMoney() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<Method>("upi");

  const addMoney = useAddMoney({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Money Added Successfully",
          description: `₹${(data.transaction.amountCents / 100).toFixed(2)} added to your wallet.`,
        });
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Payment Failed",
          description: error.error || "Could not add money",
          variant: "destructive",
        });
      }
    }
  });

  const handleProceed = () => {
    const amountCents = parseInt(amount) * 100;
    if (isNaN(amountCents) || amountCents < 100) {
      toast({ title: "Invalid Amount", description: "Minimum amount is ₹1", variant: "destructive" });
      return;
    }
    
    addMoney.mutate({
      data: {
        amountCents,
        method
      }
    });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center p-4 bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold ml-2 text-foreground">Add Money to Wallet</h1>
      </header>

      <div className="p-6 space-y-8 flex-1">
        <div className="space-y-4">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Enter Amount</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-4xl font-bold text-muted-foreground">₹</span>
            <Input
              type="tel"
              className="h-20 pl-14 text-5xl font-bold border-2 focus-visible:ring-primary shadow-sm bg-card rounded-2xl"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {[100, 500, 1000, 2000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary text-sm font-semibold rounded-full border border-border/50 transition-colors flex-shrink-0"
              >
                +₹{val}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Payment Method</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "upi", name: "UPI App", icon: Smartphone },
              { id: "debit_card", name: "Debit Card", icon: CreditCard },
              { id: "credit_card", name: "Credit Card", icon: CreditCard },
              { id: "netbanking", name: "Net Banking", icon: Building2 }
            ].map(m => (
              <label 
                key={m.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${method === m.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 bg-card hover:bg-muted/50'}`}
              >
                <input 
                  type="radio" 
                  name="method" 
                  value={m.id} 
                  checked={method === m.id} 
                  onChange={(e) => setMethod(e.target.value as Method)} 
                  className="sr-only" 
                />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${method === m.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <m.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground">{m.name}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-primary' : 'border-muted-foreground'}`}>
                  {method === m.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-card border-t border-border sticky bottom-0">
        <Button 
          className="w-full h-14 text-lg font-bold shadow-lg"
          onClick={handleProceed}
          disabled={addMoney.isPending || !amount}
        >
          {addMoney.isPending ? "Processing..." : `Proceed to pay ₹${amount || '0'}`}
        </Button>
      </div>
    </div>
  );
}
