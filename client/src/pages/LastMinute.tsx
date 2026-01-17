import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export default function LastMinute() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 pb-24">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Last Minute Capital
          </h1>
          <p className="text-sm text-muted-foreground">
            Programa diseñado para procesos de escrituración y adquisición inmobiliaria
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Oportunidades Exclusivas</h3>
                <p className="text-sm text-muted-foreground">
                  Accede a fracciones con condiciones especiales de financiamiento para cierre rápido
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <ArrowRight className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Proceso Acelerado</h3>
                <p className="text-sm text-muted-foreground">
                  Acompañamiento completo en escrituración y formalización legal
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl text-center">
          <p className="text-amber-800 font-medium mb-3">
            ¿Interesado en Last Minute Capital?
          </p>
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-600"
            onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Last%20Minute%20Capital', '_blank')}
          >
            Contactar Asesor
          </Button>
        </div>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
