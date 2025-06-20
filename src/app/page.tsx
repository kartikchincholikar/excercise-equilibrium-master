import { LoginForm } from '@/components/auth/login-form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LOGGED_IN_USER_COOKIE_NAME, ADMIN_ID, USER_N_ID, USER_K_ID } from '@/lib/constants';

export default function LoginPage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(LOGGED_IN_USER_COOKIE_NAME);

  if (userCookie?.value) {
    if (userCookie.value === ADMIN_ID) {
      redirect('/admin');
    } else if (userCookie.value === USER_N_ID || userCookie.value === USER_K_ID) {
      redirect('/dashboard');
    }
    // If cookie exists but value is unrecognized, it will be handled by middleware or cleared on next login attempt.
  }
  
  return <LoginForm />;
}
