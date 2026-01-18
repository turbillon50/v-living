import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, Star, MapPin } from 'lucide-react';

export default function Home() {
  const { language } = useLanguage();
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Clean Typography */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-stone-400 text-sm tracking-[0.3em] uppercase mb-6 font-light">
            All Global Holding LLC
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white tracking-tight leading-none mb-8">
            FRACTIONAL
            <span className="block font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              LIVING
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-300 font-extralight max-w-2xl mx-auto mb-12 leading-relaxed">
            {language === 'es' 
              ? 'Propiedad fraccionada de lujo en el Caribe. Vive, invierte y construye patrimonio.'
              : 'Luxury fractional ownership in the Caribbean. Live, invest, and build wealth.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fractional">
              <span className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 text-sm tracking-wide uppercase font-medium hover:bg-stone-100 transition-colors cursor-pointer" data-testid="button-explore">
                {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/experiences">
              <span className="inline-flex items-center gap-2 px-8 py-4 border border-stone-500 text-white text-sm tracking-wide uppercase font-medium hover:bg-white/10 transition-colors cursor-pointer" data-testid="button-experiences">
                {language === 'es' ? 'Experiencias' : 'Experiences'}
              </span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-stone-500 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '$65K', label: language === 'es' ? 'Desde por fracción' : 'Starting per fraction' },
              { value: '3', label: language === 'es' ? 'Semanas al año' : 'Weeks per year' },
              { value: '100%', label: language === 'es' ? 'Propiedad legal' : 'Legal ownership' },
              { value: '∞', label: language === 'es' ? 'Heredable' : 'Inheritable' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-extralight text-stone-900 mb-2">{stat.value}</p>
                <p className="text-sm text-stone-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-sm text-stone-400 uppercase tracking-[0.2em] mb-3">
                  {language === 'es' ? 'Portafolio' : 'Portfolio'}
                </p>
                <h2 className="text-4xl md:text-5xl font-extralight text-stone-900">
                  {language === 'es' ? 'Propiedades' : 'Properties'}
                </h2>
              </div>
              <Link href="/fractional">
                <span className="text-sm text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer" data-testid="link-view-all">
                  {language === 'es' ? 'Ver todas' : 'View all'}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <article className="group cursor-pointer" data-testid={`card-property-${property.id}`}>
                    <div className="aspect-[4/3] bg-stone-100 mb-5 overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                          <span className="text-6xl font-extralight text-stone-400">
                            {property.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                          {property.title}
                        </h3>
                        {property.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                            <span>{property.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="flex items-center gap-1 text-sm text-stone-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.location}
                      </p>
                      
                      <p className="text-stone-900">
                        <span className="font-medium">${(property.fractionPrice || 65000).toLocaleString()}</span>
                        <span className="text-stone-500 text-sm"> / {language === 'es' ? 'fracción' : 'fraction'}</span>
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-24 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-stone-500 uppercase tracking-[0.2em] mb-3">
            {language === 'es' ? 'Servicios' : 'Services'}
          </p>
          <h2 className="text-4xl md:text-5xl font-extralight mb-16">
            {language === 'es' ? 'Más que propiedad' : 'More than property'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800">
            {[
              { 
                title: language === 'es' ? 'Fracciones' : 'Fractions', 
                desc: language === 'es' ? 'Propiedad legal de bienes raíces de lujo' : 'Legal ownership of luxury real estate',
                link: '/fractional'
              },
              { 
                title: language === 'es' ? 'Experiencias' : 'Experiences', 
                desc: language === 'es' ? 'Aventuras exclusivas en el Caribe' : 'Exclusive Caribbean adventures',
                link: '/experiences'
              },
              { 
                title: language === 'es' ? 'Rentas' : 'Rentals', 
                desc: language === 'es' ? 'Alquiler por temporada con servicio premium' : 'Seasonal rentals with premium service',
                link: '/fractional'
              },
              { 
                title: language === 'es' ? 'Concierge' : 'Concierge', 
                desc: language === 'es' ? 'Atención personalizada 24/7' : '24/7 personalized attention',
                link: '/experiences'
              },
            ].map((item, i) => (
              <Link key={i} href={item.link}>
                <div className="bg-stone-950 p-8 md:p-12 hover:bg-stone-900 transition-colors cursor-pointer h-full group" data-testid={`category-${i}`}>
                  <h3 className="text-xl font-light mb-3 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extralight text-stone-900 mb-6">
            {language === 'es' 
              ? '¿Listo para invertir en tu futuro?'
              : 'Ready to invest in your future?'}
          </h2>
          <p className="text-stone-500 mb-10 text-lg font-light">
            {language === 'es'
              ? 'Agenda una llamada con nuestro equipo para conocer las opciones disponibles.'
              : 'Schedule a call with our team to learn about available options.'}
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white text-sm tracking-wide uppercase font-medium hover:bg-stone-800 transition-colors"
            data-testid="button-contact"
          >
            {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-xl font-light text-stone-900 mb-2">FRACTIONAL LIVING</p>
              <p className="text-sm text-stone-500">All Global Holding LLC</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm text-stone-500">
              <Link href="/fractional"><span className="hover:text-stone-900 transition-colors cursor-pointer">{language === 'es' ? 'Propiedades' : 'Properties'}</span></Link>
              <Link href="/experiences"><span className="hover:text-stone-900 transition-colors cursor-pointer">{language === 'es' ? 'Experiencias' : 'Experiences'}</span></Link>
              <a href="https://wa.me/529984292748" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">{language === 'es' ? 'Contacto' : 'Contact'}</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-200">
            <p className="text-xs text-stone-400">
              © 2024 All Global Holding LLC. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
