'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Car, CheckCircle, AlertCircle, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'purchase' | 'sale' | 'payment' | 'listing';
  title: string;
  description: string;
  amount?: number;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  timestamp: string;
  link?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'purchase',
    title: 'BMW 320d xDrive Touring',
    description: 'Payment in escrow',
    amount: 32500,
    status: 'in-progress',
    timestamp: '2 hours ago',
    link: '/transactions/1',
  },
  {
    id: '2',
    type: 'sale',
    title: 'Audi A4 2.0 TDI',
    description: 'Buyer confirmed receipt',
    amount: 28900,
    status: 'completed',
    timestamp: '1 day ago',
    link: '/transactions/2',
  },
  {
    id: '3',
    type: 'listing',
    title: 'Mercedes C-Class',
    description: 'New listing published',
    status: 'completed',
    timestamp: '3 days ago',
    link: '/dashboard/vehicles',
  },
];

export default function RecentActivity({ activities = mockActivities }: RecentActivityProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  const getStatusStyles = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'in-progress':
        return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'failed':
        return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    }
  };

  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-4 h-4" />;
      case 'sale':
        return <Tag className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'purchase':
        return 'bg-purple-100 text-purple-600';
      case 'sale':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No recent activity</p>
        <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-50">
        {displayedActivities.map((activity) => {
          const statusStyles = getStatusStyles(activity.status);
          
          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group"
            >
              {/* Type Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(activity.type)}`}>
                {getTypeIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-gray-900 truncate text-sm">
                    {activity.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {activity.description}
                </p>
              </div>

              {/* Status & Amount */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {activity.amount && (
                  <span className="font-bold text-gray-900 text-sm">
                    €{activity.amount.toLocaleString()}
                  </span>
                )}
                
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                  <span className="capitalize">{activity.status.replace('-', ' ')}</span>
                </div>
                
                <span className="text-xs text-gray-400 hidden sm:block">
                  {activity.timestamp}
                </span>
              </div>

              {/* Arrow */}
              {activity.link && (
                <Link href={activity.link} className="flex-shrink-0">
                  <div className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {activities.length > 5 && (
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All (${activities.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}
