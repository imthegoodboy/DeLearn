import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Marketplace from "@/pages/Marketplace";
import HosterDashboard from "@/pages/HosterDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import NotFound from "@/pages/not-found";
import InnovationHub from "@/pages/InnovationHub";
import Docs from "@/pages/Docs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/hoster/dashboard" component={HosterDashboard} />
      <Route path="/developer/dashboard" component={DeveloperDashboard} />
      <Route path="/innovation" component={InnovationHub} />
      <Route path="/docs" component={Docs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WalletProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Router />
              </main>
            </div>
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
