// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/common/app-header';
import { LOGGED_IN_USER_COOKIE_NAME, ADMIN_ID } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get cookie on the client-side
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userCookie = getCookie(LOGGED_IN_USER_COOKIE_NAME);

    if (userCookie === ADMIN_ID) {
      setIsAuthenticated(true);
    } else {
      router.replace('/'); // Redirect to login if not authenticated
    }
  }, [router]);

  // While checking auth, show a loading state
  if (!isAuthenticated) {
     return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-card shadow-md sticky top-0 z-50">
           <div className="container mx-auto px-4 py-3 flex justify-between items-center">
             <Skeleton className="h-7 w-48" />
             <Skeleton className="h-9 w-28" />
           </div>
        </header>
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
            <Skeleton className="h-96 w-full max-w-lg mx-auto" />
        </main>
      </div>
    );
  }

  // Once authenticated, render the real layout
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