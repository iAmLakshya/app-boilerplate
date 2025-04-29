import { ProtectedPage } from '@/components/protected-page';
export default function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      {/* <DashboardLayout>{children}</DashboardLayout> */}
      {children}
    </ProtectedPage>
  );
}
