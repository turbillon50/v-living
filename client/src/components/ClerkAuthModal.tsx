import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface ClerkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'sign-in' | 'sign-up';
}

export function ClerkAuthModal({ isOpen, onClose, mode }: ClerkAuthModalProps) {
  const { language } = useLanguage();
  const { isSignedIn } = useUser();
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    if (isSignedIn && isOpen) {
      onClose();
    }
  }, [isSignedIn, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
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

          {currentMode === 'sign-up' ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-black/20 hover:bg-black/5",
                  formButtonPrimary: "bg-black hover:bg-black/90",
                  footerActionLink: "text-orange-500 hover:text-orange-600",
                  formFieldInput: "border-black/20 focus:border-orange-500",
                }
              }}
              routing="hash"
              signInUrl="#sign-in"
              afterSignUpUrl="/"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-black/20 hover:bg-black/5",
                  formButtonPrimary: "bg-black hover:bg-black/90",
                  footerActionLink: "text-orange-500 hover:text-orange-600",
                  formFieldInput: "border-black/20 focus:border-orange-500",
                }
              }}
              routing="hash"
              signUpUrl="#sign-up"
              afterSignInUrl="/"
            />
          )}
        </div>
      </div>
    </div>
  );
}
