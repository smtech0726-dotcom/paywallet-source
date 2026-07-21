import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, History, QrCode, User, CreditCard, Send, Plus, ArrowRightLeft } from "lucide-react";
import { useGetCurrentSession } from "@workspace/api-client-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { data: session, isLoading, error } = useGetCurrentSession({
   query: {
  queryKey: [],
  retry: false
}
  });

  useEffect(() => {
    if (!isLoading && (error || !session)) {
      if (location !== "/login") {
        setLocation("/login");
      }
    }
  }, [isLoading, error, session, location, setLocation]);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // If not logged in and on login page, just show children
  if (!session && location === "/login") {
    return <>{children}</>;
  }

  // If not logged in and not on login page, we will be redirecting
  if (!session) {
    return null;
  }

  const isHome = location === "/";
  const isHistory = location === "/history";
  const isQr = location === "/qr";
  const isProfile = location === "/profile";

  return (
    <div className="min-h-[100dvh] w-full bg-background px-0 py-0 sm:px-4 sm:py-4">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-background shadow-[0_0_0_1px_hsl(var(--border)),0_20px_60px_rgba(15,23,42,0.12)] sm:min-h-[calc(100dvh-2rem)] sm:rounded-[32px]">
        <main className="flex-1 overflow-y-auto pb-24 pt-2 no-scrollbar">
          {children}
        </main>

        <nav className="border-t border-border bg-card/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 text-[10px] transition-colors ${isHome ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'}`}>
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link href="/history" className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 text-[10px] transition-colors ${isHistory ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'}`}>
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>

            <Link href="/qr" className="flex flex-1 -translate-y-3 justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95">
                <QrCode className="h-6 w-6" />
              </div>
            </Link>

            <Link href="/profile" className={`flex flex-1 flex-col items-center gap-1 rounded-xl p-2 text-[10px] transition-colors ${isProfile ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'}`}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
