import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, BarChart3, Building, Calendar, Plus, Trash2, Edit, Loader2, Lock,
  Image, MapPin, Bed, Bath, Users, DollarSign, Save, X, Upload, Check, Eye,
  Video, Copy, Tag, CalendarOff, Layers, GripVertical, ExternalLink, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  images: string[];
  videos: string[];
  amenities: string[];
  blockedWeeks: number[];
  price: number;
  priceHighSeason: number | null;
  priceMidSeason: number | null;
  priceLowSeason: number | null;
  videoUrl: string | null;
  mapUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  viewCount: number;
  tag: string | null;
}

interface Booking {
  id: string;
  propertyId: string;
  email: string;
  name: string | null;
  phone: string | null;
  selectedWeeks: number[];
  bookingType: string;
  expiresAt: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  icon: string;
  isActive: boolean;
}

const AMENITIES_LIST = [
  'WiFi', 'Alberca', 'Cocina', 'Aire Acondicionado', 'Estacionamiento',
  'Gimnasio', 'Vista al Mar', 'Terraza', 'BBQ', 'Lavadora',
  'TV', 'Jacuzzi', 'Seguridad 24/7', 'Playa Privada', 'Concierge'
];

const PROPERTY_TAGS = [
  { value: '', label: 'Sin etiqueta' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'oferta', label: 'Oferta Especial' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'destacado', label: 'Destacado' },
  { value: 'ultima_fraccion', label: 'Última Fracción' }
];

const DEFAULT_CATEGORIES = [
  'Propiedades', 'Yachts', 'Experiencias', 'Comercial', 'Rewards & Benefits', 'Last Minute Access'
];

export default function CreatorDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [creatorToken, setCreatorToken] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'stats' | 'categories'>('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showWeekBlocker, setShowWeekBlocker] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: 'Propiedades',
    images: [] as string[],
    videos: [] as string[],
    amenities: [] as string[],
    blockedWeeks: [] as number[],
    price: 650000,
    priceHighSeason: null as number | null,
    priceMidSeason: null as number | null,
    priceLowSeason: null as number | null,
    videoUrl: '',
    mapUrl: '',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    tag: ''
  });

  const [newCategory, setNewCategory] = useState({ name: '', nameEn: '', slug: '', icon: 'Building' });

  const { data: properties = [], isLoading: loadingProperties } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: isUnlocked
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['admin-bookings', creatorToken],
    queryFn: async () => {
      const res = await fetch('/api/admin/pre-bookings', {
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: isUnlocked && !!creatorToken
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isUnlocked
  });

  const allCategories = categories.length > 0 
    ? categories.map(c => c.name) 
    : DEFAULT_CATEGORIES;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad creada exitosamente' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      resetForm();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad actualizada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      resetForm();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      toast({ title: 'Propiedad eliminada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/properties/${id}/duplicate`, {
        method: 'POST',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad duplicada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Categoría creada' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory({ name: '', nameEn: '', slug: '', icon: 'Building' });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      toast({ title: 'Categoría eliminada' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleUnlock = async () => {
    try {
      const res = await fetch('/api/creator/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setCreatorToken(data.token);
        setIsUnlocked(true);
        toast({ title: 'Acceso autorizado' });
      } else {
        toast({ title: 'Contraseña incorrecta', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error de conexión', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', location: '', description: '', category: 'Propiedades',
      images: [], videos: [], amenities: [], blockedWeeks: [],
      price: 650000, priceHighSeason: null, priceMidSeason: null, priceLowSeason: null,
      videoUrl: '', mapUrl: '', bedrooms: 2, bathrooms: 2, maxGuests: 6, tag: ''
    });
    setEditingProperty(null);
    setIsCreating(false);
    setShowPreview(false);
    setShowWeekBlocker(false);
  };

  const handleEdit = (property: Property) => {
    setFormData({
      title: property.title,
      location: property.location,
      description: property.description,
      category: property.category,
      images: property.images || [],
      videos: property.videos || [],
      amenities: property.amenities || [],
      blockedWeeks: property.blockedWeeks || [],
      price: property.price || 650000,
      priceHighSeason: property.priceHighSeason,
      priceMidSeason: property.priceMidSeason,
      priceLowSeason: property.priceLowSeason,
      videoUrl: property.videoUrl || '',
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms || 2,
      bathrooms: property.bathrooms || 2,
      maxGuests: property.maxGuests || 6,
      tag: property.tag || ''
    });
    setEditingProperty(property);
    setIsCreating(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const urlRes = await fetch(`/api/object-storage/presigned-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
        if (!urlRes.ok) throw new Error('Failed to get upload URL');
        const { url, objectKey, publicUrl } = await urlRes.json();

        await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      }
      toast({ title: 'Imágenes subidas' });
    } catch (err) {
      toast({ title: 'Error subiendo imágenes', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingVideo(true);
    try {
      for (const file of Array.from(files)) {
        const urlRes = await fetch(`/api/object-storage/presigned-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
        if (!urlRes.ok) throw new Error('Failed to get upload URL');
        const { url, publicUrl } = await urlRes.json();

        await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        setFormData(prev => ({ ...prev, videos: [...prev.videos, publicUrl] }));
      }
      toast({ title: 'Videos subidos' });
    } catch (err) {
      toast({ title: 'Error subiendo videos', variant: 'destructive' });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleBlockedWeek = (week: number) => {
    setFormData(prev => ({
      ...prev,
      blockedWeeks: prev.blockedWeeks.includes(week)
        ? prev.blockedWeeks.filter(w => w !== week)
        : [...prev.blockedWeeks, week]
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...formData.images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.description) {
      toast({ title: 'Completa los campos requeridos', variant: 'destructive' });
      return;
    }

    const payload = {
      ...formData,
      priceHighSeason: formData.priceHighSeason || undefined,
      priceMidSeason: formData.priceMidSeason || undefined,
      priceLowSeason: formData.priceLowSeason || undefined,
      tag: formData.tag || null
    };

    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const sendWhatsAppNotification = (booking: Booking) => {
    const property = properties.find(p => p.id === booking.propertyId);
    const phone = "529984292748";
    const message = encodeURIComponent(
      `Nueva Pre-Reserva en Fractional Living\n\n` +
      `Propiedad: ${property?.title || 'N/A'}\n` +
      `Email: ${booking.email}\n` +
      `Nombre: ${booking.name || 'N/A'}\n` +
      `Teléfono: ${booking.phone || 'N/A'}\n` +
      `Semanas: ${booking.selectedWeeks?.join(', ') || 'N/A'}\n` +
      `Tipo: ${booking.bookingType === 'vacation' ? 'Vacacional' : 'Fracción'}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold">Modo Creador</h1>
              <p className="text-gray-500 text-sm mt-1">Ingresa la contraseña</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className="h-12"
                data-testid="input-password"
              />
              <Button onClick={handleUnlock} className="w-full h-12 bg-gray-900 hover:bg-gray-800" data-testid="button-unlock">
                Acceder
              </Button>
              <Button variant="ghost" onClick={() => setLocation('/')} className="w-full" data-testid="button-back">
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Vista Previa</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver a editar
              </Button>
              <Button onClick={handleSubmit} className="bg-gray-900 hover:bg-gray-800">
                <Save className="w-4 h-4 mr-2" /> {editingProperty ? 'Guardar' : 'Publicar'}
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {formData.images.length > 0 && (
              <div className="aspect-video relative">
                <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                {formData.tag && (
                  <span className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {PROPERTY_TAGS.find(t => t.value === formData.tag)?.label || formData.tag}
                  </span>
                )}
              </div>
            )}
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">{formData.title || 'Sin título'}</h1>
              <p className="text-gray-500 flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4" /> {formData.location || 'Sin ubicación'}
              </p>
              <div className="flex gap-6 mb-6 text-gray-600">
                <span className="flex items-center gap-2"><Bed className="w-5 h-5" /> {formData.bedrooms} hab</span>
                <span className="flex items-center gap-2"><Bath className="w-5 h-5" /> {formData.bathrooms} baños</span>
                <span className="flex items-center gap-2"><Users className="w-5 h-5" /> {formData.maxGuests} huéspedes</span>
              </div>
              <div className="mb-6">
                <h2 className="font-semibold text-xl mb-2">Precio de Fracción</h2>
                <p className="text-3xl font-bold text-teal-600">${formData.price.toLocaleString()} USD</p>
                {(formData.priceHighSeason || formData.priceMidSeason || formData.priceLowSeason) && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    {formData.priceHighSeason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-red-600 font-medium">Temporada Alta</p>
                        <p className="font-bold">${formData.priceHighSeason.toLocaleString()}</p>
                      </div>
                    )}
                    {formData.priceMidSeason && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-600 font-medium">Temporada Media</p>
                        <p className="font-bold">${formData.priceMidSeason.toLocaleString()}</p>
                      </div>
                    )}
                    {formData.priceLowSeason && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-600 font-medium">Temporada Baja</p>
                        <p className="font-bold">${formData.priceLowSeason.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{formData.description}</p>
              {formData.amenities.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-semibold mb-3">Amenidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map(a => (
                      <span key={a} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation('/')} data-testid="button-home">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Panel de Control</h1>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
              {[
                { id: 'properties', label: 'Propiedades', icon: Building },
                { id: 'bookings', label: 'Reservas', icon: Calendar },
                { id: 'categories', label: 'Categorías', icon: Layers },
                { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                  data-testid={`tab-${id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'properties' && (
          <div>
            {!isCreating ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Mis Propiedades</h2>
                    <p className="text-gray-500 text-sm">{properties.length} propiedades publicadas</p>
                  </div>
                  <Button onClick={() => setIsCreating(true)} className="bg-gray-900 hover:bg-gray-800" data-testid="button-new-property">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Propiedad
                  </Button>
                </div>

                {loadingProperties ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-medium mb-1">No hay propiedades</h3>
                    <p className="text-gray-500 text-sm mb-4">Crea tu primera propiedad para comenzar</p>
                    <Button onClick={() => setIsCreating(true)} data-testid="button-create-first">
                      <Plus className="w-4 h-4 mr-2" /> Crear Propiedad
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow" data-testid={`card-property-${property.id}`}>
                        <div className="flex gap-4">
                          <div className="w-32 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                            {property.images?.[0] ? (
                              <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                            {property.tag && (
                              <span className="absolute top-1 left-1 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {PROPERTY_TAGS.find(t => t.value === property.tag)?.label || property.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{property.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {property.location}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms || 0}</span>
                              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms || 0}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {property.maxGuests || 0}</span>
                              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {property.viewCount || 0} vistas</span>
                              <span className="flex items-center gap-1 font-medium text-gray-900">
                                <DollarSign className="w-3.5 h-3.5" /> ${(property.price || 650000).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setLocation(`/property/${property.id}`)} title="Ver" data-testid={`button-view-${property.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => duplicateMutation.mutate(property.id)} title="Duplicar" data-testid={`button-duplicate-${property.id}`}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(property)} title="Editar" data-testid={`button-edit-${property.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteMutation.mutate(property.id)} title="Eliminar" data-testid={`button-delete-${property.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
                    <p className="text-gray-500 text-sm">Completa la información de la propiedad</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(true)} data-testid="button-preview">
                      <Eye className="w-4 h-4 mr-2" /> Vista Previa
                    </Button>
                    <Button variant="ghost" onClick={resetForm} data-testid="button-cancel">
                      <X className="w-4 h-4 mr-2" /> Cancelar
                    </Button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Información Básica</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Título</label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Villa Paraíso Caribe"
                            className="h-11"
                            data-testid="input-title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ubicación</label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Cancún, Quintana Roo"
                            className="h-11"
                            data-testid="input-location"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Categoría</label>
                            <select
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full h-11 px-3 border rounded-lg"
                              data-testid="select-category"
                            >
                              {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Etiqueta</label>
                            <select
                              value={formData.tag}
                              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                              className="w-full h-11 px-3 border rounded-lg"
                              data-testid="select-tag"
                            >
                              {PROPERTY_TAGS.map(tag => (
                                <option key={tag.value} value={tag.value}>{tag.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Descripción</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe la propiedad en detalle..."
                            rows={4}
                            data-testid="input-description"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Precios</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Precio de Fracción (USD)</label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="h-11"
                            data-testid="input-price"
                          />
                        </div>
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Precios por Temporada (Opcional)</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs text-red-600 mb-1 block">Alta</label>
                              <Input
                                type="number"
                                value={formData.priceHighSeason || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceHighSeason: e.target.value ? Number(e.target.value) : null }))}
                                placeholder="0"
                                className="h-10"
                                data-testid="input-price-high"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-yellow-600 mb-1 block">Media</label>
                              <Input
                                type="number"
                                value={formData.priceMidSeason || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceMidSeason: e.target.value ? Number(e.target.value) : null }))}
                                placeholder="0"
                                className="h-10"
                                data-testid="input-price-mid"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-green-600 mb-1 block">Baja</label>
                              <Input
                                type="number"
                                value={formData.priceLowSeason || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceLowSeason: e.target.value ? Number(e.target.value) : null }))}
                                placeholder="0"
                                className="h-10"
                                data-testid="input-price-low"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Detalles</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Habitaciones</label>
                          <Input
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                            className="h-11"
                            data-testid="input-bedrooms"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Baños</label>
                          <Input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                            className="h-11"
                            data-testid="input-bathrooms"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Huéspedes</label>
                          <Input
                            type="number"
                            value={formData.maxGuests}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
                            className="h-11"
                            data-testid="input-guests"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Bloqueo de Semanas</h3>
                        <Button variant="outline" size="sm" onClick={() => setShowWeekBlocker(!showWeekBlocker)} data-testid="button-toggle-weeks">
                          <CalendarOff className="w-4 h-4 mr-2" /> {showWeekBlocker ? 'Ocultar' : 'Gestionar'}
                        </Button>
                      </div>
                      {showWeekBlocker && (
                        <div className="grid grid-cols-13 gap-1">
                          {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                            <button
                              key={week}
                              onClick={() => toggleBlockedWeek(week)}
                              className={cn(
                                "w-8 h-8 rounded text-xs font-medium transition-colors",
                                formData.blockedWeeks.includes(week)
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              )}
                              data-testid={`button-week-${week}`}
                            >
                              {week}
                            </button>
                          ))}
                        </div>
                      )}
                      {formData.blockedWeeks.length > 0 && !showWeekBlocker && (
                        <p className="text-sm text-red-600">
                          {formData.blockedWeeks.length} semanas bloqueadas
                        </p>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Media Adicional</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">URL de Video (YouTube)</label>
                          <Input
                            value={formData.videoUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            className="h-11"
                            data-testid="input-video-url"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">URL de Mapa (Google Maps Embed)</label>
                          <Input
                            value={formData.mapUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="h-11"
                            data-testid="input-map-url"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Imágenes (Arrastra para reordenar)</h3>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:bg-gray-50 transition-colors text-center"
                        data-testid="button-upload-images"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium">Subir imágenes</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
                          </>
                        )}
                      </button>
                      
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {formData.images.map((img, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "relative aspect-square rounded-lg overflow-hidden group cursor-move",
                                draggedIndex === i && "opacity-50"
                              )}
                              draggable
                              onDragStart={() => handleDragStart(i)}
                              onDragOver={(e) => handleDragOver(e, i)}
                              onDragEnd={handleDragEnd}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <GripVertical className="w-6 h-6 text-white" />
                              </div>
                              <button
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                              {i === 0 && (
                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">Principal</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5" /> Galería de Videos
                      </h3>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:bg-gray-50 transition-colors text-center"
                        data-testid="button-upload-videos"
                      >
                        {uploadingVideo ? (
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                        ) : (
                          <>
                            <Video className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium">Subir videos</p>
                            <p className="text-xs text-gray-500 mt-1">MP4, MOV hasta 100MB</p>
                          </>
                        )}
                      </button>
                      
                      {formData.videos.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {formData.videos.map((video, i) => (
                            <div key={i} className="relative aspect-video rounded-lg overflow-hidden group bg-gray-900">
                              <video src={video} className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeVideo(i)}
                                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Amenidades</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {AMENITIES_LIST.map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                              formData.amenities.includes(amenity)
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white hover:bg-gray-50 border-gray-200"
                            )}
                            data-testid={`button-amenity-${amenity}`}
                          >
                            {formData.amenities.includes(amenity) && <Check className="w-3.5 h-3.5" />}
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800"
                      data-testid="button-submit"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingProperty ? 'Guardar Cambios' : 'Publicar Propiedad'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Pre-Reservas</h2>
              <p className="text-gray-500 text-sm">{bookings.length} reservas activas</p>
            </div>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium mb-1">Sin reservas</h3>
                <p className="text-gray-500 text-sm">Las pre-reservas aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  const expiresAt = new Date(booking.expiresAt);
                  const isExpired = expiresAt < new Date();
                  
                  return (
                    <div key={booking.id} className={cn("bg-white rounded-xl border p-4", isExpired && "opacity-50")} data-testid={`card-booking-${booking.id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{property?.title || 'Propiedad'}</h3>
                          <p className="text-sm text-gray-500 mt-1">{booking.email}</p>
                          {booking.name && <p className="text-sm text-gray-600">{booking.name}</p>}
                          {booking.phone && <p className="text-sm text-gray-600">{booking.phone}</p>}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.selectedWeeks.map(w => (
                              <span key={w} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                Sem {w}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-xs font-medium",
                            isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          )}>
                            {isExpired ? 'Expirada' : 'Activa'}
                          </span>
                          <p className="text-xs text-gray-500">
                            {isExpired ? 'Expiró' : 'Expira'}: {expiresAt.toLocaleDateString()}
                          </p>
                          {!isExpired && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => sendWhatsAppNotification(booking)}
                              className="text-green-600 hover:text-green-700"
                              data-testid={`button-whatsapp-${booking.id}`}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Categorías Personalizadas</h2>
              <p className="text-gray-500 text-sm">Gestiona las categorías de propiedades</p>
            </div>
            
            <div className="bg-white rounded-xl border p-6 mb-6">
              <h3 className="font-semibold mb-4">Nueva Categoría</h3>
              <div className="grid grid-cols-4 gap-4">
                <Input
                  placeholder="Nombre (ES)"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-category-name"
                />
                <Input
                  placeholder="Nombre (EN)"
                  value={newCategory.nameEn}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, nameEn: e.target.value }))}
                  data-testid="input-category-name-en"
                />
                <Input
                  placeholder="Slug (url-friendly)"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  data-testid="input-category-slug"
                />
                <Button 
                  onClick={() => {
                    if (newCategory.name && newCategory.nameEn && newCategory.slug) {
                      createCategoryMutation.mutate(newCategory);
                    }
                  }}
                  disabled={!newCategory.name || !newCategory.nameEn || !newCategory.slug}
                  data-testid="button-create-category"
                >
                  <Plus className="w-4 h-4 mr-2" /> Crear
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Categorías Existentes</h3>
              </div>
              {categories.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay categorías personalizadas. Usando categorías por defecto.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex items-center justify-between" data-testid={`category-${cat.id}`}>
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        <p className="text-sm text-gray-500">{cat.nameEn} • /{cat.slug}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => deleteCategoryMutation.mutate(cat.id)}
                        data-testid={`button-delete-category-${cat.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Estadísticas</h2>
              <p className="text-gray-500 text-sm">Resumen de tu actividad</p>
            </div>
            
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{properties.length}</p>
                    <p className="text-sm text-gray-500">Propiedades</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{bookings.filter(b => new Date(b.expiresAt) > new Date()).length}</p>
                    <p className="text-sm text-gray-500">Reservas Activas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Visitas Totales</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${(properties.reduce((sum, p) => sum + (p.price || 650000), 0)).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Valor Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4">Visitas por Propiedad</h3>
              <div className="space-y-3">
                {properties.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map(property => (
                  <div key={property.id} className="flex items-center gap-4" data-testid={`stat-property-${property.id}`}>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.title}</p>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{(property.viewCount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">visitas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
