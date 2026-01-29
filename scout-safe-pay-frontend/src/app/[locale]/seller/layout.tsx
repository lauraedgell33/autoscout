'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['seller']}>
      {children}
    </ProtectedRoute>
  );
}
