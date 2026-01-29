import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);
