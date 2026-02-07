import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReviewCard } from '@/components/reviews/ReviewCard';

describe('ReviewCard', () => {
  const mockReview = {
    id: 1,
    rating: 5,
    comment: 'Excellent vehicle! Very satisfied with the purchase. The seller was professional and the car is exactly as described in the listing.',
    verified: true,
    helpful_count: 10,
    not_helpful_count: 2,
    reviewer: {
      id: 2,
      name: 'John Buyer',
      avatar: '/avatars/john.jpg'
    },
    created_at: '2024-01-15T10:00:00Z'
  };

  const mockUnverifiedReview = {
    ...mockReview,
    id: 2,
    verified: false
  };

  it('renders review with user info', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText('John Buyer')).toBeInTheDocument();
    expect(screen.getByText(/excellent vehicle/i)).toBeInTheDocument();
  });

  it('displays verified badge for verified reviews', () => {
    render(<ReviewCard review={mockReview} />);

    // Component shows verified badge when review.verified is true
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('hides badge for unverified reviews', () => {
    render(<ReviewCard review={mockUnverifiedReview} />);

    // For unverified, the badge might not show or show "unverified"
    const verifiedText = screen.queryByText(/^verified$/i);
    // Either no badge or badge indicates unverified
    expect(verifiedText === null || screen.queryByText(/not verified|unverified/i)).toBeTruthy();
  });

  it('truncates long comments with "Read more"', () => {
    const longComment = 'This is a very long comment. '.repeat(20);
    const longReview = { ...mockReview, comment: longComment };

    render(<ReviewCard review={longReview} />);

    expect(screen.getByText(/read more/i)).toBeInTheDocument();
  });

  it('helpful button triggers onVote callback', () => {
    const mockOnVote = jest.fn();
    render(<ReviewCard review={mockReview} onVote={mockOnVote} />);

    const helpfulButton = screen.getByRole('button', { name: /helpful/i });
    fireEvent.click(helpfulButton);

    expect(mockOnVote).toHaveBeenCalledWith(mockReview.id, true);
  });

  it('report button is present', () => {
    render(<ReviewCard review={mockReview} />);

    const reportButton = screen.getByRole('button', { name: /report/i });
    expect(reportButton).toBeInTheDocument();
  });

  it('shows helpful count', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<ReviewCard review={mockReview} />);

    // date-fns formatDistanceToNow will show something like "X months ago"
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });

  it('expands truncated comment on "Read more" click', () => {
    const longComment = 'This is a very long comment. '.repeat(20);
    const longReview = { ...mockReview, comment: longComment };

    render(<ReviewCard review={longReview} />);

    const readMoreButton = screen.getByText(/read more/i);
    fireEvent.click(readMoreButton);

    expect(screen.getByText(/show less/i)).toBeInTheDocument();
  });

  it('handles null reviewer gracefully', () => {
    const reviewWithoutReviewer = { ...mockReview, reviewer: null };
    render(<ReviewCard review={reviewWithoutReviewer} />);

    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
  });
});
