import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Input } from '@/components/ui/input';
import { getProperties } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
        <div className="text-cyan-500 text-4xl">🏠</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group">
      <img src={images[current]} alt="Property" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(c => c === 0 ? images.length - 1 : c - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(c => c === images.length - 1 ? 0 : c + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === current ? "bg-white w-3" : "bg-white/60")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface Property {
  id: string;
  title: string;
  location: string;
  description: string;
  images: string[];
  category: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  amenities: string[] | null;
}

export default function Fractional() {
  const { language, formatPrice } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const fractionalProperties = properties.filter(p => p.category === 'Propiedades' || p.category === 'fractional');
  
  const filteredProperties = fractionalProperties.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedProperties = showAll ? filteredProperties : filteredProperties.slice(0, 6);

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            {language === 'es' ? 'Fracciones Disponibles' : 'Available Fractions'}
          </h1>
          <p className="text-slate-500">
            {language === 'es' 
              ? 'Propiedades fraccionadas reales, legales y heredables en el Caribe mexicano'
              : 'Real, legal and inheritable fractional properties in the Mexican Caribbean'}
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder={language === 'es' ? 'Buscar por nombre o ubicación...' : 'Search by name or location...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full border-slate-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">{language === 'es' ? 'No se encontraron propiedades' : 'No properties found'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="group cursor-pointer">
                    <ImageGallery images={property.images || []} />
                    
                    <div className="mt-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-lg leading-tight group-hover:text-cyan-600 transition-colors">
                          {property.title}
                        </h3>
                      </div>
                      
                      <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.location}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                        {(property.bedrooms ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {property.bedrooms}
                          </span>
                        )}
                        {(property.bathrooms ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {property.bathrooms}
                          </span>
                        )}
                        {(property.maxGuests ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {property.maxGuests}
                          </span>
                        )}
                      </div>

                      <p className="mt-2">
                        <span className="font-semibold text-lg">{formatPrice(property.price || 650000)}</span>
                        <span className="text-slate-500 text-sm ml-1">
                          {language === 'es' ? 'por fracción' : 'per fraction'}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProperties.length > 6 && !showAll && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                >
                  {language === 'es' ? `Ver todas (${filteredProperties.length})` : `Show all (${filteredProperties.length})`}
                </button>
              </div>
            )}

            {showAll && filteredProperties.length > 6 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(false)}
                  className="text-slate-500 hover:text-slate-800 text-sm"
                >
                  {language === 'es' ? 'Ver menos' : 'Show less'}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-semibold mb-3">
            {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
          </h2>
          <p className="opacity-90 mb-6">
            {language === 'es' 
              ? 'Nuestros asesores están listos para ayudarte a encontrar la fracción perfecta para ti.'
              : 'Our advisors are ready to help you find the perfect fraction for you.'}
          </p>
          <button
            onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20me%20interesan%20las%20fracciones', '_blank')}
            className="px-6 py-3 bg-white text-cyan-600 rounded-full font-medium hover:bg-slate-100 transition-colors"
          >
            {language === 'es' ? 'Hablar con un asesor' : 'Talk to an advisor'}
          </button>
        </div>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
