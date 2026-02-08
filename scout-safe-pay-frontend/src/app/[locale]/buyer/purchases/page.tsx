'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Package, Eye, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getImageUrl, getApiUrl } from '@/lib/utils';

interface Purchase {
  id: string;
  transaction_id: string;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    primary_image: string;
  };
  amount: string;
  status: string;
  purchase_date: string;
  delivery_status: string;
  contract_url?: string;
  invoice_url?: string;
}

export default function BuyerPurchasesPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const t = useTranslations();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${getApiUrl()}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      
      // Transform transactions to purchases format
      const transactions = data.data || data || [];
      const transformedPurchases = Array.isArray(transactions) ? transactions.map((tx: any) => ({
        id: tx.id,
        transaction_id: tx.id,
        vehicle: tx.vehicle || {
          id: tx.vehicle_id,
          make: tx.metadata?.vehicle_title?.split(' ')[0] || 'Unknown',
          model: tx.metadata?.vehicle_title?.split(' ').slice(1).join(' ') || '',
          year: '',
          vin: '',
          primary_image: null,
        },
        amount: tx.amount,
        status: tx.status,
        purchase_date: tx.created_at,
        delivery_status: tx.status,
        contract_url: tx.contract_url,
        invoice_url: tx.invoice_url,
      })) : [];
      
      setPurchases(transformedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processing: 'bg-blue-100 text-primary-700 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your purchase history and documents
          </p>
        </div>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No purchases yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your completed purchases will appear here
            </p>
            <Link href={`/${locale}/marketplace`}>
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="h-24 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                    {purchase.vehicle.primary_image ? (
                      <img
                        src={getImageUrl(purchase.vehicle.primary_image)}
                        alt={`${purchase.vehicle.make} ${purchase.vehicle.model}`}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {purchase.vehicle.make} {purchase.vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Year: {purchase.vehicle.year} • VIN: {purchase.vehicle.vin}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-lg font-bold text-primary-600">
                        €{parseFloat(purchase.amount).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(purchase.status)}`}>
                        {purchase.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Purchased on {new Date(purchase.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 md:items-end">
                  <Link href={`/${locale}/transaction/${purchase.transaction_id}`}>
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  {purchase.contract_url && (
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      <FileText className="h-4 w-4 mr-2" />
                      Contract
                    </Button>
                  )}
                  
                  {purchase.invoice_url && (
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
