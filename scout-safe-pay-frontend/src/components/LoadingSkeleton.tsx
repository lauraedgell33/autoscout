'use client'

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
        
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonText({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  )
}

export default function LoadingSkeleton({ className = '', count = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  )
}
