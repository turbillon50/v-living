import { Link, useLocation } from 'wouter';
import { Globe, Menu, User, Lock } from 'lucide-react';
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
import logoImg from '@/assets/logo.png';

export function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');

  const handleRegister = () => {
    if (!registerEmail) {
      toast({ title: "Email requerido", variant: "destructive" });
      return;
    }
    toast({ title: "¡Registrado!", description: "Te contactaremos pronto" });
    setShowRegister(false);
    setRegisterEmail('');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <img 
              src={logoImg} 
              alt="Fractional Living" 
              className="h-10 w-auto cursor-pointer"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-sm cursor-pointer transition-colors ${location.startsWith('/fractional') || location.startsWith('/property') ? 'text-[#2d3a3a] font-medium' : 'text-stone-500 hover:text-[#2d3a3a]'}`}>
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-sm cursor-pointer transition-colors ${location === '/experiences' ? 'text-[#2d3a3a] font-medium' : 'text-stone-500 hover:text-[#2d3a3a]'}`}>
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-stone-400 hover:text-stone-600" title="Admin">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            
            <button 
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-[#2d3a3a] transition-colors px-2 py-1" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 border border-stone-200 rounded-full px-2 py-1.5 hover:shadow-sm transition-shadow"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4 text-stone-600" />
                  <div className="w-7 h-7 rounded-full bg-stone-400 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowRegister(true)}>
                  <span className="font-medium">{language === 'es' ? 'Registrarse' : 'Sign up'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowRegister(true)}>
                  {language === 'es' ? 'Iniciar Sesión' : 'Log in'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openWhatsApp}>
                  {language === 'es' ? 'Centro de Ayuda' : 'Help Center'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'es' ? 'Únete a Fractional Living' : 'Join Fractional Living'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-stone-500">
              {language === 'es' 
                ? 'Ingresa tu email para recibir información exclusiva sobre nuestras propiedades.'
                : 'Enter your email to receive exclusive information about our properties.'}
            </p>
            <Input 
              type="email"
              placeholder="tu@email.com" 
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
              className="h-12"
            />
            <Button onClick={handleRegister} className="w-full h-12 bg-[#2d3a3a] hover:bg-[#3d4a4a]">
              {language === 'es' ? 'Registrarme' : 'Sign up'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
