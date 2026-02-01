import { Card } from '@/components/ui/card'

/**
 * Dashboard Card Skeleton
 * Used for loading states in dashboard pages
 */
export function DashboardCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </Card>
  )
}

/**
 * Transaction Row Skeleton
 * Used for loading transaction lists
 */
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  )
}

/**
 * Vehicle Card Skeleton
 * Used for loading vehicle cards in marketplace
 */
export function VehicleCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Content */}
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
        
        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Vehicle Detail Skeleton
 * Used for loading vehicle detail page
 */
export function VehicleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Hero image */}
      <div className="h-96 bg-gray-200 dark:bg-gray-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            
            {/* Specs */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Description */}
            <Card className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-2/3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Stats Grid Skeleton
 * Used for loading dashboard statistics
 */
export function DashboardStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Transaction List Skeleton
 * Used for loading transaction lists
 */
export function TransactionListSkeleton() {
  return (
    <Card className="p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
      <div className="space-y-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    </Card>
  )
}

/**
 * Marketplace Grid Skeleton
 * Used for loading marketplace vehicle grid
 */
export function MarketplaceGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
