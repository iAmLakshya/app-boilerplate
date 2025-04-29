import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin  text-gray-700" size={50} />
    </div>
  );
};
