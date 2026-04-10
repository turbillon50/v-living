import { useState, useRef, useCallback } from 'react';
import { Heart, Star, MapPin, ChevronLeft, ChevronRight, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { Property } from '@shared/schema';

interface PropertyCardCarouselProps {
  property: Property;
  featured?: boolean;
}

export function PropertyCardCarousel({ property, featured }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const images = property.images?.length > 0 ? property.images : [];
  const totalImages = images.length;

  const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < totalImages) setCurrentIndex(idx);
  }, [totalImages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex < totalImages - 1) goTo(currentIndex + 1);
      if (diff < 0 && currentIndex > 0) goTo(currentIndex - 1);
    }
    touchStartX.current = null;
  };

  return (
    <div className={`bg-white rounded-xl overflow-hidden border border-[#ebebeb] hover:shadow-lg transition-all group ${featured ? 'sm:col-span-2' : ''}`} data-testid={`property-card-${property.id}`}>
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {totalImages > 0 ? (
          <div className="relative w-full h-full">
            {images.map((img, idx) => (
              <Link key={idx} href={`/property/${property.id}`}>
                <img
                  src={img}
                  alt={`${property.title} ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 cursor-pointer ${idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            ))}
          </div>
        ) : (
          <Link href={`/property/${property.id}`}>
            <div className="w-full h-full bg-[#f7f7f7] flex items-center justify-center cursor-pointer">
              <Waves className="w-8 h-8 text-[#059669]/20" />
            </div>
          </Link>
        )}

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"
          aria-label="Guardar favorito"
          data-testid={`fav-${property.id}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-[#059669] text-[#059669]' : 'text-[#222]'}`} />
        </button>

        {property.tag && (
          <span className="absolute top-3 left-3 bg-white text-[#222] text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm z-10">
            {property.tag}
          </span>
        )}

        {totalImages > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex - 1); }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 ${currentIndex === 0 ? 'hidden' : ''}`}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4 text-[#222]" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex + 1); }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 ${currentIndex === totalImages - 1 ? 'hidden' : ''}`}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-4 h-4 text-[#222]" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.slice(0, Math.min(totalImages, 5)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-2' : 'bg-white/60'}`}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
              {totalImages > 5 && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              )}
            </div>
          </>
        )}
      </div>

      <Link href={`/property/${property.id}`}>
        <div className="p-4 cursor-pointer">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[#222] font-semibold text-sm truncate flex-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <Star className="w-3 h-3 fill-[#222] text-[#222]" />
              <span className="text-xs font-medium text-[#222]">{property.rating || '5.0'}</span>
            </div>
          </div>

          {property.location && (
            <p className="text-[#717171] text-xs flex items-center gap-1 mb-1">
              <MapPin className="w-2.5 h-2.5 text-[#059669]" />
              {property.location}
            </p>
          )}

          <div className="flex items-center gap-2 text-[11px] text-[#717171] mb-2">
            {property.sqMeters && <span>{property.sqMeters}m²</span>}
            {property.sqMeters && property.bedrooms && <span>·</span>}
            {property.bedrooms && <span>{property.bedrooms} rec</span>}
            {property.bathrooms && <span>·</span>}
            {property.bathrooms && <span>{property.bathrooms} baño</span>}
          </div>

          <p className="text-[#222] font-semibold">
            ${((property.fractionPrice || property.price || 250000) / 1000).toFixed(0)}K
            <span className="text-[#717171] font-normal text-xs ml-1">{property.currency || 'MXN'} / fracción</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
