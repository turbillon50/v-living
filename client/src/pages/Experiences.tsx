import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

const experienceCategories = [
  { id: 1, title: 'Renta de Autos de Lujo', description: 'Vehículos premium para tu experiencia' },
  { id: 2, title: 'Yates y Embarcaciones', description: 'Navegación exclusiva en el Caribe' },
  { id: 3, title: 'Restaurantes Selectos', description: 'Gastronomía de clase mundial' },
  { id: 4, title: 'Eventos Privados', description: 'Celebraciones únicas y memorables' },
  { id: 5, title: 'Conserjería 24/7', description: 'Asistencia personalizada en todo momento' },
  { id: 6, title: 'Choferes Privados', description: 'Transporte ejecutivo y discreto' },
  { id: 7, title: 'Servicios de Niñeras', description: 'Cuidado profesional para los más pequeños' },
  { id: 8, title: 'Experiencias Privadas', description: 'Aventuras exclusivas diseñadas para ti' },
];

export default function Experiences() {
  return (
    <div className="min-h-screen bg-background pb-40">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-4">Experiencias</h1>
          <p className="text-muted-foreground max-w-2xl">
            Todas las experiencias de lujo a tu alcance: renta de autos, yates, restaurantes, 
            eventos, conserjería 24/7, choferes, niñeras, experiencias privadas y beneficios exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experienceCategories.map((exp) => (
            <div 
              key={exp.id} 
              className="group cursor-pointer border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-primary/50"
            >
              <div className="aspect-square rounded-xl bg-muted mb-4 flex items-center justify-center text-muted-foreground text-sm">
                Imagen editable
              </div>
              <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                {exp.title}
              </h3>
              <p className="text-sm text-muted-foreground">{exp.description}</p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
