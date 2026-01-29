'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'buyer' | 'seller' | 'dealer' | 'admin'>;
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const locale = pathname.split('/')[1];
      router.push(`/${locale}/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check if user has required role
    if (requiredRoles && user && !requiredRoles.includes(user.user_type)) {
      // Redirect to appropriate dashboard
      const locale = pathname.split('/')[1];
      router.push(`/${locale}/${user.user_type}/dashboard`);
    }
  }, [isAuthenticated, user, requiredRoles, router, pathname]);

  // Show loading or nothing while checking
  if (!isAuthenticated || (requiredRoles && user && !requiredRoles.includes(user.user_type))) {
    return null;
  }

  return <>{children}</>;
}
