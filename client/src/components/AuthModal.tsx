import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, User, Mail, Phone, Globe, Lock, CheckCircle, Home, TrendingUp, Users, Wallet, Building, Tag, ExternalLink } from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'comprar_fracciones', icon: Home, label: 'Comprar fracciones inmobiliarias', labelEn: 'Buy fractional real estate' },
  { id: 'last_minute_capital', icon: Wallet, label: 'Invertir capital (Last Minute Capital)', labelEn: 'Invest capital (Last Minute Capital)' },
  { id: 'property_associate', icon: Building, label: 'Aportar una propiedad (Property Associate)', labelEn: 'Contribute a property (Property Associate)' },
  { id: 'profile_associate', icon: User, label: 'Usar mi perfil de crédito (Profile Associate)', labelEn: 'Use my credit profile (Profile Associate)' },
  { id: 'broker', icon: Users, label: 'Ser broker o afiliado', labelEn: 'Become a broker or affiliate' },
  { id: 'informacion', icon: Tag, label: 'Solo quiero información', labelEn: 'I just want information' },
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
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register({ name, email, phone, country, password });
    
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
    setIsLoading(true);

    const result = await login(email, password);
    
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
    setPassword('');
    setSelectedInterests([]);
    setError('');
  };

  const handleClose = () => {
    setShowAuthModal(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
          data-testid="button-close-auth"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'form' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-white mb-2">
                {authModalMode === 'register' 
                  ? (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                  : (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
              </h2>
              <p className="text-white/50 text-sm">
                {authModalMode === 'register'
                  ? (language === 'es' ? 'Regístrate para contactarnos' : 'Register to contact us')
                  : (language === 'es' ? 'Bienvenido de vuelta' : 'Welcome back')}
              </p>
            </div>

            <form onSubmit={authModalMode === 'register' ? handleRegister : handleLogin} className="space-y-4">
              {authModalMode === 'register' && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'es' ? 'Nombre completo *' : 'Full name *'}
                      required
                      className="pl-10 bg-white/5 border-white/20 text-white"
                      data-testid="input-register-name"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={language === 'es' ? 'WhatsApp / Teléfono *' : 'WhatsApp / Phone *'}
                      required
                      className="pl-10 bg-white/5 border-white/20 text-white"
                      data-testid="input-register-phone"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-md text-white appearance-none"
                      data-testid="select-register-country"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  required
                  className="pl-10 bg-white/5 border-white/20 text-white"
                  data-testid="input-email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'es' ? 'Contraseña *' : 'Password *'}
                  required
                  minLength={6}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                  data-testid="input-password"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-medium"
                data-testid="button-submit-auth"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  authModalMode === 'register' 
                    ? (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                    : (language === 'es' ? 'Iniciar Sesión' : 'Sign In')
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setAuthModalMode(authModalMode === 'register' ? 'login' : 'register');
                  setError('');
                }}
                className="text-teal-400 text-sm hover:underline"
                data-testid="button-switch-auth-mode"
              >
                {authModalMode === 'register'
                  ? (language === 'es' ? '¿Ya tienes cuenta? Inicia sesión' : 'Already have an account? Sign in')
                  : (language === 'es' ? '¿No tienes cuenta? Regístrate' : "Don't have an account? Register")}
              </button>
            </div>
          </div>
        )}

        {step === 'interests' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-white mb-2">
                {language === 'es' ? '¿Qué te interesa?' : 'What interests you?'}
              </h2>
              <p className="text-white/50 text-sm">
                {language === 'es' ? 'Selecciona una o más opciones' : 'Select one or more options'}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {INTEREST_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedInterests.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleInterest(option.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    data-testid={`option-${option.id}`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-500/20' : 'bg-white/10'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-white/60'}`} />
                    </div>
                    <span className="text-white text-sm flex-1">
                      {language === 'es' ? option.label : option.labelEn}
                    </span>
                    {isSelected && <CheckCircle className="w-5 h-5 text-teal-400" />}
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}

            <Button
              onClick={handleInterestsSubmit}
              disabled={isLoading || selectedInterests.length === 0}
              className="w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-medium"
              data-testid="button-submit-interests"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                language === 'es' ? 'Continuar' : 'Continue'
              )}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">
              {language === 'es' ? '¡Registro Completado!' : 'Registration Complete!'}
            </h2>
            <p className="text-white/60 mb-6">
              {language === 'es' 
                ? 'Un asesor se pondrá en contacto contigo pronto.'
                : 'An advisor will contact you soon.'}
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="https://wa.me/529984292748"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                data-testid="button-whatsapp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {language === 'es' ? 'Hablar por WhatsApp' : 'Chat on WhatsApp'}
              </a>

              <a
                href="https://vandefi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                data-testid="button-vandefi"
              >
                <ExternalLink className="w-5 h-5" />
                VanDeFi.org
              </a>

              <a
                href="https://agh-ia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                data-testid="button-aghia"
              >
                <ExternalLink className="w-5 h-5" />
                AGH-IA.com
              </a>
            </div>

            <Button
              onClick={handleClose}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white"
              data-testid="button-close-success"
            >
              {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
