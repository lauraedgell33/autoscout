'use client';

import { Plus, Car, Receipt, FileText, TrendingUp, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

function QuickActionCard({ icon: Icon, title, description, href, variant = 'secondary' }: QuickActionProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <Link 
      href={href} 
      className={`
        group relative overflow-hidden rounded-2xl p-6
        transition-all duration-300 hover:-translate-y-1
        ${isPrimary 
          ? 'bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white shadow-lg shadow-primary-900/30 hover:shadow-xl hover:shadow-primary-900/40' 
          : 'bg-white border border-gray-100 hover:border-primary-200 hover:shadow-lg'
        }
      `}
    >
      {/* Background Pattern */}
      {isPrimary && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16" />
        </div>
      )}
      
      <div className="relative flex flex-col h-full">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center mb-4
          transition-transform duration-300 group-hover:scale-110
          ${isPrimary 
            ? 'bg-white/20' 
            : 'bg-primary-50'
          }
        `}>
          <Icon className={`w-6 h-6 ${isPrimary ? 'text-white' : 'text-primary-900'}`} />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isPrimary ? 'text-blue-100' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
        
        {/* Arrow indicator */}
        <div className={`
          mt-4 flex items-center gap-1 text-sm font-medium
          transition-transform duration-300 group-hover:translate-x-1
          ${isPrimary ? 'text-blue-100' : 'text-primary-600'}
        `}>
          <span>Get started</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  const actions: QuickActionProps[] = [
    {
      icon: Plus,
      title: 'Sell Vehicle',
      description: 'List your vehicle for sale',
      href: '/dashboard/vehicles/add',
      variant: 'primary',
    },
    {
      icon: Car,
      title: 'Browse Vehicles',
      description: 'Find your next car',
      href: '/marketplace',
    },
    {
      icon: Receipt,
      title: 'Transactions',
      description: 'View all transactions',
      href: '/transactions',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Get Started</h2>
        <p className="text-sm text-gray-500 mt-1">Common tasks to help you get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
