import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyLocation?: string;
}

export function InquiryForm({ isOpen, onClose, propertyTitle, propertyLocation }: InquiryFormProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappText = encodeURIComponent(
      `Hola, soy ${name}.\n` +
      `Email: ${email}\n` +
      `Tel: ${phone}\n` +
      (propertyTitle ? `Propiedad: ${propertyTitle}\n` : '') +
      (propertyLocation ? `Ubicacion: ${propertyLocation}\n` : '') +
      (message ? `Mensaje: ${message}` : '')
    );
    window.open(`https://wa.me/529984292748?text=${whatsappText}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 fl-fade-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#dddddd] rounded-full mx-auto mb-4 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors"
          data-testid="button-close-inquiry"
        >
          <X className="w-5 h-5 text-[#717171]" />
        </button>

        <div className="mb-6">
          <p className="text-[#059669] text-[10px] uppercase tracking-[0.3em] mb-1 font-semibold">
            {language === 'es' ? 'Consulta' : 'Inquiry'}
          </p>
          <h3 className="text-[#222] text-xl font-semibold">
            {propertyTitle || (language === 'es' ? 'Solicitar información' : 'Request information')}
          </h3>
          {propertyLocation && (
            <p className="text-[#717171] text-sm mt-1">{propertyLocation}</p>
          )}
        </div>

        {submitted ? (
          <div className="text-center py-8 fl-fade-in">
            <div className="w-14 h-14 rounded-full fl-gradient-brand flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[#222] font-semibold text-lg">{language === 'es' ? 'Enviado' : 'Sent'}</p>
            <p className="text-[#717171] text-sm mt-1">
              {language === 'es' ? 'Un asesor te contactará pronto.' : 'An advisor will contact you soon.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
              className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-3 text-sm text-[#222] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-all"
              data-testid="input-inquiry-name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'es' ? 'Email' : 'Email'}
              className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-3 text-sm text-[#222] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-all"
              data-testid="input-inquiry-email"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
              className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-3 text-sm text-[#222] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-all"
              data-testid="input-inquiry-phone"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
              rows={3}
              className="w-full bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-3 text-sm text-[#222] placeholder:text-[#b0b0b0] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-all resize-none"
              data-testid="input-inquiry-message"
            />
            <button
              type="submit"
              className="w-full py-3.5 fl-btn-primary text-sm"
              data-testid="button-submit-inquiry"
            >
              {language === 'es' ? 'Enviar consulta' : 'Send inquiry'}
            </button>
            <p className="text-[#717171] text-[10px] text-center">
              {language === 'es'
                ? 'Se abrirá WhatsApp para confirmar el envío.'
                : 'WhatsApp will open to confirm sending.'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
