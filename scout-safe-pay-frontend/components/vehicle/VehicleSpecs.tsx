'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Specification {
  category: string;
  specs: Array<{ label: string; value: string }>;
}

interface VehicleSpecsProps {
  specifications: Specification[];
}

export function VehicleSpecs({ specifications }: VehicleSpecsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {specifications.map((spec, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
              activeTab === index
                ? 'text-as24-blue border-b-2 border-as24-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {spec.category}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specifications[activeTab].specs.map((spec, index) => (
              <div key={index}>
                <p className="text-sm text-gray-600 mb-1">{spec.label}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VehicleSpecs;
