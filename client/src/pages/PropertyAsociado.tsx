import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Home, Building, Percent, Shield } from 'lucide-react';

export default function PropertyAsociado() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 pb-60">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-black rounded-full flex items-center justify-center">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium mb-2 bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
            Property Asociado
          </h1>
          <p className="text-sm text-muted-foreground">
            Integra tu propiedad al ecosistema Fractional Living
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Building className="w-6 h-6 text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Fraccionamiento</h3>
                <p className="text-sm text-muted-foreground">
                  Convierte tu propiedad en fracciones y genera liquidez inmediata
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Percent className="w-6 h-6 text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Rendimientos</h3>
                <p className="text-sm text-muted-foreground">
                  Obtén ingresos por la operación y renta de tu propiedad
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Seguridad Legal</h3>
                <p className="text-sm text-muted-foreground">
                  Estructura legal completa con fideicomiso bancario
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-gray-200 to-black rounded-2xl text-center">
          <p className="text-black font-medium mb-3">
            ¿Tienes una propiedad para integrar?
          </p>
          <Button
            className="bg-gradient-to-r from-black to-black"
            onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20quiero%20integrar%20mi%20propiedad', '_blank')}
          >
            Contactar Asesor
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
