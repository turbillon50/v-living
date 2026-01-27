import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { FractionCalculator } from '@/components/FractionCalculator';
import { WeekCalendar } from '@/components/WeekCalendar';
import { useLanguage } from '@/lib/LanguageContext';
import { getProperties } from '@/lib/api';
import { Property } from '@shared/schema';
import { ChevronRight, Building2, MapPin, Bed, Bath } from 'lucide-react';
import logoImg from '@/assets/logo.png';

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
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />

      {/* Hero */}
      <section className="bg-white py-16 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <img src={logoImg} alt="Fractional Living" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600 mb-4">
            Compra • Vive • Renta • Revende • Repite
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto">
            {language === 'es' 
              ? 'Servicio llave en mano. Nosotros rentamos por ti. Plusvalía garantizada.'
              : 'Turnkey service. We rent for you. Guaranteed appreciation.'}
          </p>
        </div>
      </section>

      {/* Property Selection */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-[#2d3a3a] mb-6">
            {language === 'es' ? '1. Selecciona una Propiedad' : '1. Select a Property'}
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {properties.slice(0, 6).map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`text-left p-4 bg-white border transition-all ${
                  selectedProperty?.id === property.id 
                    ? 'border-[#4db6ac] ring-2 ring-[#4db6ac]/20' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
                data-testid={`select-property-${property.id}`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 flex-shrink-0 overflow-hidden">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-stone-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#2d3a3a] truncate">{property.title}</h3>
                    <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
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
                    <p className="text-[#4db6ac] font-medium mt-2">
                      ${(property.fractionPrice || 650000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-8 bg-white border border-stone-200">
              <p className="text-stone-500">
                {language === 'es' ? 'Cargando propiedades...' : 'Loading properties...'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-[#2d3a3a] mb-6">
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

      {/* Calendar */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-[#2d3a3a] mb-6">
            {language === 'es' ? '3. Selecciona Tus Semanas' : '3. Select Your Weeks'}
          </h2>

          <WeekCalendar
            selectedWeeks={selectedWeeks}
            onWeekSelect={handleWeekToggle}
            maxSelections={3}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#2d3a3a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-light text-white mb-4">
            {language === 'es' ? 'Sé Parte de la Familia' : 'Be Part of the Family'}
          </h2>
          <p className="text-white/80 mb-4 text-lg">
            {language === 'es' 
              ? 'Contacta para pertenecer a la familia All Global Holding'
              : 'Contact us to join the All Global Holding family'}
          </p>
          <p className="text-white/60 mb-6">
            {language === 'es' 
              ? 'Seas desarrollador, broker, comprador o inversionista, tenemos un lugar para ti.'
              : 'Whether developer, broker, buyer or investor, we have a place for you.'}
          </p>
          <a
            href="https://wa.me/529984292748?text=Hola,%20quiero%20ser%20parte%20de%20la%20familia%20All%20Global%20Holding"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4db6ac] text-white hover:bg-[#3da69c] transition-colors"
            data-testid="button-invest-cta"
          >
            {language === 'es' ? 'Contactar Ahora' : 'Contact Now'}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#f8f7f4] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <img src={logoImg} alt="Fractional Living" className="h-10 w-auto mx-auto mb-3" />
          <p className="text-sm text-stone-500">
            © 2024 All Global Holding LLC. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
