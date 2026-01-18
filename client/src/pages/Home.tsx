import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { Property } from '@shared/schema';
import { ChevronRight, Star, MapPin, Bed, Bath, Users } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Home() {
  const { language } = useLanguage();
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Logo */}
          <div className="mb-10">
            <img 
              src={logoImg} 
              alt="Fractional Living" 
              className="h-36 md:h-48 w-auto mx-auto"
              data-testid="hero-logo"
            />
          </div>
          
          <p className="text-lg md:text-xl text-stone-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            {language === 'es' 
              ? 'Propiedad fraccionada de lujo en el Caribe. Vive, invierte y construye patrimonio con 3 semanas de uso anual.'
              : 'Luxury fractional ownership in the Caribbean. Live, invest, and build wealth with 3 weeks of annual use.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fractional">
              <span className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d3a3a] text-white text-sm tracking-wide hover:bg-[#3d4a4a] transition-colors cursor-pointer" data-testid="button-explore">
                {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            <a 
              href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-stone-300 text-stone-700 text-sm tracking-wide hover:border-[#4db6ac] transition-colors"
              data-testid="button-contact"
            >
              {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#f8f7f4] border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$65K', label: language === 'es' ? 'Por fracción' : 'Per fraction' },
              { value: '3', label: language === 'es' ? 'Semanas/año' : 'Weeks/year' },
              { value: '100%', label: language === 'es' ? 'Legal' : 'Legal' },
              { value: '∞', label: language === 'es' ? 'Heredable' : 'Inheritable' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-light text-[#2d3a3a] mb-1">{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm text-[#4db6ac] uppercase tracking-widest mb-2">
                {language === 'es' ? 'Portafolio' : 'Portfolio'}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[#2d3a3a]">
                {language === 'es' ? 'Propiedades Disponibles' : 'Available Properties'}
              </h2>
            </div>
            <Link href="/fractional">
              <span className="text-sm text-stone-500 hover:text-[#4db6ac] transition-colors flex items-center gap-1 cursor-pointer" data-testid="link-view-all">
                {language === 'es' ? 'Ver todas' : 'View all'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <article className="group cursor-pointer bg-[#f8f7f4] border border-stone-200 hover:border-[#4db6ac] transition-all" data-testid={`card-property-${property.id}`}>
                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                          <span className="text-5xl font-light text-stone-300">
                            {property.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-medium text-[#2d3a3a] group-hover:text-[#4db6ac] transition-colors">
                          {property.title}
                        </h3>
                        {property.rating && (
                          <div className="flex items-center gap-1 text-sm text-stone-600">
                            <Star className="w-3.5 h-3.5 fill-[#4db6ac] text-[#4db6ac]" />
                            <span>{property.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="flex items-center gap-1 text-sm text-stone-500 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.location}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {property.bathrooms}
                          </span>
                        )}
                        {property.maxGuests && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {property.maxGuests}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-stone-200">
                        <span className="text-lg font-medium text-[#2d3a3a]">
                          ${(property.fractionPrice || 65000).toLocaleString()}
                        </span>
                        <span className="text-stone-500 text-sm"> / {language === 'es' ? 'fracción' : 'fraction'}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-500">
              <p>{language === 'es' ? 'Próximamente más propiedades' : 'More properties coming soon'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#2d3a3a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-[#4db6ac] uppercase tracking-widest mb-2">
            {language === 'es' ? 'Servicios' : 'Services'}
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-12">
            {language === 'es' ? 'Más que propiedad' : 'More than property'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                desc: language === 'es' ? 'Alquiler por temporada' : 'Seasonal rentals',
                link: '/fractional'
              },
              { 
                title: language === 'es' ? 'Concierge' : 'Concierge', 
                desc: language === 'es' ? 'Atención 24/7' : '24/7 attention',
                link: '/experiences'
              },
            ].map((item, i) => (
              <Link key={i} href={item.link}>
                <div className="border border-white/20 p-6 hover:border-[#4db6ac] hover:bg-white/5 transition-all cursor-pointer h-full" data-testid={`service-${i}`}>
                  <h3 className="text-lg font-medium mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#2d3a3a] mb-4">
            {language === 'es' 
              ? '¿Listo para invertir en tu futuro?'
              : 'Ready to invest in your future?'}
          </h2>
          <p className="text-stone-500 mb-8 font-light">
            {language === 'es'
              ? 'Agenda una llamada con nuestro equipo.'
              : 'Schedule a call with our team.'}
          </p>
          <a 
            href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d3a3a] text-white text-sm tracking-wide hover:bg-[#3d4a4a] transition-colors"
            data-testid="cta-contact"
          >
            {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#f8f7f4] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <img src={logoImg} alt="Fractional Living" className="h-12 w-auto mb-2" />
              <p className="text-sm text-stone-500">All Global Holding LLC</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm text-stone-500">
              <Link href="/fractional"><span className="hover:text-[#4db6ac] transition-colors cursor-pointer">{language === 'es' ? 'Propiedades' : 'Properties'}</span></Link>
              <Link href="/experiences"><span className="hover:text-[#4db6ac] transition-colors cursor-pointer">{language === 'es' ? 'Experiencias' : 'Experiences'}</span></Link>
              <a href="https://wa.me/529984292748" target="_blank" rel="noopener noreferrer" className="hover:text-[#4db6ac] transition-colors">{language === 'es' ? 'Contacto' : 'Contact'}</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-400">
              © 2024 All Global Holding LLC. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
