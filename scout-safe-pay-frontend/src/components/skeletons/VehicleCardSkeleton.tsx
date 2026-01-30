'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VehicleCardSkeletonProps {
  className?: string;
}

export function VehicleCardSkeleton({ className }: VehicleCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse',
        className
      )}
      role="status"
      aria-label="Loading vehicle"
    >
      {/* Vehicle Image Placeholder */}
      <div className="relative bg-gray-200 h-56 w-full animate-shimmer">
        {/* Badge placeholders */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="h-6 w-16 bg-gray-300 rounded-full animate-shimmer" />
          <div className="h-6 w-20 bg-gray-300 rounded-full animate-shimmer" />
        </div>
        {/* Favorite button placeholder */}
        <div className="absolute top-3 right-3 h-10 w-10 bg-gray-300 rounded-full animate-shimmer" />
      </div>

      {/* Vehicle Details Placeholder */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-4/5 animate-shimmer" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-shimmer" />
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-gray-200 rounded w-12 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-gray-200 rounded w-12 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-shimmer" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-gray-200 rounded w-12 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-12 animate-shimmer" />
            <div className="h-7 bg-gray-200 rounded w-28 animate-shimmer" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-shimmer" />
        </div>
      </div>

      <span className="sr-only">Loading vehicle information...</span>
    </div>
  );
}

export default VehicleCardSkeleton;
