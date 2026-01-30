'use client';

import { useTranslations } from 'next-intl';
import { Wallet, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const t = useTranslations();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-blue-100 text-sm md:text-base">
          Here's what's happening with your vehicles and transactions today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title={t('dashboard.total_balance') || 'Total Balance'}
          value="€12,450"
          icon={Wallet}
          trend={{ value: 12, isPositive: true }}
          subtitle="Available funds"
        />
        <StatsCard
          title={t('dashboard.active_transactions') || 'Active'}
          value="3"
          icon={Clock}
          subtitle="In progress"
        />
        <StatsCard
          title={t('dashboard.completed') || 'Completed'}
          value="27"
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
          subtitle="All time"
        />
        <StatsCard
          title="Total Sales"
          value="€94,250"
          icon={TrendingUp}
          trend={{ value: 23, isPositive: true }}
          subtitle="This month"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
