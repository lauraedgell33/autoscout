'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse',
        className
      )}
      role="status"
      aria-label="Loading card"
    >
      {/* Image placeholder */}
      <div className="bg-gray-200 h-48 w-full shimmer" />
      
      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
        <div className="h-4 bg-gray-200 rounded w-1/2 shimmer" />
        <div className="h-3 bg-gray-200 rounded w-5/6 shimmer" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 rounded w-20 shimmer" />
          <div className="h-8 bg-gray-200 rounded w-24 shimmer" />
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default CardSkeleton;
