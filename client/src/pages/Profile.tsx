import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, LogOut, 
  Building2, Wallet, Users, Home, TrendingUp, Info,
  ChevronRight, ExternalLink, Check
} from 'lucide-react';

const INTEREST_CONFIG: Record<string, { label: string; icon: any; color: string; description: string; links: { title: string; url: string; }[] }> = {
  'comprar_fracciones': {
    label: 'Comprar Fracciones',
    icon: Home,
    color: 'from-teal-500 to-cyan-500',
    description: 'Adquiere una fracción de propiedad de lujo y comienza a generar patrimonio heredable.',
    links: [
      { title: 'Ver Propiedades Disponibles', url: '/home' },
      { title: 'Modelo de Negocio', url: '/modelo-negocios' },
    ]
  },
  'last_minute_capital': {
    label: 'Last Minute Capital',
    icon: Wallet,
    color: 'from-purple-500 to-pink-500',
    description: 'Invierte capital en oportunidades de última hora con rendimientos atractivos.',
    links: [
      { title: 'Oportunidades Actuales', url: '/last-minute-capital' },
      { title: 'Conocer VanDeFi', url: 'https://vandefi.org' },
    ]
  },
  'property_associate': {
    label: 'Property Associate',
    icon: Building2,
    color: 'from-orange-500 to-amber-500',
    description: 'Aporta tu propiedad al modelo fractional y genera ingresos pasivos.',
    links: [
      { title: 'Cómo Funciona', url: '/property-asociado' },
      { title: 'Registrar mi Propiedad', url: '/property-asociado' },
    ]
  },
  'profile_associate': {
    label: 'Profile Associate',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-500',
    description: 'Usa tu perfil de crédito para acceder a oportunidades exclusivas.',
    links: [
      { title: 'Conocer el Programa', url: '/perfil-asociado' },
      { title: 'Aplicar', url: '/perfil-asociado' },
    ]
  },
  'broker': {
    label: 'Broker / Afiliado',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    description: 'Únete a nuestra red de brokers y gana comisiones por referidos.',
    links: [
      { title: 'Programa de Afiliados', url: '/modelo-negocios' },
      { title: 'AGH-IA Platform', url: 'https://agh-ia.com' },
    ]
  },
  'informacion': {
    label: 'Información General',
    icon: Info,
    color: 'from-gray-500 to-slate-500',
    description: 'Explora todas nuestras opciones y encuentra la que mejor se adapte a ti.',
    links: [
      { title: 'Explorar Propiedades', url: '/home' },
      { title: 'Contactar Asesor', url: 'https://wa.me/529984292748' },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <Header />
      
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden mb-6">
          <div className={`bg-gradient-to-r ${INTEREST_CONFIG[primaryInterest]?.color || 'from-teal-500 to-cyan-500'} p-6`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white" data-testid="text-user-name">{user.name}</h1>
                <p className="text-white/70 text-sm">{INTEREST_CONFIG[primaryInterest]?.label || 'Miembro'}</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wide mb-1 block">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-edit-name"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wide mb-1 block">Teléfono</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-edit-phone"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-wide mb-1 block">País</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-edit-country"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => updateMutation.mutate(formData)} 
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                    disabled={updateMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    <Save className="w-4 h-4 mr-2" /> Guardar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-cancel-edit"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-2 border-b border-white/10">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-white/50 text-xs">Email</p>
                    <p className="text-white" data-testid="text-user-email">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-white/10">
                  <Phone className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-white/50 text-xs">Teléfono</p>
                    <p className="text-white" data-testid="text-user-phone">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-white/10">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-white/50 text-xs">País</p>
                    <p className="text-white" data-testid="text-user-country">{user.country}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline"
                  className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
                  data-testid="button-edit-profile"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
                </Button>
              </div>
            )}
          </div>
        </div>

        {userInterests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white/50 text-xs uppercase tracking-wide mb-3 px-1">Mis Intereses</h2>
            <div className="flex flex-wrap gap-2">
              {userInterests.map((interest) => {
                const config = INTEREST_CONFIG[interest];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <div 
                    key={interest}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r ${config.color} text-white text-sm`}
                    data-testid={`badge-interest-${interest}`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <h2 className="text-white/50 text-xs uppercase tracking-wide px-1">Contenido para Ti</h2>
          
          {userInterests.map((interest) => {
            const config = INTEREST_CONFIG[interest];
            if (!config) return null;
            const Icon = config.icon;
            
            return (
              <div 
                key={interest}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                data-testid={`card-interest-${interest}`}
              >
                <div className={`bg-gradient-to-r ${config.color} p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{config.label}</h3>
                      <p className="text-white/70 text-xs">{config.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  {config.links.map((link, idx) => {
                    const isExternal = link.url.startsWith('http');
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors"
                        data-testid={`link-${interest}-${idx}`}
                      >
                        <span className="text-white text-sm">{link.title}</span>
                        {isExternal ? (
                          <ExternalLink className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white/40" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Plataformas Asociadas</h3>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://vandefi.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-colors"
              data-testid="link-vandefi"
            >
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm font-medium">VanDeFi.org</span>
            </a>
            <a 
              href="https://agh-ia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-colors"
              data-testid="link-aghia"
            >
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm font-medium">AGH-IA.com</span>
            </a>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-20">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-medium">Estado de tu Cuenta</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Miembro desde</span>
              <span className="text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Hoy'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Perfil verificado</span>
              <span className="text-teal-400">Pendiente</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
