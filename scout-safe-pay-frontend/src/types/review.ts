export interface Review {
  id: number;
  transaction_id: number;
  reviewer_id: number;
  reviewee_id: number;
  vehicle_id: number | null;
  rating: number;
  comment: string | null;
  review_type: 'buyer' | 'seller' | 'vehicle';
  status: string;
  verified: boolean;
  verified_at: string | null;
  verification_method: 'transaction' | 'manual' | 'automated' | 'none';
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_notes: string | null;
  moderated_by: number | null;
  moderated_at: string | null;
  flagged: boolean;
  flag_count: number;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
  reviewer?: ReviewUser;
  reviewee?: ReviewUser;
  vehicle?: ReviewVehicle;
  transaction?: ReviewTransaction;
  moderator?: ReviewUser;
  flags?: ReviewFlag[];
}

export interface ReviewUser {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export interface ReviewVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

export interface ReviewTransaction {
  id: number;
  transaction_code: string;
  amount?: number;
  status?: string;
}

export interface ReviewFlag {
  id: number;
  review_id: number;
  user_id: number;
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'misleading' | 'other';
  details: string | null;
  created_at: string;
  user?: ReviewUser;
}

export interface ReviewHelpfulVote {
  id: number;
  review_id: number;
  user_id: number;
  is_helpful: boolean;
  created_at: string;
}

export interface ReviewFilters {
  verified_only?: boolean;
  reviewable_type?: 'vehicle' | 'user';
  reviewable_id?: number;
  sort?: 'created_at' | 'helpful' | 'rating';
  page?: number;
  per_page?: number;
}

export interface ReviewFormData {
  transaction_id: number;
  reviewee_id: number;
  rating: number;
  comment: string;
  review_type: 'buyer' | 'seller' | 'vehicle';
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  verified_count?: number;
  rating_breakdown: {
    [key: string]: number;
  };
}

export interface ReviewModerationStats {
  total_reviews: number;
  verified_reviews: number;
  pending_reviews: number;
  flagged_reviews: number;
  rejected_reviews: number;
  approved_reviews: number;
  verification_rate: number;
  auto_verification_rate: number;
  total_flags: number;
  unique_flagged_reviews: number;
  reviews_by_verification_method: {
    [key: string]: number;
  };
  reviews_by_moderation_status: {
    [key: string]: number;
  };
  recent_activity: {
    reviews_last_24h: number;
    verified_last_24h: number;
    flagged_last_24h: number;
  };
  top_flag_reasons: {
    [key: string]: number;
  };
}

export interface ReviewSubmissionResponse {
  message: string;
  review: Review;
  auto_verified: boolean;
}

export interface PaginatedReviews {
  data: Review[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
