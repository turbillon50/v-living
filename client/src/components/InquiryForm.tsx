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
      (propertyLocation ? `Ubicación: ${propertyLocation}\n` : '') +
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#050d18] border border-[rgba(6,182,212,0.1)] p-6 fl-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748b] hover:text-white transition-colors"
          data-testid="button-close-inquiry"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.3em] mb-2">
            {language === 'es' ? 'Consulta' : 'Inquiry'}
          </p>
          <h3 className="text-white text-xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {propertyTitle || (language === 'es' ? 'Solicitar información' : 'Request information')}
          </h3>
          {propertyLocation && (
            <p className="text-[#64748b] text-sm mt-1">{propertyLocation}</p>
          )}
        </div>

        {submitted ? (
          <div className="text-center py-8 fl-fade-in">
            <div className="w-12 h-12 rounded-full fl-gradient-turquoise flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-white font-medium">{language === 'es' ? 'Enviado' : 'Sent'}</p>
            <p className="text-[#64748b] text-sm mt-1">
              {language === 'es' ? 'Un asesor te contactará pronto.' : 'An advisor will contact you soon.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
                className="w-full bg-[rgba(6,182,212,0.04)] border border-[rgba(6,182,212,0.1)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[rgba(6,182,212,0.3)] transition-colors"
                data-testid="input-inquiry-name"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={language === 'es' ? 'Email' : 'Email'}
                className="w-full bg-[rgba(6,182,212,0.04)] border border-[rgba(6,182,212,0.1)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[rgba(6,182,212,0.3)] transition-colors"
                data-testid="input-inquiry-email"
              />
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                className="w-full bg-[rgba(6,182,212,0.04)] border border-[rgba(6,182,212,0.1)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[rgba(6,182,212,0.3)] transition-colors"
                data-testid="input-inquiry-phone"
              />
            </div>
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
                rows={3}
                className="w-full bg-[rgba(6,182,212,0.04)] border border-[rgba(6,182,212,0.1)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[rgba(6,182,212,0.3)] transition-colors resize-none"
                data-testid="input-inquiry-message"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg fl-btn-primary text-sm font-medium tracking-wide"
              data-testid="button-submit-inquiry"
            >
              {language === 'es' ? 'Enviar consulta' : 'Send inquiry'}
            </button>
            <p className="text-[#475569] text-[10px] text-center">
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
