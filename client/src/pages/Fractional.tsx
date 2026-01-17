import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { getProperties } from '@/lib/api';

export default function Fractional() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-4">Fracciones Disponibles</h1>
          <p className="text-muted-foreground max-w-2xl">
            Cada fracción representa un derecho inmobiliario real, legal y heredable. 
            Puedes ocuparla, rentarla o solicitar apoyo para su operación o reventa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link key={property.id} href={`/fractional/${property.id}`}>
              <div className="group cursor-pointer space-y-4 border border-border rounded-2xl p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  {property.images[0] ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tight group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{property.location}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-semibold">$650,000 MXN</span>
                    <span className="text-xs text-muted-foreground">14 fracciones</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-2xl border border-border">
          <p className="text-center text-muted-foreground">
            💡 Pregunta por nuestra campaña de <strong>Last Minute Capital</strong>, 
            diseñada para procesos de escrituración y adquisición inmobiliaria.
          </p>
        </div>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
