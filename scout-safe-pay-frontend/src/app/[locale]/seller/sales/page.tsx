'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Search, Filter, Eye, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getImageUrl } from '@/lib/utils';

export default function SellerSalesPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSales = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const urlParams = new URLSearchParams();
      if (statusFilter !== 'all') urlParams.append('status', statusFilter);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/sales?${urlParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSales(data.data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = sales.filter(sale =>
    searchQuery === '' ||
    sale.vehicle?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-primary-700',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track all your vehicle sales</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input type="text" placeholder="Search sales..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" />More Filters</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {!filteredSales || filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales found</h3>
            <p className="text-gray-600 dark:text-gray-400">Your sales will appear here once vehicles are purchased</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y">
                {(filteredSales || []).map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm">#{sale.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded mr-3">
                          {sale.vehicle?.primary_image && <img src={getImageUrl(sale.vehicle.primary_image)} alt="" className="h-full w-full object-cover rounded" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{sale.vehicle?.make} {sale.vehicle?.model}</div>
                          <div className="text-sm text-gray-500">{sale.vehicle?.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{sale.buyer_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold">€{parseFloat(sale.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/${locale}/transaction/${sale.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
