import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { 
  ChevronLeft, Share, Check, Loader2, Calculator, Lock, Settings,
  Wifi, Waves, Utensils, Wind, Car, Dumbbell, Mountain, Home,
  Flame, WashingMachine, Tv, Sparkles, Shield, UmbrellaOff, Phone,
  Bed, Bath, Users, MapPin, Play, X, ChevronRight, Grid3X3, Heart, Star, Gift
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPropertyById, getBookedWeeks, createPreBooking } from '@/lib/api';
import { FinancialCalculator } from '@/components/FinancialCalculator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

const CREATOR_PASSWORD = 'lumamijuvisado';
const BASE_YEAR = 2026;

const AMENITY_ICONS: Record<string, any> = {
  'WiFi': Wifi, 'Alberca': Waves, 'Cocina': Utensils, 'Aire Acondicionado': Wind,
  'Estacionamiento': Car, 'Gimnasio': Dumbbell, 'Vista al Mar': Mountain, 'Terraza': Home,
  'BBQ': Flame, 'Lavadora': WashingMachine, 'TV': Tv, 'Jacuzzi': Sparkles,
  'Seguridad 24/7': Shield, 'Playa Privada': UmbrellaOff, 'Concierge': Phone
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
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${day} ${months[date.getMonth()]}`;
  };
  
  return { start: formatDate(weekStart), end: formatDate(weekEnd) };
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formatPrice } = useLanguage();
  const { isAuthenticated, setShowAuthModal, setAuthModalMode } = useAuth();
  
  const handleContactClick = (whatsappUrl: string) => {
    if (isAuthenticated) {
      window.open(whatsappUrl, '_blank');
    } else {
      setAuthModalMode('register');
      setShowAuthModal(true);
    }
  };
  
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
  const [liked, setLiked] = useState(false);
  const [showBeneficios, setShowBeneficios] = useState(false);

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

  const propertyBlockedWeeks = (property as any)?.blockedWeeks || [];
  const creatorBlockedWeeks = (property as any)?.creatorBlockedWeeks || [];

  const weeks = useMemo(() => {
    const allBlockedWeeks = [...blockedWeeks, ...propertyBlockedWeeks];
    return Array.from({ length: 52 }, (_, i) => {
      const weekNum = i + 1;
      const dates = getWeekDates(weekNum);
      const isCreatorBlocked = creatorBlockedWeeks.includes(weekNum);
      const isBlocked = allBlockedWeeks.includes(weekNum);
      return {
        weekNumber: weekNum,
        available: !bookedWeeks.includes(weekNum) && !isBlocked && !isCreatorBlocked,
        isBlocked,
        isBooked: bookedWeeks.includes(weekNum),
        isCreatorBlocked,
        ...dates
      };
    });
  }, [bookedWeeks, blockedWeeks, propertyBlockedWeeks, creatorBlockedWeeks]);

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Propiedad no encontrada</p>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'];
  const amenities = property.amenities || [];
  const videoUrl = property.videoUrl;
  const mapUrl = property.mapUrl;
  const price = property.price || 650000;

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-[2520px] mx-auto px-6 sm:px-8 md:px-10 lg:px-20">
          <div className="h-16 flex items-center justify-between">
            <Link href="/fractional">
              <button className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full transition-colors" data-testid="back-button">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors" data-testid="share-button">
                <Share className="w-4 h-4" />
              </button>
              <button onClick={() => setLiked(!liked)} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors" data-testid="like-button">
                <Heart className={cn("w-4 h-4", liked && "fill-red-500 text-red-500")} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[2520px] mx-auto px-6 sm:px-8 md:px-10 lg:px-20 py-6">
        <div 
          className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden cursor-pointer mb-8"
          onClick={() => setShowGallery(true)}
        >
          <div className="col-span-4 md:col-span-2 md:row-span-2 relative aspect-square md:aspect-auto">
            <img src={images[0]} alt="" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
          </div>
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="hidden md:block relative aspect-square">
              <img src={img} alt="" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white font-medium">+{images.length - 5}</span>
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowGallery(true); }}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border flex items-center gap-2"
            data-testid="show-all-photos"
          >
            <Grid3X3 className="w-4 h-4" />
            Mostrar fotos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="pb-6 border-b">
              <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">5.0</span>
                </div>
                <span className="text-gray-300">·</span>
                <span className="underline">{property.location}</span>
              </div>
            </div>

            <div className="py-6 border-b">
              <div className="flex items-center gap-6">
                {property.maxGuests && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{property.maxGuests}</span>
                    </div>
                    <span className="text-sm text-gray-500">huéspedes</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Bed className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <span className="text-sm text-gray-500">habitaciones</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Bath className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <span className="text-sm text-gray-500">baños</span>
                  </div>
                )}
              </div>
            </div>

            <div className="py-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Acerca de esta propiedad</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              
              <button 
                onClick={() => setShowBeneficios(true)}
                className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-black to-black hover:from-black hover:to-black text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                data-testid="button-beneficios-property"
              >
                <Gift className="w-5 h-5" />
                Ver Beneficios Fractional Living
              </button>
            </div>

            {amenities.length > 0 && (
              <div className="py-6 border-b">
                <h2 className="text-lg font-semibold mb-4">Lo que ofrece este lugar</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity: string, i: number) => {
                    const Icon = AMENITY_ICONS[amenity] || Check;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <Icon className="w-6 h-6 text-gray-600" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="py-6 border-b">
                <h2 className="text-lg font-semibold mb-4">Video del tour</h2>
                <button 
                  onClick={() => setShowVideo(true)} 
                  className="relative w-full aspect-video rounded-xl overflow-hidden group"
                  data-testid="play-video"
                >
                  <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-7 h-7 text-gray-900 ml-1" />
                    </div>
                  </div>
                </button>
              </div>
            )}

            {mapUrl && (
              <div className="py-6 border-b">
                <h2 className="text-lg font-semibold mb-4">Dónde vas a estar</h2>
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  <iframe src={mapUrl} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                </div>
              </div>
            )}

            <div className="py-6">
              <h2 className="text-lg font-semibold mb-4">Plan de Inversión</h2>
              <FinancialCalculator 
                basePrice={property.fractionPrice || 250000}
                prices2weeks={Math.round((property.fractionPrice || 250000) * 2 * 0.93)}
                prices3weeks={Math.round((property.fractionPrice || 250000) * 3 * 0.86)}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${((property.fractionPrice || 250000) / 1000).toFixed(0)}K
                  </span>
                  <span className="text-gray-500">MXN / semana</span>
                </div>
                <p className="text-gray-600 text-sm">Preventa · Máxima plusvalía</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white text-sm">30% enganche</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                  <Check className="w-5 h-5 text-black" />
                  <span className="text-gray-700 text-sm">12 meses sin intereses</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white text-sm">Propiedad heredable</span>
                </div>
              </div>

              <button 
                onClick={() => handleContactClick(`https://wa.me/529984292748?text=Hola,%20me%20interesa%20${encodeURIComponent(property.title)}`)}
                className="block w-full py-4 bg-gradient-to-r from-black to-black hover:from-black hover:to-black text-white font-semibold rounded-xl text-center transition-colors mb-3"
                data-testid="whatsapp-cta"
              >
                💬 {isAuthenticated ? 'Hablar por WhatsApp' : 'Registrarme para Contactar'}
              </button>

              {!isAuthenticated && (
                <button 
                  onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}
                  className="w-full py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-colors" 
                  data-testid="login-cta"
                >
                  Ya tengo cuenta - Iniciar Sesión
                </button>
              )}

              <p className="text-center text-gray-400 text-xs mt-4">Te contactamos en menos de 24 horas</p>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-5xl p-0 bg-white">
          <div className="relative">
            <div className="aspect-[4/3] bg-black">
              <img src={images[galleryIndex]} alt="" className="w-full h-full object-contain" />
            </div>
            <button 
              onClick={() => setShowGallery(false)} 
              className="absolute top-4 left-4 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setGalleryIndex((galleryIndex - 1 + images.length) % images.length)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setGalleryIndex((galleryIndex + 1) % images.length)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium">{galleryIndex + 1} / {images.length}</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acceso Creador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              type="password" 
              placeholder="Contraseña" 
              value={creatorPassword} 
              onChange={(e) => setCreatorPassword(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && verifyCreatorPassword()}
              className="h-12"
            />
            <Button onClick={verifyCreatorPassword} className="w-full h-12">Acceder</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pre-Reserva Confirmada</h3>
            <p className="text-gray-500 mb-6">Tienes 5 días para completar tu reserva. Un asesor te contactará pronto.</p>
            <Button onClick={() => setShowSuccess(false)} className="w-full h-12">Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="p-2">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700 space-y-6">
              
              <div className="bg-gradient-to-r from-black to-black p-4 rounded-xl border border-white/20">
                <p className="text-center text-black font-bold text-base">
                  En Fractional Living la experiencia, plusvalía y seguridad son un mismo concepto
                </p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">¿Por qué Fractional Living?</h3>
                <p className="mb-2">Fractional Living nace de una idea simple: el tiempo, el uso y el capital inmobiliario pueden trabajar mejor cuando se estructuran correctamente.</p>
                <p className="mb-2">No somos tiempo compartido. No somos preventas tradicionales. No somos un "fraccional barato".</p>
                <p className="font-medium">Somos una infraestructura inmobiliaria diseñada para:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proteger valor</li>
                  <li>Generar utilidad</li>
                  <li>Crear experiencia real</li>
                  <li>Construir plusvalía en el tiempo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">¿Por qué invertir aquí?</h3>
                <p className="mb-2">Porque aquí no compras promesas, compras procesos.</p>
                <p className="font-medium">Cada propiedad:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Está en zonas estratégicas</li>
                  <li>Tiene origen legal transparente</li>
                  <li>Cuenta con financiamiento hipotecario</li>
                  <li>Se integra a esquemas fiduciarios claros</li>
                </ul>
                <p className="mt-2 font-medium text-black">Eso es certeza legal. Eso es estructura real.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficio Legal</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades adquiridas con crédito hipotecario</li>
                  <li>Cesión de derechos fiduciarios clara</li>
                  <li>Acceso al legajo legal del activo</li>
                  <li>Disfrute del uso desde el día uno</li>
                  <li>Preventas con respaldo estructural</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">Si tu fecha llega antes de la entrega, te hospedamos en una propiedad de igual o mejor categoría.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficio Comercial</h3>
                <p className="text-center font-bold text-black mb-2">Compra · Vive · Renta · Revende · Repite</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ingreso potencial desde el día uno</li>
                  <li>Uso flexible de tu fracción</li>
                  <li>Acceso permanente a hospedaje</li>
                  <li>Descuentos superiores al 50% en fechas no propias</li>
                  <li>Preventas con uso garantizado</li>
                </ul>
                <p className="mt-2 font-medium">Tu fracción trabaja contigo, no se queda congelada.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficios Incluidos</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Traslados aeropuerto ↔ propiedad</li>
                  <li>Concierge 24/7</li>
                  <li>Eventos semanales</li>
                  <li>Descuentos en yates, restaurantes, spas</li>
                  <li>Acceso a comunidad y networking</li>
                </ul>
                <p className="mt-2 font-medium">Aquí no solo vienes a hospedarte. Vienes a vivir el ecosistema.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">Beneficio de Experiencia</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Propiedades pet friendly y no pet friendly</li>
                  <li>Espacios para fumadores y no fumadores</li>
                  <li>Experiencias diseñadas según tu perfil</li>
                  <li>Uso personal o comercial, tú decides</li>
                </ul>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">La Gran Diferencia</h3>
                <p className="mb-2">All Global Holding conserva fracciones propias en cada desarrollo.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Somos copropietarios contigo</li>
                  <li>No cedemos la administración</li>
                  <li>Nuestro interés está alineado con el tuyo</li>
                </ul>
                <p className="mt-2 font-medium text-black">Por eso el modelo se sostiene en el tiempo. Por eso la plusvalía es real.</p>
              </div>

              <div>
                <h3 className="text-black font-bold text-base mb-2">No es tiempo compartido</h3>
                <p className="mb-2">No compras noches. No compras puntos. No compras membresías opacas.</p>
                <p className="font-medium">Compras:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Derechos reales</li>
                  <li>Uso flexible</li>
                  <li>Beneficios transferibles</li>
                  <li>Un activo con vida comercial</li>
                </ul>
                <p className="mt-2 font-medium">Tu fracción es tuya. La usas tú, o quien tú decidas.</p>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-black font-bold text-lg mb-2">Bienvenido a Fractional Living</p>
                <p className="text-sm text-gray-600 mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-black font-bold">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

