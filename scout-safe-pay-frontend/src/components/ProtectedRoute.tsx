'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller' | 'admin' | 'dealer')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [router]);

  if (!isMounted || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
