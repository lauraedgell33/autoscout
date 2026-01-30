'use client';

import { CheckCircle, Shield, Award, Star, TrendingUp, Zap, Clock, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface VehicleBadgeProps {
  type: 'verified' | 'featured' | 'new' | 'hot' | 'deal' | 'fast-delivery' | 'warranty' | 'premium';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig = {
  verified: {
    icon: CheckCircle,
    label: 'Verified',
    colors: 'bg-green-100 text-green-800 border-green-300',
    iconColor: 'text-green-600',
  },
  featured: {
    icon: Star,
    label: 'Featured',
    colors: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    iconColor: 'text-yellow-600',
  },
  new: {
    icon: Zap,
    label: 'New Arrival',
    colors: 'bg-blue-100 text-blue-800 border-blue-300',
    iconColor: 'text-blue-600',
  },
  hot: {
    icon: TrendingUp,
    label: 'Hot Deal',
    colors: 'bg-red-100 text-red-800 border-red-300',
    iconColor: 'text-red-600',
  },
  deal: {
    icon: Award,
    label: 'Great Deal',
    colors: 'bg-purple-100 text-purple-800 border-purple-300',
    iconColor: 'text-purple-600',
  },
  'fast-delivery': {
    icon: Truck,
    label: 'Fast Delivery',
    colors: 'bg-orange-100 text-orange-800 border-orange-300',
    iconColor: 'text-orange-600',
  },
  warranty: {
    icon: Shield,
    label: 'Warranty',
    colors: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconColor: 'text-indigo-600',
  },
  premium: {
    icon: Award,
    label: 'Premium',
    colors: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-amber-300',
    iconColor: 'text-amber-700',
  },
};

export default function VehicleBadge({ type, className = '', size = 'md' }: VehicleBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Badge
      variant="default"
      className={`
        ${config.colors} 
        ${sizeClasses[size]}
        ${className}
        font-semibold border-2 
        inline-flex items-center gap-1.5
        shadow-sm hover:shadow-md transition-all
        animate-scale-in
      `}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
}

// Status Badge Component
export interface StatusBadgeProps {
  status: 'active' | 'sold' | 'reserved' | 'pending' | 'draft';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Available',
      colors: 'bg-green-100 text-green-800 border-green-300',
    },
    sold: {
      label: 'Sold',
      colors: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    reserved: {
      label: 'Reserved',
      colors: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    pending: {
      label: 'Pending',
      colors: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    draft: {
      label: 'Draft',
      colors: 'bg-gray-100 text-gray-600 border-gray-300',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="default"
      className={`${config.colors} ${className} font-semibold border-2`}
    >
      {config.label}
    </Badge>
  );
}

// Condition Badge
export interface ConditionBadgeProps {
  condition: 'new' | 'excellent' | 'good' | 'fair';
  className?: string;
}

export function ConditionBadge({ condition, className = '' }: ConditionBadgeProps) {
  const conditionConfig = {
    new: {
      label: 'Brand New',
      colors: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: '✨',
    },
    excellent: {
      label: 'Excellent',
      colors: 'bg-green-100 text-green-800 border-green-300',
      icon: '⭐',
    },
    good: {
      label: 'Good',
      colors: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '👍',
    },
    fair: {
      label: 'Fair',
      colors: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: '✓',
    },
  };

  const config = conditionConfig[condition];

  return (
    <Badge
      variant="default"
      className={`${config.colors} ${className} font-semibold border-2 inline-flex items-center gap-1`}
    >
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
}

// Price Badge with Savings
export interface PriceBadgeProps {
  originalPrice?: number;
  currentPrice: number;
  currency?: string;
  className?: string;
}

export function PriceBadge({ originalPrice, currentPrice, currency = '€', className = '' }: PriceBadgeProps) {
  const hasSavings = originalPrice && originalPrice > currentPrice;
  const savings = hasSavings ? originalPrice! - currentPrice : 0;
  const savingsPercent = hasSavings ? Math.round((savings / originalPrice!) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {currency}{currentPrice.toLocaleString()}
      </div>
      {hasSavings && (
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-500 line-through">
            {currency}{originalPrice!.toLocaleString()}
          </span>
          <Badge variant="default" className="bg-red-100 text-red-800 border-red-300 font-bold">
            Save {savingsPercent}%
          </Badge>
        </div>
      )}
    </div>
  );
}
