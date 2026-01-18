import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, BarChart3, Building, Calendar, Plus, Trash2, Edit, Loader2, Lock,
  Image, MapPin, Bed, Bath, Users, DollarSign, Save, X, Upload, Check, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  images: string[];
  amenities: string[];
  price: number;
  videoUrl: string | null;
  mapUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

interface Booking {
  id: string;
  propertyId: string;
  email: string;
  selectedWeeks: number[];
  bookingType: string;
  expiresAt: string;
  createdAt: string;
}

const AMENITIES_LIST = [
  'WiFi', 'Alberca', 'Cocina', 'Aire Acondicionado', 'Estacionamiento',
  'Gimnasio', 'Vista al Mar', 'Terraza', 'BBQ', 'Lavadora',
  'TV', 'Jacuzzi', 'Seguridad 24/7', 'Playa Privada', 'Concierge'
];

export default function CreatorDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [creatorToken, setCreatorToken] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'stats'>('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: 'Propiedades',
    images: [] as string[],
    amenities: [] as string[],
    price: 650000,
    videoUrl: '',
    mapUrl: '',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6
  });

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
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad eliminada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' })
  });

  const resetForm = () => {
    setFormData({
      title: '', location: '', description: '', category: 'Propiedades',
      images: [], amenities: [], price: 650000, videoUrl: '', mapUrl: '',
      bedrooms: 2, bathrooms: 2, maxGuests: 6
    });
    setEditingProperty(null);
    setIsCreating(false);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      description: property.description,
      category: property.category,
      images: property.images || [],
      amenities: property.amenities || [],
      price: property.price || 650000,
      videoUrl: property.videoUrl || '',
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms || 2,
      bathrooms: property.bathrooms || 2,
      maxGuests: property.maxGuests || 6
    });
    setIsCreating(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location) {
      toast({ title: 'Completa título y ubicación', variant: 'destructive' });
      return;
    }
    const data = { ...formData, conditions: [] };
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const res = await fetch('/api/uploads/request-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type })
        });
        
        if (!res.ok) throw new Error('Failed to get upload URL');
        const { uploadURL, objectPath } = await res.json();
        
        const uploadRes = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload');
        newImages.push(objectPath);
      } catch (err) {
        console.error('Upload error:', err);
        toast({ title: 'Error subiendo imagen', variant: 'destructive' });
      }
    }

    if (newImages.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      toast({ title: `${newImages.length} imagen(es) subida(s)` });
    }
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

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
        toast({ title: 'Acceso concedido' });
      } else {
        toast({ title: 'Contraseña incorrecta', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error de conexión', variant: 'destructive' });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-semibold">Panel de Control</h1>
              <p className="text-gray-500 mt-1">Ingresa tu contraseña</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Panel de Control</h1>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'properties', label: 'Propiedades', icon: Building },
                { id: 'bookings', label: 'Reservas', icon: Calendar },
                { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
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
                  <Button onClick={() => setIsCreating(true)} className="bg-gray-900 hover:bg-gray-800">
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
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Crear Propiedad
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-32 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {property.images?.[0] ? (
                              <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-300" />
                              </div>
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
                              <span className="flex items-center gap-1 font-medium text-gray-900">
                                <DollarSign className="w-3.5 h-3.5" /> ${(property.price || 650000).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setLocation(`/property/${property.id}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(property)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteMutation.mutate(property.id)}>
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
                  <Button variant="ghost" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" /> Cancelar
                  </Button>
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
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ubicación</label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Cancún, Quintana Roo"
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Descripción</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe la propiedad en detalle..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Precio de Fracción (MXN)</label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="h-11"
                          />
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
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Baños</label>
                          <Input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Huéspedes</label>
                          <Input
                            type="number"
                            value={formData.maxGuests}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
                            className="h-11"
                          />
                        </div>
                      </div>
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
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">URL de Mapa (Google Maps Embed)</label>
                          <Input
                            value={formData.mapUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">Imágenes</h3>
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
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
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
                    <div key={booking.id} className={cn("bg-white rounded-xl border p-4", isExpired && "opacity-50")}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{property?.title || 'Propiedad'}</h3>
                          <p className="text-sm text-gray-500 mt-1">{booking.email}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.selectedWeeks.map(w => (
                              <span key={w} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                Sem {w}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-xs font-medium",
                            isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          )}>
                            {isExpired ? 'Expirada' : 'Activa'}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {isExpired ? 'Expiró' : 'Expira'}: {expiresAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Estadísticas</h2>
              <p className="text-gray-500 text-sm">Resumen de tu actividad</p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
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
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${(properties.reduce((sum, p) => sum + (p.price || 650000), 0)).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Valor Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
