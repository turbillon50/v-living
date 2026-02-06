import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { Users, ArrowRight, Shield, TrendingUp, Gift } from 'lucide-react';

export default function ReferralLanding() {
  const { code } = useParams<{ code: string }>();
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const { data: referrer, isLoading } = useQuery({
    queryKey: ['referral', code],
    queryFn: async () => {
      const res = await fetch(`/api/referral/${code}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!code,
  });

  useEffect(() => {
    if (code) {
      localStorage.setItem('fl_referral_code', code);
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pb-32">
        <div className="max-w-lg mx-auto px-5 pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white/70" />
            </div>
            
            {isLoading ? (
              <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
            ) : referrer ? (
              <>
                <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-2">
                  {language === 'es' ? 'Invitación de' : 'Invitation from'}
                </p>
                <h1 className="text-2xl font-light tracking-tight" data-testid="text-referrer-name">
                  {referrer.name}
                </h1>
              </>
            ) : (
              <h1 className="text-2xl font-light tracking-tight">
                {language === 'es' ? 'Enlace de invitación' : 'Invitation link'}
              </h1>
            )}
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-semibold mb-1 text-center">FRACTIONAL LIVING</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] text-center mb-5">All Global Holding LLC</p>

            <p className="text-sm text-white/60 leading-relaxed text-center mb-6">
              {language === 'es' 
                ? 'Vive, invierte y construye patrimonio en el Caribe bajo un modelo fractional real, legal y heredable.'
                : 'Live, invest and build wealth in the Caribbean under a real, legal and inheritable fractional model.'}
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: <Shield className="w-4 h-4" />, es: 'Propiedad legal y heredable', en: 'Legal & inheritable ownership' },
                { icon: <TrendingUp className="w-4 h-4" />, es: 'Inversión desde fracciones accesibles', en: 'Investment from accessible fractions' },
                { icon: <Gift className="w-4 h-4" />, es: 'Gana 4% en comisiones por tu red', en: 'Earn 4% commissions from your network' },
                { icon: <Users className="w-4 h-4" />, es: 'Red de referidos a 5 niveles', en: '5-level referral network' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="text-white/70">{item.icon}</div>
                  <span>{language === 'es' ? item.es : item.en}</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/registro">
            <div 
              className="w-full py-4 bg-white text-black rounded-xl text-sm font-medium text-center cursor-pointer hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              data-testid="button-register-referral"
            >
              {language === 'es' ? 'Crear mi cuenta gratis' : 'Create my free account'}
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <p className="text-center text-[10px] text-white/30 mt-4">
            {language === 'es' 
              ? 'Al registrarte, recibirás tu propio código para compartir y ganar.' 
              : 'By registering, you\'ll receive your own code to share and earn.'}
          </p>
        </div>
      </main>
    </div>
  );
}
