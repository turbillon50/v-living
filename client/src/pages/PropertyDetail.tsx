import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { ChevronLeft, Share, Check, Calendar as CalendarIcon, Loader2, Calculator, Lock, Unlock, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPropertyById, getBookedWeeks, createPreBooking } from '@/lib/api';
import { FloatingButtons } from '@/components/FloatingButtons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FRACTION_PRICE = 650000;
const CREATOR_PASSWORD = 'lumamijuvisado';
const BASE_YEAR = 2026;

function getWeekDates(weekNumber: number, year: number = BASE_YEAR) {
  const janFirst = new Date(year, 0, 1);
  const dayOfWeek = janFirst.getDay();
  const daysToFirstMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek);
  
  const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${months[date.getMonth()]}`;
  };
  
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
    startDate: weekStart,
    endDate: weekEnd
  };
}

function FinancialCalculator() {
  const [downPayment, setDownPayment] = useState(20);
  const [term, setTerm] = useState<12 | 24 | 36>(12);

  const rates = { 12: 0, 24: 6, 36: 9 };
  const downPaymentAmount = (FRACTION_PRICE * downPayment) / 100;
  const financeAmount = FRACTION_PRICE - downPaymentAmount;
  const annualRate = rates[term] / 100;
  const monthlyRate = annualRate / 12;
  
  const monthlyPayment = monthlyRate === 0 
    ? financeAmount / term 
    : (financeAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);

  return (
    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h4 className="font-medium">Calculadora Financiera</h4>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Enganche: {downPayment}% (${downPaymentAmount.toLocaleString()} MXN)
        </label>
        <input
          type="range"
          min="10"
          max="30"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {([12, 24, 36] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTerm(t)}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-colors",
              term === t 
                ? "bg-primary text-primary-foreground" 
                : "bg-white border border-border hover:bg-muted"
            )}
          >
            {t} meses {rates[t] > 0 && `(${rates[t]}%)`}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">Pago mensual estimado:</p>
        <p className="text-2xl font-semibold text-primary">
          ${Math.round(monthlyPayment).toLocaleString()} MXN
        </p>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [showCreatorDialog, setShowCreatorDialog] = useState(false);
  const [creatorPassword, setCreatorPassword] = useState('');
  const [blockedWeeks, setBlockedWeeks] = useState<number[]>([]);
  const [selectedWeekDetail, setSelectedWeekDetail] = useState<number | null>(null);

  // Fetch property
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id!),
    enabled: !!id,
  });

  // Fetch booked weeks
  const { data: bookedWeeks = [] } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBookedWeeks(id!),
    enabled: !!id,
  });

  // Generate weeks with availability and dates (56 weeks)
  const weeks = useMemo(() => {
    return Array.from({ length: 56 }, (_, i) => {
      const weekNum = i + 1;
      const dates = getWeekDates(weekNum);
      return {
        weekNumber: weekNum,
        available: !bookedWeeks.includes(weekNum) && !blockedWeeks.includes(weekNum),
        isBlocked: blockedWeeks.includes(weekNum),
        isBooked: bookedWeeks.includes(weekNum),
        ...dates
      };
    });
  }, [bookedWeeks, blockedWeeks]);

  const handleCreatorAccess = () => {
    if (isCreatorMode) {
      setIsCreatorMode(false);
      return;
    }
    setShowCreatorDialog(true);
  };

  const verifyCreatorPassword = () => {
    if (creatorPassword === CREATOR_PASSWORD) {
      setIsCreatorMode(true);
      setShowCreatorDialog(false);
      setCreatorPassword('');
      toast({ title: "Modo Creador activado", description: "Ahora puedes bloquear semanas" });
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive" });
    }
  };

  const toggleBlockWeek = (weekNumber: number) => {
    setBlockedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  // Pre-booking mutation
  const bookingMutation = useMutation({
    mutationFn: createPreBooking,
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create pre-booking",
        variant: "destructive"
      });
    }
  });

  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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

  const toggleWeek = (weekNum: number) => {
    if (selectedWeeks.includes(weekNum)) {
      setSelectedWeeks(selectedWeeks.filter(w => w !== weekNum));
    } else {
      if (selectedWeeks.length >= 3) {
        toast({
          title: "Limit Reached",
          description: "You must select exactly 3 weeks.",
          variant: "destructive"
        });
        return;
      }
      setSelectedWeeks([...selectedWeeks, weekNum].sort((a, b) => a - b));
    }
  };

  const handlePreBook = () => {
    if (selectedWeeks.length !== 3) {
      toast({
        title: "Selection Required",
        description: "Please select exactly 3 weeks to proceed.",
        variant: "destructive"
      });
      return;
    }
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    bookingMutation.mutate({
      propertyId: id!,
      email,
      selectedWeeks,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        {/* Navigation & Title */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Experience
            </button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">{property.title}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {property.location}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start md:self-auto">
              <Share className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] mb-12">
          <img src={property.images[0]} alt="Main view" className="w-full h-full object-cover" />
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            <img src={property.images[1]} alt="Detail view" className="w-full h-full object-cover" />
            <img src={property.images[2]} alt="Interior view" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="mb-4">
                <span className="text-3xl font-semibold">$650,000 MXN</span>
                <span className="text-muted-foreground ml-2">por fracción</span>
              </div>
              <h2 className="text-2xl font-light mb-4">Acerca de esta propiedad</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-light mb-6">Condiciones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.conditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <FinancialCalculator />

            <Separator />

            <div className="p-6 bg-muted/30 rounded-xl">
              <h3 className="font-medium mb-3">Información Legal (Legacy)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada fracción representa un derecho inmobiliario real, legal y heredable.
                Puedes ocuparla, rentarla o solicitar apoyo para su operación o reventa.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20me%20interesa%20hablar%20con%20un%20asesor%20legal', '_blank')}
              >
                Habla con un asesor legal
              </Button>
            </div>
          </div>

          {/* Booking Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-border rounded-2xl p-6 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Selecciona tus Semanas</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCreatorAccess}
                  className={cn(isCreatorMode && "text-primary")}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              {isCreatorMode && (
                <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-medium">Modo Creador: Toca una semana para bloquear/desbloquear</p>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona exactamente 3 semanas para tu fracción.
              </p>

              {/* Weeks List with Dates */}
              <div className="max-h-[400px] overflow-y-auto space-y-2 mb-6 pr-2">
                {weeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => {
                      if (isCreatorMode) {
                        toggleBlockWeek(week.weekNumber);
                      } else if (week.available) {
                        toggleWeek(week.weekNumber);
                      }
                    }}
                    disabled={!isCreatorMode && !week.available}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all flex items-center justify-between",
                      week.isBlocked && "bg-red-50 border border-red-200 text-red-700",
                      week.isBooked && !week.isBlocked && "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
                      week.available && !selectedWeeks.includes(week.weekNumber) && "bg-muted/30 hover:bg-muted border border-transparent hover:border-border",
                      selectedWeeks.includes(week.weekNumber) && "bg-black text-white shadow-md",
                      isCreatorMode && "cursor-pointer hover:ring-2 hover:ring-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        selectedWeeks.includes(week.weekNumber) ? "bg-white/20" : "bg-black/10",
                        week.isBlocked && "bg-red-200"
                      )}>
                        {week.weekNumber}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{week.start} - {week.end}</p>
                        <p className={cn(
                          "text-xs",
                          selectedWeeks.includes(week.weekNumber) ? "text-white/70" : "text-muted-foreground"
                        )}>
                          Semana {week.weekNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      {week.isBlocked && <Lock className="w-4 h-4 text-red-500" />}
                      {week.isBooked && !week.isBlocked && <span className="text-xs">Reservada</span>}
                      {selectedWeeks.includes(week.weekNumber) && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Semanas seleccionadas</span>
                  <span className="font-medium">{selectedWeeks.length} / 3</span>
                </div>
                
                {selectedWeeks.length > 0 && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {selectedWeeks.sort((a,b) => a-b).map(w => {
                      const week = weeks.find(wk => wk.weekNumber === w);
                      return week && (
                        <p key={w}>• Semana {w}: {week.start} - {week.end}</p>
                      );
                    })}
                  </div>
                )}
                
                <Separator />
                
                <Input 
                  placeholder="Tu correo electrónico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />

                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={handlePreBook}
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
                  ) : "Confirmar Pre-Reserva"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Hold gratuito por 5 días. Sin pago hoy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Creator Mode Password Dialog */}
      <Dialog open={showCreatorDialog} onOpenChange={setShowCreatorDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Acceso Modo Creador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              type="password"
              placeholder="Contraseña"
              value={creatorPassword}
              onChange={e => setCreatorPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyCreatorPassword()}
            />
            <Button onClick={verifyCreatorPassword} className="w-full">
              Acceder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingButtons />
      <BottomNav />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-light pt-4">Pre-Booking Confirmed</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-muted-foreground">
              Your 3 weeks have been reserved for 5 days.
            </p>
            <p className="text-sm">
              An advisor will contact you at <span className="font-medium text-foreground">{email}</span> shortly to finalize your experience.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="w-full mt-4">
              Return to Experience
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
