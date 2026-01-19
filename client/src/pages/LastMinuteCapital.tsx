import { useLanguage } from '@/lib/LanguageContext';
import { Link } from 'wouter';
import { ArrowLeft, Clock, TrendingUp, DollarSign, Calendar, ChevronRight, Percent, Shield, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Property {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
  tag: string | null;
}

export default function LastMinuteCapital() {
  const { language } = useLanguage();

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const lastMinuteProperties = properties.filter(p => p.tag === 'oferta' || p.tag === 'ultima_fraccion');

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="px-6 py-4 flex items-center gap-4 border-b border-white/10">
        <Link href="/home">
          <span className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <h1 className="text-lg font-light tracking-wide">Last Minute Capital</h1>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm mb-6">
              <Clock className="w-4 h-4" />
              {language === 'es' ? 'Oportunidades Limitadas' : 'Limited Opportunities'}
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight mb-4" data-testid="text-title">
              {language === 'es' ? 'Inversiones de Último Momento' : 'Last Minute Investments'}
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto">
              {language === 'es' 
                ? 'Fracciones exclusivas con descuentos especiales. Disponibilidad limitada por tiempo definido.'
                : 'Exclusive fractions with special discounts. Limited availability for a defined time.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center" data-testid="card-roi">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-teal-400" />
              <h3 className="font-medium mb-2">{language === 'es' ? 'Alto Retorno' : 'High Return'}</h3>
              <p className="text-sm text-white/50">{language === 'es' ? 'Hasta 15% anual' : 'Up to 15% yearly'}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center" data-testid="card-discount">
              <Percent className="w-8 h-8 mx-auto mb-3 text-teal-400" />
              <h3 className="font-medium mb-2">{language === 'es' ? 'Descuentos' : 'Discounts'}</h3>
              <p className="text-sm text-white/50">{language === 'es' ? 'Hasta 20% off' : 'Up to 20% off'}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center" data-testid="card-use">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-teal-400" />
              <h3 className="font-medium mb-2">{language === 'es' ? 'Uso Inmediato' : 'Immediate Use'}</h3>
              <p className="text-sm text-white/50">{language === 'es' ? '3 semanas/año' : '3 weeks/year'}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-teal-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">{language === 'es' ? '¿Por qué Last Minute?' : 'Why Last Minute?'}</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {language === 'es' 
                    ? 'Cuando un propietario necesita liquidez rápida, ofrecemos su fracción a un precio especial. Tú obtienes el mismo activo de lujo con un descuento significativo y todos los beneficios de propiedad fraccionada.'
                    : 'When an owner needs quick liquidity, we offer their fraction at a special price. You get the same luxury asset at a significant discount with all fractional ownership benefits.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <Shield className="w-6 h-6 text-teal-400 mb-3" />
              <h4 className="font-medium mb-2">{language === 'es' ? 'Misma Garantía' : 'Same Guarantee'}</h4>
              <p className="text-sm text-white/50">
                {language === 'es' 
                  ? 'Propiedad legal, heredable y con escritura notarial.'
                  : 'Legal ownership, inheritable with notarized deed.'}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <DollarSign className="w-6 h-6 text-teal-400 mb-3" />
              <h4 className="font-medium mb-2">{language === 'es' ? 'Desde $520,000 MXN' : 'From $520,000 MXN'}</h4>
              <p className="text-sm text-white/50">
                {language === 'es' 
                  ? 'Fracciones con hasta 20% de descuento del precio regular.'
                  : 'Fractions with up to 20% discount from regular price.'}
              </p>
            </div>
          </div>

          {lastMinuteProperties.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-light mb-6">{language === 'es' ? 'Disponibles Ahora' : 'Available Now'}</h3>
              {lastMinuteProperties.map(property => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex cursor-pointer hover:bg-white/10 transition-colors" data-testid={`card-property-${property.id}`}>
                    <div className="w-32 h-24 flex-shrink-0">
                      {property.images[0] ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10" />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-between">
                      <div>
                        <p className="font-medium mb-1">{property.title}</p>
                        <p className="text-sm text-white/50">{property.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-teal-400 font-medium">${property.price?.toLocaleString()} MXN</p>
                        <ChevronRight className="w-4 h-4 text-white/30 ml-auto" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10" data-testid="empty-state">
              <Clock className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/50 mb-4">
                {language === 'es' 
                  ? 'No hay oportunidades disponibles en este momento.'
                  : 'No opportunities available at this time.'}
              </p>
              <p className="text-sm text-white/30">
                {language === 'es' 
                  ? 'Habla con Alix para ser notificado cuando haya nuevas ofertas.'
                  : 'Talk to Alix to be notified when new offers are available.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
