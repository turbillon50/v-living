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

  const syncUserToDatabase = async () => {
    if (!user) return;
    
    try {
      await fetch('/api/clerk/sync-user', {
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
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const logout = () => {
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

export function useClerkAuth() {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
}
