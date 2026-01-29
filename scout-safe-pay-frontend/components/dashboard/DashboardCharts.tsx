'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStats } from '@/lib/hooks/api';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

export const DashboardCharts: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div>Loading charts...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Revenue Chart */}
      <motion.div variants={staggerItem} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Revenue (€)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Vehicles Chart */}
      <motion.div variants={staggerItem} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Selling Vehicles</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topVehicles}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#10b981" name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Sales" value={`€${stats.totalSales.toLocaleString()}`} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Customers" value={stats.totalCustomers} />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate.toFixed(2)}%`} />
      </motion.div>
    </motion.div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);
