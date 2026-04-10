import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

interface ClerkAuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'sign-in' | 'sign-up';
  setAuthModalMode: (mode: 'sign-in' | 'sign-up') => void;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'sign-in' | 'sign-up'>('sign-up');

  useEffect(() => {
    if (isSignedIn && showAuthModal) {
      setShowAuthModal(false);
      syncUserToDatabase();
    }
  }, [isSignedIn, showAuthModal]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const hasLocal = localStorage.getItem('fractional_user');
      if (!hasLocal) {
        syncUserToDatabase();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const syncUserToDatabase = async () => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/clerk/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || '',
          phone: user.primaryPhoneNumber?.phoneNumber || '',
          profileImage: user.imageUrl,
        }),
      });
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('fl_user', JSON.stringify(userData));
        localStorage.setItem('fractional_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('fl_user');
    localStorage.removeItem('fractional_user');
    signOut();
  };

  return (
    <ClerkAuthContext.Provider value={{
      user: isSignedIn ? {
        id: user?.id,
        name: user?.fullName || user?.firstName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: user?.primaryPhoneNumber?.phoneNumber || '',
        profileImage: user?.imageUrl,
      } : null,
      isAuthenticated: !!isSignedIn,
      isLoading: !isLoaded,
      logout,
      showAuthModal,
      setShowAuthModal,
      authModalMode,
      setAuthModalMode,
    }}>
      {children}
    </ClerkAuthContext.Provider>
  );
}

const defaultContext: ClerkAuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  logout: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
  authModalMode: 'sign-up',
  setAuthModalMode: () => {},
};

export function useClerkAuth() {
  const context = useContext(ClerkAuthContext);
  return context ?? defaultContext;
}
