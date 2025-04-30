import { ProtectedPage } from '@/components/protected-page';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
export default function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedPage>
  );
}
