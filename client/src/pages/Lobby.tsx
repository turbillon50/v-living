import { Link } from 'wouter';
import { Building2, Wallet, Bot, MessageCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

const lobbyLinks = [
  { 
    id: 'fractional', 
    title: 'Fractional Living', 
    description: 'Propiedad fraccionada de lujo',
    icon: Building2,
    href: '/fractional'
  },
  { 
    id: 'capital', 
    title: 'Last Minute Capital', 
    description: 'Financiamiento para escrituración',
    icon: Wallet,
    href: '/fractional'
  },
  { 
    id: 'alix', 
    title: 'Hablar con ALIX', 
    description: 'Inteligencia artificial 24/7',
    icon: Bot,
    href: '/ai'
  },
  { 
    id: 'whatsapp', 
    title: 'WhatsApp', 
    description: 'Contacta a un asesor',
    icon: MessageCircle,
    href: 'https://wa.me/529984292748'
  },
];

export default function Lobby() {
  const handleClick = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 pt-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-light mb-4">Lobby All Global Holding</h1>
          <p className="text-muted-foreground">
            El Lobby es el punto central del ecosistema All Global Holding. 
            Desde aquí accedes a inversión, servicios, educación y capital estratégico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {lobbyLinks.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('http');
            
            const content = (
              <div className="group cursor-pointer border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:border-primary/50 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <div key={item.id} onClick={() => handleClick(item.href)}>
                  {content}
                </div>
              );
            }

            return (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
