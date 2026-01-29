import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const Avatar = ({ className = '', ...props }: AvatarProps) => (
  <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${className}`} {...props} />
);

export const AvatarImage = ({ src, alt, className = '' }: { src?: string; alt?: string; className?: string }) => (
  <img src={src} alt={alt} className={`w-full h-full rounded-full object-cover ${className}`} />
);

export const AvatarFallback = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium ${className}`}>
    {children}
  </div>
);
