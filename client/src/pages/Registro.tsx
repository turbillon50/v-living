import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingAI } from '@/components/FloatingAI';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Home, TrendingUp, Users, Wallet, Building, Tag, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const INTEREST_OPTIONS = [
  { 
    id: 'fraccion', 
    icon: Home, 
    label: 'Quiero una fracción',
    labelEn: 'I want a fraction',
    desc: 'Adquirir propiedad fraccionada',
    descEn: 'Acquire fractional property'
  },
  { 
    id: 'vivirla', 
    icon: Home, 
    label: 'Vivirla',
    labelEn: 'Live in it',
    desc: 'Usar mi fracción para vacaciones',
    descEn: 'Use my fraction for vacations'
  },
  { 
    id: 'ganar', 
    icon: TrendingUp, 
    label: 'Ganar con ella',
    labelEn: 'Earn with it',
    desc: 'Generar rendimientos por renta',
    descEn: 'Generate rental income'
  },
  { 
    id: 'broker', 
    icon: Users, 
    label: 'Ser Broker / Influencer',
    labelEn: 'Be a Broker / Influencer',
    desc: 'Comisiones desde 6% + beneficios',
    descEn: '6%+ commissions + benefits'
  },
  { 
    id: 'lastminute', 
    icon: Wallet, 
    label: 'Last Minute Capital',
    labelEn: 'Last Minute Capital',
    desc: 'Financiamiento y crédito',
    descEn: 'Financing and credit'
  },
  { 
    id: 'aportar', 
    icon: Building, 
    label: 'Aportar mi propiedad',
    labelEn: 'Contribute my property',
    desc: 'Sumar mi inmueble al portafolio',
    descEn: 'Add my property to portfolio'
  },
  { 
    id: 'vender', 
    icon: Tag, 
    label: 'Vender mi propiedad',
    labelEn: 'Sell my property',
    desc: 'Liquidar a través de Fractional Living',
    descEn: 'Liquidate through Fractional Living'
  },
];

async function createLead(data: { email: string; name?: string; phone?: string; interest: string; message?: string }) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create lead');
  return res.json();
}

export default function Registro() {
  const { language } = useLanguage();
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      setShowSuccess(true);
      setEmail('');
      setName('');
      setPhone('');
      setMessage('');
      setSelectedInterest('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedInterest) return;
    
    mutation.mutate({
      email,
      name: name || undefined,
      phone: phone || undefined,
      interest: selectedInterest,
      message: message || undefined,
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-teal-400" />
            </div>
            <h1 className="text-2xl font-light text-white mb-4">
              {language === 'es' ? '¡Solicitud Recibida!' : 'Request Received!'}
            </h1>
            <p className="text-white/60 mb-6">
              {language === 'es' 
                ? 'En los próximos 5 días recibirás el estatus de tu solicitud a tu correo electrónico.'
                : 'In the next 5 days you will receive the status of your request to your email.'}
            </p>
            <p className="text-teal-400 text-sm mb-8">
              {language === 'es' 
                ? 'Revisa tu bandeja de entrada y spam'
                : 'Check your inbox and spam folder'}
            </p>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-white/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Volver al inicio' : 'Back to home'}
              </Button>
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-xs text-teal-400 uppercase tracking-[0.2em] mb-3">
              {language === 'es' ? 'Únete' : 'Join Us'}
            </p>
            <h1 className="text-3xl font-light text-white mb-3">
              {language === 'es' ? '¿Qué te interesa?' : 'What interests you?'}
            </h1>
            <p className="text-white/50">
              {language === 'es' 
                ? 'Selecciona una opción y te contactamos'
                : 'Select an option and we\'ll contact you'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              {INTEREST_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedInterest === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedInterest(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    data-testid={`option-${option.id}`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-500/20' : 'bg-white/10'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-400' : 'text-white/60'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">
                        {language === 'es' ? option.label : option.labelEn}
                      </p>
                      <p className="text-white/50 text-xs">
                        {language === 'es' ? option.desc : option.descEn}
                      </p>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-teal-400" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className="text-white/60 text-sm mb-2 block">
                  {language === 'es' ? 'Correo electrónico *' : 'Email *'}
                </label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-email"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    {language === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <Input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    {language === 'es' ? 'Teléfono' : 'Phone'}
                  </label>
                  <Input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52..."
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">
                  {language === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
                </label>
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'es' ? 'Cuéntanos más sobre tu interés...' : 'Tell us more about your interest...'}
                  className="bg-white/5 border-white/20 text-white min-h-[80px]"
                  data-testid="input-message"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!email || !selectedInterest || mutation.isPending}
              className="w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-medium"
              data-testid="button-submit"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'es' ? 'Enviando...' : 'Sending...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {language === 'es' ? 'Enviar Solicitud' : 'Send Request'}
                </span>
              )}
            </Button>

            <p className="text-center text-white/40 text-xs">
              {language === 'es' 
                ? 'Recibirás confirmación por correo y estatus en 5 días'
                : 'You will receive email confirmation and status in 5 days'}
            </p>
          </form>
        </div>
      </main>

      <BottomNav />
      <FloatingAI />
    </div>
  );
}
