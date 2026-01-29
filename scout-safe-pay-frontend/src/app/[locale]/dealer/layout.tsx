'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['dealer']}>
      {children}
    </ProtectedRoute>
  );
}
