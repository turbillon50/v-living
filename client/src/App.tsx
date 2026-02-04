import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { AuthModal } from "@/components/AuthModal";
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
import LastMinuteCapital from "@/pages/LastMinuteCapital";
import ModeloNegocios from "@/pages/ModeloNegocios";
import Registro from "@/pages/Registro";
import AutosLujo from "@/pages/AutosLujo";
import ExpYates from "@/pages/ExpYates";
import ExpRestaurantes from "@/pages/ExpRestaurantes";
import ExpEventos from "@/pages/ExpEventos";
import ExpConcierge from "@/pages/ExpConcierge";
import ExpChofer from "@/pages/ExpChofer";
import ExpNineras from "@/pages/ExpNineras";
import ExpPrivadas from "@/pages/ExpPrivadas";
import Multilinks from "@/pages/Multilinks";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/BottomNav";
import { FloatingButtons } from "@/components/FloatingButtons";
import { FloatingAI } from "@/components/FloatingAI";

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
      <Route path="/last-minute-capital" component={LastMinuteCapital} />
      <Route path="/perfil-asociado" component={PerfilAsociado} />
      <Route path="/property-asociado" component={PropertyAsociado} />
      <Route path="/modelo-negocios" component={ModeloNegocios} />
      <Route path="/registro" component={Registro} />
      <Route path="/autos-lujo" component={AutosLujo} />
      <Route path="/exp-yates" component={ExpYates} />
      <Route path="/exp-restaurantes" component={ExpRestaurantes} />
      <Route path="/exp-eventos" component={ExpEventos} />
      <Route path="/exp-concierge" component={ExpConcierge} />
      <Route path="/exp-chofer" component={ExpChofer} />
      <Route path="/exp-nineras" component={ExpNineras} />
      <Route path="/exp-privadas" component={ExpPrivadas} />
      <Route path="/links" component={Multilinks} />
      <Route path="/perfil" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <FloatingButtons />
            <FloatingAI />
            <BottomNav />
            <AuthModal />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
