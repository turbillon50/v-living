import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, MapPin, Bed, Bath, Users } from 'lucide-react';
import heroImg from '@/assets/hero-cover.png';

export default function Home() {
  const { language } = useLanguage();
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-[#1a1a1a] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Hero Image */}
          <div className="mb-10">
            <img 
              src={heroImg} 
              alt="Fractional Living" 
              className="h-40 md:h-52 w-auto mx-auto shadow-xl"
              data-testid="hero-logo"
            />
          </div>
          
          <p className="text-lg md:text-xl text-white/50 font-extralight max-w-2xl mx-auto mb-10">
            {language === 'es' 
              ? 'Propiedad fraccionada de lujo en el Caribe'
              : 'Luxury fractional ownership in the Caribbean'}
          </p>

          <div className="flex justify-center">
            <Link href="/fractional">
              <span className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white/90 transition-colors cursor-pointer" data-testid="button-explore">
                {language === 'es' ? 'VER PROPIEDADES' : 'VIEW PROPERTIES'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#f8f7f4] border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '227', label: language === 'es' ? 'Fracciones' : 'Fractions' },
              { value: '22', label: language === 'es' ? 'Propiedades' : 'Properties' },
              { value: '$650K', label: 'MXN' },
              { value: '3', label: language === 'es' ? 'Semanas/año' : 'Weeks/year' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-extralight text-[#1a1a1a]">{stat.value}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-[#4db6ac] uppercase tracking-[0.2em] mb-2 font-medium">
                {language === 'es' ? 'Portafolio' : 'Portfolio'}
              </p>
              <h2 className="text-3xl font-extralight text-[#1a1a1a]">
                {language === 'es' ? 'Propiedades' : 'Properties'}
              </h2>
            </div>
            <Link href="/fractional">
              <span className="text-sm text-stone-500 hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer">
                {language === 'es' ? 'Ver todas' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <article className="group cursor-pointer" data-testid={`card-property-${property.id}`}>
                    <div className="aspect-[4/3] bg-[#f0f0f0] mb-4 overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl font-extralight text-stone-300">
                            {property.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-[#1a1a1a] group-hover:text-[#4db6ac] transition-colors mb-1">
                      {property.title}
                    </h3>
                    
                    <p className="flex items-center gap-1 text-sm text-stone-500 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.location}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-stone-400 mb-3">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
                        </span>
                      )}
                      {property.maxGuests && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {property.maxGuests}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#1a1a1a]">
                      <span className="text-lg font-medium">${(property.fractionPrice || 65000).toLocaleString()}</span>
                      <span className="text-stone-500 text-sm"> / {language === 'es' ? 'fracción' : 'fraction'}</span>
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#f8f7f4]">
              <p className="text-stone-400 text-lg font-light">
                {language === 'es' ? 'Agrega propiedades en Modo Creador' : 'Add properties in Creator Mode'}
              </p>
              <Link href="/creator">
                <span className="inline-block mt-4 text-sm text-[#4db6ac] hover:underline cursor-pointer">
                  {language === 'es' ? 'Ir a Modo Creador →' : 'Go to Creator Mode →'}
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Proyecto ATTIK */}
      <section className="py-16 bg-gradient-to-r from-teal-900 to-cyan-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-teal-300 text-sm uppercase tracking-widest mb-2">Proyecto Destacado</p>
            <h2 className="text-3xl md:text-4xl font-extralight text-white mb-2">ATTIK</h2>
            <p className="text-white/60">{language === 'es' ? 'Entrega Julio 2026' : 'Delivery July 2026'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-6">
              <p className="text-2xl font-light text-white mb-2">{language === 'es' ? 'Crédito' : 'Credit'}</p>
              <p className="text-white/60 text-sm">{language === 'es' ? 'Contamos con Crédito Casa' : 'We have Home Credit'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <p className="text-2xl font-light text-white mb-2">{language === 'es' ? 'Usa • Renta • Revende' : 'Use • Rent • Resell'}</p>
              <p className="text-white/60 text-sm">{language === 'es' ? 'Tú decides cómo usar tu fracción' : 'You decide how to use your fraction'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <p className="text-2xl font-light text-white mb-2">24/7</p>
              <p className="text-white/60 text-sm">{language === 'es' ? 'Apoyo constante de nuestro equipo' : 'Constant support from our team'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extralight text-white mb-4">
            {language === 'es' ? '¿Tienes preguntas?' : 'Have questions?'}
          </h2>
          <p className="text-white/50 mb-6 font-light">
            {language === 'es' ? 'Habla con Alix o escríbenos por WhatsApp' : 'Talk to Alix or message us on WhatsApp'}
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors"
            data-testid="button-whatsapp"
          >
            WhatsApp +52 998 429 2748
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <img src={heroImg} alt="Fractional Living" className="h-10 w-auto" />
            <div className="flex gap-8 text-sm text-stone-500">
              <Link href="/fractional"><span className="hover:text-[#1a1a1a] cursor-pointer">{language === 'es' ? 'Propiedades' : 'Properties'}</span></Link>
              <Link href="/experiences"><span className="hover:text-[#1a1a1a] cursor-pointer">{language === 'es' ? 'Experiencias' : 'Experiences'}</span></Link>
              <Link href="/invest"><span className="hover:text-[#1a1a1a] cursor-pointer">{language === 'es' ? 'Invertir' : 'Invest'}</span></Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-400">© 2024 All Global Holding LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
