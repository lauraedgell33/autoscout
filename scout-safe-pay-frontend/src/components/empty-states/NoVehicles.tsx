import { Car } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function NoVehicles() {
  return (
    <EmptyState
      icon={Car}
      title="No vehicles found"
      description="Try adjusting your filters or search terms to find what you're looking for."
      actionLabel="Clear Filters"
      actionOnClick={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/vehicles';
        }
      }}
    />
  );
}
