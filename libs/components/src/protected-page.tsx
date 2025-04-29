'use client';
import { useAuthContext } from '@/contexts/auth.context';
import { PageLoader } from '@/ui/page-loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading, loginPageUrl, sessionApiUrl } = useAuthContext();
  useEffect(() => {
    if (user || loading) return;

    fetch(sessionApiUrl, { method: 'DELETE' })
      .finally(() => {
        const currentPath = window?.location?.pathname;
        const redirectUrl = encodeURIComponent(currentPath);
        router.push(`${loginPageUrl}?next=${redirectUrl}`);
      })
      .catch((err) => {
        console.error('Error destroying session', err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading) return <PageLoader />;

  if (!user && !loading) {
    return null; // or return some loading stat
  }
  return children;
};
