// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { LOGGED_IN_USER_COOKIE_NAME, ADMIN_ID, USER_N_ID, USER_K_ID } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userCookie = getCookie(LOGGED_IN_USER_COOKIE_NAME);
    
    if (userCookie) {
      if (userCookie === ADMIN_ID) {
        router.replace('/admin');
      } else if (userCookie === USER_N_ID || userCookie === USER_K_ID) {
        router.replace('/dashboard');
      } else {
        // Unrecognized cookie, stay on login page
        setIsChecking(false);
      }
    } else {
      // No cookie, show login form
      setIsChecking(false);
    }
  }, [router]);

  // While checking, show a loading skeleton to prevent the login form from flashing
  if (isChecking) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-sm space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
  }
  
  return <LoginForm />;
}