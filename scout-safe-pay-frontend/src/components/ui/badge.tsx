import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, Clock, XCircle } from 'lucide-react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'pending' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** For status badges, provide an accessible label */
  statusLabel?: string;
  /** Show icon for status badges */
  showIcon?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Make badge interactive (focusable) */
  interactive?: boolean;
}

const variantConfig = {
  default: {
    classes: 'bg-primary-100 text-primary-800 border-primary-200',
    icon: Info,
  },
  secondary: {
    classes: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: null,
  },
  destructive: {
    classes: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  success: {
    classes: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  warning: {
    classes: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
  },
  info: {
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Info,
  },
  pending: {
    classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  neutral: {
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: null,
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className = '', 
    variant = 'default', 
    statusLabel,
    showIcon = false,
    size = 'md',
    interactive = false,
    children,
    ...props 
  }, ref) => {
    const config = variantConfig[variant];
    const IconComponent = config.icon;
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

    // Determine if this is a status badge
    const isStatusBadge = statusLabel || ['success', 'warning', 'destructive', 'pending', 'info'].includes(variant);

    return (
      <span
        ref={ref}
        role={isStatusBadge ? 'status' : undefined}
        aria-label={statusLabel}
        tabIndex={interactive ? 0 : undefined}
        className={`
          inline-flex items-center justify-center
          rounded-full font-medium
          border
          transition-colors duration-200
          ${sizeConfig[size]}
          ${config.classes}
          ${interactive ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500' : ''}
          ${className}
        `}
        {...props}
      >
        {showIcon && IconComponent && (
          <IconComponent 
            size={iconSize} 
            className="flex-shrink-0" 
            aria-hidden="true" 
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Pre-built status badges
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'processing';
  label?: string;
  className?: string;
}

const statusMappings = {
  active: { variant: 'success' as BadgeVariant, defaultLabel: 'Active' },
  inactive: { variant: 'neutral' as BadgeVariant, defaultLabel: 'Inactive' },
  pending: { variant: 'pending' as BadgeVariant, defaultLabel: 'Pending' },
  completed: { variant: 'success' as BadgeVariant, defaultLabel: 'Completed' },
  failed: { variant: 'destructive' as BadgeVariant, defaultLabel: 'Failed' },
  processing: { variant: 'info' as BadgeVariant, defaultLabel: 'Processing' },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { variant, defaultLabel } = statusMappings[status];
  
  return (
    <Badge 
      variant={variant} 
      showIcon 
      statusLabel={label || defaultLabel}
      className={className}
    >
      {label || defaultLabel}
    </Badge>
  );
}
