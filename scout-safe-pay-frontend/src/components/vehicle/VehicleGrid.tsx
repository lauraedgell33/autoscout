'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useVehicles } from '@/lib/hooks/api';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { staggerContainer, staggerItem, hoverScale } from '@/lib/animations/variants';
import { Heart, MessageCircle } from 'lucide-react';

export const VehicleGrid: React.FC = () => {
  const filters = useFilterStore((state) => state.filters);
  const { data: vehicles, isLoading } = useVehicles({
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    brand: filters.brands[0],
  });

  const addItem = useCartStore((state) => state.addItem);
  const addToast = useUIStore((state) => state.addToast);

  const handleAddToCart = (vehicle: any) => {
    const vehicleName = `${vehicle.make} ${vehicle.model}`;
    addItem({
      id: vehicle.id,
      vehicleName: vehicleName,
      price: vehicle.price,
      quantity: 1,
      image: vehicle.primary_image || vehicle.images?.[0],
      addedAt: Date.now(),
    });
    addToast(`${vehicleName} added to cart!`);
  };

  if (isLoading) return <div className="text-center py-8">Loading vehicles...</div>;
  if (!vehicles?.length) return <div className="text-center py-8">No vehicles found</div>;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {(vehicles || []).map((vehicle) => (
        <motion.div
          key={vehicle.id}
          variants={staggerItem}
          {...hoverScale}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            {(vehicle.primary_image || vehicle.images?.[0]) && (
              <img
                src={vehicle.primary_image || vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            )}
            <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
              <Heart size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>

            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-blue-600">€{vehicle.price.toLocaleString()}</span>
              <span className="text-sm text-yellow-500">★★★★★</span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {vehicle.year} • {vehicle.mileage?.toLocaleString()} km
            </p>

            <p className="text-sm text-gray-600">
              {vehicle.transmission} • {vehicle.fuel_type}
            </p>

            <div className="flex items-center gap-1 mt-2">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                ✓ Verified
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(vehicle)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Message
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
