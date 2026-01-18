import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';

export default function ModeloNegocios() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Volver
          </span>
        </Link>
        
        <h1 className="text-4xl font-extralight text-white mb-6">Modelo de Negocios y Marco Legal</h1>
        
        <div className="bg-white/5 border border-white/10 p-8 text-white/70">
          <p className="text-lg font-light mb-6">
            Información sobre el modelo de negocios y marco legal próximamente.
          </p>
          <p className="text-sm text-white/40">
            Esta sección está en construcción. Puedes personalizar el contenido desde el Modo Creador.
          </p>
        </div>
      </div>
    </div>
  );
}
