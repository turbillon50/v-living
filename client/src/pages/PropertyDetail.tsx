import { useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'wouter';
import { 
  ChevronLeft, Share, Check, Loader2, Lock, Settings,
  Wifi, Waves, Utensils, Wind, Car, Dumbbell, Mountain, Home,
  Flame, WashingMachine, Tv, Sparkles, Shield, UmbrellaOff, Phone,
  Bed, Bath, Users, Play, X, ChevronRight, Grid3X3, Heart, Star, Gift
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPropertyById, getBookedWeeks, createPreBooking } from '@/lib/api';
import { FinancialCalculator } from '@/components/FinancialCalculator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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
  const [showConditions, setShowConditions] = useState(false);
  const [mobileGalleryIdx, setMobileGalleryIdx] = useState(0);
  const touchStartXDetail = useRef<number | null>(null);

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
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#717171]">Propiedad no encontrada</p>
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
      <header className="sticky top-0 z-40 fl-glass-header">
        <div className="max-w-[2520px] mx-auto px-6 sm:px-8 md:px-10 lg:px-20">
          <div className="h-16 flex items-center justify-between">
            <Link href="/fractional">
              <button className="flex items-center gap-2 text-sm hover:bg-[#f7f7f7] px-3 py-2 rounded-full transition-colors text-[#222]" data-testid="back-button">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const url = window.location.href;
                  const text = `${property?.title} — Fractional Living`;
                  if (navigator.share) {
                    navigator.share({ title: text, url }).catch(() => {});
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                  }
                }}
                className="p-2.5 hover:bg-[#f7f7f7] rounded-full transition-colors" data-testid="share-button" aria-label="Compartir">
                <Share className="w-4 h-4 text-[#222]" />
              </button>
              <button onClick={() => setLiked(!liked)} className="p-2.5 hover:bg-[#f7f7f7] rounded-full transition-colors" data-testid="like-button" aria-label="Guardar favorito">
                <Heart className={cn("w-4 h-4 text-[#222]", liked && "fill-[#059669] text-[#059669]")} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[2520px] mx-auto">
        <div className="md:hidden relative overflow-hidden" data-testid="mobile-gallery"
          onTouchStart={(e) => { touchStartXDetail.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartXDetail.current === null) return;
            const diff = touchStartXDetail.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
              if (diff > 0 && mobileGalleryIdx < images.length - 1) setMobileGalleryIdx(mobileGalleryIdx + 1);
              if (diff < 0 && mobileGalleryIdx > 0) setMobileGalleryIdx(mobileGalleryIdx - 1);
            }
            touchStartXDetail.current = null;
          }}
        >
          <div className="relative aspect-[4/3]">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${property.title} ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${idx === mobileGalleryIdx ? 'opacity-100' : 'opacity-0'}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onClick={() => { setGalleryIndex(idx); setShowGallery(true); }}
              />
            ))}
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.slice(0, Math.min(images.length, 7)).map((_, idx) => (
                <span key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === mobileGalleryIdx ? 'bg-white w-2.5' : 'bg-white/50'}`} />
              ))}
              {images.length > 7 && <span className="w-1.5 h-1.5 rounded-full bg-white/30" />}
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md font-medium">
            {mobileGalleryIdx + 1}/{images.length}
          </div>
        </div>

        <div className="hidden md:block px-6 sm:px-8 md:px-10 lg:px-20 py-6">
          <div 
            className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden cursor-pointer mb-8 relative"
            onClick={() => setShowGallery(true)}
          >
            <div className="col-span-2 row-span-2 relative">
              <img src={images[0]} alt={property.title} className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img src={img} alt={`${property.title} ${i + 2}`} className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white font-medium">+{images.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowGallery(true); }}
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#fafafa] border border-[#ebebeb] flex items-center gap-2"
              data-testid="show-all-photos"
            >
              <Grid3X3 className="w-4 h-4" />
              Mostrar fotos
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-8 md:px-10 lg:px-20 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="pb-6 border-b">
              <h1 className="text-2xl mb-2 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>{property.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#888] font-light">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#111] text-[#111]" />
                  <span className="font-medium text-[#111]">5.0</span>
                </div>
                <span className="text-[#ddd]">·</span>
                <span>{property.location}</span>
              </div>
            </div>

            <div className="py-6 border-b">
              <div className="flex items-center gap-6">
                {property.maxGuests && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-[#555]" />
                      <span className="font-medium text-[#111]">{property.maxGuests}</span>
                    </div>
                    <span className="text-sm text-[#888] font-light">huéspedes</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Bed className="w-5 h-5 text-[#555]" />
                      <span className="font-medium text-[#111]">{property.bedrooms}</span>
                    </div>
                    <span className="text-sm text-[#888] font-light">habitaciones</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Bath className="w-5 h-5 text-[#555]" />
                      <span className="font-medium text-[#111]">{property.bathrooms}</span>
                    </div>
                    <span className="text-sm text-[#888] font-light">baños</span>
                  </div>
                )}
              </div>
            </div>

            <div className="py-6 border-b">
              <h2 className="text-lg mb-4 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Acerca de esta propiedad</h2>
              <p className="text-[#666] leading-relaxed whitespace-pre-line font-light">{property.description}</p>
              
              <button 
                onClick={() => setShowBeneficios(true)}
                className="mt-6 w-full flex items-center justify-center gap-3 py-4 fl-btn-primary active:scale-[0.98]"
                data-testid="button-beneficios-property"
              >
                <Gift className="w-5 h-5" />
                Ver Beneficios Fractional Living
              </button>
            </div>

            {property.conditions && property.conditions.length > 0 && (
              <div className="py-6 border-b" data-testid="section-conditions">
                <button
                  onClick={() => setShowConditions(!showConditions)}
                  className="w-full flex items-center justify-between text-left"
                  data-testid="button-toggle-conditions"
                  aria-expanded={showConditions}
                  aria-controls="conditions-list"
                >
                  <h2 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Condiciones y Términos</h2>
                  <ChevronRight className={`w-5 h-5 text-[#717171] transition-transform duration-200 ${showConditions ? 'rotate-90' : ''}`} />
                </button>
                {showConditions && (
                  <ul id="conditions-list" className="mt-4 space-y-3">
                    {property.conditions.map((condition: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#555] font-light">
                        <Check className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {amenities.length > 0 && (
              <div className="py-6 border-b">
                <h2 className="text-lg mb-4 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Lo que ofrece este lugar</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity: string, i: number) => {
                    const Icon = AMENITY_ICONS[amenity] || Check;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <Icon className="w-5 h-5 text-[#555]" />
                        <span className="text-[#555] text-sm font-light">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="py-6 border-b">
                <h2 className="text-lg mb-4 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Video del tour</h2>
                <button 
                  onClick={() => setShowVideo(true)} 
                  className="relative w-full aspect-video rounded-md overflow-hidden group"
                  data-testid="play-video"
                >
                  <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-7 h-7 text-[#111] ml-1" />
                    </div>
                  </div>
                </button>
              </div>
            )}

            {mapUrl && (
              <div className="py-6 border-b">
                <h2 className="text-lg mb-4 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Dónde vas a estar</h2>
                <div className="aspect-[16/9] rounded-md overflow-hidden">
                  <iframe src={mapUrl} className="w-full h-full border-0" allowFullScreen loading="lazy" title="Ubicación de la propiedad" />
                </div>
              </div>
            )}

            <div className="py-6">
              <h2 className="text-lg mb-4 text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Plan de Inversión</h2>
              <FinancialCalculator 
                basePrice={property.fractionPrice || 250000}
                prices2weeks={Math.round((property.fractionPrice || 250000) * 2 * 0.93)}
                prices3weeks={Math.round((property.fractionPrice || 250000) * 3 * 0.86)}
              />
            </div>

            <div className="py-6 border-t" data-testid="section-week-calendar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
                  {bookingType === 'fraction' ? 'Selecciona 3 Semanas' : 'Selecciona tus Semanas'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreatorAccess}
                    className="p-2 hover:bg-[#f7f7f7] rounded-full transition-colors"
                    data-testid="button-creator-access"
                    aria-label="Modo creador"
                  >
                    {isCreatorMode ? <Lock className="w-4 h-4 text-[#059669]" /> : <Settings className="w-4 h-4 text-[#717171]" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => { setBookingType('fraction'); setSelectedWeeks([]); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${bookingType === 'fraction' ? 'bg-[#222] text-white' : 'bg-[#f7f7f7] text-[#717171]'}`}
                  data-testid="tab-fraction"
                >
                  Fracción (3 sem)
                </button>
                <button
                  onClick={() => { setBookingType('vacation'); setSelectedWeeks([]); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${bookingType === 'vacation' ? 'bg-[#222] text-white' : 'bg-[#f7f7f7] text-[#717171]'}`}
                  data-testid="tab-vacation"
                >
                  Vacaciones
                </button>
              </div>

              {selectedWeeks.length > 0 && (
                <div className="mb-4 p-3 bg-[#f0fdf4] rounded-xl border border-[#059669]/10">
                  <p className="text-[#059669] text-sm font-medium">
                    {selectedWeeks.length} semana{selectedWeeks.length > 1 ? 's' : ''} seleccionada{selectedWeeks.length > 1 ? 's' : ''}
                    {bookingType === 'fraction' && ` de 3`}
                    : {selectedWeeks.sort((a, b) => a - b).join(', ')}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 mb-6" data-testid="week-grid">
                {weeks.map((week) => {
                  const isSelected = selectedWeeks.includes(week.weekNumber);
                  const isDisabled = !week.available && !isCreatorMode;
                  const maxReached = bookingType === 'fraction' && selectedWeeks.length >= 3 && !isSelected;

                  return (
                    <button
                      key={week.weekNumber}
                      onClick={() => {
                        if (isCreatorMode) {
                          toggleBlockWeek(week.weekNumber);
                        } else if (week.available && !maxReached) {
                          toggleWeek(week.weekNumber);
                        }
                      }}
                      disabled={!isCreatorMode && (isDisabled || maxReached)}
                      className={cn(
                        'relative p-2 rounded-lg text-center transition-all text-xs',
                        isSelected && 'bg-[#059669] text-white ring-2 ring-[#059669] ring-offset-1',
                        !isSelected && week.available && !maxReached && 'bg-white border border-[#ebebeb] hover:border-[#059669] text-[#222]',
                        !isSelected && week.available && maxReached && 'bg-white border border-[#ebebeb] text-[#ccc] cursor-not-allowed',
                        week.isBooked && 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] cursor-not-allowed',
                        week.isBlocked && 'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]',
                        week.isCreatorBlocked && 'bg-[#e5e7eb] text-[#6b7280] border border-[#d1d5db] cursor-not-allowed',
                        isCreatorMode && 'cursor-pointer hover:ring-2 hover:ring-[#059669]/30'
                      )}
                      data-testid={`week-${week.weekNumber}`}
                    >
                      <span className="font-semibold block">S{week.weekNumber}</span>
                      <span className="text-[8px] opacity-70 block">{week.start}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 text-[10px] text-[#717171] mb-6">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-[#ebebeb]" /> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#059669]" /> Seleccionada</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#fee2e2] border border-[#fca5a5]" /> Reservada</span>
                {isCreatorMode && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#fef3c7] border border-[#fcd34d]" /> Bloqueada</span>}
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Tu email para pre-reservar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-[#ebebeb]"
                  data-testid="input-booking-email"
                />
                <button
                  onClick={handleSubmit}
                  disabled={bookingMutation.isPending || (bookingType === 'fraction' ? selectedWeeks.length !== 3 : selectedWeeks.length === 0) || !email}
                  className="w-full py-4 fl-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-submit-booking"
                >
                  {bookingMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {bookingType === 'fraction' ? 'Pre-Reservar Fracción' : 'Pre-Reservar Vacaciones'}
                      {selectedWeeks.length > 0 && ` (${selectedWeeks.length} sem)`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 fl-card p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-semibold text-[#222]">
                    ${((property.fractionPrice || 250000) / 1000).toFixed(0)}K
                  </span>
                  <span className="text-[#717171]">MXN / semana</span>
                </div>
                <p className="text-[#717171] text-sm">Preventa · Máxima plusvalía</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 fl-gradient-brand rounded-xl">
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white text-sm">30% enganche</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#f0fdf4] rounded-xl border border-[#059669]/10">
                  <Check className="w-5 h-5 text-[#059669]" />
                  <span className="text-[#059669] text-sm">12 meses sin intereses</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] rounded-xl border border-[#ebebeb]">
                  <Check className="w-5 h-5 text-[#222]" />
                  <span className="text-[#222] text-sm">Propiedad heredable</span>
                </div>
              </div>

              <button 
                onClick={() => handleContactClick(`https://wa.me/529984292748?text=Hola,%20me%20interesa%20${encodeURIComponent(property.title)}`)}
                className="block w-full py-4 fl-btn-primary text-center mb-3"
                data-testid="whatsapp-cta"
              >
                {isAuthenticated ? 'Hablar por WhatsApp' : 'Registrarme para Contactar'}
              </button>

              {!isAuthenticated && (
                <button 
                  onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}
                  className="w-full py-4 fl-btn-outline" 
                  data-testid="login-cta"
                >
                  Ya tengo cuenta - Iniciar Sesión
                </button>
              )}

              <p className="text-center text-[#717171] text-xs mt-4">Te contactamos en menos de 24 horas</p>
            </div>
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
              className="absolute top-4 left-4 bg-white hover:bg-[#f5f5f5] rounded-full p-2"
              aria-label="Cerrar galería"
            >
              <X className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setGalleryIndex((galleryIndex - 1 + images.length) % images.length)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#f5f5f5] rounded-full p-3"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setGalleryIndex((galleryIndex + 1) % images.length)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#f5f5f5] rounded-full p-3"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-md">
              <span className="text-sm font-medium">{galleryIndex + 1} / {images.length}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl p-0">
          {videoUrl && (
            <div className="aspect-video">
              <iframe src={getYoutubeEmbedUrl(videoUrl)} className="w-full h-full" allowFullScreen title="Video de la propiedad" />
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
            <p className="text-[#888] mb-6 font-light">Tienes 5 días para completar tu reserva. Un asesor te contactará pronto.</p>
            <Button onClick={() => setShowSuccess(false)} className="w-full h-12">Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>

      {showBeneficios && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setShowBeneficios(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-5 border-b border-[#ebebeb] flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-3xl">
              <h2 className="text-lg text-[#222] font-semibold">Beneficios Fractional Living</h2>
              <button onClick={() => setShowBeneficios(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors">
                <X className="w-5 h-5 text-[#717171]" />
              </button>
            </div>
            <div className="p-5 text-sm text-[#717171] space-y-6 leading-relaxed">
              
              <div className="fl-gradient-brand p-4 rounded-xl">
                <p className="text-center text-white font-medium text-base">
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
                <p className="mt-2 text-xs text-[#888]">Si tu fecha llega antes de la entrega, te hospedamos en una propiedad de igual o mejor categoría.</p>
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
                <p className="text-sm text-[#888] mb-3">Invertir aquí no es entrar a un producto. Es sumarte a una familia inmobiliaria estructurada.</p>
                <p className="text-black font-bold">Compra · Vive · Renta · Revende · Repite</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

