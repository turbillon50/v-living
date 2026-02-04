import { useQuery } from '@tanstack/react-query';
import { Instagram, Youtube, Facebook, Twitter, Linkedin, Globe, Play, ExternalLink } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface MultiLink {
  id: string;
  title: string;
  url: string;
  type: string;
  position: number;
  isActive: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'instagram': return Instagram;
    case 'youtube': return Youtube;
    case 'facebook': return Facebook;
    case 'twitter': return Twitter;
    case 'linkedin': return Linkedin;
    case 'video': return Play;
    default: return Globe;
  }
};

const getGradient = (type: string) => {
  switch (type) {
    case 'instagram': return 'from-black to-black';
    case 'youtube': return 'from-red-500 to-red-600';
    case 'facebook': return 'from-black to-black';
    case 'twitter': return 'from-black to-black';
    case 'linkedin': return 'from-black to-black';
    case 'video': return 'from-black to-black';
    default: return 'from-gray-700 to-gray-800';
  }
};

export default function Multilinks() {
  const { data: links = [] } = useQuery<MultiLink[]>({
    queryKey: ['multilinks'],
    queryFn: async () => {
      const res = await fetch('/api/multilinks');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const activeLinks = links.filter(l => l.isActive).sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <img src={logoImg} alt="Fractional Living" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-white text-xl font-bold mb-1">Fractional Living</h1>
          <p className="text-gray-400 text-sm">All Global Holding LLC</p>
          <p className="text-orange-500 text-xs mt-2">Compra • Vive • Renta • Revende • Repite</p>
        </div>

        <div className="space-y-3">
          {activeLinks.length === 0 ? (
            <>
              <a 
                href="https://wa.me/529984292748"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-black flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium flex-1">WhatsApp</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-black flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium flex-1">Instagram</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </>
          ) : (
            activeLinks.map((link) => {
              const Icon = getIcon(link.type);
              const gradient = getGradient(link.type);
              return (
                <a 
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium flex-1">{link.title}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              );
            })
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-xs">
            © 2024 All Global Holding LLC
          </p>
        </div>
      </div>
    </div>
  );
}
