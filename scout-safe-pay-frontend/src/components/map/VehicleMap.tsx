'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
 * 
 * @param latitude - Vehicle latitude coordinate
 * @param longitude - Vehicle longitude coordinate
 * @param title - Vehicle title for popup
 * @param price - Vehicle price for popup
 * @param className - Additional CSS classes
 * @param height - Map height (default: 400px)
 * @param zoom - Initial zoom level (default: 13)
 */
export default function VehicleMap({
  latitude,
  longitude,
  title,
  price,
  className = '',
  height = '400px',
  zoom = 13,
}: VehicleMapProps) {
  // Validate coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">Location not available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {(title || price) && (
            <Popup>
              <div className="text-center">
                {title && (
                  <div className="font-semibold text-sm mb-1">{title}</div>
                )}
                {price && (
                  <div className="text-blue-600 font-bold">
                    €{price.toLocaleString()}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
      
      {/* Attribution watermark - FREE usage */}
      <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow-sm z-10">
        FREE OpenStreetMap
      </div>
    </div>
  );
}
