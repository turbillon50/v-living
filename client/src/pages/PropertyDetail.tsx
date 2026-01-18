import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { 
  ChevronLeft, Share, Check, Loader2, Calculator, Lock, Settings,
  Wifi, Waves, Utensils, Wind, Car, Dumbbell, Mountain, Home,
  Flame, WashingMachine, Tv, Sparkles, Shield, UmbrellaOff, Phone,
  Bed, Bath, Users, MapPin, Play, X, ChevronRight, Image
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
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

const AMENITY_ICONS: Record<string, any> = {
  'WiFi': Wifi,
  'Alberca': Waves,
  'Cocina': Utensils,
  'Aire Acondicionado': Wind,
  'Estacionamiento': Car,
  'Gimnasio': Dumbbell,
  'Vista al Mar': Mountain,
  'Terraza': Home,
  'BBQ': Flame,
  'Lavadora': WashingMachine,
  'TV': Tv,
  'Jacuzzi': Sparkles,
  'Seguridad 24/7': Shield,
  'Playa Privada': UmbrellaOff,
  'Concierge': Phone
};

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
  
  return { start: formatDate(weekStart), end: formatDate(weekEnd) };
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
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 space-y-4 border border-cyan-100">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-cyan-600" />
        <h4 className="font-semibold text-lg">Calculadora de Pagos</h4>
      </div>
      <div>
        <label className="text-sm text-slate-600 mb-2 block">
          Enganche: {downPayment}% (${downPaymentAmount.toLocaleString()} MXN)
        </label>
        <input type="range" min="10" max="30" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-cyan-500" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {([12, 24, 36] as const).map((t) => (
          <button key={t} onClick={() => setTerm(t)} className={cn("py-2 px-3 rounded-lg text-sm font-medium transition-colors", term === t ? "bg-cyan-500 text-white" : "bg-white border hover:bg-slate-50")}>
            {t} meses {rates[t] > 0 && `(${rates[t]}%)`}
          </button>
        ))}
      </div>
      <div className="pt-4 border-t border-cyan-200">
        <p className="text-sm text-slate-600">Pago mensual estimado:</p>
        <p className="text-3xl font-bold text-cyan-600">${Math.round(monthlyPayment).toLocaleString()} MXN</p>
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
  const [bookingType, setBookingType] = useState<'fraction' | 'vacation'>('fraction');
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id!),
    enabled: !!id,
  });

  const { data: bookedWeeks = [] } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBookedWeeks(id!),
    enabled: !!id,
  });

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

  const bookingMutation = useMutation({
    mutationFn: (data: { propertyId: string; email: string; selectedWeeks: number[] }) =>
      createPreBooking({ ...data, bookingType }),
    onSuccess: () => {
      setShowSuccess(true);
      setSelectedWeeks([]);
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      const msg = `Nueva Pre-Reserva FRACTIONAL LIVING\n\nPropiedad: ${property?.title}\nEmail: ${email}\nSemanas: ${selectedWeeks.join(', ')}\nTipo: ${bookingType === 'fraction' ? 'Fracción' : 'Vacaciones'}`;
      window.open(`https://wa.me/529984292748?text=${encodeURIComponent(msg)}`, '_blank');
    },
    onError: () => {
      toast({ title: "Error al reservar", variant: "destructive" });
    }
  });

  const handleCreatorAccess = () => {
    if (isCreatorMode) { setIsCreatorMode(false); return; }
    setShowCreatorDialog(true);
  };

  const verifyCreatorPassword = () => {
    if (creatorPassword === CREATOR_PASSWORD) {
      setIsCreatorMode(true);
      setShowCreatorDialog(false);
      setCreatorPassword('');
      toast({ title: "Modo Creador activado" });
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive" });
    }
  };

  const toggleBlockWeek = (weekNumber: number) => {
    setBlockedWeeks(prev => prev.includes(weekNumber) ? prev.filter(w => w !== weekNumber) : [...prev, weekNumber]);
  };

  const toggleWeek = (weekNumber: number) => {
    if (bookingType === 'fraction') {
      if (selectedWeeks.includes(weekNumber)) {
        setSelectedWeeks(prev => prev.filter(w => w !== weekNumber));
      } else if (selectedWeeks.length < 3) {
        setSelectedWeeks(prev => [...prev, weekNumber]);
      }
    } else {
      setSelectedWeeks(prev => prev.includes(weekNumber) ? prev.filter(w => w !== weekNumber) : [...prev, weekNumber]);
    }
  };

  const handleSubmit = () => {
    if (bookingType === 'fraction' && selectedWeeks.length !== 3) {
      toast({ title: "Selecciona exactamente 3 semanas", variant: "destructive" });
      return;
    }
    if (!email) {
      toast({ title: "Ingresa tu email", variant: "destructive" });
      return;
    }
    bookingMutation.mutate({ propertyId: id!, email, selectedWeeks });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Propiedad no encontrada</p>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'];
  const amenities = property.amenities || [];
  const videoUrl = property.videoUrl;
  const mapUrl = property.mapUrl;

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Link href="/fractional">
          <button className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver
          </button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{property.title}</h1>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {property.location}
            </p>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            {(property.bedrooms ?? 0) > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} Rec</span>}
            {(property.bathrooms ?? 0) > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} Baños</span>}
            {(property.maxGuests ?? 0) > 0 && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {property.maxGuests} Huésp</span>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-[300px] md:h-[400px]">
          <div className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer" onClick={() => { setGalleryIndex(0); setShowGallery(true); }}>
            <img src={images[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          </div>
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="hidden md:block relative cursor-pointer" onClick={() => { setGalleryIndex(i + 1); setShowGallery(true); }}>
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
            </div>
          ))}
          {images.length > 5 && (
            <button onClick={() => setShowGallery(true)} className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-slate-50">
              <Image className="w-4 h-4 inline mr-2" /> Ver todas ({images.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-6">
              <p className="text-sm opacity-80">Precio por fracción</p>
              <p className="text-4xl font-bold">${(property.price || FRACTION_PRICE).toLocaleString()} MXN</p>
              <p className="text-sm opacity-80 mt-1">~${Math.round((property.price || FRACTION_PRICE) / 17.5).toLocaleString()} USD</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Acerca de esta propiedad</h2>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">Amenidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity: string, i: number) => {
                      const Icon = AMENITY_ICONS[amenity] || Check;
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <Icon className="w-5 h-5 text-cyan-600" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {videoUrl && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">Video</h2>
                  <button onClick={() => setShowVideo(true)} className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden group">
                    <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-cyan-600 ml-1" />
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {mapUrl && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <iframe src={mapUrl} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                  </div>
                </div>
              </>
            )}

            <Separator />
            <FinancialCalculator />

            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="font-semibold mb-3">Propiedad Real y Legal</h3>
              <p className="text-sm text-slate-600">Cada fracción representa un derecho inmobiliario real, legal y heredable. Puedes ocuparla, rentarla o solicitar apoyo para su operación o reventa.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.open('https://wa.me/529984292748?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20legal', '_blank')}>
                Habla con un asesor
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selecciona tus Semanas</h3>
                <Button variant="ghost" size="sm" onClick={handleCreatorAccess} className={cn(isCreatorMode && "text-cyan-500")}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={() => setBookingType('fraction')} className={cn("flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all", bookingType === 'fraction' ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200")}>
                  Comprar Fracción
                </button>
                <button onClick={() => setBookingType('vacation')} className={cn("flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative", bookingType === 'vacation' ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : "bg-slate-100 hover:bg-slate-200")}>
                  Vacacionar
                  <span className="absolute -top-2 -right-2 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Pronto</span>
                </button>
              </div>

              {isCreatorMode && (
                <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                  <p className="text-xs text-cyan-700 font-medium">Modo Creador: Toca para bloquear/desbloquear</p>
                </div>
              )}

              <div className="max-h-[350px] overflow-y-auto space-y-2 mb-4 pr-1">
                {weeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => isCreatorMode ? toggleBlockWeek(week.weekNumber) : week.available && toggleWeek(week.weekNumber)}
                    disabled={!isCreatorMode && !week.available}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all flex items-center justify-between",
                      week.isBlocked && "bg-red-50 border border-red-200 text-red-700",
                      week.isBooked && !week.isBlocked && "bg-slate-100 opacity-50 cursor-not-allowed",
                      week.available && !selectedWeeks.includes(week.weekNumber) && "bg-slate-50 hover:bg-slate-100",
                      selectedWeeks.includes(week.weekNumber) && "bg-cyan-500 text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", selectedWeeks.includes(week.weekNumber) ? "bg-white/20" : "bg-slate-200")}>
                        {week.weekNumber}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{week.start} - {week.end}</p>
                        <p className="text-xs opacity-70">Semana {week.weekNumber}</p>
                      </div>
                    </div>
                    {week.isBlocked && <Lock className="w-4 h-4" />}
                    {week.isBooked && !week.isBlocked && <span className="text-xs">Reservada</span>}
                    {selectedWeeks.includes(week.weekNumber) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Seleccionadas</span>
                  <span className="font-medium">{selectedWeeks.length} / 3</span>
                </div>

                {selectedWeeks.length === 3 && bookingType === 'fraction' && (
                  <>
                    <Input type="email" placeholder="Tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={handleSubmit} disabled={bookingMutation.isPending} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      {bookingMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pre-Reservar (5 días hold)"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <div className="relative">
            <img src={images[galleryIndex]} alt="" className="w-full h-auto max-h-[80vh] object-contain" />
            <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2">
              <X className="w-6 h-6 text-white" />
            </button>
            {images.length > 1 && (
              <>
                <button onClick={() => setGalleryIndex((galleryIndex - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => setGalleryIndex((galleryIndex + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full">
              <span className="text-white text-sm">{galleryIndex + 1} / {images.length}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl p-0">
          {videoUrl && (
            <div className="aspect-video">
              <iframe src={getYoutubeEmbedUrl(videoUrl)} className="w-full h-full" allowFullScreen />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatorDialog} onOpenChange={setShowCreatorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modo Creador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="password" placeholder="Contraseña" value={creatorPassword} onChange={(e) => setCreatorPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && verifyCreatorPassword()} />
            <Button onClick={verifyCreatorPassword} className="w-full">Acceder</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pre-Reserva Confirmada</h3>
            <p className="text-slate-600 mb-4">Tienes 5 días para completar tu reserva. Un asesor te contactará pronto.</p>
            <Button onClick={() => setShowSuccess(false)}>Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingButtons />
    </div>
  );
}
