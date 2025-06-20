import { AppHeader } from '@/components/common/app-header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LOGGED_IN_USER_COOKIE_NAME, USER_N_ID, USER_K_ID } from '@/lib/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(LOGGED_IN_USER_COOKIE_NAME);
  
  if (!userCookie || (userCookie.value !== USER_N_ID && userCookie.value !== USER_K_ID)) {
    // This should be caught by middleware, but as a safeguard:
    redirect('/');
  }

  const userName = userCookie.value === USER_N_ID ? 'N' : 'K';

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} userType="user" />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Balanced diet is important. More protein, less rice and poli 
      </footer>
    </div>
  );
}
