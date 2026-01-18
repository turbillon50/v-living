import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Loader2, MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight, Search, Heart, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Input } from '@/components/ui/input';
import { getProperties } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

function PropertyCard({ property }: { property: Property }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const { formatPrice } = useLanguage();
  const images = property.images?.filter(Boolean) || [];
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(c => (c + 1) % images.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(c => c === 0 ? images.length - 1 : c - 1);
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Link href={`/property/${property.id}`}>
      <div className="group cursor-pointer" data-testid={`property-card-${property.id}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          {images.length > 0 ? (
            <img 
              src={images[currentImage]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-300 text-6xl">🏠</div>
            </div>
          )}
          
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 z-10"
            data-testid={`like-btn-${property.id}`}
          >
            <Heart 
              className={cn(
                "w-6 h-6 drop-shadow-md transition-all",
                liked ? "fill-red-500 text-red-500" : "text-white fill-black/20 hover:scale-110"
              )} 
            />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
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
        
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-[15px] text-gray-900 leading-tight">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-sm">5.0</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-[15px]">{property.location}</p>
          
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            {property.bedrooms && (
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'hab' : 'habs'}</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</span>
            )}
            {property.maxGuests && (
              <span>{property.maxGuests} huéspedes</span>
            )}
          </div>
          
          <div className="pt-1">
            <span className="font-semibold text-gray-900">
              {formatPrice(property.price || 650000)}
            </span>
            <span className="text-gray-500 text-[15px]"> fracción</span>
          </div>
        </div>
      </div>
    </Link>
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

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const fractionalProperties = properties.filter(p => p.category === 'Propiedades' || p.category === 'fractional');
  
  const filteredProperties = fractionalProperties.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <main className="max-w-[2520px] mx-auto px-6 sm:px-8 md:px-10 lg:px-20 pt-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'es' ? 'Buscar propiedades...' : 'Search properties...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              data-testid="search-input"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {language === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
