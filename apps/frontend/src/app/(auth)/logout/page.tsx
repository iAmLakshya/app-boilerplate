'use client';
import { PageLoader } from '@/ui/page-loader';
import { getFirebaseClientAuth } from '@/utils/firebase/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

const LogoutPage = () => {
  const router = useRouter();
  const auth = useCallback(() => getFirebaseClientAuth(), []);
  const [signOut, isSigningOut, signOutError] = useSignOut(auth());
  const destroySession = async () => {
    try {
      await fetch('/api/v1/session', { method: 'DELETE' });
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Error destroying session', err);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (!isSigningOut && signOutError) {
      console.error('Error signing out', signOutError);
      toast.error('Something went wrong, ' + signOutError?.message);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signOutError]);

  useEffect(() => {
    destroySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <PageLoader />;
};
export default LogoutPage;
