import { AppHeader } from '@/components/common/app-header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LOGGED_IN_USER_COOKIE_NAME, ADMIN_ID } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(LOGGED_IN_USER_COOKIE_NAME);

  if (!userCookie || userCookie.value !== ADMIN_ID) {
     // This should be caught by middleware, but as a safeguard:
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName="Admin" userType="admin" />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Admin Control Panel
      </footer>
    </div>
  );
}
