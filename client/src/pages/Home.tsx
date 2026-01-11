import { useState } from 'react';
import { Map, LayoutGrid } from 'lucide-react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/SearchBar';
import { PropertyCard } from '@/components/PropertyCard';
import { properties } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between border-b border-border">
          <FilterBar />

          <div className="hidden md:flex items-center gap-2 py-4">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
              data-testid="button-view-grid"
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="gap-2"
              data-testid="button-view-map"
            >
              <Map className="w-4 h-4" />
              Map
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-240px)]">
              <div className="overflow-y-auto pr-4 space-y-6">
                {properties.slice(0, 8).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map view</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 All Living. Fractional ownership platform.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
