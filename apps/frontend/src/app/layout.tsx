import { AuthProvider } from '@/contexts/auth.context';
import { GlobalStyles } from '@/ui/global-styles';
import { Toaster } from '@/ui/sonner';
export const metadata = {
  title: 'Welcome to frontend',
  description: 'Lorem ipsum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <GlobalStyles />
        <body className="scroll-smooth">
          <Toaster closeButton richColors />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
