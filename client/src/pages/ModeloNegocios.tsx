import { useLanguage } from '@/lib/LanguageContext';
import { Link } from 'wouter';
import { ArrowLeft, FileText, Scale, Building2, Users, Shield, CheckCircle, Globe, Landmark } from 'lucide-react';

export default function ModeloNegocios() {
  const { language } = useLanguage();

  const legalPoints = language === 'es' ? [
    'Escritura pública ante notario mexicano',
    'Registro ante el Registro Público de la Propiedad',
    'Estructura de copropiedad bajo ley mexicana',
    'Contrato de uso temporal regulado',
    'Heredable a familiares directos',
    'Cumplimiento fiscal en México y EE.UU.'
  ] : [
    'Public deed before Mexican notary',
    'Registration with Property Registry',
    'Co-ownership structure under Mexican law',
    'Regulated temporary use contract',
    'Inheritable to direct family',
    'Tax compliance in Mexico and USA'
  ];

  const businessPoints = language === 'es' ? [
    { title: '8 Fracciones por Propiedad', desc: 'Cada propiedad se divide en 8 partes iguales' },
    { title: '3 Semanas de Uso Anual', desc: 'Cada fracción incluye 3 semanas de uso personal' },
    { title: '$650,000 MXN por Fracción', desc: 'Precio fijo con opción de financiamiento' },
    { title: 'Mantenimiento Incluido', desc: 'Cuota anual cubre limpieza, servicios y reparaciones' }
  ] : [
    { title: '8 Fractions per Property', desc: 'Each property is divided into 8 equal parts' },
    { title: '3 Weeks Annual Use', desc: 'Each fraction includes 3 weeks of personal use' },
    { title: '$650,000 MXN per Fraction', desc: 'Fixed price with financing option' },
    { title: 'Maintenance Included', desc: 'Annual fee covers cleaning, services and repairs' }
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
          {language === 'es' ? 'Modelo de Negocios' : 'Business Model'}
        </h1>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-full text-sm mb-6">
              <Scale className="w-4 h-4" />
              {language === 'es' ? 'Transparencia Total' : 'Full Transparency'}
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight mb-4" data-testid="text-title">
              {language === 'es' ? 'Modelo Fractional Real' : 'Real Fractional Model'}
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto">
              {language === 'es' 
                ? 'Propiedad legal, uso garantizado y valor patrimonial heredable bajo la ley mexicana.'
                : 'Legal ownership, guaranteed use and inheritable asset value under Mexican law.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Building2 className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="text-xl font-medium mb-4">
                {language === 'es' ? 'Modelo de Negocio' : 'Business Model'}
              </h3>
              <div className="space-y-4">
                {businessPoints.map((point, i) => (
                  <div key={i} className="flex gap-3" data-testid={`business-point-${i}`}>
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{point.title}</p>
                      <p className="text-xs text-white/50">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Landmark className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="text-xl font-medium mb-4">
                {language === 'es' ? 'Marco Legal' : 'Legal Framework'}
              </h3>
              <div className="space-y-3">
                {legalPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 items-center" data-testid={`legal-point-${i}`}>
                    <Shield className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <p className="text-sm text-white/70">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Globe className="w-8 h-8 text-teal-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">All Global Holding LLC</h3>
                <p className="text-sm text-white/70 mb-3">
                  {language === 'es' 
                    ? 'Empresa registrada en Estados Unidos con operaciones en México. Respaldo legal binacional para tu inversión.'
                    : 'US-registered company with operations in Mexico. Binational legal backing for your investment.'}
                </p>
                <div className="flex gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Delaware, USA
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> +50 {language === 'es' ? 'inversores' : 'investors'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-8 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4">
              {language === 'es' 
                ? '¿Tienes preguntas sobre el modelo legal o de negocio?'
                : 'Have questions about the legal or business model?'}
            </p>
            <p className="text-white/60 text-sm">
              {language === 'es' 
                ? 'Habla con Alix, nuestra asesora virtual disponible 24/7'
                : 'Talk to Alix, our virtual advisor available 24/7'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
