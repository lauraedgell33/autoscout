import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function NoFavorites() {
  return (
    <EmptyState
      icon={Heart}
      title="No favorites yet"
      description="Start exploring vehicles and save your favorites for easy access later."
      actionLabel="Browse Vehicles"
      actionOnClick={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/vehicles';
        }
      }}
    />
  );
}
