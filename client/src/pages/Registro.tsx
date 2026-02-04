import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/AuthContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useLanguage } from '@/lib/LanguageContext';

export default function Registro() {
  const { language } = useLanguage();
  const { isAuthenticated, setShowAuthModal, setAuthModalMode } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      setAuthModalMode('register');
      setShowAuthModal(true);
    }
  }, [isAuthenticated, navigate, setShowAuthModal, setAuthModalMode]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">
            {language === 'es' ? 'Cargando formulario...' : 'Loading form...'}
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
