'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, MapPin, Calendar, Gauge, Fuel, Settings, Eye, Share2,
  ChevronLeft, ChevronRight, Star, ShieldCheck, TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VehicleBadge, { StatusBadge, ConditionBadge, PriceBadge } from './VehicleBadges';

interface EnhancedVehicleCardProps {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  images: string[];
  condition?: 'new' | 'excellent' | 'good' | 'fair';
  status?: 'active' | 'sold' | 'reserved';
  isFeatured?: boolean;
  isVerified?: boolean;
  isNew?: boolean;
  dealerRating?: number;
  viewCount?: number;
  savedCount?: number;
  onSave?: () => void;
  onShare?: () => void;
}

export default function EnhancedVehicleCard({
  id,
  title,
  make,
  model,
  year,
  price,
  originalPrice,
  mileage,
  fuelType,
  transmission,
  location,
  images,
  condition = 'good',
  status = 'active',
  isFeatured = false,
  isVerified = false,
  isNew = false,
  dealerRating,
  viewCount,
  savedCount,
  onSave,
  onShare,
}: EnhancedVehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.();
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 relative"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      <Link href={`/vehicles/${id}`}>
        {/* Image Section */}
        <div 
          className="relative aspect-[4/3] overflow-hidden bg-gray-100"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image
            src={images[currentImageIndex] || '/placeholder-car.jpg'}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Image Navigation */}
          {images.length > 1 && isImageHovered && (
            <>
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg z-10 rounded-full"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg z-10 rounded-full"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${idx === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50'
                      }
                    `}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {status === 'sold' && <StatusBadge status="sold" />}
            {status === 'reserved' && <StatusBadge status="reserved" />}
            {isFeatured && <VehicleBadge type="featured" size="sm" />}
            {isNew && <VehicleBadge type="new" size="sm" />}
            {isVerified && <VehicleBadge type="verified" size="sm" />}
            {condition && <ConditionBadge condition={condition} />}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <Button
              variant="ghost"
              className={`
                w-10 h-10 p-0 rounded-full
                bg-white/90 hover:bg-white shadow-lg
                ${isSaved ? 'text-red-600' : 'text-gray-700'}
                group/heart
              `}
              onClick={handleSave}
              aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isSaved}
            >
              <Heart className={`h-5 w-5 transition-all duration-300 ${isSaved ? 'fill-current scale-110' : 'group-hover/heart:text-red-500 group-hover/heart:scale-110'}`} />
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg text-gray-700"
              onClick={handleShare}
              aria-label="Share vehicle"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick View Overlay */}
          {showQuickView && status === 'active' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 animate-fade-in">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  // Open quick view modal
                }}
              >
                <Eye className="mr-2 h-5 w-5" />
                Quick View
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title & Price */}
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
              {title}
            </h3>
            <PriceBadge
              currentPrice={price}
              originalPrice={originalPrice}
              currency="€"
            />
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Gauge className="h-4 w-4 flex-shrink-0" />
              <span>{mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Fuel className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">{fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">{transmission}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {dealerRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{dealerRating.toFixed(1)}</span>
                </div>
              )}
              {viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{viewCount}</span>
                </div>
              )}
              {savedCount && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{savedCount}</span>
                </div>
              )}
            </div>

            {status === 'active' && (
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View Details →
              </Button>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
