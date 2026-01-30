'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentMethod {
  id: number;
  type: 'card';
  card_brand: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
}

export default function BuyerPaymentMethodsPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPaymentMethods(data.data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${id}/default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const deletePaymentMethod = async (id: number) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const getCardBrandLogo = (brand: string) => {
    const logos: Record<string, string> = {
      visa: '💳 Visa',
      mastercard: '💳 Mastercard',
      amex: '💳 Amex',
      discover: '💳 Discover',
    };
    return logos[brand.toLowerCase()] || '💳 Card';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Methods
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your saved payment methods
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Card
          </h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Number
              </label>
              <Input id="card-number" name="cardNumber" type="text" placeholder="1234 5678 9012 3456" maxLength={19} autoComplete="cc-number" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="expiry-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Month
                </label>
                <Input id="expiry-month" name="expiryMonth" type="text" placeholder="MM" maxLength={2} autoComplete="cc-exp-month" />
              </div>
              <div>
                <label htmlFor="expiry-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Year
                </label>
                <Input id="expiry-year" name="expiryYear" type="text" placeholder="YY" maxLength={2} autoComplete="cc-exp-year" />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVV
                </label>
                <Input id="cvv" name="cvv" type="text" placeholder="123" maxLength={4} autoComplete="cc-csc" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Card
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No payment methods added
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add a payment method to make purchases easier
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-2xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getCardBrandLogo(method.card_brand)} •••• {method.last4}
                      </h3>
                      {method.is_default && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!method.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
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
          <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Secure Payment Processing
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All card information is encrypted and securely stored. We never store your full card number or CVV.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
