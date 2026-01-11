import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, formatPrice } from '@/lib/mockData';
import { SeasonBadge } from '@/components/SeasonBadge';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const dominantSeason = property.fractions[0]?.usageWeeks[0]?.season || 'mid';

  return (
    <Link href={`/property/${property.id}`} data-testid={`card-property-${property.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
          <img
            src={property.images[currentImage]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            data-testid={`button-favorite-${property.id}`}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-foreground/70'}`}
            />
          </button>

          {property.images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                data-testid={`button-prev-image-${property.id}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                data-testid={`button-next-image-${property.id}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImage ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>

          <div className="absolute top-3 left-3">
            <SeasonBadge season={dominantSeason} size="sm" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-1" data-testid={`text-title-${property.id}`}>
              {property.location}, {property.country}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1" data-testid={`text-type-${property.id}`}>
            {property.title}
          </p>
          <p className="text-sm text-muted-foreground" data-testid={`text-fractions-${property.id}`}>
            <span className="font-medium text-foreground">{property.availableFractions}</span> of {property.totalFractions} fractions available
          </p>
          <p className="text-sm" data-testid={`text-price-${property.id}`}>
            <span className="font-semibold">{formatPrice(property.startingPrice)}</span>
            <span className="text-muted-foreground"> starting</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
