import { GlobalStyle } from '@app/ui/styles/global-style'
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
    <html lang="en">
      <GlobalStyle />
      <body>{children}</body>
    </html>
  );
}
