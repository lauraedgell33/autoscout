'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddressResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: {
    street?: string;
    houseNumber?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function AddressAutocomplete({
  onSelect,
  placeholder = 'Start typing your address...',
  className = '',
  initialValue = '',
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}` +
          `&format=json` +
          `&addressdetails=1` +
          `&limit=5` +
          `&countrycodes=de,at,ch,fr,it,es,nl,be,gb,us`, // Limit to relevant countries
        {
          headers: {
            'User-Agent': 'AutoScout24SafeTrade/1.0', // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: AddressResult[] = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Address search error:', error);
      toast.error('Failed to search addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(value);
    }, 500); // Wait 500ms after user stops typing
  };

  const handleSelect = (result: AddressResult) => {
    const address = result.address;
    const selectedAddress = {
      street: address.road || '',
      houseNumber: address.house_number || '',
      city: address.city || address.town || address.village || '',
      postalCode: address.postcode || '',
      country: address.country_code?.toUpperCase() || '',
    };

    setQuery(result.display_name);
    setShowResults(false);
    onSelect(selectedAddress);
    toast.success('Address selected!');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelect({
      street: '',
      houseNumber: '',
      city: '',
      postalCode: '',
      country: '',
    });
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        Search Address
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
          </div>
        )}

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className={`
                w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0
                ${index === selectedIndex ? 'bg-primary-50' : ''}
              `}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.address.road && result.address.house_number
                      ? `${result.address.road} ${result.address.house_number}`
                      : result.address.road || 'Address'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {result.address.postcode || ''} {result.address.city || result.address.town || result.address.village || ''}, {result.address.country || ''}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && !loading && query.length >= 3 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No addresses found. Try a different search term.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Start typing to search for your address (minimum 3 characters)
      </p>
    </div>
  );
}
