import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { SignUp, useUser } from '@clerk/clerk-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Download, Smartphone, Share, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkRegistro() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [showPwa, setShowPwa] = useState(false);
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

  const referralCode = localStorage.getItem('fl_referral_code') || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setClerkTimedOut(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      syncUserToDatabase().then(() => {
        navigate('/dashboard');
      });
    }
  }, [isSignedIn, isLoaded]);

  const syncUserToDatabase = async () => {
    if (!user) return;
    try {
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

  if (!isLoaded && !clerkTimedOut) {
    return <RegistroLoading language={language} />;
  }

  if (clerkTimedOut && !isLoaded) {
    return (
      <RegistroLayout language={language} referralCode={referralCode} showPwa={showPwa} setShowPwa={setShowPwa}>
        <div className="p-6 text-center space-y-4">
          <p className="text-[#1a1a1a] text-sm font-medium">
            {language === 'es' ? 'No se pudo conectar al servicio de registro' : 'Could not connect to registration service'}
          </p>
          <p className="text-[#1a1a1a]/50 text-xs">
            {language === 'es' ? 'Por favor visita allliving.org directamente o contáctanos por WhatsApp' : 'Please visit allliving.org directly or contact us via WhatsApp'}
          </p>
          <a href="https://wa.me/529984292748?text=Hola%2C%20quiero%20registrarme%20en%20Fractional%20Living"
            target="_blank" rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-6 py-2.5 rounded-lg text-sm font-medium"
            data-testid="button-whatsapp-register"
          >
            {language === 'es' ? 'Registrarme por WhatsApp' : 'Register via WhatsApp'}
          </a>
        </div>
      </RegistroLayout>
    );
  }

  return (
    <RegistroLayout language={language} referralCode={referralCode} showPwa={showPwa} setShowPwa={setShowPwa}>
      <div className="p-5">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none p-0 bg-transparent w-full",
              headerTitle: "text-[15px] font-medium text-[#1a1a1a] tracking-tight",
              headerSubtitle: "text-[#1a1a1a]/50 text-xs font-light",
              socialButtonsBlockButton: "hidden",
              socialButtonsBlockButtonText: "hidden",
              formButtonPrimary: "bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all",
              footerActionLink: "text-[#059669] hover:text-[#047857] text-[13px] font-normal",
              formFieldInput: "border border-[#e5e5e5] focus:border-[#059669] focus:ring-0 rounded-lg h-10 text-[13px] text-[#1a1a1a] bg-white placeholder:text-[#1a1a1a]/30",
              formFieldLabel: "text-[#1a1a1a]/60 text-[12px] font-normal",
              dividerLine: "bg-[#e5e5e5]",
              dividerText: "text-[#1a1a1a]/30 text-[11px] font-light",
              identityPreviewText: "text-[#1a1a1a] text-[13px]",
              identityPreviewEditButton: "text-[#059669] text-[12px]",
              footer: "pt-3",
              footerAction: "text-[12px]",
              footerActionText: "text-[#1a1a1a]/40 text-[12px]",
              socialButtonsProviderIcon: "hidden",
              socialButtonsBlockButtonArrow: "hidden",
              formFieldErrorText: "text-[11px]",
              alert: "text-[12px] rounded-lg",
              formFieldSuccessText: "text-[11px]",
              otpCodeFieldInput: "border-[#e5e5e5] rounded-lg text-[#1a1a1a]",
            },
            layout: {
              socialButtonsPlacement: "bottom",
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
    </RegistroLayout>
  );
}

function FallbackRegistro() {
  const { language } = useLanguage();
  const [showPwa, setShowPwa] = useState(false);

  return (
    <RegistroLayout language={language} referralCode="" showPwa={showPwa} setShowPwa={setShowPwa}>
      <div className="p-8 text-center">
        <p className="text-[#717171] text-sm font-light">
          {language === 'es'
            ? 'El sistema de registro está siendo configurado.'
            : 'Registration system is being configured.'}
        </p>
      </div>
    </RegistroLayout>
  );
}

export default function Registro() {
  return CLERK_ENABLED ? <ClerkRegistro /> : <FallbackRegistro />;
}

function RegistroLoading({ language }: { language: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border border-[#059669]/30 border-t-[#059669] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#717171] text-xs tracking-widest uppercase">
          {language === 'es' ? 'Cargando' : 'Loading'}
        </p>
      </div>
    </div>
  );
}

function RegistroLayout({ language, referralCode, showPwa, setShowPwa, children }: {
  language: string;
  referralCode: string;
  showPwa: boolean;
  setShowPwa: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-10 pb-8 max-w-md mx-auto w-full">
        <div className="text-center mb-8 w-full">
          <Link href="/home">
            <span className="cursor-pointer" data-testid="link-logo-home">
              <h1 className="text-xl font-extralight tracking-[0.2em] text-[#222]" data-testid="text-brand">
                FRACTIONAL LIVING
              </h1>
              <div className="w-8 h-[0.5px] bg-gradient-to-r from-[#059669] to-[#06b6d4] mx-auto mt-2 mb-1" />
              <p className="text-[8px] text-[#999] uppercase tracking-[0.4em]">All Global Holding LLC</p>
            </span>
          </Link>
        </div>

        <div className="w-full mb-6">
          <p className="text-center text-sm text-[#717171] font-light leading-relaxed">
            {language === 'es'
              ? 'Crea tu cuenta y accede al ecosistema de propiedades fraccionadas de lujo en el Caribe.'
              : 'Create your account and access the luxury fractional property ecosystem in the Caribbean.'}
          </p>
          {referralCode && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <p className="text-xs text-[#717171]">
                {language === 'es' ? `Invitado con código: ${referralCode}` : `Invited with code: ${referralCode}`}
              </p>
            </div>
          )}
        </div>

        <div className="w-full bg-white rounded-2xl overflow-hidden border border-[#ebebeb] shadow-[0_8px_40px_rgba(5,150,105,0.08)]" data-testid="card-registro">
          {children}
        </div>

        <div className="w-full mt-8">
          <button
            onClick={() => setShowPwa(!showPwa)}
            className="w-full flex items-center justify-between py-3 text-left group"
            data-testid="button-toggle-pwa"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-[#717171]" />
              </div>
              <div>
                <p className="text-[13px] text-[#555] font-light">
                  {language === 'es' ? 'Instalar como app' : 'Install as app'}
                </p>
                <p className="text-[10px] text-[#999]">
                  {language === 'es' ? 'Acceso directo desde tu pantalla' : 'Direct access from your screen'}
                </p>
              </div>
            </div>
            {showPwa
              ? <ChevronUp className="w-4 h-4 text-[#ccc]" />
              : <ChevronDown className="w-4 h-4 text-[#ccc]" />
            }
          </button>

          {showPwa && (
            <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-4 mt-1 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" data-testid="card-pwa-instructions">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#717171]" />
                  <p className="text-[11px] font-medium text-[#717171] uppercase tracking-wider">iPhone / iPad</p>
                </div>
                <div className="space-y-2 pl-5">
                  <Step number={1} text={language === 'es' ? 'Abre allliving.org en Safari' : 'Open allliving.org in Safari'} />
                  <Step number={2} icon={<Share className="w-3 h-3" />} text={language === 'es' ? 'Toca el icono de compartir' : 'Tap the share icon'} />
                  <Step number={3} icon={<Plus className="w-3 h-3" />} text={language === 'es' ? 'Selecciona "Agregar a inicio"' : 'Select "Add to Home Screen"'} />
                </div>
              </div>

              <div className="h-[0.5px] bg-[#ebebeb]" />

              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#717171]" />
                  <p className="text-[11px] font-medium text-[#717171] uppercase tracking-wider">Android</p>
                </div>
                <div className="space-y-2 pl-5">
                  <Step number={1} text={language === 'es' ? 'Abre allliving.org en Chrome' : 'Open allliving.org in Chrome'} />
                  <Step number={2} text={language === 'es' ? 'Toca el menú (tres puntos)' : 'Tap menu (three dots)'} />
                  <Step number={3} text={language === 'es' ? 'Selecciona "Instalar app"' : 'Select "Install app"'} />
                </div>
              </div>

              <p className="text-[10px] text-[#999] text-center pt-1">
                {language === 'es'
                  ? 'La app funciona sin conexión y se actualiza automáticamente.'
                  : 'The app works offline and updates automatically.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-[10px] text-[#bbb] leading-relaxed max-w-xs mx-auto">
            {language === 'es'
              ? 'Al registrarte recibes tu código único para construir tu red y acceder al 4% de comisiones en 5 niveles.'
              : 'By registering you receive your unique code to build your network and access 4% commissions across 5 levels.'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-[#ccc]">
            <span>allliving.org</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#ccc]" />
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
      <span className="w-4 h-4 rounded-full bg-[#ebebeb] flex items-center justify-center text-[9px] text-[#717171] font-medium flex-shrink-0">
        {number}
      </span>
      {icon && <span className="text-[#999]">{icon}</span>}
      <span className="text-[11px] text-[#717171] font-light">{text}</span>
    </div>
  );
}
