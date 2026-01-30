'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CreditCard, Building2, ArrowRight, Lock } from 'lucide-react';
import { transactionService } from '@/lib/api/transactions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentInitiatePage() {
  const router = useRouter();
  const params = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get vehicle data from URL params or localStorage
    const vehicleId = new URLSearchParams(window.location.search).get('vehicle_id');
    if (vehicleId) {
      fetchVehicle(vehicleId);
    }
  }, []);

  const fetchVehicle = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    }
  };

  const initiatePayment = async () => {
    if (!vehicle) return;
    setLoading(true);

    try {
      const response = await transactionService.create({
        vehicle_id: vehicle.id.toString(),
        amount: vehicle.price,
        payment_method: 'bank_transfer',
      });

      // Navigate to success page with transaction details
      router.push(`/${params.locale}/payment/success?transaction_id=${response.transaction.id}`);
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Choose your payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <label htmlFor="payment-bank-transfer" className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}>
                <input id="payment-bank-transfer" type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-4" />
                <Building2 className="h-6 w-6 mr-3 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Secure bank-to-bank transfer</div>
                </div>
              </label>
              
              <label htmlFor="payment-card" className="flex items-center p-4 border-2 border-gray-300 rounded-lg opacity-50 cursor-not-allowed">
                <input id="payment-card" type="radio" name="payment" value="card" disabled className="mr-4" />
                <CreditCard className="h-6 w-6 mr-3 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Coming soon</div>
                </div>
              </label>
            </div>
          </Card>

          {/* Security Info */}
          <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Your Payment is Protected</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funds are held securely until vehicle inspection is complete. Full refund if vehicle doesn't match description.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
              {vehicle.primary_image && (
                <img src={vehicle.primary_image} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover rounded-lg" />
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <h4 className="font-semibold">{vehicle.make} {vehicle.model}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Year: {vehicle.year}</p>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Vehicle Price</span>
                  <span className="font-semibold">€{parseFloat(vehicle.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                  <span className="font-semibold">€0</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-blue-600">€{parseFloat(vehicle.price).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button onClick={initiatePayment} disabled={loading} className="w-full" size="lg">
              {loading ? 'Processing...' : 'Proceed to Payment'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our Terms of Service
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
