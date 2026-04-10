import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { FractionCalculator } from '@/components/FractionCalculator';
import { WeekCalendar } from '@/components/WeekCalendar';
import { InquiryForm } from '@/components/InquiryForm';
import { useLanguage } from '@/lib/LanguageContext';
import { getProperties } from '@/lib/api';
import { Property } from '@shared/schema';
import { shareProperty } from '@/lib/shareProperty';
import { ChevronRight, MapPin, Bed, Bath, Share2, TrendingUp, Shield, Building2, Users, ArrowRight, CheckCircle2, Briefcase, CreditCard, DollarSign } from 'lucide-react';

export default function Invest() {
  const { language } = useLanguage();
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const handleWeekToggle = (weekNum: number) => {
    setSelectedWeeks(prev =>
      prev.includes(weekNum)
        ? prev.filter(w => w !== weekNum)
        : [...prev, weekNum]
    );
  };

  const handleProceedToPayment = () => {
    const msg = `Hola, me interesa invertir en Fractional Living.\n\n${selectedProperty ? `Propiedad: ${selectedProperty.title}\n` : ''}Semanas seleccionadas: ${selectedWeeks.join(', ')}`;
    window.open(`https://wa.me/529984292748?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShare = async (property: Property) => {
    await shareProperty({
      title: property.title,
      location: property.location,
      pricePerFraction: `$${(property.fractionPrice || 650000).toLocaleString()} USD / fracción`,
      yieldPercent: '8-12% anual',
      url: `${window.location.origin}/fractional/${property.id}`,
      imageUrl: property.images?.[0],
    });
  };

  const investorProfiles = [
    {
      icon: Building2,
      title: language === 'es' ? 'Propietarios' : 'Property Owners',
      desc: language === 'es' ? 'Resolvemos activos detenidos antes de que pierdan valor' : 'We resolve stalled assets before they lose value',
      points: language === 'es' 
        ? ['Deuda, obra parada o falta de liquidez', 'Estructuración legal y financiera vía fideicomiso', 'Terminación, revalorización y salida']
        : ['Debt, stalled construction or lack of liquidity', 'Legal and financial structuring via trust', 'Completion, revaluation and exit'],
      result: language === 'es' ? 'Fracciones inmediatas desde el inicio' : 'Immediate fractions from the start',
    },
    {
      icon: CreditCard,
      title: language === 'es' ? 'Perfil con Crédito' : 'Credit Profile',
      desc: language === 'es' ? 'Te asociamos para adquirir y cerrar activos con nosotros' : 'We partner with you to acquire and close assets',
      points: language === 'es'
        ? ['Score 640+ y comportamiento sano', 'Crédito aplicado a operaciones reales', 'Participación en compra, ejecución y salida']
        : ['Score 640+ and healthy credit behavior', 'Credit applied to real operations', 'Participation in purchase, execution and exit'],
      result: language === 'es' ? 'Activos generados en semanas' : 'Assets generated in weeks',
    },
    {
      icon: DollarSign,
      title: language === 'es' ? 'Socios Inversionistas' : 'Investment Partners',
      desc: language === 'es' ? 'Capital inteligente en activos ya avanzados' : 'Smart capital in already advanced assets',
      points: language === 'es'
        ? ['Entrada desde $200,000 MXN', 'Modelo de salida definido', '70-90% avance de obra']
        : ['Entry from $200,000 MXN', 'Defined exit model', '70-90% construction progress'],
      result: language === 'es' ? 'Fracciones inmediatas desde el inicio' : 'Immediate fractions from the start',
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 pt-14">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[400px] md:h-[480px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-white" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-8">
            <div className="fl-fade-in">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-xl fl-gradient-brand flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Fractional Living</p>
              <h1 className="text-3xl md:text-5xl text-white tracking-tight mb-3 font-semibold" data-testid="hero-title-invest">
                {language === 'es' ? 'Inversión Inteligente' : 'Smart Investment'}
              </h1>
              <p className="text-white/70 max-w-xl mx-auto text-sm mb-2">
                {language === 'es'
                  ? 'Entra en el momento correcto. Tu capital es directamente derechos sobre propiedad desde el inicio.'
                  : 'Enter at the right moment. Your capital is directly property rights from the start.'}
              </p>
              <p className="text-white/50 text-xs max-w-lg mx-auto">
                {language === 'es'
                  ? 'Estructuramos activos detenidos, integramos capital y generamos salida vía fideicomiso y propiedad fraccionada.'
                  : 'We structure stalled assets, integrate capital and generate exit via trust and fractional property.'}
              </p>
              <div className="flex items-center justify-center gap-6 mt-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-white/70 text-xs font-medium">8-12% {language === 'es' ? 'rendimiento' : 'yield'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-white/70 text-xs font-medium">{language === 'es' ? 'Escritura real' : 'Real deed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-5xl mx-auto px-6 fl-fade-in-delay-1">
        <div className="text-center mb-10">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
            {language === 'es' ? '¿Dónde entras tú?' : 'Where do you fit in?'}
          </p>
          <h2 className="text-2xl md:text-3xl text-[#222] mb-3 font-semibold">
            {language === 'es' ? 'Tres Perfiles de Inversión' : 'Three Investment Profiles'}
          </h2>
          <p className="text-[#717171] text-sm max-w-lg mx-auto">
            {language === 'es'
              ? 'No se trata de invertir. Se trata de entrar en el momento correcto.'
              : "It's not about investing. It's about entering at the right moment."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {investorProfiles.map((profile, i) => {
            const Icon = profile.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-[#ebebeb] p-6 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl fl-gradient-brand flex items-center justify-center mb-4 group-hover:shadow-md transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[#222] font-semibold text-lg mb-2">{profile.title}</h3>
                <p className="text-[#717171] text-sm mb-4">{profile.desc}</p>
                <ul className="space-y-2 mb-4">
                  {profile.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#717171]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#f0fdf4] rounded-xl p-3 border border-[#059669]/10">
                  <p className="text-[#059669] text-xs font-semibold flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3" />
                    {profile.result}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 bg-[#f7f7f7] border-y border-[#ebebeb]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
              {language === 'es' ? 'Características del Fondo' : 'Fund Characteristics'}
            </p>
            <h2 className="text-2xl text-[#222] font-semibold">
              All Living Inversiones
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: language === 'es' ? 'Entrada mínima' : 'Min. entry', value: '$200K MXN' },
              { label: language === 'es' ? 'Avance de obra' : 'Construction', value: '70-90%' },
              { label: language === 'es' ? 'Integración' : 'Integration', value: language === 'es' ? 'Fiduciaria' : 'Fiduciary' },
              { label: language === 'es' ? 'Last-Minute' : 'Last-Minute', value: language === 'es' ? 'Rescate y cierre' : 'Rescue & close' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-[#ebebeb]">
                <p className="text-[#222] font-bold text-lg">{item.value}</p>
                <p className="text-[#717171] text-[10px] uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-[#ebebeb] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl fl-gradient-brand flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[#222] font-semibold mb-1">
                  {language === 'es' ? 'Seguridad Jurídica Absoluta' : 'Absolute Legal Security'}
                </h3>
                <p className="text-[#717171] text-sm leading-relaxed">
                  {language === 'es'
                    ? 'Tu capital se aplica directamente y se convierte en derechos sobre propiedad desde el inicio. Operamos, comercializamos y ejecutamos la salida con experiencia.'
                    : 'Your capital is applied directly and becomes property rights from the start. We operate, market and execute the exit with experience.'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[#717171] text-sm mt-6 italic">
            {language === 'es'
              ? 'Resultado: fracciones inmobiliarias inmediatas con alto valor de mercado.'
              : 'Result: immediate real estate fractions with high market value.'}
          </p>
        </div>
      </section>

      <section className="py-12 fl-fade-in-delay-1">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
            {language === 'es' ? 'Paso 1' : 'Step 1'}
          </p>
          <h2 className="text-2xl text-[#222] mb-8 font-semibold">
            {language === 'es' ? 'Selecciona una Propiedad' : 'Select a Property'}
          </h2>

          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {properties.slice(0, 6).map((property) => (
              <div key={property.id} className="relative group">
                <button
                  onClick={() => setSelectedProperty(property)}
                  className={`text-left w-full p-4 rounded-xl border transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-[#059669] bg-[#f0fdf4] shadow-md'
                      : 'border-[#ebebeb] bg-white hover:shadow-md hover:border-[#059669]/30'
                  }`}
                  data-testid={`select-property-${property.id}`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-[#f7f7f7] flex-shrink-0 overflow-hidden rounded-lg">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-[#b0b0b0]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#222] truncate text-sm">{property.title}</h3>
                      <p className="text-xs text-[#717171] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#717171]">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3 h-3" /> {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-3 h-3" /> {property.bathrooms}
                          </span>
                        )}
                      </div>
                      <p className="text-[#059669] font-semibold mt-1.5 text-sm">
                        ${(property.fractionPrice || 650000).toLocaleString()} <span className="text-[10px] text-[#717171] font-normal">/ {language === 'es' ? 'fracción' : 'fraction'}</span>
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleShare(property)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#f7f7f7] flex items-center justify-center text-[#717171] hover:text-[#059669] opacity-0 group-hover:opacity-100 transition-all"
                  data-testid={`share-property-${property.id}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {selectedProperty && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowInquiry(true)}
                className="px-6 py-2.5 rounded-xl fl-btn-dark text-sm"
                data-testid="button-consultar"
              >
                {language === 'es' ? 'Consultar sobre esta propiedad' : 'Inquire about this property'}
              </button>
            </div>
          )}

          {properties.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-[#ebebeb]">
              <Building2 className="w-8 h-8 text-[#b0b0b0] mx-auto mb-2" />
              <p className="text-[#717171] text-sm">
                {language === 'es' ? 'Cargando propiedades...' : 'Loading properties...'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 border-y border-[#ebebeb] bg-[#f7f7f7] fl-fade-in-delay-2">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
            {language === 'es' ? 'Paso 2' : 'Step 2'}
          </p>
          <h2 className="text-2xl text-[#222] mb-8 font-semibold">
            {language === 'es' ? 'Calcula Tu Inversión' : 'Calculate Your Investment'}
          </h2>

          <FractionCalculator
            propertyTitle={selectedProperty?.title}
            totalValue={(selectedProperty?.fractionPrice || 650000) * 14}
            fractionPrice={selectedProperty?.fractionPrice || 650000}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      </section>

      <section className="py-12 fl-fade-in-delay-3">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
            {language === 'es' ? 'Paso 3' : 'Step 3'}
          </p>
          <h2 className="text-2xl text-[#222] mb-8 font-semibold">
            {language === 'es' ? 'Selecciona Tus Semanas' : 'Select Your Weeks'}
          </h2>

          <WeekCalendar
            selectedWeeks={selectedWeeks}
            onWeekSelect={handleWeekToggle}
            maxSelections={3}
          />
        </div>
      </section>

      <section className="py-16 border-t border-[#ebebeb] bg-[#f7f7f7]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl text-[#222] mb-2 font-semibold">
            {language === 'es' ? 'Agenda Tu Asesoría Personalizada' : 'Schedule Your Personalized Advisory'}
          </h2>
          <p className="text-[#717171] text-sm mb-2">
            {language === 'es'
              ? 'No todos los perfiles aplican. Sujeto a evaluación.'
              : 'Not all profiles apply. Subject to evaluation.'}
          </p>
          <p className="text-[#999] text-xs mb-8">
            {language === 'es'
              ? 'Los procesos pueden implicar estructuración profesional.'
              : 'Processes may involve professional structuring.'}
          </p>
          <a
            href="https://wa.me/529984292748?text=Hola,%20quiero%20agendar%20mi%20asesoría%20financiera%20personalizada%20con%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 fl-btn-primary rounded-xl text-sm font-semibold tracking-wide"
            data-testid="button-invest-cta"
          >
            {language === 'es' ? 'Agendar Asesoría Ahora' : 'Schedule Advisory Now'}
            <ChevronRight className="w-4 h-4" />
          </a>
          <p className="text-[#717171] text-xs mt-4">allliving.org</p>
        </div>
      </section>

      <AGHFooter />

      <InquiryForm
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        propertyTitle={selectedProperty?.title}
        propertyLocation={selectedProperty?.location}
      />
    </div>
  );
}
