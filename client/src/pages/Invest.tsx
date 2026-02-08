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
import { ChevronRight, Building2, MapPin, Bed, Bath } from 'lucide-react';
import { AGHLogo } from '@/components/AGHLogo';

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
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-20 border-b border-[#eee] agh-fade-in">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <AGHLogo size={28} color="#111" />
          </div>
          <h1 className="text-3xl md:text-4xl text-[#111] tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            Compra &middot; Vive &middot; Renta &middot; Revende &middot; Repite
          </h1>
          <p className="text-[#888] max-w-xl mx-auto font-light">
            {language === 'es' 
              ? 'Servicio llave en mano. Nosotros rentamos por ti. Plusvalía garantizada.'
              : 'Turnkey service. We rent for you. Guaranteed appreciation.'}
          </p>
        </div>
      </section>

      <section className="py-16 agh-fade-in-delay-1">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl text-[#111] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '1. Selecciona una Propiedad' : '1. Select a Property'}
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {properties.slice(0, 6).map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`text-left p-4 bg-white border transition-all duration-200 rounded-md ${
                  selectedProperty?.id === property.id 
                    ? 'border-[#111] bg-[#fafafa]' 
                    : 'border-[#eee] hover:border-[#999]'
                }`}
                data-testid={`select-property-${property.id}`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-[#f5f5f5] flex-shrink-0 overflow-hidden rounded-sm">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-[#ddd]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#111] truncate text-sm">{property.title}</h3>
                    <p className="text-sm text-[#999] flex items-center gap-1 mt-1 font-light">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#999] font-light">
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
                    <p className="text-[#111] font-medium mt-2 text-sm">
                      ${(property.fractionPrice || 650000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-10 bg-[#fafafa] border border-[#eee] rounded-md">
              <p className="text-[#999] font-light">
                {language === 'es' ? 'Cargando propiedades...' : 'Loading properties...'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#fafafa] border-y border-[#eee] agh-fade-in-delay-2">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl text-[#111] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '2. Calcula Tu Inversión' : '2. Calculate Your Investment'}
          </h2>
          
          <FractionCalculator 
            propertyTitle={selectedProperty?.title}
            totalValue={(selectedProperty?.fractionPrice || 650000) * 14}
            fractionPrice={selectedProperty?.fractionPrice || 650000}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      </section>

      <section className="py-16 agh-fade-in-delay-3">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl text-[#111] mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '3. Selecciona Tus Semanas' : '3. Select Your Weeks'}
          </h2>

          <WeekCalendar
            selectedWeeks={selectedWeeks}
            onWeekSelect={handleWeekToggle}
            maxSelections={3}
          />
        </div>
      </section>

      <section className="py-20 bg-[#111]">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#111] hover:bg-[#eee] transition-colors duration-200 rounded-md text-sm font-medium tracking-wide"
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
