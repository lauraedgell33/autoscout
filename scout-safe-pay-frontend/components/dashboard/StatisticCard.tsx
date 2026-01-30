'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  onClick?: () => void;
}

export function StatisticCard({
  title,
  value,
  unit,
  change,
  icon,
  trend = 'neutral',
  loading = false,
  onClick,
}: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>

          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {value}
              {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
            </p>
          )}

          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm mt-2 ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp size={16} />}
              {trend === 'down' && <TrendingDown size={16} />}
              <span>
                {Math.abs(change)}% {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'change'} vs last period
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="text-as24-blue opacity-80">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatisticCard;
