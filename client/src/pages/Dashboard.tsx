import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/Header';
import { 
  ArrowLeft, Copy, Share2, Users, TrendingUp, Gift, 
  ChevronDown, ChevronRight, Check, 
  Network, Star, Wallet, UserPlus, LinkIcon, Shield,
  Crown, Tag, Megaphone, Gem, Handshake, Home as HomeIcon, type LucideIcon
} from 'lucide-react';

const COMMISSION_LEVELS = [
  { level: 1, percentage: 1.2, color: '#FF6B00' },
  { level: 2, percentage: 0.8, color: '#FF8C38' },
  { level: 3, percentage: 0.8, color: '#FFB170' },
  { level: 4, percentage: 0.6, color: '#FFD1A0' },
  { level: 5, percentage: 0.6, color: '#FFE4C7' },
];

const INTEREST_OPTIONS: Array<{ id: string; label: string; labelEn: string; Icon: LucideIcon }> = [
  { id: 'comprar', label: 'Comprar una fracción', labelEn: 'Buy a fraction', Icon: Crown },
  { id: 'invertir', label: 'Invertir en propiedades', labelEn: 'Invest in properties', Icon: TrendingUp },
  { id: 'vender', label: 'Vender mi propiedad', labelEn: 'Sell my property', Icon: Tag },
  { id: 'promocionar', label: 'Promocionar propiedades', labelEn: 'Promote properties', Icon: Megaphone },
  { id: 'vivir', label: 'Vivir experiencias de lujo', labelEn: 'Live luxury experiences', Icon: Gem },
  { id: 'referir', label: 'Referir amigos y ganar', labelEn: 'Refer friends & earn', Icon: Handshake },
];

export default function Dashboard() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'perfil' | 'red' | 'comisiones' | 'compartir'>('perfil');
  const [copied, setCopied] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const storedUser = localStorage.getItem('fl_user') || localStorage.getItem('fractional_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (currentUser) {
      setAuthChecked(true);
      return;
    }
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      const retryUser = localStorage.getItem('fl_user') || localStorage.getItem('fractional_user');
      if (retryUser) {
        clearInterval(interval);
        setAuthChecked(true);
        window.location.reload();
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        navigate('/login');
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['referral-dashboard', currentUser?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${currentUser.id}/referral-dashboard`);
      if (!res.ok) throw new Error('Error');
      return res.json();
    },
    enabled: !!currentUser?.id,
    refetchInterval: 30000,
  });

  const copyLink = () => {
    if (dashboardData?.referralLink) {
      navigator.clipboard.writeText(dashboardData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLink = async () => {
    if (!dashboardData?.referralLink) return;
    const shareData = {
      title: 'FRACTIONAL LIVING',
      text: language === 'es'
        ? `Únete a Fractional Living! Vive, invierte y construye patrimonio en el Caribe. Usa mi código: ${dashboardData.referralCode}`
        : `Join Fractional Living! Live, invest and build wealth in the Caribbean. Use my code: ${dashboardData.referralCode}`,
      url: dashboardData.referralLink,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyLink();
      }
    } catch {
      copyLink();
    }
  };

  if (!currentUser && !authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#717171]">{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const tabs = [
    { id: 'perfil' as const, label: language === 'es' ? 'Perfil' : 'Profile', icon: <Shield className="w-4 h-4" /> },
    { id: 'red' as const, label: language === 'es' ? 'Mi Red' : 'My Network', icon: <Network className="w-4 h-4" /> },
    { id: 'comisiones' as const, label: language === 'es' ? 'Comisiones' : 'Commissions', icon: <Wallet className="w-4 h-4" /> },
    { id: 'compartir' as const, label: language === 'es' ? 'Compartir' : 'Share', icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-[#222]">
      <Header />

      <main className="pb-32 max-w-4xl mx-auto pt-20 md:pt-24">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <Link href="/home">
            <span className="p-2 hover:bg-[#f7f7f7] rounded-full transition-colors cursor-pointer" data-testid="button-back-dashboard">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-dashboard-title">
              {language === 'es' ? 'Mi Dashboard' : 'My Dashboard'}
            </h1>
            <p className="text-[10px] text-[#999] uppercase tracking-[0.2em]">FRACTIONAL LIVING NETWORK</p>
          </div>
        </div>

        {dashboardData?.referralCode && (
          <div className="mx-4 mt-3 bg-gradient-to-r from-[#f0f0f0] to-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-4" data-testid="card-referral-code">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#717171] uppercase tracking-wider mb-1">
                  {language === 'es' ? 'Tu código único' : 'Your unique code'}
                </p>
                <p className="text-2xl font-bold text-[#555] tracking-widest font-mono" data-testid="text-referral-code">
                  {dashboardData.referralCode}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyLink} 
                  className="p-3 bg-[#f0f0f0] rounded-xl hover:bg-[#ebebeb] transition-colors"
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="w-5 h-5 text-[#059669]" /> : <Copy className="w-5 h-5" />}
                </button>
                <button 
                  onClick={shareLink}
                  className="p-3 bg-gradient-to-r from-[#059669] to-[#06b6d4] rounded-xl hover:opacity-90 transition-colors"
                  data-testid="button-share-link"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 bg-[#f7f7f7] rounded-lg px-3 py-2">
              <LinkIcon className="w-3 h-3 text-[#999] flex-shrink-0" />
              <p className="text-xs text-[#717171] truncate" data-testid="text-referral-link">
                {dashboardData.referralLink}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-1 mx-4 mt-4 bg-[#f7f7f7] rounded-xl p-1" data-testid="tabs-dashboard">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20'
                  : 'text-[#717171] hover:text-[#555]'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 px-4">
          {activeTab === 'perfil' && (
            <ProfileTab 
              user={dashboardData?.user || currentUser}
              stats={dashboardData?.stats}
              language={language}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'red' && (
            <NetworkTab
              network={dashboardData?.network || []}
              stats={dashboardData?.stats}
              language={language}
              isLoading={isLoading}
              expandedLevel={expandedLevel}
              setExpandedLevel={setExpandedLevel}
            />
          )}
          {activeTab === 'comisiones' && (
            <CommissionsTab
              commissions={dashboardData?.commissions || []}
              totalCommission={dashboardData?.totalCommission || 0}
              commissionStructure={dashboardData?.commissionStructure || COMMISSION_LEVELS}
              language={language}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'compartir' && (
            <ShareTab
              referralCode={dashboardData?.referralCode || ''}
              referralLink={dashboardData?.referralLink || ''}
              language={language}
              onCopy={copyLink}
              onShare={shareLink}
              copied={copied}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ProfileTab({ user, stats, language, isLoading }: any) {
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="space-y-4" data-testid="tab-content-perfil">
      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#059669] to-[#06b6d4] flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate" data-testid="text-user-name">{user?.name || 'Usuario'}</h2>
            <p className="text-sm text-[#717171] truncate" data-testid="text-user-email">{user?.email}</p>
            <p className="text-xs text-[#555] mt-1">
              {language === 'es' ? 'Miembro de la Red FL' : 'FL Network Member'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard label={language === 'es' ? 'Teléfono' : 'Phone'} value={user?.phone || '-'} />
          <InfoCard label={language === 'es' ? 'País' : 'Country'} value={user?.country || 'México'} />
          <InfoCard 
            label={language === 'es' ? 'Miembro desde' : 'Member since'} 
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }) : '-'} 
          />
          <InfoCard 
            label={language === 'es' ? 'Fuente' : 'Source'} 
            value={user?.source === 'referral' ? 'Referido' : 'Web'} 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard 
          icon={<UserPlus className="w-5 h-5 text-[#555]" />}
          value={stats?.totalReferrals || 0}
          label={language === 'es' ? 'Directos' : 'Direct'}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-[#555]" />}
          value={stats?.networkSize || 0}
          label={language === 'es' ? 'Red Total' : 'Network'}
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-[#555]" />}
          value={stats?.levels?.length || 0}
          label={language === 'es' ? 'Niveles' : 'Levels'}
        />
      </div>

      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-3 text-[#444]">
          {language === 'es' ? 'Acceso Exclusivo' : 'Exclusive Access'}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Link href="/fractional">
            <div className="relative overflow-hidden rounded-xl h-24 cursor-pointer group" data-testid="link-quick-fractions">
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=200&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-medium">{language === 'es' ? 'Fracciones' : 'Fractions'}</p>
                <p className="text-white/70 text-[10px]">{language === 'es' ? 'Apartá tu propiedad' : 'Reserve your property'}</p>
              </div>
            </div>
          </Link>
          <Link href="/experiences">
            <div className="relative overflow-hidden rounded-xl h-24 cursor-pointer group" data-testid="link-quick-experiences">
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-medium">{language === 'es' ? 'Experiencias' : 'Experiences'}</p>
                <p className="text-white/70 text-[10px]">{language === 'es' ? 'Yates, chefs, tours' : 'Yachts, chefs, tours'}</p>
              </div>
            </div>
          </Link>
          <Link href="/favoritos">
            <div className="relative overflow-hidden rounded-xl h-24 cursor-pointer group" data-testid="link-quick-favorites">
              <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=200&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-medium">{language === 'es' ? 'Favoritos' : 'Favorites'}</p>
                <p className="text-white/70 text-[10px]">{language === 'es' ? 'Tus propiedades guardadas' : 'Your saved properties'}</p>
              </div>
            </div>
          </Link>
          <Link href="/vuelos">
            <div className="relative overflow-hidden rounded-xl h-24 cursor-pointer group" data-testid="link-quick-flights">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109db56?w=400&h=200&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="text-white text-xs font-medium">{language === 'es' ? 'Vuelos' : 'Flights'}</p>
                <p className="text-white/70 text-[10px]">{language === 'es' ? 'Reserva tu viaje' : 'Book your trip'}</p>
              </div>
            </div>
          </Link>
        </div>
        <h3 className="text-sm font-semibold mb-3 text-[#444]">
          {language === 'es' ? 'Mis Intereses' : 'My Interests'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map(opt => {
            const isSelected = user?.interests?.includes(opt.id);
            return (
              <div 
                key={opt.id}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-xs ${
                  isSelected 
                    ? 'bg-[#f0fdf4] border-[#059669]/15 text-[#555]' 
                    : 'bg-[#f7f7f7] border-[#ebebeb] text-[#999]'
                }`}
                data-testid={`interest-${opt.id}`}
              >
                <opt.Icon className="w-3.5 h-3.5 text-[#717171]" />
                <span>{language === 'es' ? opt.label : opt.labelEn}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#f7f7f7] to-transparent border border-[#ebebeb] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Gift className="w-6 h-6 text-[#059669] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[#555] mb-1">
              {language === 'es' ? 'Gana compartiendo!' : 'Earn by sharing!'}
            </h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              {language === 'es' 
                ? 'Comparte tu enlace único con amigos, familia o conocidos. Por cada persona que se registre y cualquier actividad en tu red de 5 niveles, accedes al 4% en comisiones. No necesitan comprar para que tú ganes!'
                : 'Share your unique link with friends, family or contacts. For every person who registers and any activity in your 5-level network, you access 4% in commissions. They don\'t need to buy for you to earn!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkTab({ network, stats, language, isLoading, expandedLevel, setExpandedLevel }: any) {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4" data-testid="tab-content-red">
      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Network className="w-4 h-4 text-[#555]" />
          {language === 'es' ? 'Mi Red de 5 Niveles' : 'My 5-Level Network'}
        </h3>
        
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(level => {
            const levelData = network?.find((n: any) => n.level === level);
            const count = levelData?.count || 0;
            const commission = COMMISSION_LEVELS.find(c => c.level === level);
            const isExpanded = expandedLevel === level;

            return (
              <div key={level}>
                <button
                  onClick={() => setExpandedLevel(isExpanded ? null : level)}
                  className="w-full flex items-center gap-3 p-3 bg-white hover:bg-[#f0f0f0] rounded-xl transition-all"
                  data-testid={`network-level-${level}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black"
                    style={{ backgroundColor: commission?.color }}
                  >
                    N{level}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {language === 'es' ? `Nivel ${level}` : `Level ${level}`}
                        {level === 1 && <span className="text-[#555] text-xs ml-1">({language === 'es' ? 'Directos' : 'Direct'})</span>}
                      </span>
                      <span className="text-sm font-bold text-[#555]" data-testid={`text-level-${level}-count`}>{count}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-[#999]">{commission?.percentage}% {language === 'es' ? 'comisión' : 'commission'}</span>
                      {count > 0 && (
                        isExpanded ? <ChevronDown className="w-3 h-3 text-[#999]" /> : <ChevronRight className="w-3 h-3 text-[#999]" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && levelData?.users && (
                  <div className="mt-1 space-y-1 pl-4 ml-5 border-l border-[#ebebeb]">
                    {levelData.users.map((u: any) => (
                      <div key={u.id} className="flex items-center gap-3 p-2 bg-white rounded-lg text-xs">
                        <div className="w-7 h-7 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[10px] font-bold">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#444] truncate">{u.name}</p>
                          <p className="text-[#bbb] truncate">{u.email}</p>
                        </div>
                        <span className="text-[10px] text-[#bbb]">
                          {new Date(u.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {stats?.networkSize === 0 && (
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-6 text-center">
          <Users className="w-12 h-12 text-[#ccc] mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-2">
            {language === 'es' ? 'Tu red está vacía' : 'Your network is empty'}
          </h3>
          <p className="text-xs text-[#717171] mb-4 max-w-xs mx-auto">
            {language === 'es' 
              ? 'Comparte tu enlace único y comienza a construir tu red. Cada registro cuenta.'
              : 'Share your unique link and start building your network. Every registration counts.'}
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#f7f7f7] to-transparent border border-[#ebebeb] rounded-2xl p-5">
        <h4 className="text-xs font-semibold text-[#555] mb-3 uppercase tracking-wider">
          {language === 'es' ? 'Razones para compartir tu enlace' : 'Reasons to share your link'}
        </h4>
        <div className="space-y-2">
          {[
            { es: 'Un amigo quiere comprar una fracción', en: 'A friend wants to buy a fraction', Icon: Crown },
            { es: 'Alguien quiere vender su propiedad', en: 'Someone wants to sell their property', Icon: Tag },
            { es: 'Un conocido busca invertir', en: 'Someone looking to invest', Icon: TrendingUp },
            { es: 'Una persona quiere promocionar propiedades', en: 'Someone wants to promote properties', Icon: Megaphone },
            { es: 'Cualquier persona curiosa por el modelo', en: 'Anyone curious about the model', Icon: Gem },
          ].map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#717171]">
              <reason.Icon className="w-3.5 h-3.5 text-[#999]" />
              <span>{language === 'es' ? reason.es : reason.en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommissionsTab({ commissions, totalCommission, commissionStructure, language, isLoading }: any) {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4" data-testid="tab-content-comisiones">
      <div className="bg-gradient-to-br from-[#059669] to-[#047857] border border-[#059669]/20 rounded-2xl p-5">
        <p className="text-[10px] text-white/70 uppercase tracking-wider mb-1">
          {language === 'es' ? 'Total Comisiones Acumuladas' : 'Total Accumulated Commissions'}
        </p>
        <p className="text-3xl font-bold text-white" data-testid="text-total-commissions">
          ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          <span className="text-sm text-white/60 ml-1">USD</span>
        </p>
      </div>

      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#555]" />
          {language === 'es' ? 'Estructura de Comisiones - 4% Total' : 'Commission Structure - 4% Total'}
        </h3>

        <div className="space-y-3">
          {COMMISSION_LEVELS.map(level => (
            <div key={level.level} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                style={{ backgroundColor: level.color }}
              >
                {level.level}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#555]">
                    {language === 'es' ? `Nivel ${level.level}` : `Level ${level.level}`}
                    {level.level === 1 && ` (${language === 'es' ? 'Directos' : 'Direct'})`}
                  </span>
                  <span className="text-xs font-bold text-[#555]">{level.percentage}%</span>
                </div>
                <div className="w-full bg-[#ebebeb] rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${(level.percentage / 1.2) * 100}%`, backgroundColor: level.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[#ebebeb] flex justify-between items-center">
          <span className="text-xs text-[#717171]">{language === 'es' ? 'Total por transacción' : 'Total per transaction'}</span>
          <span className="text-sm font-bold text-[#555]">4.0%</span>
        </div>
      </div>

      {commissions.length > 0 ? (
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3">
            {language === 'es' ? 'Historial de Comisiones' : 'Commission History'}
          </h3>
          <div className="space-y-2">
            {commissions.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                <div>
                  <p className="text-xs font-medium">Nivel {c.level}</p>
                  <p className="text-[10px] text-[#999]">{new Date(c.createdAt).toLocaleDateString('es-MX')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#059669]">+${parseFloat(c.amount).toFixed(2)}</p>
                  <p className="text-[10px] text-[#999]">{c.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-6 text-center">
          <Wallet className="w-12 h-12 text-[#ccc] mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-2">
            {language === 'es' ? 'Sin comisiones aún' : 'No commissions yet'}
          </h3>
          <p className="text-xs text-[#717171] max-w-xs mx-auto">
            {language === 'es' 
              ? 'Las comisiones se generan cuando hay actividad en tu red. Comienza compartiendo tu enlace!'
              : 'Commissions are generated when there is activity in your network. Start sharing your link!'}
          </p>
        </div>
      )}

      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h4 className="text-xs font-semibold text-[#555] mb-3">
          {language === 'es' ? 'Cómo funcionan las comisiones?' : 'How do commissions work?'}
        </h4>
        <div className="space-y-3 text-xs text-[#717171]">
          <p>
            {language === 'es' 
              ? '- Cada vez que alguien en tu red realiza una transacción (compra, venta, inversión), se genera un 4% de comisión distribuido en 5 niveles.'
              : '- Every time someone in your network makes a transaction (purchase, sale, investment), a 4% commission is generated distributed across 5 levels.'}
          </p>
          <p>
            {language === 'es'
              ? '- No necesitas comprar nada para ganar. Solo comparte tu enlace y deja que tu red crezca.'
              : '- You don\'t need to buy anything to earn. Just share your link and let your network grow.'}
          </p>
          <p>
            {language === 'es'
              ? '- Las comisiones se acumulan y son pagaderas según los términos del programa.'
              : '- Commissions accumulate and are payable according to program terms.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShareTab({ referralCode, referralLink, language, onCopy, onShare, copied }: any) {
  const shareMessages = [
    {
      label: language === 'es' ? 'Para un amigo que quiere comprar' : 'For a friend who wants to buy',
      Icon: Crown,
      message: language === 'es'
        ? `Hola! Mira esta oportunidad de tener una fracción de propiedad de lujo en el Caribe. Es legal, heredable y accesible. Regístrate con mi enlace: ${referralLink}`
        : `Hey! Check out this opportunity to own a fraction of luxury property in the Caribbean. It's legal, inheritable and accessible. Register with my link: ${referralLink}`,
    },
    {
      label: language === 'es' ? 'Para alguien que quiere vender' : 'For someone who wants to sell',
      Icon: Tag,
      message: language === 'es'
        ? `Tienes una propiedad que quieres vender? En Fractional Living la venden por ti con un modelo innovador que puede darte hasta 12% más de su valor. Info: ${referralLink}`
        : `Have a property you want to sell? Fractional Living sells it for you with an innovative model that can give you up to 12% more. Info: ${referralLink}`,
    },
    {
      label: language === 'es' ? 'Para un inversionista' : 'For an investor',
      Icon: TrendingUp,
      message: language === 'es'
        ? `Si buscas invertir en bienes raíces de lujo en el Caribe sin complicaciones, conoce el modelo Fractional Living. Activos reales, estructura legal. ${referralLink}`
        : `If you're looking to invest in luxury Caribbean real estate hassle-free, check out the Fractional Living model. Real assets, legal structure. ${referralLink}`,
    },
    {
      label: language === 'es' ? 'Para promocionar' : 'To promote',
      Icon: Megaphone,
      message: language === 'es'
        ? `Te gustaría ganar comisiones promoviendo propiedades de lujo en el Caribe? Únete a la red de Fractional Living. Es gratis registrarse: ${referralLink}`
        : `Want to earn commissions promoting luxury Caribbean properties? Join the Fractional Living network. Free to register: ${referralLink}`,
    },
    {
      label: language === 'es' ? 'General' : 'General',
      Icon: Gem,
      message: language === 'es'
        ? `Te invito a conocer Fractional Living - propiedades de lujo fraccionadas en el Caribe. Vive, invierte y construye patrimonio. ${referralLink}`
        : `Check out Fractional Living - fractional luxury properties in the Caribbean. Live, invest and build wealth. ${referralLink}`,
    },
  ];

  const copyMessage = (msg: string) => {
    navigator.clipboard.writeText(msg);
  };

  return (
    <div className="space-y-4" data-testid="tab-content-compartir">
      <div className="bg-gradient-to-r from-[#f0f0f0] to-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5 text-center">
        <Share2 className="w-10 h-10 text-[#059669] mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">
          {language === 'es' ? 'Comparte y Gana' : 'Share & Earn'}
        </h3>
        <p className="text-xs text-[#717171] mb-4 max-w-sm mx-auto">
          {language === 'es'
            ? 'Cada persona que se registre con tu enlace se convierte en parte de tu red. Ganas comisiones por la actividad de hasta 5 niveles de profundidad.'
            : 'Every person who registers with your link becomes part of your network. You earn commissions from activity up to 5 levels deep.'}
        </p>

        <div className="bg-[#f7f7f7] rounded-xl p-4 mb-4">
          <p className="text-[10px] text-[#999] mb-1 uppercase tracking-wider">
            {language === 'es' ? 'Tu enlace único' : 'Your unique link'}
          </p>
          <p className="text-sm text-[#555] font-mono break-all" data-testid="text-share-link">{referralLink}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCopy}
            className="flex-1 py-3 bg-[#f0f0f0] rounded-xl text-sm font-medium hover:bg-[#ebebeb] transition-colors flex items-center justify-center gap-2"
            data-testid="button-copy-share"
          >
            {copied ? <Check className="w-4 h-4 text-[#059669]" /> : <Copy className="w-4 h-4" />}
            {copied ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar' : 'Copy')}
          </button>
          <button
            onClick={onShare}
            className="flex-1 py-3 bg-gradient-to-r from-[#059669] to-[#06b6d4] rounded-xl text-sm font-medium text-white hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            data-testid="button-share-native"
          >
            <Share2 className="w-4 h-4" />
            {language === 'es' ? 'Compartir' : 'Share'}
          </button>
        </div>
      </div>

      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-[#555]" />
          {language === 'es' ? 'Mensajes listos para compartir' : 'Ready-to-share messages'}
        </h3>
        <div className="space-y-3">
          {shareMessages.map((msg, i) => (
            <div key={i} className="bg-white border border-[#ebebeb] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <msg.Icon className="w-3.5 h-3.5 text-[#717171]" />
                  {msg.label}
                </span>
                <button
                  onClick={() => copyMessage(msg.message)}
                  className="text-[10px] text-[#059669] hover:text-[#047857] flex items-center gap-1"
                  data-testid={`button-copy-message-${i}`}
                >
                  <Copy className="w-3 h-3" />
                  {language === 'es' ? 'Copiar' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-[#717171] leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-5">
        <h4 className="text-xs font-semibold text-[#555] mb-3">
          {language === 'es' ? 'Quién puede beneficiarse?' : 'Who can benefit?'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { es: 'Compradores', en: 'Buyers', Icon: Crown },
            { es: 'Vendedores', en: 'Sellers', Icon: Tag },
            { es: 'Inversionistas', en: 'Investors', Icon: TrendingUp },
            { es: 'Promotores', en: 'Promoters', Icon: Megaphone },
            { es: 'Brokers', en: 'Brokers', Icon: Handshake },
            { es: 'Curiosos', en: 'Curious', Icon: Gem },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-lg text-xs text-[#717171]">
              <item.Icon className="w-3.5 h-3.5 text-[#999]" />
              <span>{language === 'es' ? item.es : item.en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3">
      <p className="text-[10px] text-[#999] mb-0.5">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-4 text-center" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-[#717171]">{label}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-[#f7f7f7] rounded-2xl p-5 animate-pulse">
          <div className="h-4 bg-[#ebebeb] rounded w-1/3 mb-3" />
          <div className="h-3 bg-[#f0f0f0] rounded w-2/3 mb-2" />
          <div className="h-3 bg-[#f0f0f0] rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
