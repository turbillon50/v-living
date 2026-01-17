import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/LanguageContext';
import logoImage from '@assets/generated_images/fractional_living_luxury_logo.png';

export function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');

  const handleRegister = () => {
    if (!registerEmail) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "¡Registrado!",
      description: "Te contactaremos pronto con más información",
    });
    setShowRegister(false);
    setRegisterEmail('');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60">
      <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link href="/" data-testid="link-back-lobby">
              <button className="p-2 rounded-full hover:bg-muted transition-colors" title={language === 'es' ? 'Volver al Lobby' : 'Back to Lobby'}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={logoImage} alt="Fractional Living" className="w-10 h-10 object-contain" />
                <div className="hidden sm:block">
                  <span className="text-lg font-semibold text-foreground tracking-tight block leading-none">
                    FRACTIONAL LIVING
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">All Global Holding LLC</p>
                </div>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location.startsWith('/fractional') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Fracciones
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/experiences' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Experiencias
              </span>
            </Link>
            <Link href="/lobby" data-testid="link-lobby">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/lobby' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Lobby
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/creator">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8"
                title="Modo Creador"
              >
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex text-sm font-medium" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'es' ? 'ES' : 'EN'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full px-3 py-2 h-auto border-border hover:shadow-md transition-shadow"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4" />
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem data-testid="menu-item-login" onClick={() => setShowRegister(true)}>
                  <span className="font-medium">Iniciar Sesión</span>
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-item-signup" onClick={() => setShowRegister(true)}>
                  Registrarse
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-item-help" onClick={openWhatsApp}>
                  Centro de Ayuda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Register Dialog */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Únete a Fractional Living</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Ingresa tu email para recibir información exclusiva sobre nuestras propiedades fraccionadas.
            </p>
            <Input 
              type="email"
              placeholder="tu@email.com" 
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
            <Button onClick={handleRegister} className="w-full">
              Registrarme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
