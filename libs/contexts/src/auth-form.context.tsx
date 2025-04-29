'use client';

import { AuthFormView, IAuthFormContext } from '@/types';
import { getFirebaseClientAuth } from '@/utils/firebase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const AuthFormContext = createContext<IAuthFormContext>({
  activeView: AuthFormView.LOGIN,
  isSubmitting: false,
});

interface AuthFormProviderProps {
  children: React.ReactNode;
}
export const AuthFormProvider = ({ children }: AuthFormProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useCallback(() => getFirebaseClientAuth(), []);
  const [userCred, authLoading, error] = useAuthState(auth());
  const [state, setState] = useState<any>({});

  const [activeView, setActiveView] = useState<AuthFormView>(
    AuthFormView.LOGIN
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSession = async (cb?: () => any) => {
    const currentUser = auth()?.currentUser;
    try {
      await fetch('/api/v1/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await currentUser?.getIdToken() }),
      });
      await cb?.();
      const next = searchParams.get('next') || '/dashboard';
      router.replace(next);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create session, please try again.');
    }
  };
  return (
    <AuthFormContext.Provider
      value={{
        activeView,
        setActiveView,
        isSubmitting,
        setIsSubmitting,
        createSession,
        state,
        setState,
      }}
    >
      {children}
    </AuthFormContext.Provider>
  );
};

export const useAuthFormContext = () => useContext(AuthFormContext);
