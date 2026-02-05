import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { SignUp, useUser } from '@clerk/clerk-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Download, Smartphone, Share, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Registro() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [showPwa, setShowPwa] = useState(false);
  
  const clerkUser = CLERK_ENABLED ? useUser() : { isSignedIn: false, isLoaded: true };
  const { isSignedIn, isLoaded } = clerkUser;

  const referralCode = localStorage.getItem('fl_referral_code') || '';

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncUserToDatabase().then(() => {
        navigate('/dashboard');
      });
    }
  }, [isSignedIn, isLoaded, navigate]);

  const syncUserToDatabase = async () => {
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
          referralCode,
        }),
      });
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('fl_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border border-white/10 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs tracking-widest uppercase">
            {language === 'es' ? 'Cargando' : 'Loading'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-10 pb-8 max-w-md mx-auto w-full">

        <div className="text-center mb-8 w-full">
          <Link href="/home">
            <span className="cursor-pointer" data-testid="link-logo-home">
              <h1 className="text-xl font-extralight tracking-[0.2em] text-white" data-testid="text-brand">
                FRACTIONAL LIVING
              </h1>
              <div className="w-8 h-[0.5px] bg-orange-500 mx-auto mt-2 mb-1" />
              <p className="text-[8px] text-white/25 uppercase tracking-[0.4em]">All Global Holding LLC</p>
            </span>
          </Link>
        </div>

        <div className="w-full mb-6">
          <p className="text-center text-sm text-white/50 font-light leading-relaxed">
            {language === 'es' 
              ? 'Crea tu cuenta y accede al ecosistema de propiedades fraccionadas de lujo en el Caribe.'
              : 'Create your account and access the luxury fractional property ecosystem in the Caribbean.'}
          </p>
          {referralCode && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <p className="text-xs text-orange-400/80">
                {language === 'es' ? `Invitado con código: ${referralCode}` : `Invited with code: ${referralCode}`}
              </p>
            </div>
          )}
        </div>

        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]" data-testid="card-registro">
          {CLERK_ENABLED ? (
            <div className="p-5">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 bg-transparent w-full",
                    headerTitle: "text-[15px] font-medium text-[#1a1a1a] tracking-tight",
                    headerSubtitle: "text-[#1a1a1a]/50 text-xs font-light",
                    socialButtonsBlockButton: "border border-[#e5e5e5] hover:border-[#1a1a1a]/20 hover:bg-[#fafafa] text-[#1a1a1a] rounded-lg h-10 text-[13px] font-normal transition-all",
                    socialButtonsBlockButtonText: "text-[#1a1a1a] font-normal text-[13px]",
                    formButtonPrimary: "bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all",
                    footerActionLink: "text-orange-600 hover:text-orange-700 text-[13px] font-normal",
                    formFieldInput: "border border-[#e5e5e5] focus:border-[#1a1a1a] focus:ring-0 rounded-lg h-10 text-[13px] text-[#1a1a1a] bg-white placeholder:text-[#1a1a1a]/30",
                    formFieldLabel: "text-[#1a1a1a]/60 text-[12px] font-normal",
                    dividerLine: "bg-[#e5e5e5]",
                    dividerText: "text-[#1a1a1a]/30 text-[11px] font-light",
                    identityPreviewText: "text-[#1a1a1a] text-[13px]",
                    identityPreviewEditButton: "text-orange-600 text-[12px]",
                    footer: "pt-3",
                    footerAction: "text-[12px]",
                    footerActionText: "text-[#1a1a1a]/40 text-[12px]",
                    socialButtonsProviderIcon: "w-4 h-4",
                    socialButtonsBlockButtonArrow: "hidden",
                    formFieldErrorText: "text-[11px]",
                    alert: "text-[12px] rounded-lg",
                    formFieldSuccessText: "text-[11px]",
                    otpCodeFieldInput: "border-[#e5e5e5] rounded-lg text-[#1a1a1a]",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                    showOptionalFields: false,
                  }
                }}
                routing="path"
                path="/registro"
                signInUrl="/login"
                afterSignUpUrl="/dashboard"
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#1a1a1a]/50 text-sm font-light">
                {language === 'es' 
                  ? 'El sistema de registro está siendo configurado.' 
                  : 'Registration system is being configured.'}
              </p>
            </div>
          )}
        </div>

        <div className="w-full mt-8">
          <button
            onClick={() => setShowPwa(!showPwa)}
            className="w-full flex items-center justify-between py-3 text-left group"
            data-testid="button-toggle-pwa"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <p className="text-[13px] text-white/70 font-light">
                  {language === 'es' ? 'Instalar como app' : 'Install as app'}
                </p>
                <p className="text-[10px] text-white/30">
                  {language === 'es' ? 'Acceso directo desde tu pantalla' : 'Direct access from your screen'}
                </p>
              </div>
            </div>
            {showPwa 
              ? <ChevronUp className="w-4 h-4 text-white/20" /> 
              : <ChevronDown className="w-4 h-4 text-white/20" />
            }
          </button>

          {showPwa && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mt-1 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" data-testid="card-pwa-instructions">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                  <p className="text-[11px] font-medium text-white/60 uppercase tracking-wider">iPhone / iPad</p>
                </div>
                <div className="space-y-2 pl-5">
                  <Step number={1} text={language === 'es' ? 'Abre allliving.org en Safari' : 'Open allliving.org in Safari'} />
                  <Step number={2} icon={<Share className="w-3 h-3" />} text={language === 'es' ? 'Toca el icono de compartir' : 'Tap the share icon'} />
                  <Step number={3} icon={<Plus className="w-3 h-3" />} text={language === 'es' ? 'Selecciona "Agregar a inicio"' : 'Select "Add to Home Screen"'} />
                </div>
              </div>

              <div className="h-[0.5px] bg-white/[0.06]" />

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                  <p className="text-[11px] font-medium text-white/60 uppercase tracking-wider">Android</p>
                </div>
                <div className="space-y-2 pl-5">
                  <Step number={1} text={language === 'es' ? 'Abre allliving.org en Chrome' : 'Open allliving.org in Chrome'} />
                  <Step number={2} text={language === 'es' ? 'Toca el menú (tres puntos)' : 'Tap menu (three dots)'} />
                  <Step number={3} text={language === 'es' ? 'Selecciona "Instalar app"' : 'Select "Install app"'} />
                </div>
              </div>

              <p className="text-[10px] text-white/20 text-center pt-1">
                {language === 'es' 
                  ? 'La app funciona sin conexión y se actualiza automáticamente.' 
                  : 'The app works offline and updates automatically.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-[10px] text-white/20 leading-relaxed max-w-xs mx-auto">
            {language === 'es' 
              ? 'Al registrarte recibes tu código único para construir tu red y acceder al 4% de comisiones en 5 niveles.'
              : 'By registering you receive your unique code to build your network and access 4% commissions across 5 levels.'}
          </p>
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

function Step({ number, text, icon }: { number: number; text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center text-[9px] text-white/40 font-medium flex-shrink-0">
        {number}
      </span>
      {icon && <span className="text-white/30">{icon}</span>}
      <span className="text-[11px] text-white/45 font-light">{text}</span>
    </div>
  );
}
