import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { AGHLogo } from '@/components/AGHLogo';

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
            <div className="flex justify-center mb-2">
              <AGHLogo size={28} color="#059669" />
            </div>
            <h1 className="text-2xl font-light tracking-[0.2em] text-[#222]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>FRACTIONAL LIVING</h1>
            <div className="w-8 h-[0.5px] bg-gradient-to-r from-[#059669] to-[#06b6d4] mx-auto mt-2 mb-1" />
            <p className="text-[8px] text-[#999] uppercase tracking-[0.4em]">All Global Holding LLC</p>
          </div>

          {currentMode === 'sign-up' ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-[#ebebeb] hover:bg-[#f7f7f7]",
                  formButtonPrimary: "bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all",
                  footerActionLink: "text-[#059669] hover:text-[#047857] text-[13px]",
                  formFieldInput: "border-[#e5e5e5] focus:border-[#059669] focus:ring-0 rounded-lg h-10 text-[13px] text-[#222] bg-white",
                  formFieldLabel: "text-[#717171] text-[12px]",
                }
              }}
              routing="hash"
              signInUrl="#sign-in"
              afterSignUpUrl="/dashboard"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-[#ebebeb] hover:bg-[#f7f7f7]",
                  formButtonPrimary: "bg-gradient-to-r from-[#059669] to-[#06b6d4] hover:from-[#047857] hover:to-[#0891b2] text-white rounded-lg h-10 text-[13px] font-medium shadow-none transition-all",
                  footerActionLink: "text-[#059669] hover:text-[#047857] text-[13px]",
                  formFieldInput: "border-[#e5e5e5] focus:border-[#059669] focus:ring-0 rounded-lg h-10 text-[13px] text-[#222] bg-white",
                  formFieldLabel: "text-[#717171] text-[12px]",
                }
              }}
              routing="hash"
              signUpUrl="#sign-up"
              afterSignInUrl="/dashboard"
            />
          )}
        </div>
      </div>
    </div>
  );
}
