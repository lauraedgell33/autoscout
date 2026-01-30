'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapSkeleton } from '../common/SkeletonCard';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface VehicleMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  price?: number;
  className?: string;
  height?: string;
  zoom?: number;
}

/**
 * VehicleMap Component
 * 
 * FREE alternative to Mapbox using Leaflet + OpenStreetMap
 * - Zero cost, unlimited usage
 * - No API key required
 * - Fully functional maps with markers and popups
 * - Loading skeleton state
 * - Mobile-friendly zoom controls
 * - Accessible with ARIA labels
 * 
 * @param latitude - Vehicle latitude coordinate
 * @param longitude - Vehicle longitude coordinate
 * @param title - Vehicle title for popup
 * @param price - Vehicle price for popup
 * @param className - Additional CSS classes
 * @param height - Map height (default: 400px)
 * @param zoom - Initial zoom level (default: 13)
 */
function VehicleMapComponent({
  latitude,
  longitude,
  title,
  price,
  className = '',
  height = '400px',
  zoom = 13,
}: VehicleMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Validate coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
        role="status"
        aria-label="Location not available"
      >
        <MapPin className="text-gray-400 mb-2" size={48} aria-hidden="true" />
        <p className="text-gray-500 font-medium">Location not available</p>
      </div>
    );
  }

  // Show loading skeleton
  if (isLoading) {
    return <MapSkeleton height={height} />;
  }

  // Show error state
  if (mapError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
        role="alert"
        aria-label="Map failed to load"
      >
        <MapPin className="text-[var(--color-error)] mb-2" size={48} aria-hidden="true" />
        <p className="text-[var(--color-error)] font-medium">Failed to load map</p>
        <button
          onClick={() => {
            setMapError(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
          }}
          className="mt-2 text-[var(--color-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded px-2 py-1"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} role="region" aria-label="Vehicle location map">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ 
          height, 
          width: '100%', 
          borderRadius: '8px',
          zIndex: 0 
        }}
        scrollWheelZoom={false}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
        <Marker position={[latitude, longitude]}>
          {(title || price) && (
            <Popup>
              <div className="text-center py-2">
                {title && (
                  <div className="font-semibold text-sm mb-1 text-gray-900">{title}</div>
                )}
                {price && (
                  <div className="text-[var(--color-primary)] font-bold text-lg">
                    €{price.toLocaleString()}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
      
      {/* Attribution watermark - FREE usage */}
      <div 
        className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-md text-xs text-gray-600 shadow-md z-10 border border-gray-200"
        aria-label="Map data from OpenStreetMap"
      >
        FREE OpenStreetMap
      </div>

      {/* Mobile-friendly zoom indicator */}
      <div 
        className="absolute top-2 left-2 bg-white px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 shadow-md z-10 border border-gray-200 md:hidden"
        aria-live="polite"
      >
        <MapPin size={12} className="inline mr-1" aria-hidden="true" />
        Pinch to zoom
      </div>
    </div>
  );
}

// Export with dynamic import for better performance (lazy loading)
export default dynamic(() => Promise.resolve(VehicleMapComponent), {
  ssr: false,
  loading: () => <MapSkeleton height="400px" />,
});
