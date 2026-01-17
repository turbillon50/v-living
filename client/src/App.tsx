import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import Fractional from "@/pages/Fractional";
import Experiences from "@/pages/Experiences";
import Lobby from "@/pages/Lobby";
import AIAssistant from "@/pages/AIAssistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fractional" component={Fractional} />
      <Route path="/fractional/:id" component={PropertyDetail} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/experiences" component={Experiences} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/ai" component={AIAssistant} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
