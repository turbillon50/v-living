import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatPrice: (priceMXN: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    'fractions': 'Fracciones',
    'experiences': 'Experiencias',
    'lastMinute': 'Last Minute',
    'profile': 'Perfil',
    'property': 'Property',
    'available': 'Disponibles',
    'selectWeeks': 'Selecciona 3 semanas',
    'buyFraction': 'Comprar Fracción',
    'vacation': 'Vacacionar',
    'launch': 'Lanzamiento: 21 de Marzo',
    'launchBonus': 'Regístrate para bonos exclusivos',
    'reserve': 'Reservar',
    'registerLaunch': 'Registrarme para Lanzamiento',
    'email': 'Tu correo electrónico',
    'contactAdvisor': 'Contactar Asesor',
    'realProperty': 'Propiedad real, legal y heredable en el Caribe',
    'soon': 'Pronto',
    'week': 'Semana',
    'price': 'Precio',
    'perFraction': 'por fracción',
  },
  en: {
    'fractions': 'Fractions',
    'experiences': 'Experiences',
    'lastMinute': 'Last Minute',
    'profile': 'Profile',
    'property': 'Property',
    'available': 'Available',
    'selectWeeks': 'Select 3 weeks',
    'buyFraction': 'Buy Fraction',
    'vacation': 'Vacation',
    'launch': 'Launch: March 21st',
    'launchBonus': 'Register for exclusive bonuses',
    'reserve': 'Reserve',
    'registerLaunch': 'Register for Launch',
    'email': 'Your email',
    'contactAdvisor': 'Contact Advisor',
    'realProperty': 'Real, legal and inheritable property in the Caribbean',
    'soon': 'Soon',
    'week': 'Week',
    'price': 'Price',
    'perFraction': 'per fraction',
  }
};

const EXCHANGE_RATE = 17.5;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const formatPrice = (priceMXN: number): string => {
    if (language === 'en') {
      const priceUSD = Math.round(priceMXN / EXCHANGE_RATE);
      return `$${priceUSD.toLocaleString()} USD`;
    }
    return `$${priceMXN.toLocaleString()} MXN`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
