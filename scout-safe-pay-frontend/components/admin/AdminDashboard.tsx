'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  amount?: number;
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'revenue' | 'users' | 'compliance'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      });

      const response = await fetch(`/api/admin/dashboard/comprehensive?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMetricCards = (): DashboardMetric[] => {
    if (!dashboardData?.overall) return [];

    return [
      {
        title: 'Total Transactions',
        value: dashboardData.overall.total_transactions,
        color: 'bg-blue-500',
        icon: '📊',
      },
      {
        title: 'Completed Transactions',
        value: dashboardData.overall.completed_transactions,
        color: 'bg-green-500',
        icon: '✅',
      },
      {
        title: 'Total Volume',
        value: `€${(dashboardData.overall.total_volume / 1000).toFixed(1)}K`,
        color: 'bg-purple-500',
        icon: '💰',
      },
      {
        title: 'Active Vehicles',
        value: dashboardData.overall.active_vehicles,
        color: 'bg-yellow-500',
        icon: '🚗',
      },
      {
        title: 'Active Users',
        value: dashboardData.overall.total_users,
        color: 'bg-indigo-500',
        icon: '👥',
      },
      {
        title: 'KYC Verified',
        value: dashboardData.overall.kyc_verified_users,
        color: 'bg-pink-500',
        icon: '✓',
      },
    ];
  };

  const getTransactionChartData = () => {
    if (!dashboardData?.transactions?.by_day) return [];

    return dashboardData.transactions.by_day.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.count,
      amount: item.total_amount,
    }));
  };

  const getRevenueChartData = () => {
    if (!dashboardData?.revenue?.by_day) return [];

    return dashboardData.revenue.by_day.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fee: item.platform_fee,
      commission: item.dealer_commission,
    }));
  };

  const getVehicleStatusData = () => {
    if (!dashboardData?.vehicles?.by_status) return [];

    return Object.entries(dashboardData.vehicles.by_status).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count as number,
    }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error Loading Dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const metrics = getMetricCards();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          
          {/* Date Range Picker */}
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold text-sm">{metric.title}</h3>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              {metric.change && (
                <div className={`text-sm mt-2 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}% from last period
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {(['overview', 'transactions', 'revenue', 'users', 'compliance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Transactions Tab */}
          {activeTab === 'transactions' && dashboardData?.transactions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Trends</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getTransactionChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Count" />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-gray-600 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.transactions.completion_rate?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Cancellation Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.transactions.cancellation_rate?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.transactions.total}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && dashboardData?.revenue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Analytics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getRevenueChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fee" fill="#3b82f6" name="Platform Fee" />
                  <Bar dataKey="commission" fill="#10b981" name="Dealer Commission" />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-gray-600 text-sm">Platform Fee</p>
                  <p className="text-2xl font-bold text-gray-900">€{(dashboardData.revenue.total_platform_fee / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Gross Volume</p>
                  <p className="text-2xl font-bold text-gray-900">€{(dashboardData.revenue.total_gross_volume / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fee Percentage</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.revenue.average_fee_percentage?.toFixed(2)}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && dashboardData?.users && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.users.new_users_by_day}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Users by Role</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboardData.users.by_role || {}).map(([name, value]) => ({
                          name: name.charAt(0).toUpperCase() + name.slice(1),
                          value: value as number,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Top Sellers</h3>
                  <div className="space-y-3">
                    {dashboardData.users.top_sellers?.slice(0, 5).map((seller: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{seller.name}</p>
                          <p className="text-xs text-gray-600">{seller.transaction_count} transactions</p>
                        </div>
                        <p className="font-bold text-gray-900">€{(seller.total_volume / 1000).toFixed(1)}K</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && dashboardData?.compliance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Verification</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-bold text-gray-900">{dashboardData.compliance.kyc_verification?.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified</span>
                    <span className="font-bold text-green-600">{dashboardData.compliance.kyc_verification?.verified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rejected</span>
                    <span className="font-bold text-red-600">{dashboardData.compliance.kyc_verification?.rejected}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-gray-600 font-semibold">Verification Rate</span>
                    <span className="font-bold text-blue-600">{dashboardData.compliance.kyc_verification?.verification_rate?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Disputes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active</span>
                    <span className="font-bold text-orange-600">{dashboardData.compliance.active_disputes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolved (Period)</span>
                    <span className="font-bold text-green-600">{dashboardData.compliance.resolved_disputes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total (Period)</span>
                    <span className="font-bold text-gray-900">{dashboardData.compliance.disputes_this_period}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && dashboardData?.vehicles && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getVehicleStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
