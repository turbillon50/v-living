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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-[2520px] mx-auto px-6 sm:px-8 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FL</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-gray-900">FRACTIONAL LIVING</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/fractional" data-testid="link-fractional">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location.startsWith('/fractional') || location.startsWith('/property') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </span>
            </Link>
            <Link href="/experiences" data-testid="link-experiences">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/experiences' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/creator">
              <Button variant="ghost" size="icon" className="w-9 h-9" title="Admin">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium px-3" 
              data-testid="button-language"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <Globe className="w-4 h-4 mr-1.5" />
              {language === 'es' ? 'ES' : 'EN'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 h-auto border-gray-200 hover:shadow-md transition-shadow"
                  data-testid="button-user-menu"
                >
                  <Menu className="w-4 h-4" />
                  <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Button>
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
            <p className="text-sm text-gray-500">
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
            <Button onClick={handleRegister} className="w-full h-12">
              {language === 'es' ? 'Registrarme' : 'Sign up'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
