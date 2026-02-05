import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { SignIn, useUser } from '@clerk/clerk-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useLanguage } from '@/lib/LanguageContext';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Login() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  
  const clerkUser = CLERK_ENABLED ? useUser() : { isSignedIn: false, isLoaded: true };
  const { isSignedIn, isLoaded } = clerkUser;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-black/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">
              {language === 'es' ? 'Cargando...' : 'Loading...'}
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 pb-32">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black tracking-tight">FRACTIONAL LIVING</h1>
            <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] mt-1">All Global Holding LLC</p>
          </div>

          {CLERK_ENABLED ? (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "text-lg font-semibold text-black",
                  headerSubtitle: "text-black/60 text-sm",
                  socialButtonsBlockButton: "border-black/20 hover:bg-black/5 text-black",
                  socialButtonsBlockButtonText: "text-black font-medium",
                  formButtonPrimary: "bg-black hover:bg-black/90 text-white",
                  footerActionLink: "text-orange-500 hover:text-orange-600",
                  formFieldInput: "border-black/20 focus:border-orange-500 focus:ring-orange-500",
                  formFieldLabel: "text-black/70",
                  dividerLine: "bg-black/10",
                  dividerText: "text-black/40",
                }
              }}
              routing="path"
              path="/login"
              signUpUrl="/registro"
              afterSignInUrl="/home"
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-black/60">
                {language === 'es' 
                  ? 'El sistema de login está siendo configurado.' 
                  : 'Login system is being configured.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
