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
import { ChevronRight, MapPin, Bed, Bath, Share2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#030810] pb-24 pt-14">
      <Header />

      <section className="relative overflow-hidden">
        <div className="relative h-[360px] md:h-[440px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030810]/50 via-[#030810]/70 to-[#030810]" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-8">
            <div className="fl-fade-in">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center shadow-lg shadow-[#0891b2]/20">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-3xl md:text-5xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-invest">
                {language === 'es' ? 'Compra · Vive · Renta · Revende' : 'Buy · Live · Rent · Resell'}
              </h1>
              <p className="text-[#64748b] max-w-xl mx-auto font-light text-sm">
                {language === 'es'
                  ? 'Modelo real, legal y heredable. 3 semanas de uso al año. Renta el resto.'
                  : 'Real, legal and inheritable model. 3 weeks of use per year. Rent the rest.'}
              </p>
              <div className="flex items-center justify-center gap-6 mt-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  <span className="text-[#64748b] text-xs">8-12% {language === 'es' ? 'rendimiento' : 'yield'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0891b2]" />
                  <span className="text-[#64748b] text-xs">{language === 'es' ? 'Escritura real' : 'Real deed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 fl-fade-in-delay-1">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 1' : 'Step 1'}
          </p>
          <h2 className="text-2xl text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Selecciona una Propiedad' : 'Select a Property'}
          </h2>

          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {properties.slice(0, 6).map((property) => (
              <div key={property.id} className="relative group">
                <button
                  onClick={() => setSelectedProperty(property)}
                  className={`text-left w-full p-4 fl-glass-card transition-all duration-300 ${
                    selectedProperty?.id === property.id
                      ? 'border-[#0891b2] bg-[rgba(6,182,212,0.08)]'
                      : ''
                  }`}
                  data-testid={`select-property-${property.id}`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-[#0a1628] flex-shrink-0 overflow-hidden rounded-lg">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#1e293b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white truncate text-sm">{property.title}</h3>
                      <p className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#475569]">
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
                      <p className="text-[#22d3ee] font-medium mt-1.5 text-sm">
                        ${(property.fractionPrice || 650000).toLocaleString()} <span className="text-[10px] text-[#64748b] font-normal">/ {language === 'es' ? 'fracción' : 'fraction'}</span>
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleShare(property)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-md bg-[rgba(6,182,212,0.08)] flex items-center justify-center text-[#64748b] hover:text-[#22d3ee] opacity-0 group-hover:opacity-100 transition-all"
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
                className="px-6 py-2.5 rounded-lg fl-btn-dark text-sm"
                data-testid="button-consultar"
              >
                {language === 'es' ? 'Consultar sobre esta propiedad' : 'Inquire about this property'}
              </button>
            </div>
          )}

          {properties.length === 0 && (
            <div className="text-center py-10 fl-glass-card">
              <svg className="w-8 h-8 text-[#1e293b] mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              <p className="text-[#64748b] font-light text-sm">
                {language === 'es' ? 'Cargando propiedades...' : 'Loading properties...'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 border-y border-[rgba(6,182,212,0.06)] bg-[#020608] fl-fade-in-delay-2">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 2' : 'Step 2'}
          </p>
          <h2 className="text-2xl text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
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
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 3' : 'Step 3'}
          </p>
          <h2 className="text-2xl text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Selecciona Tus Semanas' : 'Select Your Weeks'}
          </h2>

          <WeekCalendar
            selectedWeeks={selectedWeeks}
            onWeekSelect={handleWeekToggle}
            maxSelections={3}
          />
        </div>
      </section>

      <section className="py-16 border-t border-[rgba(6,182,212,0.06)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Siguiente Paso' : 'Next Step'}
          </h2>
          <p className="text-[#64748b] mb-8 font-light text-sm">
            {language === 'es'
              ? 'Contacta a un asesor para iniciar tu proceso de inversión.'
              : 'Contact an advisor to start your investment process.'}
          </p>
          <a
            href="https://wa.me/529984292748?text=Hola,%20quiero%20invertir%20en%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 fl-btn-primary rounded-xl text-sm font-medium tracking-wide"
            data-testid="button-invest-cta"
          >
            {language === 'es' ? 'Contactar Ahora' : 'Contact Now'}
            <ChevronRight className="w-4 h-4" />
          </a>
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
