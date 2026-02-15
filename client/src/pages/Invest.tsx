import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { FractionCalculator } from '@/components/FractionCalculator';
import { WeekCalendar } from '@/components/WeekCalendar';
import { useLanguage } from '@/lib/LanguageContext';
import { getProperties } from '@/lib/api';
import { Property } from '@shared/schema';
import { ChevronRight, Building2, MapPin, Bed, Bath, Waves } from 'lucide-react';

export default function Invest() {
  const { language } = useLanguage();
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />

      <section className="py-20 border-b border-[#e2e8f0] fl-fade-in">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl fl-gradient-turquoise flex items-center justify-center shadow-lg shadow-[#0891b2]/25">
              <Waves className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl text-[#0a1628] tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
          </h1>
          <p className="text-[#94a3b8] max-w-xl mx-auto font-light">
            {language === 'es' 
              ? 'Servicio llave en mano. Nosotros rentamos por ti. Plusvalía garantizada.'
              : 'Turnkey service. We rent for you. Guaranteed appreciation.'}
          </p>
        </div>
      </section>

      <section className="py-16 fl-fade-in-delay-1">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 1' : 'Step 1'}
          </p>
          <h2 className="text-2xl text-[#0a1628] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Selecciona una Propiedad' : 'Select a Property'}
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {properties.slice(0, 6).map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`text-left p-4 bg-white border transition-all duration-300 rounded-xl ${
                  selectedProperty?.id === property.id 
                    ? 'border-[#0891b2] bg-[#f0fdfa] shadow-md shadow-[#0891b2]/10' 
                    : 'border-[#e2e8f0] hover:border-[#0891b2]/30 hover:shadow-sm'
                }`}
                data-testid={`select-property-${property.id}`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-[#f1f5f9] flex-shrink-0 overflow-hidden rounded-xl">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Waves className="w-8 h-8 text-[#0891b2]/20" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#0a1628] truncate text-sm">{property.title}</h3>
                    <p className="text-sm text-[#94a3b8] flex items-center gap-1 mt-1 font-light">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#94a3b8] font-light">
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
                    <p className="text-[#0891b2] font-medium mt-2 text-sm">
                      ${(property.fractionPrice || 650000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-10 fl-card">
              <Waves className="w-8 h-8 text-[#0891b2]/20 mx-auto mb-2" />
              <p className="text-[#94a3b8] font-light">
                {language === 'es' ? 'Cargando propiedades...' : 'Loading properties...'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0] fl-fade-in-delay-2">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 2' : 'Step 2'}
          </p>
          <h2 className="text-2xl text-[#0a1628] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
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

      <section className="py-16 fl-fade-in-delay-3">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#0891b2] text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
            {language === 'es' ? 'Paso 3' : 'Step 3'}
          </p>
          <h2 className="text-2xl text-[#0a1628] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Selecciona Tus Semanas' : 'Select Your Weeks'}
          </h2>

          <WeekCalendar
            selectedWeeks={selectedWeeks}
            onWeekSelect={handleWeekToggle}
            maxSelections={3}
          />
        </div>
      </section>

      <section className="py-20 fl-gradient-sunset">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? 'Sé Parte de la Familia' : 'Be Part of the Family'}
          </h2>
          <p className="text-white/60 mb-4 font-light">
            {language === 'es' 
              ? 'Contacta para pertenecer a la familia All Global Holding'
              : 'Contact us to join the All Global Holding family'}
          </p>
          <p className="text-white/40 mb-8 font-light text-sm">
            {language === 'es' 
              ? 'Seas desarrollador, broker, comprador o inversionista, tenemos un lugar para ti.'
              : 'Whether developer, broker, buyer or investor, we have a place for you.'}
          </p>
          <a
            href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20parte%20de%20la%20familia%20All%20Global%20Holding"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a1628] hover:bg-white/90 transition-colors duration-200 rounded-xl text-sm font-medium tracking-wide shadow-lg"
            data-testid="button-invest-cta"
          >
            {language === 'es' ? 'Contactar Ahora' : 'Contact Now'}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <AGHFooter />
    </div>
  );
}
