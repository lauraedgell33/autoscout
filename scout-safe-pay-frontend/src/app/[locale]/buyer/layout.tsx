'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['buyer']}>
      {children}
    </ProtectedRoute>
  );
}
