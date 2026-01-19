import { useLanguage } from '@/lib/LanguageContext';
import { Link } from 'wouter';
import { ArrowLeft, Users, Star, Gift, TrendingUp, Award, DollarSign, Briefcase, Target } from 'lucide-react';

export default function PerfilAsociado() {
  const { language } = useLanguage();

  const benefits = language === 'es' ? [
    { icon: DollarSign, title: 'Comisiones Atractivas', desc: 'Hasta 5% por cada fracción vendida a través de tu referencia' },
    { icon: Gift, title: 'Bonos por Metas', desc: 'Bonificaciones adicionales al alcanzar objetivos de ventas' },
    { icon: Briefcase, title: 'Material de Ventas', desc: 'Acceso a presentaciones, catálogos y herramientas digitales' },
    { icon: Target, title: 'Capacitación', desc: 'Entrenamientos mensuales sobre producto y técnicas de venta' }
  ] : [
    { icon: DollarSign, title: 'Attractive Commissions', desc: 'Up to 5% for each fraction sold through your referral' },
    { icon: Gift, title: 'Goal Bonuses', desc: 'Additional bonuses when reaching sales targets' },
    { icon: Briefcase, title: 'Sales Materials', desc: 'Access to presentations, catalogs and digital tools' },
    { icon: Target, title: 'Training', desc: 'Monthly training on product and sales techniques' }
  ];

  const levels = language === 'es' ? [
    { name: 'Asociado', sales: '1-3 fracciones', commission: '3%' },
    { name: 'Asociado Premium', sales: '4-10 fracciones', commission: '4%' },
    { name: 'Embajador', sales: '11+ fracciones', commission: '5%' }
  ] : [
    { name: 'Associate', sales: '1-3 fractions', commission: '3%' },
    { name: 'Premium Associate', sales: '4-10 fractions', commission: '4%' },
    { name: 'Ambassador', sales: '11+ fractions', commission: '5%' }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-white/10">
        <Link href="/home">
          <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <h1 className="text-lg font-light tracking-wide">
          {language === 'es' ? 'Perfil Asociado' : 'Associate Profile'}
        </h1>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight mb-4" data-testid="text-title">
              {language === 'es' ? 'Únete a Nuestra Red' : 'Join Our Network'}
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto">
              {language === 'es' 
                ? 'Genera ingresos pasivos referiendo clientes a Fractional Living. Sin inversión inicial.'
                : 'Generate passive income by referring clients to Fractional Living. No initial investment.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5" data-testid={`benefit-${i}`}>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <benefit.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                    <p className="text-sm text-white/50">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-teal-400" />
              <h3 className="text-lg font-medium">
                {language === 'es' ? 'Niveles de Asociado' : 'Associate Levels'}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {levels.map((level, i) => (
                <div key={i} className={`p-4 rounded-xl text-center ${i === 2 ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30' : 'bg-white/5'}`} data-testid={`level-${i}`}>
                  <Star className={`w-6 h-6 mx-auto mb-2 ${i === 2 ? 'text-teal-400' : 'text-white/40'}`} />
                  <p className="font-medium mb-1">{level.name}</p>
                  <p className="text-xs text-white/50 mb-2">{level.sales}</p>
                  <p className="text-xl font-bold text-teal-400">{level.commission}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-4 text-teal-400" />
            <h3 className="text-xl font-medium mb-2">
              {language === 'es' ? '¿Listo para empezar?' : 'Ready to start?'}
            </h3>
            <p className="text-white/60 mb-4">
              {language === 'es' 
                ? 'Habla con Alix para aplicar al programa de asociados'
                : 'Talk to Alix to apply to the associate program'}
            </p>
            <p className="text-sm text-white/40">
              {language === 'es' 
                ? 'Usa el botón de chat en la esquina inferior derecha'
                : 'Use the chat button in the bottom right corner'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
