/**
 * Enhanced Skeleton Components with Shimmer Animation
 * Provides loading states for various UI elements
 */

export function VehicleCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Image Skeleton with Shimmer */}
      <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-2/3"></div>
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-16"></div>
        </div>

        {/* Price */}
        <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
        </div>

        {/* Dealer Info */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-24"></div>
        <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
      </div>
      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-20 mb-2"></div>
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-32"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-12"></div>
      </td>
    </tr>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-20"></div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-48"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-32"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-24"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Generic Skeleton component for custom layouts
 */
export function Skeleton({ 
  className = '',
  width,
  height,
  circle = false
}: { 
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] ${circle ? 'rounded-full' : 'rounded'} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
}

/**
 * Map Skeleton for VehicleMap loading state
 */
export function MapSkeleton({ height = '400px' }: { height?: string }) {
  return (
    <div 
      className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg flex items-center justify-center"
      style={{ height }}
      role="status"
      aria-label="Loading map..."
    >
      <div className="text-gray-400 flex flex-col items-center gap-2">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span className="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  );
}
