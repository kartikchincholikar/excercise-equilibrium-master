// src/app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/common/app-header';
import { LOGGED_IN_USER_COOKIE_NAME, USER_N_ID, USER_K_ID } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get cookie on the client-side
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userCookie = getCookie(LOGGED_IN_USER_COOKIE_NAME);
    
    if (userCookie === USER_N_ID || userCookie === USER_K_ID) {
      setIsAuthenticated(true);
      setUserName(userCookie === USER_N_ID ? 'N' : 'K');
    } else {
      router.replace('/'); // Redirect to login if not authenticated
    }
  }, [router]);

  // While checking authentication, show a loading state
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
            <div className="space-y-8">
                <Skeleton className="h-[450px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
        </main>
      </div>
    );
  }

  // Once authenticated, render the real layout and content
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader userName={userName} userType="user" />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Balanced diet is important too. More protein, less rice and poli 
      </footer>
    </div>
  );
}