import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ChevronLeft, Share, Heart, Star, MapPin, Bed, Bath, Maximize, Grid3X3, Calendar, Users, Shield, Award } from 'lucide-react';
import { Header } from '@/components/Header';
import { FractionSelector } from '@/components/FractionSelector';
import { SeasonBadge } from '@/components/SeasonBadge';
import { getPropertyById, formatPrice, Property } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = getPropertyById(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-12">
          <p className="text-center text-muted-foreground">Property not found</p>
          <Link href="/">
            <Button variant="outline" className="mx-auto mt-4 block">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" data-testid="link-back">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-2">
                <ChevronLeft className="w-4 h-4" />
                Back to explore
              </span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold" data-testid="text-property-title">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4" />
                {property.location}, {property.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-share">
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsFavorite(!isFavorite)}
              data-testid="button-save"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8">
          <div className="md:col-span-2 md:row-span-2">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover aspect-[4/3] md:aspect-auto cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setSelectedImageIndex(0)}
            />
          </div>
          {property.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="hidden md:block">
              <img
                src={img}
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover aspect-[4/3] cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setSelectedImageIndex(idx + 1)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-medium">{property.propertyType} Property</span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Bed className="w-4 h-4" /> {property.bedrooms} bedrooms
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Bath className="w-4 h-4" /> {property.bathrooms} baths
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Maximize className="w-4 h-4" /> {property.sqft.toLocaleString()} sqft
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About this property</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                {property.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Ownership Structure</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Grid3X3 className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">{property.totalFractions} Fractions</p>
                  <p className="text-sm text-muted-foreground">Total units</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">3 Weeks</p>
                  <p className="text-sm text-muted-foreground">Per fraction/year</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">{property.availableFractions} Available</p>
                  <p className="text-sm text-muted-foreground">Fractions left</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Shield className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">Deeded</p>
                  <p className="text-sm text-muted-foreground">Ownership type</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Season Classification</h2>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <SeasonBadge season="high" />
                  <span className="text-sm text-muted-foreground">Peak demand periods</span>
                </div>
                <div className="flex items-center gap-3">
                  <SeasonBadge season="mid" />
                  <span className="text-sm text-muted-foreground">Shoulder season</span>
                </div>
                <div className="flex items-center gap-3">
                  <SeasonBadge season="low" />
                  <span className="text-sm text-muted-foreground">Off-peak periods</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-muted-foreground" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl font-semibold">{formatPrice(property.startingPrice)}</span>
                <span className="text-muted-foreground">starting price</span>
              </div>

              <FractionSelector property={property} />

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ownership percentage</span>
                  <span className="font-medium">{(100 / property.totalFractions).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Usage weeks per year</span>
                  <span className="font-medium">3 weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available fractions</span>
                  <span className="font-medium">{property.availableFractions} of {property.totalFractions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
