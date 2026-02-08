import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md mx-4 border border-[#eee] rounded-md p-8">
        <div className="flex mb-4 gap-2 items-center">
          <AlertCircle className="h-6 w-6 text-[#999]" />
          <h1 className="text-2xl text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>404</h1>
        </div>
        <p className="text-sm text-[#888] font-light mb-6">
          Página no encontrada
        </p>
        <Link href="/">
          <span className="inline-block px-6 py-3 bg-[#111] text-white rounded-md text-sm font-medium hover:bg-[#000] transition-colors duration-200 cursor-pointer">
            Volver al inicio
          </span>
        </Link>
      </div>
    </div>
  );
}
