import { useListTransactions } from "@workspace/api-client-react";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, Calendar } from "lucide-react";
import { Link } from "wouter";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
};

export function History() {
  const { data: transactions, isLoading } = useListTransactions({ limit: 50 });

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-sm sticky top-0 z-10 rounded-b-2xl">
        <div className="flex items-center">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors inline-block">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold ml-2">Passbook History</h1>
        </div>
        <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <Calendar className="w-5 h-5" />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : !transactions?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <Calendar className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">No Transactions Yet</h3>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto mt-2">Your payments, added money, and recharges will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => {
              const isPositive = tx.type === "add_money" || tx.type === "transfer_in";
              
              let title = "";
              let subtitle = "";
              
              if (tx.type === "add_money") {
                title = "Added to Wallet";
                subtitle = "From Bank Account";
              } else if (tx.type === "transfer_in") {
                title = `Received from ${tx.counterpartyName || 'User'}`;
                subtitle = `+91 ${tx.counterpartyPhone}`;
              } else if (tx.type === "transfer_out") {
                title = `Paid to ${tx.counterpartyName || 'User'}`;
                subtitle = `+91 ${tx.counterpartyPhone}`;
              } else if (tx.type === "recharge") {
                title = "Mobile Recharge";
                subtitle = "Prepaid";
              } else if (tx.type === "bill_payment") {
                title = "Bill Payment";
                subtitle = tx.category ? tx.category.replace('_', ' ') : "Utility";
              }

              return (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isPositive ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{subtitle}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-bold text-lg tracking-tight ${isPositive ? 'text-green-600' : 'text-foreground'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(tx.amountCents)}
                    </p>
                    {tx.status === "completed" ? (
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider mt-1">
                        Success
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold uppercase tracking-wider mt-1">
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
