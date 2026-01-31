'use client';

import { useTranslations } from 'next-intl';
import { Wallet, TrendingUp, CheckCircle, Clock, Sparkles } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || 'there';
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 p-6 md:p-8 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full -mb-24" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-medium text-blue-200">Dashboard</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-xl">
            Here's an overview of your vehicles and transactions. Keep track of your SafeTrade activities.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={t('dashboard.total_balance') || 'Total Balance'}
            value="€12,450"
            icon={Wallet}
            trend={{ value: 12, isPositive: true }}
            subtitle="Available funds"
            variant="primary"
          />
          <StatsCard
            title={t('dashboard.active_transactions') || 'Active'}
            value="3"
            icon={Clock}
            subtitle="In progress"
            variant="warning"
          />
          <StatsCard
            title={t('dashboard.completed') || 'Completed'}
            value="27"
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            subtitle="All time"
            variant="success"
          />
          <StatsCard
            title="Total Sales"
            value="€94,250"
            icon={TrendingUp}
            trend={{ value: 23, isPositive: true }}
            subtitle="This month"
            variant="default"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <RecentActivity />
      </div>
    </div>
  );
}
