'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface RelatedVehicle {
  id: string;
  name: string;
  price: number;
  image: string;
  year: number;
  make: string;
  mileage?: number;
  location?: string;
}

interface RelatedVehiclesProps {
  vehicles: RelatedVehicle[];
  loading?: boolean;
  title?: string;
}

export function RelatedVehicles({
  vehicles,
  loading = false,
  title = 'Similar Vehicles',
}: RelatedVehiclesProps) {
  const [displayedVehicles, setDisplayedVehicles] = useState<RelatedVehicle[]>([]);

  useEffect(() => {
    setDisplayedVehicles(vehicles.slice(0, 4));
  }, [vehicles]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!displayedVehicles || displayedVehicles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Link
          href="/vehicles/search"
          className="text-as24-blue hover:text-as24-blue/80 transition flex items-center gap-1 text-sm font-medium"
        >
          View More <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/vehicles/${vehicle.id}`}>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                    {vehicle.year} {vehicle.make}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {vehicle.name}
                  </p>

                  {vehicle.mileage && (
                    <p className="text-xs text-gray-500 mb-1">
                      {vehicle.mileage.toLocaleString()} km
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-as24-orange">
                      €{vehicle.price.toLocaleString()}
                    </span>
                    {vehicle.location && (
                      <span className="text-xs text-gray-500">{vehicle.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RelatedVehicles;
