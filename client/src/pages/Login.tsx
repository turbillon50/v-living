import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkLogin() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    const isDevDomain = window.location.hostname.includes('replit.dev') || window.location.hostname.includes('replit.app') || window.location.hostname === 'localhost';
    if (isDevDomain) {
      setClerkTimedOut(true);
      return;
    }
    const timer = setTimeout(() => {
      if (!isLoaded) setClerkTimedOut(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      syncAndNavigate();
    }
  }, [isSignedIn, isLoaded]);

  const syncAndNavigate = async () => {
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
        }),
      });
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('fl_user', JSON.stringify(userData));
        localStorage.setItem('fractional_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
    navigate('/dashboard');
  };

  if (!isLoaded && !clerkTimedOut) {
    return <LoginLoading language={language} />;
  }

  if (clerkTimedOut && !isLoaded) {
    return (
      <LoginLayout language={language}>
        <DirectLoginForm language={language} />
      </LoginLayout>
    );
  }

  return (
    <LoginLayout language={language}>
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
    </LoginLayout>
  );
}

function DirectLoginForm({ language }: { language: string }) {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(language === 'es' ? 'Completa todos los campos' : 'Fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setLoading(false);
        window.location.href = '/dashboard';
        return;
      } else {
        setError(result.error || (language === 'es' ? 'Error al iniciar sesión' : 'Login error'));
      }
    } catch {
      setError(language === 'es' ? 'Error de conexión' : 'Connection error');
    }
    setLoading(false);
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[#717171] text-[12px] block mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-[#e5e5e5] focus:border-[#059669] focus:ring-0 rounded-lg h-10 text-[13px] text-[#222] bg-white px-3 outline-none transition-colors"
            data-testid="input-login-email"
          />
        </div>
        <div>
          <label className="text-[#717171] text-[12px] block mb-1">
            {language === 'es' ? 'Contraseña' : 'Password'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border border-[#e5e5e5] focus:border-[#059669] focus:ring-0 rounded-lg h-10 text-[13px] text-[#222] bg-white px-3 outline-none transition-colors"
            data-testid="input-login-password"
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs text-center" data-testid="text-login-error">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          data-testid="button-login-submit"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {language === 'es' ? 'Iniciar sesión' : 'Sign in'}
        </button>
        <p className="text-center text-[12px] text-[#999]">
          {language === 'es' ? '¿No tienes cuenta? ' : "Don't have an account? "}
          <Link href="/registro" className="text-[#059669] hover:text-[#047857]">
            {language === 'es' ? 'Regístrate' : 'Sign up'}
          </Link>
        </p>
      </form>
    </div>
  );
}

function FallbackLogin() {
  const { language } = useLanguage();
  return (
    <LoginLayout language={language}>
      <DirectLoginForm language={language} />
    </LoginLayout>
  );
}

export default function Login() {
  return CLERK_ENABLED ? <ClerkLogin /> : <FallbackLogin />;
}

function LoginLoading({ language }: { language: string }) {
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

function LoginLayout({ language, children }: { language: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-14 pb-8 max-w-md mx-auto w-full">
        <div className="text-center mb-10 w-full">
          <Link href="/home">
            <span className="cursor-pointer" data-testid="link-logo-home-login">
              <h1 className="text-xl font-extralight tracking-[0.2em] text-[#222]">
                FRACTIONAL LIVING
              </h1>
              <div className="w-8 h-[0.5px] bg-gradient-to-r from-[#059669] to-[#06b6d4] mx-auto mt-2 mb-1" />
              <p className="text-[8px] text-[#999] uppercase tracking-[0.4em]">All Global Holding LLC</p>
            </span>
          </Link>
        </div>

        <div className="w-full mb-6">
          <p className="text-center text-sm text-[#717171] font-light">
            {language === 'es'
              ? 'Accede a tu cuenta y gestiona tu red.'
              : 'Access your account and manage your network.'}
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl overflow-hidden border border-[#ebebeb] shadow-[0_8px_40px_rgba(5,150,105,0.08)]" data-testid="card-login">
          {children}
        </div>

        <div className="mt-8 text-center">
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
