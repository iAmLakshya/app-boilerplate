'use client';

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseClientAuth } from '@/utils/firebase/client';

const DEFAULT_LOGIN_PAGE_URL = '/login';
const SESSION_API_URL = '/api/v1/session';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginPageUrl: string;
  sessionApiUrl: string;
  // You might add other relevant state like custom claims, roles, etc.
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginPageUrl: DEFAULT_LOGIN_PAGE_URL,
  sessionApiUrl: SESSION_API_URL,
});

interface AuthProviderProps {
  children: React.ReactNode;
  loginPageUrl?: string;
  sessionApiUrl?: string;
}

export const AuthProvider = ({
  children,
  loginPageUrl = DEFAULT_LOGIN_PAGE_URL,
  sessionApiUrl = SESSION_API_URL,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useCallback(() => getFirebaseClientAuth(), []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth(), (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.debug('Auth state changed, user:', currentUser?.uid || 'none');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginPageUrl, sessionApiUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
