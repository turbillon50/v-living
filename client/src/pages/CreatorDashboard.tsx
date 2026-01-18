import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  BarChart3, 
  Building, 
  Calendar,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Lock,
  Image,
  Video,
  MapPin,
  Bed,
  Bath,
  Users,
  DollarSign,
  Save,
  X
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
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [creatorToken, setCreatorToken] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'stats'>('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: 'Propiedades',
    images: [''],
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
        headers: { 
          'Content-Type': 'application/json',
          'X-Creator-Token': creatorToken
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad creada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      resetForm();
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Creator-Token': creatorToken
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad actualizada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      resetForm();
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/properties/${id}`, { 
        method: 'DELETE',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Propiedad eliminada' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      category: 'Propiedades',
      images: [''],
      amenities: [],
      price: 650000,
      videoUrl: '',
      mapUrl: '',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 6
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
      images: property.images.length > 0 ? property.images : [''],
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

    const data = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      conditions: []
    };

    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
        toast({ title: 'Modo Creador Activado' });
      } else {
        toast({ title: 'Contraseña incorrecta', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error de conexión', variant: 'destructive' });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 border-white/20 text-white">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <CardTitle className="text-2xl">Centro de Control</CardTitle>
            <p className="text-white/60 text-sm">Ingresa la contraseña de Modo Creador</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button onClick={handleUnlock} className="w-full bg-cyan-500 hover:bg-cyan-600">
              Acceder
            </Button>
            <Button variant="ghost" onClick={() => setLocation('/')} className="w-full text-white/60">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-medium">Modo Creador</h1>
          </div>
          <div className="flex gap-2">
            {['properties', 'bookings', 'stats'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab as any)}
                className={activeTab === tab ? 'bg-cyan-500' : ''}
              >
                {tab === 'properties' && <Building className="w-4 h-4 mr-2" />}
                {tab === 'bookings' && <Calendar className="w-4 h-4 mr-2" />}
                {tab === 'stats' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab === 'properties' ? 'Propiedades' : tab === 'bookings' ? 'Reservas' : 'Estadísticas'}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {!isCreating ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Mis Propiedades ({properties.length})</h2>
                  <Button onClick={() => setIsCreating(true)} className="bg-cyan-500 hover:bg-cyan-600">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Propiedad
                  </Button>
                </div>

                {loadingProperties ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : properties.length === 0 ? (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="py-12 text-center">
                      <Building className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                      <p className="text-slate-400">No hay propiedades. Crea la primera.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {properties.map((property) => (
                      <Card key={property.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                              {property.images?.[0] ? (
                                <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="w-8 h-8 text-slate-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{property.title}</h3>
                              <p className="text-sm text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {property.location}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {property.bedrooms || 0}</span>
                                <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.bathrooms || 0}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {property.maxGuests || 0}</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${(property.price || 650000).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(property)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-400" onClick={() => deleteMutation.mutate(property.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
                  <Button variant="ghost" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" /> Cancelar
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base">Información Básica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400">Título</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ej: Villa Paraíso Caribe"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Ubicación</label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Ej: Cancún, Quintana Roo"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Descripción</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe la propiedad..."
                          className="bg-slate-700 border-slate-600 min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Precio (MXN)</label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm text-slate-400">Recámaras</label>
                          <Input
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Baños</label>
                          <Input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Huéspedes</label>
                          <Input
                            type="number"
                            value={formData.maxGuests}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Image className="w-4 h-4" /> Imágenes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={img}
                            onChange={(e) => updateImage(i, e.target.value)}
                            placeholder="URL de imagen..."
                            className="bg-slate-700 border-slate-600"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeImage(i)} className="text-red-400">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addImageField} className="w-full border-dashed">
                        <Plus className="w-4 h-4 mr-2" /> Agregar Imagen
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Video className="w-4 h-4" /> Video y Mapa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400">URL de Video (YouTube/Vimeo)</label>
                        <Input
                          value={formData.videoUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="https://youtube.com/..."
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">URL de Google Maps</label>
                        <Input
                          value={formData.mapUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                          placeholder="https://maps.google.com/..."
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base">Amenidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {AMENITIES_LIST.map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={cn(
                              "px-3 py-1 rounded-full text-sm transition-all",
                              formData.amenities.includes(amenity)
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            )}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 h-12"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> {editingProperty ? 'Actualizar Propiedad' : 'Crear Propiedad'}</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Reservas ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400">No hay reservas aún</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.email}</p>
                          <p className="text-sm text-slate-400">
                            Semanas: {booking.selectedWeeks?.join(', ') || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500">
                            Tipo: {booking.bookingType} | Expira: {new Date(booking.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://wa.me/529984292748?text=Seguimiento reserva: ${booking.email}`, '_blank')}
                        >
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Building className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <p className="text-3xl font-bold">{properties.length}</p>
                <p className="text-slate-400 text-sm">Propiedades</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-3xl font-bold">{bookings.length}</p>
                <p className="text-slate-400 text-sm">Reservas</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-3xl font-bold">{new Set(bookings.map(b => b.email)).size}</p>
                <p className="text-slate-400 text-sm">Usuarios Únicos</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
