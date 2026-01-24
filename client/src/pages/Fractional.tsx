import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, MapPin, Star, Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { getProperties } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

import type { Property } from '@shared/schema';

function PropertyCard({ property }: { property: Property }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const { language } = useLanguage();
  const images = property.images?.filter(Boolean) || [];
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImage(c => (c + 1) % images.length);
    }
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImage(c => c === 0 ? images.length - 1 : c - 1);
    }
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Link href={`/property/${property.id}`}>
      <article className="group cursor-pointer" data-testid={`property-card-${property.id}`}>
        <div className="relative aspect-[4/3] bg-stone-100 mb-4 overflow-hidden">
          {images.length > 0 ? (
            <img 
              src={images[currentImage]} 
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <span className="text-5xl font-extralight text-stone-400">
                {property.title.charAt(0)}
              </span>
            </div>
          )}
          
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 z-10 p-2"
            data-testid={`like-btn-${property.id}`}
          >
            <Heart 
              className={cn(
                "w-5 h-5 drop-shadow-md transition-all",
                liked ? "fill-red-500 text-red-500" : "text-white fill-black/30 hover:scale-110"
              )} 
            />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`prev-img-${property.id}`}
              >
                <ChevronLeft className="w-4 h-4 text-stone-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`next-img-${property.id}`}
              >
                <ChevronRight className="w-4 h-4 text-stone-700" />
              </button>
              
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.slice(0, 5).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === currentImage ? "bg-white" : "bg-white/50"
                    )} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
              {property.title}
            </h3>
            {property.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                <span className="text-sm text-stone-900">{property.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-stone-500 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {property.location}
          </p>
          
          <div className="flex items-center gap-3 text-stone-500 text-sm">
            {property.bedrooms && (
              <span>{property.bedrooms} {language === 'es' ? 'hab' : 'bed'}</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} {language === 'es' ? 'baño' : 'bath'}</span>
            )}
            {property.maxGuests && (
              <span>{property.maxGuests} {language === 'es' ? 'huésp' : 'guests'}</span>
            )}
          </div>
          
          <div className="pt-1">
            <span className="font-medium text-stone-900">
              ${(property.fractionPrice || property.price || 650000).toLocaleString()}
            </span>
            <span className="text-stone-500 text-sm"> / {language === 'es' ? 'fracción' : 'fraction'}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Fractional() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const categories = [
    { id: 'all', label: language === 'es' ? 'Todas' : 'All' },
    { id: 'fractional', label: language === 'es' ? 'Fracciones' : 'Fractions' },
    { id: 'Propiedades', label: language === 'es' ? 'Propiedades' : 'Properties' },
    { id: 'Yachts', label: 'Yachts' },
  ];

  const attikOnly = properties.filter(p => p.title?.includes('ATTIK'));
  
  const filteredProperties = attikOnly.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder={language === 'es' ? 'Buscar propiedades...' : 'Search properties...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                data-testid="search-input"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    activeCategory === cat.id 
                      ? "bg-stone-900 text-white" 
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                  data-testid={`filter-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            {language === 'es' ? 'Propiedades disponibles' : 'Available properties'}
          </h1>
          <p className="text-stone-500">
            {filteredProperties.length} {language === 'es' ? 'propiedades encontradas' : 'properties found'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">
              {language === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
            </p>
            <p className="text-stone-400 text-sm mt-2">
              {language === 'es' ? 'Prueba con otros filtros' : 'Try different filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-100 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-lg font-light text-stone-900">FRACTIONAL LIVING</p>
              <p className="text-sm text-stone-500">All Global Holding LLC</p>
            </div>
            <div className="flex gap-6 text-sm text-stone-500">
              <Link href="/"><span className="hover:text-stone-900 transition-colors cursor-pointer">{language === 'es' ? 'Inicio' : 'Home'}</span></Link>
              <Link href="/experiences"><span className="hover:text-stone-900 transition-colors cursor-pointer">{language === 'es' ? 'Experiencias' : 'Experiences'}</span></Link>
              <a href="https://wa.me/529984292748" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">{language === 'es' ? 'Contacto' : 'Contact'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
