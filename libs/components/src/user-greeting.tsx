'use client';
import { useAuthContext } from '@/contexts/auth.context';
import { generateGreeting } from '@/utils';

export const UserGreeting = () => {
  const { user } = useAuthContext();
  return (
    <div className="text-2xl">
      {generateGreeting()}
      {user?.displayName?.split?.(' ')[0]}
    </div>
  );
};
