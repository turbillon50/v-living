import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { User, Star, Gift, TrendingUp } from 'lucide-react';

export default function PerfilAsociado() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30 pb-24">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Perfil Asociado
          </h1>
          <p className="text-sm text-muted-foreground">
            Únete a nuestra red de asociados y genera ingresos
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Star className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Programa de Referidos</h3>
                <p className="text-sm text-muted-foreground">
                  Gana comisiones por cada fracción vendida a través de tu referencia
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <Gift className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Beneficios Exclusivos</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso a eventos, capacitaciones y material de ventas
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Crecimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Construye tu red y escala tus ingresos pasivos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl text-center">
          <p className="text-purple-800 font-medium mb-3">
            ¿Quieres ser asociado?
          </p>
          <Button
            className="bg-gradient-to-r from-purple-500 to-indigo-600"
            onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20quiero%20ser%20asociado', '_blank')}
          >
            Aplicar Ahora
          </Button>
        </div>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
