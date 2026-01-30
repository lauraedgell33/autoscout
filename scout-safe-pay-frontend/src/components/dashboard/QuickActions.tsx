'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, Car, FileText, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

function QuickActionCard({ icon, title, description, href, variant = 'secondary' }: QuickActionProps) {
  return (
    <Link href={href} className="group">
      <Card className={`
        p-6 h-full hover:shadow-xl transition-all cursor-pointer border-2
        ${variant === 'primary' 
          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 hover:from-blue-700 hover:to-indigo-700' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500'
        }
      `}>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`
            w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform
            ${variant === 'primary' 
              ? 'bg-white/20' 
              : 'bg-blue-100 dark:bg-blue-900'
            }
          `}>
            <div className={variant === 'primary' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
              {icon}
            </div>
          </div>
          
          <div>
            <h3 className={`font-bold text-lg mb-1 ${
              variant === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </h3>
            <p className={`text-sm ${
              variant === 'primary' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function QuickActions() {
  const actions: QuickActionProps[] = [
    {
      icon: <Plus className="h-7 w-7" />,
      title: 'Sell Vehicle',
      description: 'List your vehicle for sale',
      href: '/dashboard/vehicles/add',
      variant: 'primary',
    },
    {
      icon: <Car className="h-7 w-7" />,
      title: 'Browse Vehicles',
      description: 'Find your next car',
      href: '/marketplace',
    },
    {
      icon: <Wallet className="h-7 w-7" />,
      title: 'Transactions',
      description: 'View all transactions',
      href: '/transactions',
    },
    {
      icon: <FileText className="h-7 w-7" />,
      title: 'My Listings',
      description: 'Manage your vehicles',
      href: '/dashboard/vehicles',
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: 'Analytics',
      description: 'View your statistics',
      href: '/dashboard/analytics',
    },
    {
      icon: <Settings className="h-7 w-7" />,
      title: 'Settings',
      description: 'Account preferences',
      href: '/dashboard/profile',
    },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get started with common tasks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </Card>
  );
}
