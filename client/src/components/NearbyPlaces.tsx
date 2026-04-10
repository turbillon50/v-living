import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Utensils, Waves, Hospital, ShoppingCart, GraduationCap, Clapperboard, Bus,
  Star, MapPin, ChevronRight, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NearbyPlace {
  name: string;
  category: string;
  distance: number;
  rating: number | null;
  lat: number;
  lon: number;
}

interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
  propertyTitle?: string;
}

const CATEGORIES = [
  { key: 'restaurant', label: 'Restaurantes', icon: Utensils, color: 'bg-orange-50 text-orange-600', emoji: '🍽️' },
  { key: 'beach', label: 'Playas', icon: Waves, color: 'bg-cyan-50 text-cyan-600', emoji: '🏖️' },
  { key: 'hospital', label: 'Hospitales', icon: Hospital, color: 'bg-red-50 text-red-600', emoji: '🏥' },
  { key: 'supermarket', label: 'Supermercados', icon: ShoppingCart, color: 'bg-green-50 text-green-600', emoji: '🛒' },
  { key: 'school', label: 'Escuelas', icon: GraduationCap, color: 'bg-purple-50 text-purple-600', emoji: '🎓' },
  { key: 'entertainment', label: 'Entretenimiento', icon: Clapperboard, color: 'bg-pink-50 text-pink-600', emoji: '🎭' },
  { key: 'transport', label: 'Transporte', icon: Bus, color: 'bg-blue-50 text-blue-600', emoji: '🚌' },
];

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function NearbyPlaces({ latitude, longitude, propertyTitle }: NearbyPlacesProps) {
  const [activeCategory, setActiveCategory] = useState('restaurant');

  const { data: places = [], isLoading } = useQuery<NearbyPlace[]>({
    queryKey: ['nearby-places', latitude, longitude, activeCategory],
    queryFn: async () => {
      const res = await fetch(`/api/nearby-places?lat=${latitude}&lng=${longitude}&category=${activeCategory}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!;

  return (
    <div data-testid="nearby-places-section">
      <h2
        className="text-lg mb-2 text-[#111]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}
      >
        Qué hay cerca
      </h2>
      <p className="text-sm text-[#888] font-light mb-5">
        Lugares de interés alrededor de esta propiedad
      </p>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 border',
                isActive
                  ? 'bg-[#0a1628] text-white border-[#0a1628] shadow-sm'
                  : 'bg-white text-[#555] border-[#e2e8f0] hover:border-[#94a3b8] hover:bg-[#fafafa]'
              )}
              data-testid={`category-${cat.key}`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#0891b2]" />
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 bg-[#fafafa] rounded-2xl">
          <activeCat.icon className="w-10 h-10 mx-auto mb-3 text-[#ccc]" />
          <p className="text-[#888] font-light text-sm">
            No se encontraron {activeCat.label.toLowerCase()} cercanos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {places.slice(0, 8).map((place, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#f0f0f0] hover:border-[#e2e8f0] hover:shadow-sm transition-all duration-200"
              data-testid={`nearby-place-${i}`}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', activeCat.color)}>
                <activeCat.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#222] truncate">{place.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#888] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {formatDistance(place.distance)}
                  </span>
                  {place.rating && place.rating > 0 && (
                    <span className="text-xs text-[#888] flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {place.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
