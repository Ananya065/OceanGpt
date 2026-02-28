import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapView from "@/pages/map-view";
import Simulator from "@/pages/simulator";
import Blockchain from "@/pages/blockchain";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/map" component={MapView} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/blockchain" component={Blockchain} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full bg-background overflow-hidden relative">
            
            {/* Background ambient gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <AppSidebar />
            <div className="flex flex-col flex-1 z-10 w-full overflow-hidden">
              <header className="flex items-center justify-between p-4 px-6 border-b border-border/50 bg-background/50 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                  <SidebarTrigger data-testid="button-sidebar-toggle" className="hover-elevate" />
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
