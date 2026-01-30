'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
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

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Activity['type']) => {
    return <Car className="h-5 w-5" />;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your latest transactions and updates</p>
        </div>
      </div>

      <div className="space-y-4">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {getTypeIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {activity.title}
                </h4>
                {activity.amount && (
                  <span className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    €{activity.amount.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {activity.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="default" className={`${getStatusColor(activity.status)} text-xs font-semibold border`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(activity.status)}
                    {activity.status.replace('-', ' ')}
                  </span>
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </span>
              </div>
            </div>

            {activity.link && (
              <Link href={activity.link}>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {activities.length > 5 && (
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All Activities (${activities.length})`}
          </Button>
        </div>
      )}
    </Card>
  );
}
