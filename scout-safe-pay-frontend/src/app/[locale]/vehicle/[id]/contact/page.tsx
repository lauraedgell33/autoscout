'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { VehicleContactForm } from '@/components/forms/VehicleContactForm';
import { getImageUrl, getApiUrl } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string | number;
  currency: string;
  primary_image?: string;
  status: string;
}

export default function VehicleContactPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const tVehicle = useTranslations('vehicle');
  const tCommon = useTranslations('common');
  const vehicleId = params.id as string;
  const locale = params.locale as string;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
      const response = await fetch(
          `${getApiUrl()}/vehicles/${vehicleId}`
        );

        if (!response.ok) {
          throw new Error('Vehicle not found');
        }

        const data = await response.json();
        // API returns { vehicle: {...} } for single vehicle
        setVehicle(data.vehicle || data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicle');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  const handleSuccess = () => {
    // Redirect back to vehicle page after successful submission
    setTimeout(() => {
      router.push(`/${locale}/vehicle/${vehicleId}`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {tCommon('error')}
            </h2>
            <p className="text-red-600">
              {error || tVehicle('not_found')}
            </p>
            <Link
              href={`/${locale}/marketplace`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-700"
            >
              {tVehicle('back_to_marketplace')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/${locale}/vehicle/${vehicleId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tCommon('back')}
          </Link>
        </div>

        {/* Vehicle Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-6">
            {/* Vehicle Image */}
            <div className="flex-shrink-0">
              {vehicle.primary_image ? (
                <Image
                  src={getImageUrl(vehicle.primary_image)}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  width={150}
                  height={100}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <Car className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="font-medium">{vehicle.year}</span>
                <span className="text-gray-400">•</span>
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: vehicle.currency || 'EUR',
                  }).format(typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price)}
                </span>
              </div>
              {vehicle.status && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {vehicle.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {tVehicle('contact_seller')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('marketplace.send_message_to_seller')}
          </p>

          <VehicleContactForm
            vehicleId={vehicleId}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
