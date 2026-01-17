import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50/30 pb-24">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {language === 'es' ? 'Bienvenido a' : 'Welcome to'}
          </h1>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
            FRACTIONAL LIVING
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === 'es' 
              ? 'Vive, invierte y construye patrimonio en el Caribe bajo un modelo fractional real, legal y heredable.'
              : 'Live, invest and build wealth in the Caribbean under a real, legal and inheritable fractional model.'}
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link href="/fractional">
            <Button size="lg" className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full">
              {language === 'es' ? 'Ver Fracciones' : 'View Fractions'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link href="/experiences">
            <Button size="lg" variant="outline" className="w-full gap-2 h-14 text-lg rounded-full">
              {language === 'es' ? 'Experiencias' : 'Experiences'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          <Button 
            size="lg" 
            variant="ghost" 
            className="w-full gap-2 h-14"
            onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20Fractional%20Living', '_blank')}
          >
            {language === 'es' ? 'Hablar con un Asesor' : 'Talk to an Advisor'}
          </Button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            All Global Holding LLC
          </p>
        </div>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
