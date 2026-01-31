'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller' | 'admin' | 'dealer')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated && !token) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, token, router]);

  useEffect(() => {
    // Check role access
    if (isMounted && isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
      const userRole = user.user_type || user.role;
      if (userRole && !allowedRoles.includes(userRole)) {
        // User doesn't have required role, redirect to appropriate dashboard
        router.push('/dashboard');
      }
    }
  }, [isMounted, isAuthenticated, user, allowedRoles, router]);

  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  return <>{children}</>;
}
