import { GalleryVerticalEnd } from 'lucide-react';

import { UserAuthForm } from '@/components/auth/auth-form';
import { cn } from '@/utils';

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block bg-gradient-to-b from-blue-800 to-black p-6 md:p-10 ">
        <div className="-z-10">
          <div
            className={cn(
              'absolute inset-0',
              '[background-size:40px_40px]',
              '[background-image:radial-gradient(#4D49BB_1px,transparent_1px)]',
              'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
            )}
          />
        </div>
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="#"
            className="flex items-center gap-2 font-medium text-white text-xl"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <UserAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
