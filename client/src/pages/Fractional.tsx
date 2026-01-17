import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, ChevronDown, ChevronUp, MapPin, Check, Calendar, Calculator, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProperties, createPreBooking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

function PaymentCalculator({ language, formatPrice }: { language: 'es' | 'en', formatPrice: (n: number) => string }) {
  const [months, setMonths] = useState(12);
  const totalPrice = 650000;
  const downPayment = totalPrice * 0.3;
  const remaining = totalPrice - downPayment;
  const monthlyPayment = remaining / months;

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-cyan-600" />
        <h3 className="font-medium text-cyan-800">
          {language === 'es' ? 'Calculadora de Pagos' : 'Payment Calculator'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="bg-white rounded-lg p-3">
          <p className="text-muted-foreground text-xs">{language === 'es' ? 'Precio Total' : 'Total Price'}</p>
          <p className="font-bold text-lg">{formatPrice(totalPrice)}</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-muted-foreground text-xs">{language === 'es' ? 'Enganche (30%)' : 'Down Payment (30%)'}</p>
          <p className="font-bold text-lg">{formatPrice(downPayment)}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-3">
        <p className="text-muted-foreground text-xs mb-2">{language === 'es' ? 'Meses a pagar' : 'Months to pay'}</p>
        <div className="flex gap-2 mb-2">
          {[6, 12, 18, 24].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={cn(
                "flex-1 py-1 rounded text-sm font-medium transition-all",
                months === m ? "bg-cyan-500 text-white" : "bg-muted"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">{language === 'es' ? 'Pago mensual' : 'Monthly payment'}</p>
          <p className="text-2xl font-bold text-cyan-600">{formatPrice(monthlyPayment)}</p>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
        <Calendar className="w-12 h-12 text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
      <img src={images[current]} alt="Property" className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => c === 0 ? images.length - 1 : c - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => c === images.length - 1 ? 0 : c + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div key={i} className={cn("w-2 h-2 rounded-full", i === current ? "bg-white" : "bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getWeekDates(weekNumber: number, lang: 'es' | 'en'): { start: string; end: string } {
  const year = 2026;
  const firstMonday = new Date(year, 0, 5);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }
  
  const startDate = new Date(firstMonday);
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = lang === 'es' ? monthsEs : monthsEn;
  
  return {
    start: `${startDate.getDate()} ${months[startDate.getMonth()]}`,
    end: `${endDate.getDate()} ${months[endDate.getMonth()]}`
  };
}

const getWeeks = (lang: 'es' | 'en') => Array.from({ length: 56 }, (_, i) => ({
  weekNumber: i + 1,
  ...getWeekDates(i + 1, lang)
}));

interface PropertyCardProps {
  property: any;
  isExpanded: boolean;
  onToggle: () => void;
}

function PropertyCard({ property, isExpanded, onToggle }: PropertyCardProps) {
  const { toast } = useToast();
  const { language, formatPrice, t } = useLanguage();
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [bookingType, setBookingType] = useState<'fraction' | 'vacation'>('fraction');
  const weeks = getWeeks(language);

  const sendWhatsAppAlert = (userEmail: string, weeksSelected: number[], type: 'fraction' | 'vacation') => {
    const weekDetails = weeksSelected.sort((a,b) => a-b).map(w => {
      const week = getWeekDates(w, language);
      return `${t('week')} ${w}: ${week.start} - ${week.end}`;
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
          <p className="text-lg font-semibold text-primary mt-1">{formatPrice(650000)}</p>
        </div>
        <div className="flex-shrink-0">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/30">
          <ImageGallery images={property.images || []} />
          
          <p className="text-sm text-muted-foreground mb-4">
            {property.description || (language === 'es' 
              ? 'Fracción inmobiliaria real, legal y heredable. Incluye 3 semanas de uso anual.' 
              : 'Real, legal and inheritable fractional property. Includes 3 weeks of annual use.')}
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
              💎 {t('buyFraction')}
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
              🏖️ {t('vacation')}
              <span className="absolute -top-2 -right-2 text-[9px] bg-amber-500 text-white px-1 py-0.5 rounded-full">{t('soon')}</span>
            </button>
          </div>

          {bookingType === 'vacation' && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 font-bold text-center text-sm">🚀 {t('launch')}</p>
              <p className="text-amber-700 text-xs text-center">{t('launchBonus')}</p>
            </div>
          )}

          {bookingType === 'fraction' && (
            <>
              <p className="text-sm font-medium mb-2">
                {t('selectWeeks')} ({selectedWeeks.length}/3)
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
                      const week = getWeekDates(w, language);
                      return `S${w}: ${week.start}`;
                    }).join(' • ')}
                  </p>
                </div>
              )}
            </>
          )}

          <Input
            type="email"
            placeholder={t('email')}
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
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {language === 'es' ? 'Enviando...' : 'Sending...'}</>
            ) : bookingType === 'fraction' ? (
              selectedWeeks.length === 3 
                ? (language === 'es' ? '¡Reservar Fracción!' : 'Reserve Fraction!') 
                : (language === 'es' ? `Selecciona ${3 - selectedWeeks.length} más` : `Select ${3 - selectedWeeks.length} more`)
            ) : (
              t('registerLaunch')
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Fractional() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { language, t, formatPrice } = useLanguage();
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const displayProperties = properties.length > 0 
    ? properties 
    : Array.from({ length: 30 }, (_, i) => ({
        id: `placeholder-${i}`,
        title: language === 'es' ? `Fracción ${i + 1}` : `Fraction ${i + 1}`,
        location: language === 'es' ? 'Caribe Mexicano' : 'Mexican Caribbean',
        description: '',
        images: [],
        category: 'Propiedades'
      }));
  
  const visibleProperties = showAll ? displayProperties : displayProperties.slice(0, 4);

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
            {language === 'es' ? 'Fracciones Disponibles' : 'Available Fractions'}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {t('realProperty')}
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {language === 'es' 
              ? 'Adquiere una fracción de propiedad en el Caribe. Cada fracción incluye 3 semanas de uso al año, escritura a tu nombre y es 100% heredable.'
              : 'Acquire a fraction of property in the Caribbean. Each fraction includes 3 weeks of use per year, deed in your name, and is 100% inheritable.'}
          </p>
        </div>

        <PaymentCalculator language={language} formatPrice={formatPrice} />

        <div className="space-y-4">
          {visibleProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isExpanded={expandedId === property.id}
              onToggle={() => setExpandedId(expandedId === property.id ? null : property.id)}
            />
          ))}
        </div>

        {!showAll && displayProperties.length > 4 && (
          <div className="mt-6 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 rounded-full"
              onClick={() => setShowAll(true)}
            >
              {language === 'es' ? `Explorar Más (${displayProperties.length - 4} más)` : `Explore More (${displayProperties.length - 4} more)`}
            </Button>
          </div>
        )}

        {showAll && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(false)}
            >
              {language === 'es' ? 'Ver menos' : 'Show less'}
            </Button>
          </div>
        )}
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
