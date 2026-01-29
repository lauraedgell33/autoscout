'use client';

import React from 'react';

export default function CookieBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing to browse, you agree to our cookie policy.
        </p>
        <button
          onClick={() => document.querySelector('[data-cookie-banner]')?.remove()}
          className="px-4 py-2 bg-white text-gray-900 rounded font-medium whitespace-nowrap hover:bg-gray-100"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
