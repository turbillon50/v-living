import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useLanguage } from '@/lib/LanguageContext';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Login() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  
  const clerkUser = CLERK_ENABLED ? useUser() : { isSignedIn: false, isLoaded: true };
  const { isSignedIn, isLoaded } = clerkUser;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncAndNavigate();
    }
  }, [isSignedIn, isLoaded, navigate]);

  const syncAndNavigate = async () => {
    if (!CLERK_ENABLED) return;
    try {
      const user = (clerkUser as any).user;
      if (!user) return;
      const res = await fetch('/api/clerk/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || '',
          phone: user.primaryPhoneNumber?.phoneNumber || '',
          profileImage: user.imageUrl,
        }),
      });
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('fl_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
    navigate('/dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border border-[#0891b2]/30 border-t-[#0891b2] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs tracking-widest uppercase">
            {language === 'es' ? 'Cargando' : 'Loading'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-14 pb-8 max-w-md mx-auto w-full">

        <div className="text-center mb-10 w-full">
          <Link href="/home">
            <span className="cursor-pointer" data-testid="link-logo-home-login">
              <h1 className="text-xl font-extralight tracking-[0.2em] text-white">
                FRACTIONAL LIVING
              </h1>
              <div className="w-8 h-[0.5px] bg-[#0891b2] mx-auto mt-2 mb-1" />
              <p className="text-[8px] text-white/25 uppercase tracking-[0.4em]">All Global Holding LLC</p>
            </span>
          </Link>
        </div>

        <div className="w-full mb-6">
          <p className="text-center text-sm text-white/50 font-light">
            {language === 'es' 
              ? 'Accede a tu cuenta y gestiona tu red.'
              : 'Access your account and manage your network.'}
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(8,145,178,0.15)]" data-testid="card-login">
          {CLERK_ENABLED ? (
            <div className="p-5">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 bg-transparent w-full",
                    headerTitle: "text-[15px] font-medium text-[#1a1a1a] tracking-tight",
                    headerSubtitle: "text-[#1a1a1a]/50 text-xs font-light",
                    socialButtonsBlockButton: "hidden",
                    socialButtonsBlockButtonText: "hidden",
                    formButtonPrimary: "bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all",
                    footerActionLink: "text-black hover:text-black/80 text-[13px] font-normal",
                    formFieldInput: "border border-[#e5e5e5] focus:border-[#1a1a1a] focus:ring-0 rounded-lg h-10 text-[13px] text-[#1a1a1a] bg-white placeholder:text-[#1a1a1a]/30",
                    formFieldLabel: "text-[#1a1a1a]/60 text-[12px] font-normal",
                    dividerLine: "bg-[#e5e5e5]",
                    dividerText: "text-[#1a1a1a]/30 text-[11px] font-light",
                    identityPreviewText: "text-[#1a1a1a] text-[13px]",
                    identityPreviewEditButton: "text-black text-[12px]",
                    footer: "pt-3",
                    footerAction: "text-[12px]",
                    footerActionText: "text-[#1a1a1a]/40 text-[12px]",
                    socialButtonsProviderIcon: "hidden",
                    socialButtonsBlockButtonArrow: "hidden",
                    formFieldErrorText: "text-[11px]",
                    alert: "text-[12px] rounded-lg",
                    otpCodeFieldInput: "border-[#e5e5e5] rounded-lg text-[#1a1a1a]",
                  },
                  layout: {
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "blockButton",
                  }
                }}
                routing="path"
                path="/login"
                signUpUrl="/registro"
                afterSignInUrl="/dashboard"
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#1a1a1a]/50 text-sm font-light">
                {language === 'es' 
                  ? 'El sistema de login está siendo configurado.' 
                  : 'Login system is being configured.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] text-white/15">
            <span>allliving.org</span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
            <span>Tulum, MX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
