import { Link, useLocation } from 'wouter';
import { Globe, Menu, User } from 'lucide-react';
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
import logoImage from '@assets/generated_images/minimalist_single_ring_logo_for_all_living.png';

export function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
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
    window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fraccional%20All%20Living', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60">
      <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logoImage} alt="Fraccional All Living" className="w-10 h-10 object-contain" />
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-foreground tracking-tight block leading-none">
                  FRACCIONAL
                </span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">All Living</p>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" data-testid="link-explore">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Experience
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:flex text-sm font-medium" data-testid="button-language">
              <Globe className="w-4 h-4 mr-1" />
              EN
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
            <DialogTitle>Únete a Fraccional All Living</DialogTitle>
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
