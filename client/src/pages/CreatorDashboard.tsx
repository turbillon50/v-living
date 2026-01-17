import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Building, 
  Calendar,
  Megaphone,
  Send,
  Bell,
  Mail,
  MessageSquare,
  Loader2,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Analytics {
  totalProperties: number;
  totalBookings: number;
  activeBookings: number;
  fractionBookings: number;
  vacationBookings: number;
  totalSubscribers: number;
  totalAnnouncements: number;
  uniqueEmails: number;
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

interface Property {
  id: string;
  title: string;
  category: string;
  location: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

const CREATOR_PASSWORD = 'lumamijuvisado';

export default function CreatorDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'announcements' | 'notifications'>('analytics');
  
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'news' });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
    enabled: isUnlocked
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pre-bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    enabled: isUnlocked
  });

  const { data: properties } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
    enabled: isUnlocked
  });

  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await fetch('/api/announcements');
      if (!res.ok) throw new Error('Failed to fetch announcements');
      return res.json();
    },
    enabled: isUnlocked
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: { title: string; message: string; type: string }) => {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create announcement');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Anuncio creado', description: 'El anuncio se ha publicado correctamente' });
      setNewAnnouncement({ title: '', message: '', type: 'news' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });

  const handleUnlock = () => {
    if (password === CREATOR_PASSWORD) {
      setIsUnlocked(true);
      toast({ title: 'Modo Creador', description: 'Acceso concedido' });
    } else {
      toast({ title: 'Error', description: 'Contraseña incorrecta', variant: 'destructive' });
    }
  };

  const sendWhatsAppNotification = (emails: string[], message: string) => {
    const text = `📢 ANUNCIO FRACTIONAL LIVING\n\n${message}\n\nPara: ${emails.length} usuarios registrados`;
    const whatsappUrl = `https://wa.me/529984292748?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
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
            <Button variant="ghost" onClick={() => setLocation('/home')} className="w-full text-white/60">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/home')} className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Centro de Control
              </h1>
              <p className="text-xs text-white/60">Modo Creador Activo</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'bookings', label: 'Reservas', icon: Calendar },
            { id: 'announcements', label: 'Anuncios', icon: Megaphone },
            { id: 'notifications', label: 'Notificar', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id 
                  ? "bg-cyan-500 text-white" 
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'analytics' && analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building} label="Propiedades" value={analytics.totalProperties} color="cyan" />
            <StatCard icon={Calendar} label="Pre-reservas" value={analytics.totalBookings} color="blue" />
            <StatCard icon={Calendar} label="Activas" value={analytics.activeBookings} color="green" />
            <StatCard icon={Users} label="Emails únicos" value={analytics.uniqueEmails} color="purple" />
            <StatCard icon={Building} label="Fracciones" value={analytics.fractionBookings} color="cyan" />
            <StatCard icon={Calendar} label="Vacaciones" value={analytics.vacationBookings} color="emerald" />
            <StatCard icon={Users} label="Suscriptores" value={analytics.totalSubscribers} color="amber" />
            <StatCard icon={Megaphone} label="Anuncios" value={analytics.totalAnnouncements} color="rose" />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Pre-reservas Recibidas</h2>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const property = properties?.find(p => p.id === booking.propertyId);
                  const isExpired = new Date(booking.expiresAt) < new Date();
                  return (
                    <Card key={booking.id} className={cn("bg-white/10 border-white/20", isExpired && "opacity-50")}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white">{booking.email}</p>
                            <p className="text-sm text-white/60">{property?.title || 'Propiedad'}</p>
                            <p className="text-xs text-white/40 mt-1">
                              Semanas: {(booking.selectedWeeks || []).join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              booking.bookingType === 'vacation' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-cyan-500/20 text-cyan-400"
                            )}>
                              {booking.bookingType === 'vacation' ? '🏖️ Vacaciones' : '💎 Fracción'}
                            </span>
                            <p className={cn("text-xs mt-1", isExpired ? "text-red-400" : "text-green-400")}>
                              {isExpired ? 'Expirado' : 'Activo'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No hay pre-reservas aún</p>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Nuevo Anuncio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {['news', 'opportunity', 'alert'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewAnnouncement(prev => ({ ...prev, type }))}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        newAnnouncement.type === type 
                          ? "bg-cyan-500 text-white" 
                          : "bg-white/10 text-white/70"
                      )}
                    >
                      {type === 'news' ? '📰 Noticia' : type === 'opportunity' ? '💎 Oportunidad' : '🔔 Alerta'}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Título del anuncio"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Textarea
                  placeholder="Mensaje..."
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                />
                <Button 
                  onClick={() => createAnnouncementMutation.mutate(newAnnouncement)}
                  disabled={!newAnnouncement.title || !newAnnouncement.message || createAnnouncementMutation.isPending}
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                >
                  {createAnnouncementMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publicando...</>
                  ) : (
                    <>Publicar Anuncio</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Separator className="bg-white/20" />

            <h3 className="font-medium">Anuncios Publicados</h3>
            {announcements && announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <Card key={ann.id} className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {ann.type === 'news' ? '📰' : ann.type === 'opportunity' ? '💎' : '🔔'}
                        </span>
                        <div>
                          <h4 className="font-medium text-white">{ann.title}</h4>
                          <p className="text-sm text-white/70 mt-1">{ann.message}</p>
                          <p className="text-xs text-white/40 mt-2">
                            {new Date(ann.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No hay anuncios aún</p>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Notificar por WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/60 text-sm">
                  Envía notificaciones a todos los usuarios que han hecho pre-reservas.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      const emails = bookings?.map(b => b.email) || [];
                      sendWhatsAppNotification(emails, '¡Nueva oportunidad de inversión disponible!');
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Oportunidad
                  </Button>
                  <Button
                    onClick={() => {
                      const emails = bookings?.map(b => b.email) || [];
                      sendWhatsAppNotification(emails, '¡Últimas semanas disponibles - reserva ahora!');
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Urgente
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Emails registrados</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {bookings && Array.from(new Set(bookings.map(b => b.email))).map((email) => (
                      <div key={email} className="flex items-center gap-2 text-sm text-white/70">
                        <Mail className="w-4 h-4" />
                        {email}
                      </div>
                    ))}
                    {(!bookings || bookings.length === 0) && (
                      <p className="text-white/50 text-sm">No hay emails registrados</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/20 text-rose-400',
  };

  return (
    <Card className={cn("bg-gradient-to-br border-white/10", colorClasses[color])}>
      <CardContent className="p-4">
        <Icon className="w-6 h-6 mb-2" />
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/60">{label}</p>
      </CardContent>
    </Card>
  );
}
