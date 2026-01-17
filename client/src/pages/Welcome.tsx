import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Wallet, Building2, Shield, Bot, Users, Coins, Globe, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '529984292748';

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6 md:p-10 flex justify-between items-center">
          <div className={cn(
            "transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            <span className="text-xl font-bold tracking-wider">ALL GLOBAL HOLDING</span>
          </div>
          <div className={cn(
            "flex items-center gap-4 transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Globe className="w-4 h-4 mr-2" />
              ES
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className={cn(
            "transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm uppercase tracking-widest text-white/60">Web3 Ready</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6">
              FRACTIONAL
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400">
                LIVING
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              La evolución de la propiedad inmobiliaria. 
              Conectamos el mundo tradicional con la innovación blockchain.
            </p>
          </div>

          {showContent && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <FeatureCard icon={Building2} label="Propiedades" sublabel="Fraccionadas" />
              <FeatureCard icon={Wallet} label="VanDeFi" sublabel="Crypto Wallet" />
              <FeatureCard icon={Coins} label="Tokens" sublabel="Propios" />
              <FeatureCard icon={Shield} label="Fideicomisos" sublabel="Bancarios" />
            </div>
          )}

          {showContent && (
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/home">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 gap-2 h-14 px-8 text-lg rounded-full">
                  Explorar Plataforma
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 gap-2 h-14 px-8 text-lg rounded-full"
                onClick={() => window.open('https://wa.me/529984292748', '_blank')}
              >
                <Bot className="w-5 h-5" />
                Hablar con ALIX 2.4
              </Button>
            </div>
          )}
        </main>

        {showContent && (
          <div className="animate-in fade-in duration-1000 delay-700">
            <div className="flex justify-center pb-4">
              <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
            </div>
            
            <section className="bg-white/5 backdrop-blur-sm border-t border-white/10">
              <div className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-2xl md:text-3xl font-light text-center mb-12">
                  Un Ecosistema Completo
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <InfoCard 
                    title="Certeza Jurídica"
                    description="Cada propiedad está respaldada por fideicomisos bancarios. Tu inversión tiene un ancla legal sólida y transparente."
                    icon={Shield}
                  />
                  <InfoCard 
                    title="Pagos Flexibles"
                    description="Acepta dinero fiat tradicional, criptomonedas, nuestra wallet VanDeFi, o nuestros tokens propios listos para operar."
                    icon={Wallet}
                  />
                  <InfoCard 
                    title="Gestión Llave en Mano"
                    description="Integra tu propiedad para venta fraccionada o administración vacacional. Nosotros manejamos todo el proyecto."
                    icon={Building2}
                  />
                </div>

                <div className="text-center space-y-6">
                  <p className="text-white/60 max-w-2xl mx-auto">
                    Siempre estarás en contacto con <strong className="text-white">ALIX 2.4</strong>, nuestra inteligencia artificial, 
                    o con uno de nuestros asesores especializados.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <ServiceBadge label="Manejo de Dinero" />
                    <ServiceBadge label="Propiedades" />
                    <ServiceBadge label="DeFi" />
                    <ServiceBadge label="Fideicomisos Bancarios" />
                    <ServiceBadge label="Crypto & Fiat" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-teal-900/50 py-12">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h3 className="text-xl md:text-2xl font-light mb-4">
                  ¿Tienes una propiedad?
                </h3>
                <p className="text-white/70 mb-6">
                  Intégrala para venta fraccionada o administración vacacional. 
                  Proyecto totalmente llave en mano.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 rounded-full"
                  onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20quiero%20integrar%20mi%20propiedad', '_blank')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contactar Asesor
                </Button>
              </div>
            </section>

            <footer className="py-8 text-center text-white/40 text-sm">
              <p>© 2026 All Global Holding LLC. Todos los derechos reservados.</p>
            </footer>
          </div>
        )}

        {/* Floating WhatsApp & ALIX buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me interesa Fractional Living')}`, '_blank')}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola ALIX, necesito información sobre Fractional Living')}`, '_blank')}
          >
            <Bot className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, label, sublabel }: { icon: any; label: string; sublabel: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
      <Icon className="w-6 h-6 text-white/70 mb-2 group-hover:text-white transition-colors" />
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-white/50">{sublabel}</p>
    </div>
  );
}

function InfoCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white/80" />
      </div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ServiceBadge({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white/80">
      {label}
    </span>
  );
}
