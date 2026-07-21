import { useState } from "react";
import { useLocation } from "wouter";
import { 
  useCreateTransfer, 
  useLookupUser, 
  useListContacts, 
  useCreateContact,
  getGetWalletQueryKey, 
  getGetDashboardSummaryQueryKey,
  getListContactsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Search, UserCircle2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function SendMoney() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<"lookup" | "amount">("lookup");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<{phone: string, name: string} | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { data: contacts, isLoading: contactsLoading } = useListContacts();
  const contactsList: any[] = Array.isArray(contacts)
  ? contacts
  : [];  
  
  // Debounce phone lookup conceptually (if it's 10 digits, we trigger)
  const isCompletePhone = phoneSearch.replace(/\D/g, '').length >= 10;
  
  const { data: lookupResult, error: lookupError, isLoading: lookupLoading } = useLookupUser(
    { phone: phoneSearch.replace(/\D/g, '') },
    {
  query: {
    queryKey: [],
    enabled: isCompletePhone,
    retry: false
  }
}
  );

  const transfer = useCreateTransfer({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Transfer Successful",
          description: `₹${(data.transaction.amountCents / 100).toFixed(2)} sent to ${selectedUser?.name || selectedUser?.phone}`,
        });
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Transfer Failed",
          description: error.error || "Could not complete transfer",
          variant: "destructive",
        });
      }
    }
  });

  const saveContact = useCreateContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Contact saved" });
        queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() });
      }
    }
  });

  const handleSelectContact = (phone: string, name: string) => {
    setSelectedUser({ phone, name });
    setStep("amount");
  };

  const handleSend = () => {
    const amountCents = parseInt(amount) * 100;
    if (isNaN(amountCents) || amountCents < 100) {
      toast({ title: "Invalid Amount", variant: "destructive" });
      return;
    }
    if (!selectedUser) return;
    
    transfer.mutate({
      data: {
        toPhone: selectedUser.phone,
        amountCents,
        note: note || undefined
      }
    });
  };

  const handleAddContact = () => {
    if (selectedUser) {
      saveContact.mutate({
        data: {
          phone: selectedUser.phone,
          name: selectedUser.name
        }
      });
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center p-4 bg-primary text-primary-foreground shadow-sm sticky top-0 z-10 rounded-b-2xl">
        <button 
          onClick={() => {
            if (step === "amount") {
              setStep("lookup");
              setAmount("");
              setNote("");
            } else {
              window.history.back();
            }
          }} 
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold ml-2">Send Money</h1>
      </header>

      <div className="flex-1">
        {step === "lookup" ? (
          <div className="p-4 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Enter Mobile Number"
                className="pl-10 h-14 text-lg rounded-xl bg-card border-border/50 shadow-sm"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                autoFocus
              />
            </div>

            {isCompletePhone && lookupLoading && (
              <div className="text-center p-4 text-muted-foreground animate-pulse">Searching user...</div>
            )}
            
            {isCompletePhone && lookupError && (
              <div className="text-center p-4 text-red-500 bg-red-50 rounded-xl">User not found</div>
            )}

            {isCompletePhone && lookupResult && (
              <div 
                className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => handleSelectContact(lookupResult.phone, lookupResult.name)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                    {lookupResult.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{lookupResult.name}</h3>
                    <p className="text-sm text-muted-foreground">+91 {lookupResult.phone}</p>
                  </div>
                </div>
                <ArrowRight className="text-primary w-5 h-5" />
              </div>
            )}

            {!isCompletePhone && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">Saved Contacts</h3>
                {contactsLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}
                  </div>
                ) : contactsList && contactsList.length > 0 ? (
                  <div className="space-y-2">
                    {contactsList.map(contact => (
                      <div 
                        key={contact.id}
                        className="flex items-center p-3 bg-card rounded-xl border border-border/50 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleSelectContact(contact.phone, contact.name)}
                      >
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold mr-4">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">+91 {contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-xl border border-dashed">No saved contacts yet</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-primary pt-6 pb-12 px-6 rounded-b-[2rem] text-primary-foreground text-center relative shadow-lg shadow-primary/20">
              <div className="w-16 h-16 bg-white/20 mx-auto rounded-full flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
                {selectedUser?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{selectedUser?.name}</h2>
              <p className="text-primary-foreground/80">+91 {selectedUser?.phone}</p>
              
              {!contactsList.find(c => c.phone === selectedUser?.phone) && (
                <button 
                  onClick={handleAddContact}
                  disabled={saveContact.isPending}
                  className="mt-4 inline-flex items-center px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Save Contact
                </button>
              )}
            </div>

            <div className="p-6 space-y-6 flex-1 -mt-8 relative z-10">
              <div className="bg-card p-6 rounded-2xl shadow-xl border border-border/50 space-y-6">
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground font-semibold mb-2 text-sm uppercase tracking-wider">Amount</span>
                  <div className="relative flex justify-center items-center w-full">
                    <span className="text-3xl font-bold text-muted-foreground mr-1">₹</span>
                    <Input
                      type="tel"
                      className="h-16 text-4xl font-bold border-none shadow-none text-center p-0 w-3/4 focus-visible:ring-0"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                  <div className="h-px w-full max-w-[200px] bg-border mt-2" />
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Add a note (optional)"
                    className="h-12 bg-muted/50 border-transparent focus-visible:bg-background rounded-xl"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border-t border-border sticky bottom-0">
              <Button 
                className="w-full h-14 text-lg font-bold shadow-lg"
                onClick={handleSend}
                disabled={transfer.isPending || !amount}
              >
                {transfer.isPending ? "Processing..." : `Pay ₹${amount || '0'}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
