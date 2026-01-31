'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: {
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  primary: {
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-900',
  },
  success: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle, 
  className = '',
  variant = 'primary'
}: StatsCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl bg-white border border-gray-100
      p-6 transition-all duration-300
      hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5
      ${className}
    `}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-50" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${styles.iconBg}`}>
            <Icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          
          {trend && (
            <div className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
              ${trend.isPositive 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
              }
            `}>
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        {/* Content */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
