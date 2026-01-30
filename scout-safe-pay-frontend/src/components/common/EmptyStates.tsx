'use client';

import React from 'react';
import { 
  Car, 
  Heart, 
  Search, 
  FileText, 
  Bell, 
  ShoppingBag,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { EmptyState } from '../ui/empty-state';

// No Vehicles Found
export function NoVehiclesFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={Car}
      title="No vehicles found"
      description="We couldn't find any vehicles matching your criteria. Try adjusting your filters or search terms."
      actionLabel={onClearFilters ? "Clear All Filters" : undefined}
      actionOnClick={onClearFilters}
    />
  );
}

// No Search Results
export function NoSearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try different keywords or check your spelling.`
          : "Try a different search term to find what you're looking for."
      }
    />
  );
}

// No Favorites Yet
export function NoFavorites() {
  return (
    <EmptyState
      icon={Heart}
      title="No favorites yet"
      description="Start adding vehicles to your favorites by clicking the heart icon on any vehicle listing."
      actionLabel="Browse Vehicles"
      actionHref="/vehicles"
    />
  );
}

// No Transactions
export function NoTransactions() {
  return (
    <EmptyState
      icon={FileText}
      title="No transactions yet"
      description="Your transaction history is empty. Once you make a purchase, your transactions will appear here."
      actionLabel="Browse Vehicles"
      actionHref="/vehicles"
    />
  );
}

// No Notifications
export function NoNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! We'll notify you when there's something new."
      size="sm"
      variant="minimal"
    />
  );
}

// No Orders
export function NoOrders() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to see your orders here."
      actionLabel="Start Shopping"
      actionHref="/vehicles"
    />
  );
}

// No Reviews
export function NoReviews() {
  return (
    <EmptyState
      icon={FileText}
      title="No reviews yet"
      description="Be the first to leave a review and help others make informed decisions."
      size="sm"
    />
  );
}

// Access Denied
export function AccessDenied() {
  return (
    <EmptyState
      icon={UserX}
      title="Access Denied"
      description="You don't have permission to access this content. Please log in or contact support."
      actionLabel="Go to Login"
      actionHref="/login"
      secondaryActionLabel="Go Home"
      secondaryActionHref="/"
    />
  );
}

// Error State
export function ErrorState({ 
  message = "Something went wrong",
  onRetry,
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Oops! Something went wrong"
      description={message}
      actionLabel={onRetry ? "Try Again" : undefined}
      actionOnClick={onRetry}
      secondaryActionLabel="Go Home"
      secondaryActionHref="/"
    />
  );
}

// Generic Empty State
export function GenericEmpty({
  title = "Nothing to see here",
  description = "There's no content to display at the moment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      size="sm"
      variant="minimal"
    />
  );
}
