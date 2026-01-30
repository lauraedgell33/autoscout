'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardSkeletonProps {
  className?: string;
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div
      className={cn('space-y-8 animate-pulse', className)}
      role="status"
      aria-label="Loading dashboard"
    >
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-64 animate-shimmer" />
        <div className="h-4 bg-gray-200 rounded w-96 animate-shimmer" />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer" />
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-24 animate-shimmer" />
              <div className="h-3 bg-gray-200 rounded w-32 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-40 animate-shimmer" />
            <div className="h-8 bg-gray-200 rounded w-28 animate-shimmer" />
          </div>
          <div className="h-64 bg-gray-200 rounded animate-shimmer" />
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-40 animate-shimmer" />
            <div className="h-8 bg-gray-200 rounded w-28 animate-shimmer" />
          </div>
          <div className="h-64 bg-gray-200 rounded animate-shimmer" />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-shimmer" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-shimmer" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading dashboard...</span>
    </div>
  );
}

export default DashboardSkeleton;
