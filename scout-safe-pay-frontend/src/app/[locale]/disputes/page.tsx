'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { AlertCircle, Plus, MessageCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Dispute {
  id: number;
  transaction_id: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  created_at: string;
  vehicle: {
    make: string;
    model: string;
  };
}

export default function DisputesPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setDisputes(data.data || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disputes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage transaction disputes and issues</p>
        </div>
      </div>

      {disputes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No disputes</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any active disputes. We hope it stays that way!
            </p>
            <Link href={`/${locale}/buyer/transactions`}>
              <Button>View Transactions</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Dispute #{dispute.id}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                      {dispute.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Vehicle: {dispute.vehicle.make} {dispute.vehicle.model}
                  </p>
                  
                  <div className="flex items-start space-x-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Reason:</span> {dispute.reason}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(dispute.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Link href={`/${locale}/disputes/${dispute.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Dispute Resolution Process</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our team reviews all disputes within 24-48 hours. We'll work with both parties to find a fair resolution.
              All communication should happen through our platform for your protection.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
