import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '529984292748';
const WHATSAPP_MESSAGE = 'Hola, me interesa Fractional Living';

export function FloatingButtons() {
  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Button 
        size="lg" 
        className="rounded-full h-14 w-14 shadow-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
        onClick={openWhatsApp}
        data-testid="button-whatsapp-float"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
