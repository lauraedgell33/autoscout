'use client';

import { useState, useCallback } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { 
  Heart, MapPin, Calendar, Gauge, Fuel, Settings, Eye, Share2,
  ChevronLeft, ChevronRight, Star, ShieldCheck, TrendingUp, Check, Copy, X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VehicleBadge, { StatusBadge, ConditionBadge, PriceBadge } from './VehicleBadges';
import { getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

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
  const [isSaving, setIsSaving] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

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

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      router.push('/auth/login');
      return;
    }
    
    setIsSaving(true);
    try {
      const { apiClient } = await import('@/lib/api-client');
      
      if (isSaved) {
        await apiClient.delete(`/favorites/${id}`);
        setIsSaved(false);
        toast.success('Removed from favorites');
      } else {
        await apiClient.post('/favorites', { vehicle_id: id });
        setIsSaved(true);
        toast.success('Added to favorites');
      }
      onSave?.();
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsSaving(false);
    }
  }, [id, isSaved, isAuthenticated, router, onSave]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/en/vehicle/${id}`;
    const shareData = {
      title: title,
      text: `Check out this ${make} ${model} (${year}) for €${price.toLocaleString()}`,
      url: shareUrl,
    };
    
    // Try native share first (mobile)
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
        onShare?.();
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
      onShare?.();
    } catch (err) {
      toast.error('Failed to copy link');
    }
  }, [id, title, make, model, year, price, onShare]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/vehicle/${id}`);
  }, [id, router]);

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 relative rounded-xl sm:rounded-2xl"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      <Link href={`/vehicle/${id}`}>
        {/* Image Section */}
        <div 
          className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-gray-100"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onTouchStart={() => setIsImageHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsImageHovered(false), 2000)}
        >
          <Image
            src={getImageUrl(images[currentImageIndex])}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Image Navigation - always visible on mobile */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 hover:bg-white shadow-lg z-10 rounded-full transition-opacity ${isImageHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'} sm:group-hover:opacity-100`}
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 hover:bg-white shadow-lg z-10 rounded-full transition-opacity ${isImageHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'} sm:group-hover:opacity-100`}
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Image Indicators - always visible */}
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10">
                {images.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`
                      h-1.5 sm:h-2 rounded-full transition-all
                      ${idx === currentImageIndex 
                        ? 'bg-white w-4 sm:w-6' 
                        : 'bg-white/50 w-1.5 sm:w-2 hover:bg-white/70'
                      }
                    `}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
                {images.length > 5 && (
                  <span className="text-white text-xs ml-1">+{images.length - 5}</span>
                )}
              </div>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-2 z-10 max-w-[60%]">
            {status === 'sold' && <StatusBadge status="sold" />}
            {status === 'reserved' && <StatusBadge status="reserved" />}
            {isFeatured && <VehicleBadge type="featured" size="sm" />}
            {isNew && <VehicleBadge type="new" size="sm" />}
            {isVerified && <VehicleBadge type="verified" size="sm" />}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1.5 sm:gap-2 z-10">
            <Button
              variant="ghost"
              className={`
                w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full
                bg-white/90 hover:bg-white shadow-lg
                ${isSaved ? 'text-red-600' : 'text-gray-700'}
                group/heart active:scale-95 transition-transform
                ${isSaving ? 'opacity-50 cursor-wait' : ''}
              `}
              onClick={handleSave}
              disabled={isSaving}
              aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isSaved}
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isSaved ? 'fill-current scale-110' : 'group-hover/heart:text-red-500 group-hover/heart:scale-110'} ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              className={`w-9 h-9 sm:w-10 sm:h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg active:scale-95 transition-transform ${copied ? 'text-green-600' : 'text-gray-700'}`}
              onClick={handleShare}
              aria-label="Share vehicle"
            >
              {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>

          {/* Quick View Overlay */}
          {showQuickView && status === 'active' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 animate-fade-in">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={handleQuickView}
              >
                <Eye className="mr-2 h-5 w-5" />
                Quick View
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
          {/* Title & Price */}
          <div className="space-y-1 sm:space-y-2">
            <h3 className="font-bold text-base sm:text-xl text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
              {title}
            </h3>
            <PriceBadge
              currentPrice={price}
              originalPrice={originalPrice}
              currency="€"
            />
          </div>

          {/* Key Specs - 2x2 grid on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Gauge className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{(mileage / 1000).toFixed(0)}k km</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Fuel className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="capitalize truncate">{fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="capitalize truncate">{transmission}</span>
            </div>
          </div>

          {/* Location - hidden on very small screens */}
          <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{location || 'Location N/A'}</span>
          </div>

          {/* Footer Info - simplified on mobile */}
          <div className="pt-2.5 sm:pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
              {dealerRating && (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{dealerRating.toFixed(1)}</span>
                </div>
              )}
              {viewCount !== undefined && viewCount > 0 && (
                <div className="hidden sm:flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{viewCount}</span>
                </div>
              )}
            </div>

            {status === 'active' && (
              <span className="text-xs sm:text-sm font-medium text-primary-600">
                View →
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
