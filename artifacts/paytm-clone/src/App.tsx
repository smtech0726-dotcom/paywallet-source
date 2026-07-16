import { AppLayout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import Login from "./pages/login";
import { useGetCurrentSession } from "@workspace/api-client-react";
import { AddMoney } from "./pages/add-money";
import { SendMoney } from "./pages/send-money";
import { Recharge } from "./pages/recharge";
import { History } from "./pages/history";
import { Qr } from "./pages/qr";
import { Profile } from "./pages/profile";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const { data: session, isLoading } = useGetCurrentSession();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        {isLoading ? (
          <div className="p-8">Loading...</div>
        ) : session?.user ? (
          <AppLayout><Dashboard /></AppLayout>
        ) : (
          <Login />
        )}
      </Route>
      
      <Route path="/add-money">
        <AppLayout><AddMoney /></AppLayout>
      </Route>

      <Route path="/send">
        <AppLayout><SendMoney /></AppLayout>
      </Route>

      <Route path="/recharge">
        <AppLayout><Recharge /></AppLayout>
      </Route>

      <Route path="/history">
        <AppLayout><History /></AppLayout>
      </Route>

      <Route path="/qr">
        <AppLayout><Qr /></AppLayout>
      </Route>

      <Route path="/profile">
        <AppLayout><Profile /></AppLayout>
      </Route>

      <Route>
        <AppLayout><NotFound /></AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
