import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interests: string[];
  primaryInterest?: string;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; country: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateInterests: (interests: string[], primaryInterest?: string) => Promise<boolean>;
  updateUser: (user: User) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  useEffect(() => {
    const savedUser = localStorage.getItem('fractional_user') || localStorage.getItem('fl_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        localStorage.setItem('fractional_user', JSON.stringify(parsed));
      } catch (e) {
        localStorage.removeItem('fractional_user');
        localStorage.removeItem('fl_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const flUser = localStorage.getItem('fl_user');
      if (flUser && !user) {
        try {
          const parsed = JSON.parse(flUser);
          setUser(parsed);
          localStorage.setItem('fractional_user', JSON.stringify(parsed));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => {
      const flUser = localStorage.getItem('fl_user');
      if (flUser && !user) {
        try {
          const parsed = JSON.parse(flUser);
          setUser(parsed);
          localStorage.setItem('fractional_user', JSON.stringify(parsed));
        } catch (e) {}
      }
    }, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('fractional_user', JSON.stringify(userData));
      setShowAuthModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; country: string; password: string }) => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Error al registrarse' };
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('fractional_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const updateInterests = async (interests: string[], primaryInterest?: string) => {
    if (!user) return false;
    
    try {
      const res = await fetch(`/api/users/${user.id}/interests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, primaryInterest }),
      });

      if (!res.ok) return false;

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem('fractional_user', JSON.stringify(updatedUser));
      setShowAuthModal(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fractional_user');
    localStorage.removeItem('fl_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fractional_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      updateInterests,
      updateUser,
      logout,
      showAuthModal,
      setShowAuthModal,
      authModalMode,
      setAuthModalMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
