"use client";

import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions"; // Assuming logout is a server action
import { ADMIN_ID, USER_K_ID, USER_N_ID } from "@/lib/constants";

interface AppHeaderProps {
  userName: string;
  userType: 'user' | 'admin';
}

export function AppHeader({ userName, userType }: AppHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Redirect to login page
    router.refresh(); // Ensure page reloads to clear state
  };
  
  const UserIcon = userType === 'admin' ? ShieldCheck : UserCircle;

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-headline text-primary">Exercise Equilibrium</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserIcon className="text-primary" />
            <span className="font-body">{userName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
