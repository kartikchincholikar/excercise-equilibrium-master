import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOGGED_IN_USER_COOKIE_NAME, ADMIN_ID, USER_N_ID, USER_K_ID } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get(LOGGED_IN_USER_COOKIE_NAME);
  const currentUserId = currentUserCookie?.value;
  const { pathname } = request.nextUrl;

  // If trying to access a protected route without being logged in, redirect to login
  if (!currentUserId && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If logged in
  if (currentUserId) {
    // If on login page, redirect to appropriate dashboard
    if (pathname === '/') {
      if (currentUserId === ADMIN_ID) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      if (currentUserId === USER_N_ID || currentUserId === USER_K_ID) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && currentUserId !== ADMIN_ID) {
      // Non-admin trying to access admin pages
      return NextResponse.redirect(new URL('/dashboard', request.url)); // Or an error page
    }
    if (pathname.startsWith('/dashboard') && currentUserId === ADMIN_ID) {
      // Admin trying to access user dashboard
      return NextResponse.redirect(new URL('/admin', request.url)); // Or an error page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*'],
};
