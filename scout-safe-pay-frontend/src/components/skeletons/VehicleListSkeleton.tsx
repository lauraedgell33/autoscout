'use client';

import React from 'react';
import { VehicleCardSkeleton } from './VehicleCardSkeleton';

interface VehicleListSkeletonProps {
  count?: number;
  className?: string;
}

export function VehicleListSkeleton({ count = 6, className }: VehicleListSkeletonProps) {
  return (
    <div
      className={className}
      role="status"
      aria-label="Loading vehicles"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
      <span className="sr-only">Loading vehicle list...</span>
    </div>
  );
}

export default VehicleListSkeleton;
