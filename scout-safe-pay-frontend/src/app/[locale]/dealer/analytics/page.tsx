'use client';

import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, DollarSign, Package, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function DealerAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    sales_by_month: [],
    revenue_by_month: [],
    top_models: [],
    conversion_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      // Use apiClient instead of direct fetch
      const data = await apiClient.get(`/dealer/analytics?period=${period}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Revenue</h3>
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold">€125,430</p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last period</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Vehicles Sold</h3>
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">47</p>
          <p className="text-sm text-blue-600 mt-2">+8 from last period</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Conversion Rate</h3>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{analytics.conversion_rate}%</p>
          <p className="text-sm text-purple-600 mt-2">+2.3% from last period</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Sales Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
          <BarChart className="h-16 w-16 text-gray-400" />
          <p className="ml-4 text-gray-500">Chart visualization placeholder</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Top Selling Models</h3>
          <div className="space-y-3">
            {['BMW 3 Series', 'Mercedes C-Class', 'Audi A4', 'VW Golf', 'Ford Focus'].map((model, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <span>{model}</span>
                <span className="font-semibold">{15 - i * 2} sales</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {[
              {category: 'Cars', revenue: 98500},
              {category: 'SUVs', revenue: 15200},
              {category: 'Vans', revenue: 11730},
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <span>{item.category}</span>
                <span className="font-semibold">€{item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
