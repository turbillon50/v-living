import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, LogOut, 
  Building2, Wallet, Users, Home, TrendingUp, Info,
  ChevronRight, ExternalLink, Check, DollarSign, Calendar,
  CreditCard, FileText, Clock, BarChart3, ArrowUpRight
} from 'lucide-react';

const INTEREST_CONFIG: Record<string, { 
  label: string; 
  icon: any; 
  color: string; 
  description: string;
  dashboardTitle: string;
  features: { icon: any; label: string; value: string; status?: string }[];
}> = {
  'comprar_fracciones': {
    label: 'Propietario Fractional',
    icon: Home,
    color: 'bg-gradient-to-r from-black/20 to-black/10',
    description: 'Tus fracciones inmobiliarias de lujo',
    dashboardTitle: 'Mis Fracciones',
    features: [
      { icon: Home, label: 'Fracciones activas', value: '0', status: 'pending' },
      { icon: DollarSign, label: 'Valor total', value: '$0 USD', status: 'pending' },
      { icon: CreditCard, label: 'Mensualidades pagadas', value: '0/12', status: 'pending' },
      { icon: Calendar, label: 'Próxima semana', value: 'Por definir', status: 'pending' },
    ]
  },
  'last_minute_capital': {
    label: 'Inversionista Capital',
    icon: Wallet,
    color: 'bg-gradient-to-r from-[#059669]/20 to-[#06b6d4]/10',
    description: 'Tus inversiones de capital',
    dashboardTitle: 'Mis Inversiones',
    features: [
      { icon: DollarSign, label: 'Capital invertido', value: '$0 USD', status: 'pending' },
      { icon: TrendingUp, label: 'Rendimiento', value: '0%', status: 'pending' },
      { icon: Calendar, label: 'Próximo pago', value: 'Por definir', status: 'pending' },
      { icon: BarChart3, label: 'Retorno proyectado', value: '$0 USD', status: 'pending' },
    ]
  },
  'property_associate': {
    label: 'Property Associate',
    icon: Building2,
    color: 'bg-gradient-to-r from-[#059669]/15 to-[#06b6d4]/10',
    description: 'Estado de tu propiedad asociada',
    dashboardTitle: 'Mi Propiedad',
    features: [
      { icon: Building2, label: 'Propiedades registradas', value: '0', status: 'pending' },
      { icon: FileText, label: 'Estado del proceso', value: 'En revisión', status: 'pending' },
      { icon: DollarSign, label: 'Ventas de fracciones', value: '0/8', status: 'pending' },
      { icon: Wallet, label: 'Ingresos generados', value: '$0 USD', status: 'pending' },
    ]
  },
  'profile_associate': {
    label: 'Profile Associate',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-gray-800 to-black',
    description: 'Estado de tu perfil de crédito',
    dashboardTitle: 'Mi Perfil de Crédito',
    features: [
      { icon: FileText, label: 'Trámites activos', value: '0', status: 'pending' },
      { icon: Clock, label: 'Estado', value: 'En proceso', status: 'pending' },
      { icon: DollarSign, label: 'Crédito aprobado', value: 'Pendiente', status: 'pending' },
      { icon: TrendingUp, label: 'Ventas de propiedad', value: '0', status: 'pending' },
    ]
  },
  'broker': {
    label: 'Broker / Afiliado',
    icon: Users,
    color: 'bg-gradient-to-r from-black/20 to-black/10',
    description: 'Tu desempeño como broker',
    dashboardTitle: 'Mi Red',
    features: [
      { icon: Users, label: 'Referidos', value: '0', status: 'pending' },
      { icon: DollarSign, label: 'Comisiones ganadas', value: '$0 USD', status: 'pending' },
      { icon: FileText, label: 'Ventas cerradas', value: '0', status: 'pending' },
      { icon: TrendingUp, label: 'Nivel', value: 'Starter', status: 'active' },
    ]
  },
  'informacion': {
    label: 'Explorador',
    icon: Info,
    color: 'bg-gradient-to-r from-gray-600 to-gray-700',
    description: 'Tu perfil de exploración',
    dashboardTitle: 'Explorar',
    features: [
      { icon: Home, label: 'Propiedades vistas', value: '0', status: 'pending' },
      { icon: Calendar, label: 'Citas agendadas', value: '0', status: 'pending' },
      { icon: FileText, label: 'Solicitudes', value: '0', status: 'pending' },
      { icon: Info, label: 'Estado', value: 'Activo', status: 'active' },
    ]
  }
};

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: ''
  });

  useEffect(() => {
    if (!user) {
      setLocation('/');
    } else {
      setFormData({
        name: user.name,
        phone: user.phone,
        country: user.country
      });
    }
  }, [user, setLocation]);

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; country: string }) => {
      const res = await fetch(`/api/users/${user?.id}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user?.id || ''
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: (data) => {
      updateUser(data);
      setIsEditing(false);
      toast({ title: 'Perfil actualizado' });
    },
    onError: () => {
      toast({ title: 'Error al actualizar', variant: 'destructive' });
    }
  });

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  if (!user) return null;

  const userInterests = user.interests || [];
  const primaryInterest = user.primaryInterest || userInterests[0] || 'informacion';
  const config = INTEREST_CONFIG[primaryInterest] || INTEREST_CONFIG['informacion'];

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />
      
      <div className="px-4 py-6 max-w-lg mx-auto pb-60 pt-20 md:pt-24">
        <div className="fl-gradient-sunset rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Bienvenido</p>
              <h1 className="text-2xl font-bold" data-testid="text-user-name">{user.name}</h1>
              <p className="text-white/80 text-sm mt-1">{config.label}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <config.icon className="w-7 h-7" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {config.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-3">
                <feat.icon className="w-4 h-4 text-white/60 mb-1" />
                <p className="text-white/60 text-xs">{feat.label}</p>
                <p className="text-white font-bold">{feat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#222] font-semibold">{config.dashboardTitle}</h2>
            <span className="text-[#059669] text-xs font-medium px-2 py-1 bg-[#059669]/10 rounded-full">
              En desarrollo
            </span>
          </div>
          
          <div className="space-y-3">
            {config.features.map((feat, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-[#ebebeb] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#ebebeb]">
                    <feat.icon className="w-5 h-5 text-[#717171]" />
                  </div>
                  <div>
                    <p className="text-[#717171] text-xs">{feat.label}</p>
                    <p className="text-[#222] font-medium">{feat.value}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${feat.status === 'active' ? 'bg-[#059669]' : 'bg-[#ccc]'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden mb-6">
          <div className="p-4 border-b border-black/10 flex items-center justify-between">
            <h3 className="font-semibold text-black">Datos de contacto</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-black text-sm font-medium flex items-center gap-1"
                data-testid="button-edit-profile"
              >
                <Edit2 className="w-4 h-4" /> Editar
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="p-4 space-y-4">
              <div>
                <label className="text-black/50 text-xs uppercase tracking-wide mb-1 block">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/5 border-0 text-black"
                  data-testid="input-edit-name"
                />
              </div>
              <div>
                <label className="text-black/50 text-xs uppercase tracking-wide mb-1 block">WhatsApp</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-black/5 border-0 text-black"
                  data-testid="input-edit-phone"
                />
              </div>
              <div>
                <label className="text-black/50 text-xs uppercase tracking-wide mb-1 block">País</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-black/5 border-0 text-black"
                  data-testid="input-edit-country"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => updateMutation.mutate(formData)} 
                  className="flex-1 bg-black hover:bg-black/90 text-white"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-black/20"
                  data-testid="button-cancel-edit"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              <div className="p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-black/30" />
                <div>
                  <p className="text-black/50 text-xs">Email</p>
                  <p className="text-black" data-testid="text-user-email">{user.email}</p>
                </div>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Phone className="w-5 h-5 text-black/30" />
                <div>
                  <p className="text-black/50 text-xs">WhatsApp</p>
                  <p className="text-black" data-testid="text-user-phone">{user.phone}</p>
                </div>
              </div>
              <div className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-black/30" />
                <div>
                  <p className="text-black/50 text-xs">País</p>
                  <p className="text-black" data-testid="text-user-country">{user.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {userInterests.length > 1 && (
          <div className="mb-6">
            <h3 className="text-black/50 text-xs uppercase tracking-wide mb-3 px-1">Otros intereses</h3>
            <div className="flex flex-wrap gap-2">
              {userInterests.filter(i => i !== primaryInterest).map((interest) => {
                const interestConfig = INTEREST_CONFIG[interest];
                if (!interestConfig) return null;
                return (
                  <span 
                    key={interest}
                    className="px-3 py-1.5 bg-black/5 text-black/70 rounded-full text-sm"
                    data-testid={`badge-interest-${interest}`}
                  >
                    {interestConfig.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <Link href="/home">
            <a className="flex items-center justify-between p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-black" />
                <span className="font-medium text-black">Ver propiedades</span>
              </div>
              <ChevronRight className="w-5 h-5 text-black/30" />
            </a>
          </Link>
          
          <a 
            href="https://wa.me/529984292748?text=Hola, soy usuario registrado de Fractional Living"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Contactar asesor</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-black/30" />
          </a>
        </div>

        <div className="bg-black/5 rounded-2xl p-4 mb-6">
          <h3 className="font-medium text-black mb-3">Plataformas del ecosistema</h3>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://vandefi.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors"
              data-testid="link-vandefi"
            >
              <Wallet className="w-5 h-5 text-black" />
              <span className="text-black text-sm font-medium">VanDeFi</span>
            </a>
            <a 
              href="https://agh-ia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors"
              data-testid="link-aghia"
            >
              <TrendingUp className="w-5 h-5 text-black" />
              <span className="text-black text-sm font-medium">AGH-IA</span>
            </a>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-black/30 text-xs">
            Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'hoy'}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full border-[#ebebeb] text-[#717171] hover:bg-[#f0fdf4] hover:text-[#059669] hover:border-[#059669]/30"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
