'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ verified, className = '' }) => {
  if (!verified) return null;

  return (
    <div className={`inline-flex items-center ${className}`} title="Review from confirmed buyer">
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        <span>Verified Purchase</span>
      </Badge>
    </div>
  );
};
