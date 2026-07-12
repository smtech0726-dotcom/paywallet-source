import { useGetDashboardSummary, useGetCurrentSession } from "@workspace/api-client-react";
import { Link } from "wouter";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Smartphone, 
  Lightbulb, 
  Wifi, 
  Wallet,
  Building2,
  ChevronRight,
  ReceiptText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
};

export function Dashboard() {
  const { data: session } = useGetCurrentSession();
  const { data: summary, isLoading } = useGetDashboardSummary();

  const displayName = session?.user?.name ?? session?.user?.phone ?? "User";
  const recentTransactions = summary?.recentTransactions ?? [];

  if (isLoading || !summary) {
    return (
      <div className="p-4 space-y-6">
        <div className="h-40 bg-muted animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header / Profile Area */}
      <div className="bg-primary pt-12 pb-24 px-6 rounded-b-[2rem] text-primary-foreground relative shadow-lg shadow-primary/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Welcome back,</p>
              <p className="font-bold text-lg">{displayName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card - overlapping header */}
      <div className="px-4 -mt-16 relative z-10">
        <Card className="p-6 shadow-xl border-border/50 bg-card rounded-2xl">
          <p className="text-muted-foreground text-sm font-medium mb-1">SMTech Balance</p>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              {formatCurrency(summary.balanceCents)}
            </h2>
            <Link href="/add-money">
              <Button size="sm" className="rounded-full shadow-md font-medium">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </Link>
          </div>
          
          <div className="flex gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3 text-green-500" />
                Received
              </p>
              <p className="font-semibold text-sm mt-1">{formatCurrency(summary.totalAddedCents)}</p>
            </div>
            <div className="w-px bg-border/50"></div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-red-500" />
                Spent
              </p>
              <p className="font-semibold text-sm mt-1">{formatCurrency(summary.totalSpentCents)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-8">
        <div className="grid grid-cols-4 gap-3">
          <Link href="/send" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform group-active:scale-95">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">Send<br/>Money</span>
          </Link>
          
          <Link href="/qr" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform group-active:scale-95">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">Scan<br/>Any QR</span>
          </Link>

          <Link href="/recharge" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform group-active:scale-95">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">Mobile<br/>Recharge</span>
          </Link>

          <Link href="/recharge" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform group-active:scale-95">
              <ReceiptText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">Pay<br/>Bills</span>
          </Link>
        </div>
      </div>

      {/* Bill Payments Section */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-bold text-foreground mb-4 px-1">Recharge & Bill Payments</h3>
        <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
          <div className="grid grid-cols-4 gap-y-6">
            <Link href="/recharge" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-center">Electricity</span>
            </Link>
            <Link href="/recharge" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-center">Broadband</span>
            </Link>
            <Link href="/recharge" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-center">Rent</span>
            </Link>
            <Link href="/recharge" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-center">View All</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-bold text-foreground">Recent Transactions</h3>
          <Link href="/history" className="text-xs font-semibold text-primary flex items-center">
            View All <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-2xl text-sm border border-dashed">
              No recent transactions
            </div>
          ) : (
            recentTransactions.map(tx => {
              const isPositive = tx.type === "add_money" || tx.type === "transfer_in";
              
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isPositive ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {tx.type === 'add_money' ? 'Added to Wallet' : 
                         tx.type === 'transfer_in' ? `From ${tx.counterpartyName || tx.counterpartyPhone}` :
                         tx.type === 'transfer_out' ? `To ${tx.counterpartyName || tx.counterpartyPhone}` :
                         tx.type === 'recharge' ? 'Mobile Recharge' : 'Bill Payment'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-foreground'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(tx.amountCents)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 font-medium">
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
