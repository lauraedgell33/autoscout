'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from '../common/SkeletonCard';

interface VehicleMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  price?: number;
  className?: string;
  height?: string;
  zoom?: number;
}

// Internal map component that will be dynamically imported
function LeafletMapInternal({
  latitude,
  longitude,
  title,
  price,
  className = '',
  height = '400px',
  zoom = 13,
}: VehicleMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of react-leaflet components client-side only
    const loadMap = async () => {
      const leaflet = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      
      // Load Leaflet CSS dynamically
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix for default marker icons
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
      setMapReady(true);
    };

    loadMap();
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

  if (!mapReady || !MapComponents) {
    return <MapSkeleton height={height} />;
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ height, maxHeight: height }}
      role="region" 
      aria-label="Vehicle location map"
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ 
          height: '100%', 
          width: '100%', 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1 
        }}
        scrollWheelZoom={false}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] !rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      
      {/* Attribution watermark */}
      <div 
        className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-md text-xs text-gray-600 shadow-md z-10 border border-gray-200"
        aria-label="Map data from OpenStreetMap"
      >
        OpenStreetMap
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

// Export with dynamic import to ensure no SSR
export default dynamic(() => Promise.resolve(LeafletMapInternal), {
  ssr: false,
  loading: () => <MapSkeleton height="400px" />,
});
