import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, BarChart3, Building, Calendar, Plus, Trash2, Edit, Loader2, Lock,
  Image, MapPin, Bed, Bath, Users, DollarSign, Save, X, Upload, Check, Eye,
  Video, Copy, CalendarOff, Layers, GripVertical, MessageCircle, FileText, Navigation, Link2
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

interface NavButton {
  id: string;
  position: number;
  name: string;
  nameEn: string | null;
  link: string;
  image: string | null;
  isActive: boolean;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
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

const DEFAULT_TEXTS = [
  { key: 'welcome_tagline_es', label: 'Tagline (ES)', default: 'Propiedad fraccionada de lujo en el Caribe' },
  { key: 'welcome_tagline_en', label: 'Tagline (EN)', default: 'Luxury fractional ownership in the Caribbean' },
  { key: 'company_name', label: 'Nombre empresa', default: 'All Global Holding LLC' },
  { key: 'whatsapp_number', label: 'WhatsApp', default: '529984292748' },
  { key: 'btn_explore_es', label: 'Botón Explorar (ES)', default: 'EXPLORAR' },
  { key: 'btn_explore_en', label: 'Botón Explorar (EN)', default: 'EXPLORE' },
  { key: 'btn_contact_es', label: 'Botón Contactar (ES)', default: 'CONTACTAR' },
  { key: 'btn_contact_en', label: 'Botón Contactar (EN)', default: 'CONTACT' },
  { key: 'cta_title_es', label: 'CTA Título (ES)', default: '¿Listo para invertir?' },
  { key: 'cta_title_en', label: 'CTA Título (EN)', default: 'Ready to invest?' },
  { key: 'cta_subtitle_es', label: 'CTA Subtítulo (ES)', default: 'Agenda una llamada con nuestro equipo.' },
  { key: 'cta_subtitle_en', label: 'CTA Subtítulo (EN)', default: 'Schedule a call with our team.' },
  { key: 'footer_copyright', label: 'Copyright', default: '© 2024 All Global Holding LLC' },
];

export default function CreatorDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const navImageRef = useRef<HTMLInputElement>(null);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [creatorToken, setCreatorToken] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'navigation' | 'content' | 'bookings' | 'stats'>('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showWeekBlocker, setShowWeekBlocker] = useState(false);
  const [editingNavButton, setEditingNavButton] = useState<NavButton | null>(null);
  const [uploadingNavImage, setUploadingNavImage] = useState(false);

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

  const [navForm, setNavForm] = useState({
    name: '',
    nameEn: '',
    link: '',
    image: '',
    position: 0
  });

  const [textValues, setTextValues] = useState<Record<string, string>>({});

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

  const { data: navButtons = [] } = useQuery<NavButton[]>({
    queryKey: ['nav-buttons'],
    queryFn: async () => {
      const res = await fetch('/api/nav-buttons');
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isUnlocked
  });

  const { data: siteSettings = [] } = useQuery<SiteSetting[]>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings');
      if (!res.ok) return [];
      const settings = await res.json();
      const vals: Record<string, string> = {};
      settings.forEach((s: SiteSetting) => { vals[s.key] = s.value; });
      setTextValues(vals);
      return settings;
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
      toast({ title: 'Propiedad creada' });
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

  const saveNavMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingNavButton ? `/api/nav-buttons/${editingNavButton.id}` : '/api/nav-buttons';
      const method = editingNavButton ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: editingNavButton ? 'Botón actualizado' : 'Botón creado' });
      queryClient.invalidateQueries({ queryKey: ['nav-buttons'] });
      setEditingNavButton(null);
      setNavForm({ name: '', nameEn: '', link: '', image: '', position: 0 });
    }
  });

  const deleteNavMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/nav-buttons/${id}`, {
        method: 'DELETE',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      toast({ title: 'Botón eliminado' });
      queryClient.invalidateQueries({ queryKey: ['nav-buttons'] });
    }
  });

  const saveTextMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify({ key, value })
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Texto guardado' });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
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
        const urlRes = await fetch('/api/uploads/request-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type })
        });
        if (!urlRes.ok) throw new Error('Failed to get upload URL');
        const { uploadURL, objectPath } = await urlRes.json();

        await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        setFormData(prev => ({ ...prev, images: [...prev.images, objectPath] }));
      }
      toast({ title: 'Imágenes subidas' });
    } catch (err) {
      console.error('Upload error:', err);
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
        const urlRes = await fetch('/api/uploads/request-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type })
        });
        if (!urlRes.ok) throw new Error('Failed to get upload URL');
        const { uploadURL, objectPath } = await urlRes.json();

        await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        setFormData(prev => ({ ...prev, videos: [...prev.videos, objectPath] }));
      }
      toast({ title: 'Videos subidos' });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Error subiendo videos', variant: 'destructive' });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleNavImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingNavImage(true);
    try {
      const file = files[0];
      const urlRes = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type })
      });
      if (!urlRes.ok) throw new Error('Failed to get upload URL');
      const { uploadURL, objectPath } = await urlRes.json();

      await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      setNavForm(prev => ({ ...prev, image: objectPath }));
      toast({ title: 'Imagen subida' });
    } catch (err) {
      toast({ title: 'Error subiendo imagen', variant: 'destructive' });
    } finally {
      setUploadingNavImage(false);
      if (navImageRef.current) navImageRef.current.value = '';
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
    const phone = textValues['whatsapp_number'] || "529984292748";
    const message = encodeURIComponent(
      `Nueva Pre-Reserva\n\n` +
      `Propiedad: ${property?.title || 'N/A'}\n` +
      `Email: ${booking.email}\n` +
      `Nombre: ${booking.name || 'N/A'}\n` +
      `Teléfono: ${booking.phone || 'N/A'}\n` +
      `Semanas: ${booking.selectedWeeks?.join(', ') || 'N/A'}`
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
              />
              <Button onClick={handleUnlock} className="w-full h-12 bg-gray-900 hover:bg-gray-800">
                Acceder
              </Button>
              <Button variant="ghost" onClick={() => setLocation('/')} className="w-full">
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-base font-semibold">Modo Creador</h1>
            </div>
          </div>
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-1">
            {[
              { id: 'properties', label: 'Propiedades', icon: Building },
              { id: 'navigation', label: 'Navegación', icon: Navigation },
              { id: 'content', label: 'Contenido', icon: FileText },
              { id: 'bookings', label: 'Reservas', icon: Calendar },
              { id: 'stats', label: 'Analytics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === id ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div>
            {!isCreating ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">{properties.length} propiedades</p>
                  <Button onClick={() => setIsCreating(true)} size="sm" className="bg-gray-900">
                    <Plus className="w-4 h-4 mr-1" /> Nueva
                  </Button>
                </div>

                {loadingProperties ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-white rounded-xl border-2 border-dashed p-12 text-center">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No hay propiedades</p>
                    <Button onClick={() => setIsCreating(true)} className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Crear
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white rounded-xl border p-3">
                        <div className="flex gap-3">
                          <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {property.images?.[0] ? (
                              <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{property.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{property.location}</p>
                            <p className="text-xs text-gray-400 mt-1">{property.viewCount || 0} vistas</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(property)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => duplicateMutation.mutate(property.id)}>
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteMutation.mutate(property.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">{editingProperty ? 'Editar' : 'Nueva'} Propiedad</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                      <Eye className="w-4 h-4 mr-1" /> Vista Previa
                    </Button>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl border p-4 space-y-4">
                    <Input placeholder="Título" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                    <Input placeholder="Ubicación" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} />
                    <Textarea placeholder="Descripción" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                      <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="h-10 px-3 border rounded-lg text-sm">
                        {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <select value={formData.tag} onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))} className="h-10 px-3 border rounded-lg text-sm">
                        {PROPERTY_TAGS.map(tag => <option key={tag.value} value={tag.value}>{tag.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-sm mb-3">Precio</h3>
                    <Input type="number" placeholder="Precio USD" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} className="mb-3" />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-red-500">Alta</label>
                        <Input type="number" placeholder="0" value={formData.priceHighSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceHighSeason: e.target.value ? Number(e.target.value) : null }))} />
                      </div>
                      <div>
                        <label className="text-xs text-yellow-500">Media</label>
                        <Input type="number" placeholder="0" value={formData.priceMidSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceMidSeason: e.target.value ? Number(e.target.value) : null }))} />
                      </div>
                      <div>
                        <label className="text-xs text-green-500">Baja</label>
                        <Input type="number" placeholder="0" value={formData.priceLowSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceLowSeason: e.target.value ? Number(e.target.value) : null }))} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-sm mb-3">Detalles</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Bed className="w-3 h-3" /> Hab</label>
                        <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Bath className="w-3 h-3" /> Baños</label>
                        <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> Huésp</label>
                        <Input type="number" value={formData.maxGuests} onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-sm mb-3">Imágenes</h3>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50">
                      {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <><Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" /><p className="text-xs text-gray-500">Subir imágenes</p></>}
                    </button>
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded overflow-hidden" draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => handleDragOver(e, i)} onDragEnd={handleDragEnd}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-sm mb-3">Videos</h3>
                    <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                    <button onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo} className="w-full border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50">
                      {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><Video className="w-5 h-5 mx-auto mb-1 text-gray-400" /><p className="text-xs text-gray-500">Subir videos</p></>}
                    </button>
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {formData.videos.map((vid, i) => (
                          <div key={i} className="relative aspect-video rounded overflow-hidden bg-gray-900">
                            <video src={vid} className="w-full h-full object-cover" />
                            <button onClick={() => removeVideo(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Bloquear Semanas</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowWeekBlocker(!showWeekBlocker)}>
                        <CalendarOff className="w-3.5 h-3.5 mr-1" /> {formData.blockedWeeks.length}
                      </Button>
                    </div>
                    {showWeekBlocker && (
                      <div className="grid grid-cols-13 gap-1">
                        {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                          <button key={week} onClick={() => toggleBlockedWeek(week)} className={cn("w-6 h-6 rounded text-[10px] font-medium", formData.blockedWeeks.includes(week) ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600")}>
                            {week}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-sm mb-3">Amenidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {AMENITIES_LIST.map((amenity) => (
                        <button key={amenity} onClick={() => toggleAmenity(amenity)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border", formData.amenities.includes(amenity) ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200")}>
                          {formData.amenities.includes(amenity) && <Check className="w-3 h-3 inline mr-1" />}{amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="w-full h-12 bg-gray-900">
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{editingProperty ? 'Guardar' : 'Publicar'}</>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-4">Botones de Navegación</h3>
              <p className="text-xs text-gray-500 mb-4">Estos botones aparecen en la página de inicio con imagen</p>
              
              <div className="space-y-3 mb-4">
                <Input placeholder="Nombre (ES)" value={navForm.name} onChange={(e) => setNavForm(prev => ({ ...prev, name: e.target.value }))} />
                <Input placeholder="Nombre (EN)" value={navForm.nameEn} onChange={(e) => setNavForm(prev => ({ ...prev, nameEn: e.target.value }))} />
                <Input placeholder="Link (ej: /last-minute-capital)" value={navForm.link} onChange={(e) => setNavForm(prev => ({ ...prev, link: e.target.value }))} />
                <Input type="number" placeholder="Posición" value={navForm.position} onChange={(e) => setNavForm(prev => ({ ...prev, position: Number(e.target.value) }))} />
                
                <input ref={navImageRef} type="file" accept="image/*" onChange={handleNavImageUpload} className="hidden" />
                <button onClick={() => navImageRef.current?.click()} disabled={uploadingNavImage} className="w-full border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50">
                  {uploadingNavImage ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : navForm.image ? (
                    <img src={navForm.image} alt="" className="h-20 mx-auto object-cover rounded" />
                  ) : (
                    <><Image className="w-5 h-5 mx-auto mb-1 text-gray-400" /><p className="text-xs text-gray-500">Subir imagen del botón</p></>
                  )}
                </button>

                <Button onClick={() => saveNavMutation.mutate({ ...navForm, isActive: true })} disabled={!navForm.name || !navForm.link} className="w-full">
                  <Plus className="w-4 h-4 mr-1" /> {editingNavButton ? 'Actualizar' : 'Agregar'} Botón
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border divide-y">
              {navButtons.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Navigation className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No hay botones de navegación</p>
                </div>
              ) : (
                navButtons.sort((a, b) => a.position - b.position).map(btn => (
                  <div key={btn.id} className="p-3 flex items-center gap-3">
                    <div className="w-16 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      {btn.image ? <img src={btn.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Image className="w-5 h-5" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{btn.name}</p>
                      <p className="text-xs text-gray-500 truncate">{btn.link}</p>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setEditingNavButton(btn); setNavForm({ name: btn.name, nameEn: btn.nameEn || '', link: btn.link, image: btn.image || '', position: btn.position }); }}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteNavMutation.mutate(btn.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-4">Textos del Sitio</h3>
              <p className="text-xs text-gray-500 mb-4">Edita todos los textos que aparecen en la app</p>
              
              <div className="space-y-4">
                {DEFAULT_TEXTS.map(({ key, label, default: defaultVal }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                    <div className="flex gap-2">
                      <Input
                        value={textValues[key] ?? defaultVal}
                        onChange={(e) => setTextValues(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={defaultVal}
                        className="flex-1"
                      />
                      <Button size="sm" variant="outline" onClick={() => saveTextMutation.mutate({ key, value: textValues[key] ?? defaultVal })}>
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">{bookings.length} reservas</p>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Sin reservas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  const expiresAt = new Date(booking.expiresAt);
                  const isExpired = expiresAt < new Date();
                  
                  return (
                    <div key={booking.id} className={cn("bg-white rounded-xl border p-4", isExpired && "opacity-50")}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{property?.title || 'Propiedad'}</h3>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                          {booking.name && <p className="text-xs text-gray-600">{booking.name}</p>}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.selectedWeeks.map(w => (
                              <span key={w} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">Sem {w}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                            {isExpired ? 'Expirada' : 'Activa'}
                          </span>
                          {!isExpired && (
                            <Button variant="outline" size="sm" onClick={() => sendWhatsAppNotification(booking)} className="text-green-600">
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
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

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{properties.length}</p>
                    <p className="text-xs text-gray-500">Propiedades</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{bookings.filter(b => new Date(b.expiresAt) > new Date()).length}</p>
                    <p className="text-xs text-gray-500">Reservas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{totalViews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Vistas</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">${(properties.reduce((sum, p) => sum + (p.price || 650000), 0) / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">Valor</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-4">Vistas por Propiedad</h3>
              <div className="space-y-3">
                {properties.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map(property => (
                  <div key={property.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      {property.images?.[0] ? <img src={property.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-gray-300" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{property.title}</p>
                    </div>
                    <p className="font-bold text-sm">{(property.viewCount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Vista Previa</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowPreview(false)}>Cerrar</Button>
                  <Button size="sm" onClick={handleSubmit}><Save className="w-4 h-4 mr-1" /> Guardar</Button>
                </div>
              </div>
              {formData.images[0] && (
                <div className="aspect-video relative">
                  <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                  {formData.tag && <span className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm">{PROPERTY_TAGS.find(t => t.value === formData.tag)?.label}</span>}
                </div>
              )}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{formData.title || 'Sin título'}</h1>
                <p className="text-gray-500 flex items-center gap-1 mb-4"><MapPin className="w-4 h-4" /> {formData.location || 'Sin ubicación'}</p>
                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {formData.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {formData.bathrooms}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {formData.maxGuests}</span>
                </div>
                <p className="text-2xl font-bold text-teal-600 mb-4">${formData.price.toLocaleString()} USD</p>
                <p className="text-gray-600 whitespace-pre-wrap">{formData.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
