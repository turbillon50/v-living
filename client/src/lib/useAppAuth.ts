import { useAuth } from './AuthContext';
import { useClerkAuth } from './ClerkAuthContext';

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function useAppAuth() {
  if (CLERK_ENABLED) {
    return useClerkAuth();
  }
  return useAuth();
}
