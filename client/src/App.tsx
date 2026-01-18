import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/LanguageContext";
import Welcome from "@/pages/Welcome";
import Home from "@/pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import Fractional from "@/pages/Fractional";
import Experiences from "@/pages/Experiences";
import Invest from "@/pages/Invest";
import Lobby from "@/pages/Lobby";
import AIAssistant from "@/pages/AIAssistant";
import CreatorDashboard from "@/pages/CreatorDashboard";
import LastMinute from "@/pages/LastMinute";
import PerfilAsociado from "@/pages/PerfilAsociado";
import PropertyAsociado from "@/pages/PropertyAsociado";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/home" component={Home} />
      <Route path="/fractional" component={Fractional} />
      <Route path="/fractional/:id" component={PropertyDetail} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/experiences" component={Experiences} />
      <Route path="/invest" component={Invest} />
      <Route path="/calendar" component={Invest} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/ai" component={AIAssistant} />
      <Route path="/creator" component={CreatorDashboard} />
      <Route path="/last-minute" component={LastMinute} />
      <Route path="/perfil-asociado" component={PerfilAsociado} />
      <Route path="/property-asociado" component={PropertyAsociado} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
