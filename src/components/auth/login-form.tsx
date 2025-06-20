"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { USER_PASSWORDS, LOGGED_IN_USER_COOKIE_NAME, USER_N_ID, USER_K_ID, ADMIN_ID } from '@/lib/constants';

// Simplified client-side login action (mimics server action for setting cookie)
async function loginAction(password: string): Promise<{ success: boolean; userId?: string; message?: string }> {
    let userIdFound: string | undefined = undefined;
    for (const userId in USER_PASSWORDS) {
        if (USER_PASSWORDS[userId] === password) {
            userIdFound = userId;
            break;
        }
    }

    if (userIdFound) {
        // In a real app, this would be an API call that sets an HTTPOnly cookie.
        // For this scaffold, we set it client-side.
        document.cookie = `${LOGGED_IN_USER_COOKIE_NAME}=${userIdFound}; path=/; max-age=${60 * 60 * 24 * 7}`;
        return { success: true, userId: userIdFound };
    } else {
        return { success: false, message: 'Invalid password.' };
    }
}


export function LoginForm() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const result = await loginAction(password);

    if (result.success && result.userId) {
      toast({ title: 'Login Successful', description: 'Redirecting...' });
      if (result.userId === ADMIN_ID) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      toast({
        title: 'Login Failed',
        description: result.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          {/* <CardTitle className="text-3xl font-headline">Exercise Equilibrium</CardTitle> */}
          {/* <CardDescription>Enter your password to continue</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {/* <Label htmlFor="password">Password</Label> */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LogIn className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
