import { redirect } from 'next/navigation';
import { verifyAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth/admin';
import { cookies } from 'next/headers';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  const session = await verifyAdminSession(token);
  if (!session?.authenticated) {
    redirect('/login');
  }

  return <AdminLayout>{children}</AdminLayout>;
}