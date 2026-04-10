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
  subtitle: string | null;
  category: string;
  location: string;
  country: string | null;
  description: string;
  images: string[];
  videos: string[];
  amenities: string[];
  conditions: string[];
  blockedWeeks: number[];
  creatorBlockedWeeks: number[];
  price: number;
  fractionPrice: number | null;
  totalFractions: number | null;
  availableFractions: number | null;
  weeksPerFraction: number | null;
  currency: string | null;
  priceHighSeason: number | null;
  priceMidSeason: number | null;
  priceLowSeason: number | null;
  videoUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  mapUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqMeters: number | null;
  viewCount: number;
  tag: string | null;
  isFeatured: boolean | null;
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

const LINK_TYPES = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'video', label: 'Video' },
  { value: 'link', label: 'Enlace' },
];

interface MultiLink {
  id: string;
  title: string;
  url: string;
  type: string;
  position: number;
  isActive: boolean;
}

function LinksManager({ creatorToken }: { creatorToken: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingLink, setEditingLink] = useState<MultiLink | null>(null);
  const [form, setForm] = useState({ title: '', url: '', type: 'link', position: 0 });

  const { data: links = [], isLoading } = useQuery<MultiLink[]>({
    queryKey: ['multilinks'],
    queryFn: async () => {
      const res = await fetch('/api/multilinks');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/multilinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Link agregado' });
      queryClient.invalidateQueries({ queryKey: ['multilinks'] });
      setIsAdding(false);
      setForm({ title: '', url: '', type: 'link', position: 0 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/multilinks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Creator-Token': creatorToken },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Link actualizado' });
      queryClient.invalidateQueries({ queryKey: ['multilinks'] });
      setEditingLink(null);
      setForm({ title: '', url: '', type: 'link', position: 0 });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/multilinks/${id}`, {
        method: 'DELETE',
        headers: { 'X-Creator-Token': creatorToken }
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      toast({ title: 'Link eliminado' });
      queryClient.invalidateQueries({ queryKey: ['multilinks'] });
    }
  });

  const handleEdit = (link: MultiLink) => {
    setEditingLink(link);
    setForm({ title: link.title, url: link.url, type: link.type, position: link.position });
    setIsAdding(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.url) {
      toast({ title: 'Completa título y URL', variant: 'destructive' });
      return;
    }
    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, data: { ...form, isActive: true } });
    } else {
      createMutation.mutate({ ...form, isActive: true, position: links.length });
    }
  };

  const toggleActive = (link: MultiLink) => {
    updateMutation.mutate({ id: link.id, data: { isActive: !link.isActive } });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#555]" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-[#717171]">{links.length} links</p>
          <p className="text-xs text-[#bbb]">Página: /links</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingLink(null); setForm({ title: '', url: '', type: 'link', position: 0 }); }} size="sm" className="bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90">
          <Plus className="w-4 h-4 mr-1" /> Nuevo
        </Button>
      </div>

      {isAdding && (
        <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#222]">{editingLink ? 'Editar Link' : 'Nuevo Link'}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#717171]" onClick={() => { setIsAdding(false); setEditingLink(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#717171] mb-1 block">Título</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Instagram" className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
            </div>
            <div>
              <label className="text-xs text-[#717171] mb-1 block">URL</label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://instagram.com/..." className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
            </div>
            <div>
              <label className="text-xs text-[#717171] mb-1 block">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 rounded-md bg-[#f0f0f0] border border-[#ddd] text-[#222] text-sm">
                {LINK_TYPES.map(t => <option key={t.value} value={t.value} className="bg-white text-[#222]">{t.label}</option>)}
              </select>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90">
              <Save className="w-4 h-4 mr-1" /> {editingLink ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      )}

      {links.length === 0 && !isAdding ? (
        <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] border-dashed p-12 text-center">
          <Link2 className="w-12 h-12 mx-auto mb-4 text-[#bbb]" />
          <p className="text-[#717171] mb-2">No hay links</p>
          <p className="text-xs text-[#bbb] mb-4">Agrega redes sociales y videos de interés</p>
          <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-[#059669] to-[#06b6d4]" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Agregar Link
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className={cn("bg-[#f7f7f7] rounded-xl border p-3 flex items-center gap-3", link.isActive ? "border-[#ebebeb]" : "border-[#ebebeb] opacity-50")}>
              <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-[#555]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-[#222] truncate">{link.title}</h4>
                <p className="text-xs text-[#999] truncate">{link.url}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#717171] hover:bg-[#f0f0f0]" onClick={() => toggleActive(link)}>
                  {link.isActive ? <Eye className="w-4 h-4" /> : <CalendarOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#717171] hover:bg-[#f0f0f0]" onClick={() => handleEdit(link)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/20" onClick={() => deleteMutation.mutate(link.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CRMUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interests: string[];
  primaryInterest: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

const INTEREST_LABELS: Record<string, string> = {
  'comprar_fracciones': 'Comprar fracciones',
  'last_minute_capital': 'Last Minute Capital',
  'property_associate': 'Property Associate',
  'profile_associate': 'Profile Associate',
  'broker': 'Broker/Afiliado',
  'informacion': 'Solo información'
};

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Nuevo', color: 'bg-black/5' },
  { value: 'contacted', label: 'Contactado', color: 'bg-[#999]' },
  { value: 'in_progress', label: 'En proceso', color: 'bg-[#059669]' },
  { value: 'converted', label: 'Convertido', color: 'bg-[#059669]' },
  { value: 'lost', label: 'Perdido', color: 'bg-[#888]' }
];

function UsersCRM({ creatorToken }: { creatorToken: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterInterest, setFilterInterest] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const { data: users = [], isLoading } = useQuery<CRMUser[]>({
    queryKey: ['crm-users'],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': creatorToken }
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': creatorToken },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-users'] });
      toast({ title: 'Estado actualizado' });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const res = await fetch(`/api/users/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': creatorToken },
        body: JSON.stringify({ notes })
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-users'] });
      setEditingNotes(null);
      toast({ title: 'Notas guardadas' });
    }
  });

  const filteredUsers = users.filter(u => {
    if (filterInterest && !u.interests.includes(filterInterest)) return false;
    if (filterStatus && u.status !== filterStatus) return false;
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'País', 'Intereses', 'Estado', 'Fecha'];
    const rows = filteredUsers.map(u => [
      u.name,
      u.email,
      u.phone,
      u.country,
      u.interests.map(i => INTEREST_LABELS[i] || i).join('; '),
      STATUS_OPTIONS.find(s => s.value === u.status)?.label || u.status,
      new Date(u.createdAt).toLocaleDateString()
    ]);
    
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#555]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-lg font-semibold text-[#222]">CRM - {users.length} usuarios registrados</h2>
        <Button onClick={exportToCSV} size="sm" variant="outline" className="bg-[#f7f7f7] border-[#ddd] text-[#222]">
          <Copy className="w-4 h-4 mr-1" /> Exportar CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={filterInterest}
          onChange={(e) => setFilterInterest(e.target.value)}
          className="px-3 py-2 bg-[#f7f7f7] border border-[#ddd] rounded-lg text-[#222] text-sm"
        >
          <option value="" className="bg-white">Todos los intereses</option>
          {Object.entries(INTEREST_LABELS).map(([key, label]) => (
            <option key={key} value={key} className="bg-white">{label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-[#f7f7f7] border border-[#ddd] rounded-lg text-[#222] text-sm"
        >
          <option value="" className="bg-white">Todos los estados</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">{opt.label}</option>
          ))}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-[#f7f7f7] rounded-xl p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-[#bbb]" />
          <p className="text-[#717171]">No hay usuarios registrados aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const statusInfo = STATUS_OPTIONS.find(s => s.value === user.status) || STATUS_OPTIONS[0];
            return (
              <div key={user.id} className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-[#222]">{user.name}</h3>
                    <p className="text-sm text-[#717171]">{user.email}</p>
                    <p className="text-sm text-[#999]">{user.phone} • {user.country}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={user.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: user.id, status: e.target.value })}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium text-[#222]", statusInfo.color)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-[#222]">{opt.label}</option>
                      ))}
                    </select>
                    <span className="text-xs text-[#999]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.interests.map((interest) => (
                      <span key={interest} className="px-2 py-1 bg-[#f0f0f0] text-[#555] rounded text-xs">
                        {INTEREST_LABELS[interest] || interest}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <a
                    href={`https://wa.me/${user.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white rounded text-xs flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                  <a
                    href={`mailto:${user.email}`}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#222] rounded text-xs"
                  >
                    Email
                  </a>
                  <button
                    onClick={() => { setEditingNotes(user.id); setNotesValue(user.notes || ''); }}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#222] rounded text-xs"
                  >
                    {user.notes ? 'Ver notas' : 'Agregar nota'}
                  </button>
                </div>

                {editingNotes === user.id && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      placeholder="Notas internas..."
                      className="bg-[#f7f7f7] border-[#ddd] text-[#222] min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateNotesMutation.mutate({ id: user.id, notes: notesValue })}
                        className="bg-gradient-to-r from-[#059669] to-[#06b6d4]"
                      >
                        <Save className="w-3 h-3 mr-1" /> Guardar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<'properties' | 'navigation' | 'content' | 'bookings' | 'stats' | 'links' | 'users'>('properties');
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
    subtitle: '',
    location: '',
    country: 'México',
    description: '',
    category: 'Propiedades',
    images: [] as string[],
    videos: [] as string[],
    amenities: [] as string[],
    conditions: [] as string[],
    blockedWeeks: [] as number[],
    creatorBlockedWeeks: [] as number[],
    price: 650000,
    fractionPrice: 65000,
    totalFractions: 14,
    availableFractions: 14,
    weeksPerFraction: 3,
    currency: 'MXN',
    priceHighSeason: null as number | null,
    priceMidSeason: null as number | null,
    priceLowSeason: null as number | null,
    videoUrl: '',
    address: '',
    latitude: '',
    longitude: '',
    mapUrl: '',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    sqMeters: 150,
    tag: '',
    isFeatured: false
  });
  const [geocoding, setGeocoding] = useState(false);
  
  const [newCondition, setNewCondition] = useState('');

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
      title: '', subtitle: '', location: '', country: 'México', description: '', category: 'Propiedades',
      images: [], videos: [], amenities: [], conditions: [], blockedWeeks: [], creatorBlockedWeeks: [],
      price: 650000, fractionPrice: 65000, totalFractions: 14, availableFractions: 14, weeksPerFraction: 3, currency: 'MXN',
      priceHighSeason: null, priceMidSeason: null, priceLowSeason: null,
      videoUrl: '', address: '', latitude: '', longitude: '', mapUrl: '', bedrooms: 2, bathrooms: 2, maxGuests: 6, sqMeters: 150, tag: '', isFeatured: false
    });
    setNewCondition('');
    setEditingProperty(null);
    setIsCreating(false);
    setShowPreview(false);
    setShowWeekBlocker(false);
  };

  const handleEdit = (property: Property) => {
    setFormData({
      title: property.title,
      subtitle: property.subtitle || '',
      location: property.location,
      country: property.country || 'México',
      description: property.description,
      category: property.category,
      images: property.images || [],
      videos: property.videos || [],
      amenities: property.amenities || [],
      conditions: property.conditions || [],
      blockedWeeks: property.blockedWeeks || [],
      creatorBlockedWeeks: property.creatorBlockedWeeks || [],
      price: property.price || 650000,
      fractionPrice: property.fractionPrice || 65000,
      totalFractions: property.totalFractions || 14,
      availableFractions: property.availableFractions || 14,
      weeksPerFraction: property.weeksPerFraction || 3,
      currency: property.currency || 'MXN',
      priceHighSeason: property.priceHighSeason,
      priceMidSeason: property.priceMidSeason,
      priceLowSeason: property.priceLowSeason,
      videoUrl: property.videoUrl || '',
      address: '',
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms || 2,
      bathrooms: property.bathrooms || 2,
      maxGuests: property.maxGuests || 6,
      sqMeters: property.sqMeters || 150,
      tag: property.tag || '',
      isFeatured: property.isFeatured || false
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

  const toggleCreatorBlockedWeek = (week: number) => {
    setFormData(prev => ({
      ...prev,
      creatorBlockedWeeks: prev.creatorBlockedWeeks.includes(week)
        ? prev.creatorBlockedWeeks.filter(w => w !== week)
        : [...prev.creatorBlockedWeeks, week]
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
      latitude: formData.latitude ? String(formData.latitude) : null,
      longitude: formData.longitude ? String(formData.longitude) : null,
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-md p-8 border border-[#eee]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#111] rounded-md flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl font-bold">Modo Creador</h1>
              <p className="text-[#888] text-sm mt-1 font-light">Ingresa la contraseña</p>
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
              <Button onClick={handleUnlock} className="w-full h-12 bg-[#111] hover:bg-[#000]">
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
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#ebebeb] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setLocation('/')} className="text-[#222] hover:bg-[#f0f0f0] h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-sm sm:text-base font-semibold text-[#222]">Modo Creador</h1>
            </div>
          </div>
          <div className="flex overflow-x-auto pb-3 -mx-3 px-3 gap-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 'properties', label: 'Props', icon: Building },
              { id: 'navigation', label: 'Nav', icon: Navigation },
              { id: 'content', label: 'Textos', icon: FileText },
              { id: 'bookings', label: 'Reservas', icon: Calendar },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              { id: 'links', label: 'Links', icon: Link2 },
              { id: 'users', label: 'CRM', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
                  activeTab === id ? "bg-[#059669] text-white" : "bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-60 sm:pb-60">
        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div>
            {!isCreating ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-[#717171]">{properties.length} propiedades</p>
                  <Button onClick={() => setIsCreating(true)} size="sm" className="bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90">
                    <Plus className="w-4 h-4 mr-1" /> Nueva
                  </Button>
                </div>

                {loadingProperties ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#555]" />
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] border-dashed p-12 text-center">
                    <Building className="w-12 h-12 mx-auto mb-4 text-[#bbb]" />
                    <p className="text-[#717171]">No hay propiedades</p>
                    <Button onClick={() => setIsCreating(true)} className="mt-4 bg-gradient-to-r from-[#059669] to-[#06b6d4]" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Crear
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-3">
                        <div className="flex gap-3">
                          <div className="w-16 sm:w-20 h-14 sm:h-16 rounded-lg bg-[#f0f0f0] overflow-hidden flex-shrink-0">
                            {property.images?.[0] ? (
                              <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-5 h-5 text-[#bbb]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-[#222] truncate">{property.title}</h3>
                            <p className="text-xs text-[#717171] truncate">{property.location}</p>
                            <p className="text-xs text-[#bbb] mt-1">{property.viewCount || 0} vistas</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#555] hover:bg-[#f0f0f0]" onClick={() => handleEdit(property)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#555] hover:bg-[#f0f0f0]" onClick={() => duplicateMutation.mutate(property.id)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:bg-red-500/20" onClick={() => deleteMutation.mutate(property.id)}>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#222]">{editingProperty ? 'Editar' : 'Nueva'} Propiedad</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="border-[#ddd] text-[#222] hover:bg-[#f0f0f0]">
                      <Eye className="w-4 h-4 mr-1" /> Vista
                    </Button>
                    <Button variant="ghost" size="sm" onClick={resetForm} className="text-[#222] hover:bg-[#f0f0f0]">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4 space-y-3">
                    <Input placeholder="Título (ej: ATTIK 01)" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                    <Input placeholder="Subtítulo (ej: Departamento de Lujo)" value={formData.subtitle} onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Ubicación" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                      <Input placeholder="País" value={formData.country} onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                    </div>
                    <Textarea placeholder="Descripción completa de la propiedad..." value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="h-10 px-3 bg-[#f0f0f0] border border-[#ddd] rounded-lg text-sm text-[#222]">
                        {allCategories.map(cat => <option key={cat} value={cat} className="bg-white">{cat}</option>)}
                      </select>
                      <select value={formData.tag} onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))} className="h-10 px-3 bg-[#f0f0f0] border border-[#ddd] rounded-lg text-sm text-[#222]">
                        {PROPERTY_TAGS.map(tag => <option key={tag.value} value={tag.value} className="bg-white">{tag.label}</option>)}
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#555]">
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 rounded" />
                      Destacar propiedad
                    </label>
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Precios y Fracciones</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-[#717171]">Precio Total</label>
                        <Input type="number" placeholder="650000" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171]">Moneda</label>
                        <select value={formData.currency} onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))} className="w-full h-10 px-3 bg-[#f0f0f0] border border-[#ddd] rounded-lg text-sm text-[#222]">
                          <option value="MXN" className="bg-white">MXN</option>
                          <option value="USD" className="bg-white">USD</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-[#555]">Enganche / Precio Fracción</label>
                        <Input type="number" placeholder="65000" value={formData.fractionPrice} onChange={(e) => setFormData(prev => ({ ...prev, fractionPrice: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171]">Semanas por Fracción</label>
                        <Input type="number" placeholder="3" value={formData.weeksPerFraction} onChange={(e) => setFormData(prev => ({ ...prev, weeksPerFraction: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-[#717171]">Total Fracciones</label>
                        <Input type="number" placeholder="14" value={formData.totalFractions} onChange={(e) => setFormData(prev => ({ ...prev, totalFractions: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171]">Fracciones Disponibles</label>
                        <Input type="number" placeholder="14" value={formData.availableFractions} onChange={(e) => setFormData(prev => ({ ...prev, availableFractions: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                    </div>
                    <p className="text-xs text-[#bbb] mb-3">Precios por temporada (opcional)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-[#555]">Alta</label>
                        <Input type="number" placeholder="0" value={formData.priceHighSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceHighSeason: e.target.value ? Number(e.target.value) : null }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#555]">Media</label>
                        <Input type="number" placeholder="0" value={formData.priceMidSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceMidSeason: e.target.value ? Number(e.target.value) : null }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#555]">Baja</label>
                        <Input type="number" placeholder="0" value={formData.priceLowSeason || ''} onChange={(e) => setFormData(prev => ({ ...prev, priceLowSeason: e.target.value ? Number(e.target.value) : null }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Detalles Propiedad</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-xs text-[#717171] flex items-center gap-1"><Bed className="w-3 h-3" /> Hab</label>
                        <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171] flex items-center gap-1"><Bath className="w-3 h-3" /> Baños</label>
                        <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171] flex items-center gap-1"><Users className="w-3 h-3" /> Huésp</label>
                        <Input type="number" value={formData.maxGuests} onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171]">m²</label>
                        <Input type="number" value={formData.sqMeters} onChange={(e) => setFormData(prev => ({ ...prev, sqMeters: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Condiciones / Textos Adicionales</h3>
                    <div className="flex gap-2 mb-3">
                      <Input 
                        placeholder="Ej: 30% enganche, 12 meses sin intereses..." 
                        value={newCondition} 
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newCondition.trim()) {
                            setFormData(prev => ({ ...prev, conditions: [...prev.conditions, newCondition.trim()] }));
                            setNewCondition('');
                          }
                        }}
                        className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" 
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          if (newCondition.trim()) {
                            setFormData(prev => ({ ...prev, conditions: [...prev.conditions, newCondition.trim()] }));
                            setNewCondition('');
                          }
                        }}
                        className="bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.conditions.length > 0 && (
                      <div className="space-y-2">
                        {formData.conditions.map((cond, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#f7f7f7] rounded-lg px-3 py-2">
                            <span className="text-sm text-[#444] flex-1">{cond}</span>
                            <button onClick={() => setFormData(prev => ({ ...prev, conditions: prev.conditions.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-300">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Ubicación en Mapa</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-[#717171] mb-1 block">Dirección completa</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ej: Av. Coba 12, Tulum, Quintana Roo, México"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999] flex-1"
                            data-testid="input-address"
                          />
                          <button
                            type="button"
                            disabled={!formData.address || geocoding}
                            onClick={async () => {
                              setGeocoding(true);
                              try {
                                const res = await fetch(`/api/geocode?address=${encodeURIComponent(formData.address)}`, {
                                  headers: { 'X-Creator-Token': creatorToken },
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setFormData(prev => ({
                                    ...prev,
                                    latitude: String(data.latitude),
                                    longitude: String(data.longitude),
                                  }));
                                  toast({ title: `Ubicación encontrada: ${data.formattedAddress}` });
                                } else {
                                  toast({ title: 'Dirección no encontrada', variant: 'destructive' });
                                }
                              } catch {
                                toast({ title: 'Error al buscar dirección', variant: 'destructive' });
                              }
                              setGeocoding(false);
                            }}
                            className="px-3 py-2 bg-gradient-to-r from-[#059669] to-[#06b6d4] text-white rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
                            data-testid="button-geocode"
                          >
                            {geocoding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                            Ubicar
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-[#717171]">Latitud</label>
                          <Input type="number" step="any" placeholder="20.2114" value={formData.latitude} onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" data-testid="input-latitude" />
                        </div>
                        <div>
                          <label className="text-xs text-[#717171]">Longitud</label>
                          <Input type="number" step="any" placeholder="-87.4654" value={formData.longitude} onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" data-testid="input-longitude" />
                        </div>
                      </div>
                      {formData.latitude && formData.longitude && (
                        <div className="bg-white rounded-lg border border-[#ebebeb] p-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs text-[#059669] font-medium">Coordenadas: {Number(formData.latitude).toFixed(4)}, {Number(formData.longitude).toFixed(4)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Enlaces</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-[#717171]">URL Video (YouTube/Vimeo)</label>
                        <Input placeholder="https://..." value={formData.videoUrl} onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#717171]">URL Mapa (fallback)</label>
                        <Input placeholder="https://..." value={formData.mapUrl} onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Imágenes</h3>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="w-full border-2 border-dashed border-[#ddd] rounded-lg p-6 text-center hover:bg-[#f7f7f7]">
                      {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#555]" /> : <><Upload className="w-6 h-6 mx-auto mb-1 text-[#999]" /><p className="text-xs text-[#717171]">Subir imágenes</p></>}
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

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Videos</h3>
                    <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                    <button onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo} className="w-full border-2 border-dashed border-[#ddd] rounded-lg p-4 text-center hover:bg-[#f7f7f7]">
                      {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#555]" /> : <><Video className="w-5 h-5 mx-auto mb-1 text-[#999]" /><p className="text-xs text-[#717171]">Subir videos</p></>}
                    </button>
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {formData.videos.map((vid, i) => (
                          <div key={i} className="relative aspect-video rounded overflow-hidden bg-black">
                            <video src={vid} className="w-full h-full object-cover" />
                            <button onClick={() => removeVideo(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm text-[#222]">Semanas Apartadas (Creador)</h3>
                      <span className="text-xs text-[#555] bg-[#059669]/10 px-2 py-1 rounded-full">{formData.creatorBlockedWeeks.length} apartadas</span>
                    </div>
                    <p className="text-xs text-[#717171] mb-3">Semanas reservadas internamente. Se muestran en morado.</p>
                    <div className="grid grid-cols-13 gap-1">
                      {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                        <button key={week} onClick={() => toggleCreatorBlockedWeek(week)} className={cn("w-6 h-6 rounded text-[10px] font-medium", formData.creatorBlockedWeeks.includes(week) ? "bg-black text-white" : formData.blockedWeeks.includes(week) ? "bg-[#888]/50 text-[#717171] cursor-not-allowed" : "bg-[#f0f0f0] text-[#717171] hover:bg-[#e0e0e0]")}>
                          {week}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm text-[#222]">Bloquear Semanas (No disponibles)</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowWeekBlocker(!showWeekBlocker)} className="border-[#ddd] text-[#222] hover:bg-[#f0f0f0]">
                        <CalendarOff className="w-3.5 h-3.5 mr-1" /> {formData.blockedWeeks.length}
                      </Button>
                    </div>
                    {showWeekBlocker && (
                      <>
                        <p className="text-xs text-[#717171] mb-3">Semanas no disponibles para reserva. Se muestran en rojo.</p>
                        <div className="grid grid-cols-13 gap-1">
                          {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                            <button key={week} onClick={() => toggleBlockedWeek(week)} className={cn("w-6 h-6 rounded text-[10px] font-medium", formData.blockedWeeks.includes(week) ? "bg-[#888] text-white" : formData.creatorBlockedWeeks.includes(week) ? "bg-black/50 text-[#717171] cursor-not-allowed" : "bg-[#f0f0f0] text-[#717171] hover:bg-[#e0e0e0]")}>
                              {week}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
                    <h3 className="font-medium text-sm text-[#222] mb-3">Amenidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {AMENITIES_LIST.map((amenity) => (
                        <button key={amenity} onClick={() => toggleAmenity(amenity)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border", formData.amenities.includes(amenity) ? "bg-[#059669] text-white border-[#059669]" : "bg-[#f7f7f7] border-[#ddd] text-[#555]")}>
                          {formData.amenities.includes(amenity) && <Check className="w-3 h-3 inline mr-1" />}{amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pb-8">
                    <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="w-full h-12 bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90">
                      {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{editingProperty ? 'Guardar' : 'Publicar'}</>}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
          <div className="space-y-4">
            <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
              <h3 className="font-semibold text-[#222] mb-4">Botones de Navegación</h3>
              <p className="text-xs text-[#717171] mb-4">Estos botones aparecen en la página de inicio</p>
              
              <div className="space-y-3 mb-4">
                <Input placeholder="Nombre (ES)" value={navForm.name} onChange={(e) => setNavForm(prev => ({ ...prev, name: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                <Input placeholder="Nombre (EN)" value={navForm.nameEn} onChange={(e) => setNavForm(prev => ({ ...prev, nameEn: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                <Input placeholder="Link (ej: /last-minute-capital)" value={navForm.link} onChange={(e) => setNavForm(prev => ({ ...prev, link: e.target.value }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                <Input type="number" placeholder="Posición" value={navForm.position} onChange={(e) => setNavForm(prev => ({ ...prev, position: Number(e.target.value) }))} className="bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]" />
                
                <input ref={navImageRef} type="file" accept="image/*" onChange={handleNavImageUpload} className="hidden" />
                <button onClick={() => navImageRef.current?.click()} disabled={uploadingNavImage} className="w-full border-2 border-dashed border-[#ddd] rounded-lg p-4 text-center hover:bg-[#f7f7f7]">
                  {uploadingNavImage ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#555]" /> : navForm.image ? (
                    <img src={navForm.image} alt="" className="h-20 mx-auto object-cover rounded" />
                  ) : (
                    <><Image className="w-5 h-5 mx-auto mb-1 text-[#999]" /><p className="text-xs text-[#717171]">Subir imagen</p></>
                  )}
                </button>

                <Button onClick={() => saveNavMutation.mutate({ ...navForm, isActive: true })} disabled={!navForm.name || !navForm.link} className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:opacity-90">
                  <Plus className="w-4 h-4 mr-1" /> {editingNavButton ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </div>

            <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] divide-y divide-white/10">
              {navButtons.length === 0 ? (
                <div className="p-8 text-center">
                  <Navigation className="w-8 h-8 mx-auto mb-2 text-[#bbb]" />
                  <p className="text-sm text-[#717171]">No hay botones</p>
                </div>
              ) : (
                navButtons.sort((a, b) => a.position - b.position).map(btn => (
                  <div key={btn.id} className="p-3 flex items-center gap-3">
                    <div className="w-14 h-10 rounded bg-[#f0f0f0] overflow-hidden flex-shrink-0">
                      {btn.image ? <img src={btn.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#bbb]"><Image className="w-4 h-4" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#222] truncate">{btn.name}</p>
                      <p className="text-xs text-[#717171] truncate">{btn.link}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-[#555] hover:bg-[#f0f0f0]" onClick={() => { setEditingNavButton(btn); setNavForm({ name: btn.name, nameEn: btn.nameEn || '', link: btn.link, image: btn.image || '', position: btn.position }); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:bg-red-500/20" onClick={() => deleteNavMutation.mutate(btn.id)}>
                      <Trash2 className="w-4 h-4" />
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
            <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
              <h3 className="font-semibold text-[#222] mb-4">Textos del Sitio</h3>
              <p className="text-xs text-[#717171] mb-4">Edita todos los textos de la app</p>
              
              <div className="space-y-4">
                {DEFAULT_TEXTS.map(({ key, label, default: defaultVal }) => (
                  <div key={key}>
                    <label className="text-xs text-[#717171] mb-1 block">{label}</label>
                    <div className="flex gap-2">
                      <Input
                        value={textValues[key] ?? defaultVal}
                        onChange={(e) => setTextValues(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={defaultVal}
                        className="flex-1 bg-[#f0f0f0] border-[#ddd] text-[#222] placeholder:text-[#999]"
                      />
                      <Button size="sm" variant="outline" onClick={() => saveTextMutation.mutate({ key, value: textValues[key] ?? defaultVal })} className="border-[#ddd] text-[#222] hover:bg-[#f0f0f0]">
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
            <p className="text-sm text-[#717171] mb-4">{bookings.length} reservas</p>
            
            {bookings.length === 0 ? (
              <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] border-dashed p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-[#bbb]" />
                <p className="text-[#717171]">Sin reservas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  const expiresAt = new Date(booking.expiresAt);
                  const isExpired = expiresAt < new Date();
                  
                  return (
                    <div key={booking.id} className={cn("bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4", isExpired && "opacity-50")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm text-[#222] truncate">{property?.title || 'Propiedad'}</h3>
                          <p className="text-xs text-[#717171] truncate">{booking.email}</p>
                          {booking.name && <p className="text-xs text-[#717171]">{booking.name}</p>}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.selectedWeeks.map(w => (
                              <span key={w} className="bg-[#f0f0f0] text-[#555] px-2 py-0.5 rounded text-xs">Sem {w}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", isExpired ? "bg-[#f0f0f0] text-[#717171]" : "bg-[#059669]/10 text-[#059669]")}>
                            {isExpired ? 'Expirada' : 'Activa'}
                          </span>
                          {!isExpired && (
                            <Button size="sm" onClick={() => sendWhatsAppNotification(booking)} className="bg-gradient-to-r from-[#059669] to-[#06b6d4] text-xs h-8">
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> WA
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
              <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#059669]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-[#222]">{properties.length}</p>
                    <p className="text-[10px] sm:text-xs text-[#717171]">Propiedades</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#059669]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#555]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-[#222]">{bookings.filter(b => new Date(b.expiresAt) > new Date()).length}</p>
                    <p className="text-[10px] sm:text-xs text-[#717171]">Reservas</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#059669]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#555]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-[#222]">{totalViews.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-[#717171]">Vistas</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#f0f0f0] rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#555]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-[#222]">${(properties.reduce((sum, p) => sum + (p.price || 650000), 0) / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] sm:text-xs text-[#717171]">Valor</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f7f7f7] rounded-xl border border-[#ebebeb] p-4">
              <h3 className="font-semibold text-[#222] mb-4">Vistas por Propiedad</h3>
              <div className="space-y-3">
                {properties.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map(property => (
                  <div key={property.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#f0f0f0] overflow-hidden flex-shrink-0">
                      {property.images?.[0] ? <img src={property.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-[#bbb]" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#222] truncate">{property.title}</p>
                    </div>
                    <p className="font-bold text-sm text-[#555]">{(property.viewCount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LINKS TAB */}
        {activeTab === 'links' && (
          <LinksManager creatorToken={creatorToken} />
        )}

        {/* USERS CRM TAB */}
        {activeTab === 'users' && (
          <UsersCRM creatorToken={creatorToken} />
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-md overflow-hidden">
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
                  {formData.tag && <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">{PROPERTY_TAGS.find(t => t.value === formData.tag)?.label}</span>}
                </div>
              )}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{formData.title || 'Sin título'}</h1>
                <p className="text-[#888] flex items-center gap-1 mb-4 font-light"><MapPin className="w-4 h-4" /> {formData.location || 'Sin ubicación'}</p>
                <div className="flex gap-4 mb-4 text-sm text-[#666]">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {formData.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {formData.bathrooms}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {formData.maxGuests}</span>
                </div>
                <p className="text-2xl font-bold text-[#555] mb-4">${formData.price.toLocaleString()} USD</p>
                <p className="text-[#666] whitespace-pre-wrap font-light">{formData.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
