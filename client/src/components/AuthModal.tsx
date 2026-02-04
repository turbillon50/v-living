import { useState, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, User, Mail, Phone, Globe, CheckCircle, Home, TrendingUp, Users, Wallet, Building, Tag, ExternalLink, ArrowRight } from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'comprar_fracciones', icon: Home, label: 'Comprar fracciones', labelEn: 'Buy fractions' },
  { id: 'last_minute_capital', icon: Wallet, label: 'Last Minute Capital', labelEn: 'Last Minute Capital' },
  { id: 'property_associate', icon: Building, label: 'Property Associate', labelEn: 'Property Associate' },
  { id: 'profile_associate', icon: User, label: 'Profile Associate', labelEn: 'Profile Associate' },
  { id: 'broker', icon: Users, label: 'Broker / Afiliado', labelEn: 'Broker / Affiliate' },
  { id: 'informacion', icon: Tag, label: 'Solo información', labelEn: 'Just info' },
];

const COUNTRIES = [
  'México', 'Estados Unidos', 'Canadá', 'España', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Brasil', 'Otro'
];

export function AuthModal() {
  const { language } = useLanguage();
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authModalMode, 
    setAuthModalMode,
    register,
    login,
    updateInterests,
    user
  } = useAuth();

  const [step, setStep] = useState<'form' | 'interests' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('México');
  const [pin, setPin] = useState(['', '', '', '']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  if (!showAuthModal) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const getPinString = () => pin.join('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (getPinString().length !== 4) {
      setError(language === 'es' ? 'Ingresa un PIN de 4 dígitos' : 'Enter a 4-digit PIN');
      return;
    }
    
    setIsLoading(true);
    const result = await register({ name, email, phone, country, password: getPinString() });
    
    if (result.success) {
      setStep('interests');
    } else {
      setError(result.error || 'Error al registrarse');
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (getPinString().length !== 4) {
      setError(language === 'es' ? 'Ingresa tu PIN de 4 dígitos' : 'Enter your 4-digit PIN');
      return;
    }
    
    setIsLoading(true);
    const result = await login(email, getPinString());
    
    if (result.success) {
      setShowAuthModal(false);
      resetForm();
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
    setIsLoading(false);
  };

  const handleInterestsSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError(language === 'es' ? 'Selecciona al menos un interés' : 'Select at least one interest');
      return;
    }

    setIsLoading(true);
    const success = await updateInterests(selectedInterests, selectedInterests[0]);
    
    if (success) {
      setStep('success');
    }
    setIsLoading(false);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setStep('form');
    setName('');
    setEmail('');
    setPhone('');
    setCountry('México');
    setPin(['', '', '', '']);
    setSelectedInterests([]);
    setError('');
  };

  const handleClose = () => {
    setShowAuthModal(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto" data-testid="auth-modal">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black z-10"
          data-testid="button-close-auth"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black tracking-tight">FRACTIONAL LIVING</h1>
            <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] mt-1">All Global Holding LLC</p>
          </div>

          {step === 'form' && authModalMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-black mb-4">
                {language === 'es' ? 'Crear cuenta' : 'Create account'}
              </h2>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <Input
                  type="text"
                  placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 bg-black/5 border-0 text-black placeholder:text-black/40 rounded-xl"
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-black/5 border-0 text-black placeholder:text-black/40 rounded-xl"
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <Input
                  type="tel"
                  placeholder="WhatsApp (+52 999 123 4567)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-12 bg-black/5 border-0 text-black placeholder:text-black/40 rounded-xl"
                  required
                  data-testid="input-phone"
                />
              </div>

              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-black/5 border-0 text-black rounded-xl appearance-none"
                  data-testid="select-country"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <p className="text-sm text-black/60 text-center mb-3">
                  {language === 'es' ? 'Crea tu PIN de 4 dígitos' : 'Create your 4-digit PIN'}
                </p>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={pinRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-bold bg-black/5 border-2 border-transparent focus:border-orange-500 rounded-xl text-black outline-none transition-colors"
                      data-testid={`input-pin-${i}`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-xl font-medium"
                data-testid="button-register"
              >
                {isLoading ? '...' : (language === 'es' ? 'Continuar' : 'Continue')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-center text-sm text-black/50">
                {language === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
                <button 
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-orange-500 font-medium hover:underline"
                  data-testid="link-login"
                >
                  {language === 'es' ? 'Iniciar sesión' : 'Log in'}
                </button>
              </p>
            </form>
          )}

          {step === 'form' && authModalMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-black mb-4">
                {language === 'es' ? 'Iniciar sesión' : 'Log in'}
              </h2>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-black/5 border-0 text-black placeholder:text-black/40 rounded-xl"
                  required
                  data-testid="input-login-email"
                />
              </div>

              <div>
                <p className="text-sm text-black/60 text-center mb-3">
                  {language === 'es' ? 'Tu PIN de 4 dígitos' : 'Your 4-digit PIN'}
                </p>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={pinRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-bold bg-black/5 border-2 border-transparent focus:border-orange-500 rounded-xl text-black outline-none transition-colors"
                      data-testid={`input-login-pin-${i}`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-xl font-medium"
                data-testid="button-login"
              >
                {isLoading ? '...' : (language === 'es' ? 'Entrar' : 'Enter')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-center text-sm text-black/50">
                {language === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
                <button 
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-orange-500 font-medium hover:underline"
                  data-testid="link-register"
                >
                  {language === 'es' ? 'Regístrate' : 'Sign up'}
                </button>
              </p>
            </form>
          )}

          {step === 'interests' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-black">
                {language === 'es' ? '¿Qué te interesa?' : 'What interests you?'}
              </h2>
              <p className="text-sm text-black/50 text-center">
                {language === 'es' ? 'Selecciona una o más opciones' : 'Select one or more options'}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedInterests.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleInterest(option.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-black/10 bg-black/5 hover:border-black/20'
                      }`}
                      data-testid={`interest-${option.id}`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-orange-500' : 'text-black/40'}`} />
                      <p className={`text-sm font-medium ${isSelected ? 'text-orange-600' : 'text-black/70'}`}>
                        {language === 'es' ? option.label : option.labelEn}
                      </p>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
              )}

              <Button 
                onClick={handleInterestsSubmit}
                disabled={isLoading || selectedInterests.length === 0}
                className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-xl font-medium"
                data-testid="button-save-interests"
              >
                {isLoading ? '...' : (language === 'es' ? 'Continuar' : 'Continue')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                {language === 'es' ? '¡Bienvenido!' : 'Welcome!'}
              </h2>
              <p className="text-black/60 text-sm mb-6">
                {language === 'es' 
                  ? 'Tu cuenta ha sido creada. Pronto recibirás un correo de bienvenida.' 
                  : 'Your account has been created. You will receive a welcome email soon.'}
              </p>

              <div className="space-y-3 mb-6">
                <a 
                  href="https://vandefi.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
                >
                  <span className="font-medium text-black">VanDeFi.org</span>
                  <ExternalLink className="w-4 h-4 text-orange-500" />
                </a>
                <a 
                  href="https://agh-ia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
                >
                  <span className="font-medium text-black">AGH-IA.com</span>
                  <ExternalLink className="w-4 h-4 text-orange-500" />
                </a>
              </div>

              <Button 
                onClick={handleClose}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
                data-testid="button-go-dashboard"
              >
                {language === 'es' ? 'Ir a mi perfil' : 'Go to my profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
