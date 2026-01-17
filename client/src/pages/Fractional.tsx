import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, ChevronDown, ChevronUp, MapPin, Check, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProperties, createPreBooking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function getWeekDates(weekNumber: number): { start: string; end: string } {
  const year = 2026;
  const firstMonday = new Date(year, 0, 5);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }
  
  const startDate = new Date(firstMonday);
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return {
    start: `${startDate.getDate()} ${months[startDate.getMonth()]}`,
    end: `${endDate.getDate()} ${months[endDate.getMonth()]}`
  };
}

const weeks = Array.from({ length: 56 }, (_, i) => ({
  weekNumber: i + 1,
  ...getWeekDates(i + 1)
}));

interface PropertyCardProps {
  property: any;
  isExpanded: boolean;
  onToggle: () => void;
}

function PropertyCard({ property, isExpanded, onToggle }: PropertyCardProps) {
  const { toast } = useToast();
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [bookingType, setBookingType] = useState<'fraction' | 'vacation'>('fraction');

  const sendWhatsAppAlert = (userEmail: string, weeksSelected: number[], type: 'fraction' | 'vacation') => {
    const weekDetails = weeksSelected.sort((a,b) => a-b).map(w => {
      const week = getWeekDates(w);
      return `Semana ${w}: ${week.start} - ${week.end}`;
    }).join('\n');
    
    const typeLabel = type === 'fraction' ? '💎 COMPRA DE FRACCIÓN' : '🏖️ RESERVA VACACIONAL';
    const message = `🔔 NUEVA SOLICITUD\n\n${typeLabel}\n\nEmail: ${userEmail}\nPropiedad: ${property?.title || 'Fracción'}\n\nSemanas:\n${weekDetails}\n\n¡Contactar!`;
    
    const whatsappUrl = `https://wa.me/529984292748?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const bookingMutation = useMutation({
    mutationFn: createPreBooking,
    onSuccess: () => {
      toast({ title: '¡Registrado!', description: 'Un asesor te contactará pronto' });
      sendWhatsAppAlert(email, selectedWeeks, bookingType);
      setSelectedWeeks([]);
      setEmail('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Intenta de nuevo', variant: 'destructive' });
    }
  });

  const handleWeekToggle = (weekNumber: number) => {
    if (bookingType === 'fraction') {
      setSelectedWeeks(prev => 
        prev.includes(weekNumber) 
          ? prev.filter(w => w !== weekNumber)
          : prev.length < 3 ? [...prev, weekNumber] : prev
      );
    } else {
      setSelectedWeeks(prev => 
        prev.includes(weekNumber) 
          ? prev.filter(w => w !== weekNumber)
          : [...prev, weekNumber]
      );
    }
  };

  const handleSubmit = () => {
    if (!email) {
      toast({ title: 'Ingresa tu email', variant: 'destructive' });
      return;
    }
    if (bookingType === 'fraction' && selectedWeeks.length !== 3) {
      toast({ title: 'Selecciona 3 semanas', variant: 'destructive' });
      return;
    }
    if (bookingType === 'vacation') {
      sendWhatsAppAlert(email, selectedWeeks, bookingType);
      toast({ title: '¡Registrado para lanzamiento!' });
      return;
    }

    bookingMutation.mutate({
      propertyId: property.id,
      email,
      selectedWeeks,
      bookingType
    });
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer flex items-center gap-4"
      >
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <Calendar className="w-8 h-8 text-cyan-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg truncate">{property.title || 'Fracción Disponible'}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {property.location || 'Caribe Mexicano'}
          </p>
          <p className="text-lg font-semibold text-primary mt-1">$650,000 MXN</p>
        </div>
        <div className="flex-shrink-0">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground mb-4">
            {property.description || 'Fracción inmobiliaria real, legal y heredable. Incluye 3 semanas de uso anual.'}
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setBookingType('fraction'); setSelectedWeeks([]); }}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                bookingType === 'fraction' 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" 
                  : "bg-white text-muted-foreground border border-border"
              )}
            >
              💎 Comprar Fracción
            </button>
            <button
              onClick={() => { setBookingType('vacation'); setSelectedWeeks([]); }}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative",
                bookingType === 'vacation' 
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" 
                  : "bg-white text-muted-foreground border border-border"
              )}
            >
              🏖️ Vacacionar
              <span className="absolute -top-2 -right-2 text-[9px] bg-amber-500 text-white px-1 py-0.5 rounded-full">Pronto</span>
            </button>
          </div>

          {bookingType === 'vacation' && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 font-bold text-center text-sm">🚀 Lanzamiento: 21 de Marzo</p>
              <p className="text-amber-700 text-xs text-center">Regístrate para bonos exclusivos</p>
            </div>
          )}

          {bookingType === 'fraction' && (
            <>
              <p className="text-sm font-medium mb-2">
                Selecciona 3 semanas ({selectedWeeks.length}/3)
              </p>
              <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto mb-4">
                {weeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => handleWeekToggle(week.weekNumber)}
                    className={cn(
                      "p-2 rounded text-xs transition-all",
                      selectedWeeks.includes(week.weekNumber)
                        ? "bg-cyan-500 text-white"
                        : "bg-white border border-border hover:border-cyan-300"
                    )}
                  >
                    <span className="font-medium">S{week.weekNumber}</span>
                    <span className="block text-[10px] opacity-80">{week.start}</span>
                  </button>
                ))}
              </div>

              {selectedWeeks.length > 0 && (
                <div className="mb-4 p-2 bg-cyan-50 rounded-lg">
                  <p className="text-xs text-cyan-700">
                    {selectedWeeks.sort((a,b) => a-b).map(w => {
                      const week = getWeekDates(w);
                      return `S${w}: ${week.start}`;
                    }).join(' • ')}
                  </p>
                </div>
              )}
            </>
          )}

          <Input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3"
          />

          <Button
            onClick={handleSubmit}
            disabled={bookingMutation.isPending || (bookingType === 'fraction' && selectedWeeks.length !== 3)}
            className={cn(
              "w-full",
              bookingType === 'fraction' 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600" 
                : "bg-gradient-to-r from-amber-500 to-orange-600"
            )}
          >
            {bookingMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
            ) : bookingType === 'fraction' ? (
              selectedWeeks.length === 3 ? '¡Reservar Fracción!' : `Selecciona ${3 - selectedWeeks.length} más`
            ) : (
              '¡Registrarme para Lanzamiento!'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Fractional() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const displayProperties = properties.length > 0 
    ? properties 
    : Array.from({ length: 10 }, (_, i) => ({
        id: `placeholder-${i}`,
        title: `Fracción ${i + 1}`,
        location: 'Caribe Mexicano',
        description: '',
        images: [],
        category: 'Propiedades'
      }));

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
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50/30 pb-24">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Fracciones Disponibles
          </h1>
          <p className="text-sm text-muted-foreground">
            Propiedad real, legal y heredable en el Caribe
          </p>
        </div>

        <div className="space-y-4">
          {displayProperties.slice(0, 10).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isExpanded={expandedId === property.id}
              onToggle={() => setExpandedId(expandedId === property.id ? null : property.id)}
            />
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl text-center">
          <p className="text-sm text-cyan-800">
            💡 ¿Tienes preguntas? Contacta a un asesor por WhatsApp
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => window.open('https://wa.me/529984292748', '_blank')}
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
