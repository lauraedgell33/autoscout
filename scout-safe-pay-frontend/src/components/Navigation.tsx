'use client';

import React from 'react';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AutoScout24
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/vehicles" className="text-gray-600 hover:text-gray-900">
              Vehicles
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
