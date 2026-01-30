import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      {/* Icon */}
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-orange-50 rounded-full flex items-center justify-center mb-6 animate-scale-in">
        <Icon className="w-12 h-12 text-blue-900" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-slide-up animation-delay-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 max-w-md mx-auto mb-8 animate-slide-up animation-delay-400">
        {description}
      </p>

      {/* Action Button */}
      {(actionLabel && (actionHref || actionOnClick)) && (
        <div className="animate-slide-up animation-delay-600">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {actionLabel}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {actionLabel}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
