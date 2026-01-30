'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'date';
  values?: Array<{ id: string; label: string }>;
  minValue?: number;
  maxValue?: number;
  step?: number;
  unit?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onApply?: (selectedFilters: Record<string, any>) => void;
  onReset?: () => void;
}

export function AdvancedFilters({
  filters,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filters.map((f) => f.id))
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCheckboxChange = (filterId: string, valueId: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || [];
      return {
        ...prev,
        [filterId]: current.includes(valueId)
          ? current.filter((v: string) => v !== valueId)
          : [...current, valueId],
      };
    });
  };

  const handleRadioChange = (filterId: string, valueId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: valueId,
    }));
  };

  const handleRangeChange = (filterId: string, min: number, max: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: { min, max },
    }));
  };

  const handleApply = () => {
    onApply?.(selectedFilters);
  };

  const handleReset = () => {
    setSelectedFilters({});
    onReset?.();
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (v) => v && (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-as24-orange hover:text-as24-orange/80 transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filters.map((filter) => (
          <div key={filter.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(filter.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-900">{filter.label}</span>
              <motion.div
                animate={{ rotate: expandedSections.has(filter.id) ? 180 : 0 }}
              >
                <ChevronDown size={18} className="text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has(filter.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 p-3 space-y-2"
                >
                  {filter.type === 'checkbox' && filter.values && (
                    <div className="space-y-2">
                      {filter.values.map((value) => (
                        <label
                          key={value.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={(selectedFilters[filter.id] || []).includes(
                              value.id
                            )}
                            onChange={() =>
                              handleCheckboxChange(filter.id, value.id)
                            }
                            className="rounded border-gray-300 text-as24-blue focus:ring-as24-blue"
                          />
                          <span className="text-sm text-gray-700">{value.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'radio' && filter.values && (
                    <div className="space-y-2">
                      {filter.values.map((value) => (
                        <label
                          key={value.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={filter.id}
                            checked={selectedFilters[filter.id] === value.id}
                            onChange={() => handleRadioChange(filter.id, value.id)}
                            className="border-gray-300 text-as24-blue focus:ring-as24-blue"
                          />
                          <span className="text-sm text-gray-700">{value.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'range' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder={`Min ${filter.unit || ''}`}
                          min={filter.minValue}
                          max={filter.maxValue}
                          value={selectedFilters[filter.id]?.min ?? ''}
                          onChange={(e) =>
                            handleRangeChange(
                              filter.id,
                              parseInt(e.target.value) || filter.minValue || 0,
                              (selectedFilters[filter.id]?.max ?? filter.maxValue) || 100
                            )
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-as24-blue"
                        />
                        <input
                          type="number"
                          placeholder={`Max ${filter.unit || ''}`}
                          min={filter.minValue}
                          max={filter.maxValue}
                          value={selectedFilters[filter.id]?.max ?? ''}
                          onChange={(e) =>
                            handleRangeChange(
                              filter.id,
                              (selectedFilters[filter.id]?.min ?? filter.minValue) || 0,
                              parseInt(e.target.value) || filter.maxValue || 100
                            )
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-as24-blue"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-as24-blue text-white rounded-lg hover:bg-as24-blue/90 transition font-medium"
        >
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default AdvancedFilters;
