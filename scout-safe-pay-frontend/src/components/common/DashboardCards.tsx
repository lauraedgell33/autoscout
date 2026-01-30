'use client'

import { ReactNode } from 'react'
import { AnimatedCounter } from './AnimatedCounter'
import { LucideIcon } from 'lucide-react'

interface DashboardStatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  suffix?: string
  prefix?: string
  animated?: boolean
  color?: 'blue' | 'orange' | 'green' | 'purple'
  onClick?: () => void
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  trend,
  suffix = '',
  prefix = '',
  animated = true,
  color = 'blue',
  onClick,
}: DashboardStatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      icon: 'text-blue-600',
      badge: 'bg-blue-100',
    },
    orange: {
      bg: 'from-orange-400 to-orange-500',
      text: 'text-orange-600',
      icon: 'text-orange-600',
      badge: 'bg-orange-100',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      icon: 'text-green-600',
      badge: 'bg-green-100',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      icon: 'text-purple-600',
      badge: 'bg-purple-100',
    },
  }

  const colors = colorClasses[color]

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-6
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
        animate-scale-in
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        {animated && typeof value === 'number' ? (
          <AnimatedCounter
            end={value}
            prefix={prefix}
            suffix={suffix}
            className={`text-3xl font-bold ${colors.text}`}
          />
        ) : (
          <div className={`text-3xl font-bold ${colors.text}`}>
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}

interface ProgressCardProps {
  title: string
  current: number
  total: number
  color?: 'blue' | 'orange' | 'green' | 'purple'
  icon?: LucideIcon
}

export function ProgressCard({
  title,
  current,
  total,
  color = 'blue',
  icon: Icon,
}: ProgressCardProps) {
  const percentage = Math.round((current / total) * 100)

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-400 to-orange-500',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {Icon && (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{current}</span>
          <span className="text-gray-500">/ {total}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{percentage}% complete</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
