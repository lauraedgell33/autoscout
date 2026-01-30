'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Phone, Mail, ExternalLink, Check } from 'lucide-react';

interface SellerCardProps {
  sellerId: string;
  sellerName: string;
  sellerImage?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  vehicleCount?: number;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  responseTime?: string;
}

export function SellerCard({
  sellerId,
  sellerName,
  sellerImage,
  rating,
  reviewCount,
  isVerified,
  vehicleCount = 0,
  location,
  contactEmail,
  contactPhone,
  responseTime,
}: SellerCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {sellerImage ? (
          <Image
            src={sellerImage}
            alt={sellerName}
            width={80}
            height={80}
            className="rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 bg-as24-blue rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {sellerName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{sellerName}</h3>
            {isVerified && (
              <div className="flex-shrink-0" title="Verified seller">
                <Check size={20} className="text-green-500" />
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.round(rating)
                      ? 'fill-as24-orange text-as24-orange'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            {location && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
            )}
            {vehicleCount > 0 && (
              <div className="text-gray-600">
                {vehicleCount} vehicles
              </div>
            )}
            {responseTime && (
              <div className="col-span-2 text-gray-600">
                Response time: {responseTime}
              </div>
            )}
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap gap-2 mb-4">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="Call seller"
              >
                <Phone size={14} />
                Call
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="Email seller"
              >
                <Mail size={14} />
                Email
              </a>
            )}
          </div>

          {/* View Profile Link */}
          <Link
            href={`/sellers/${sellerId}`}
            className="inline-flex items-center gap-1 text-sm text-as24-blue hover:text-as24-blue/80 transition font-medium"
          >
            View Profile
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellerCard;
