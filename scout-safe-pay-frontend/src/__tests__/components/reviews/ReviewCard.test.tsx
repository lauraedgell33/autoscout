import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewCard from '@/components/reviews/ReviewCard';

describe('ReviewCard', () => {
  const mockReview = {
    id: 1,
    rating: 5,
    comment: 'Excellent vehicle! Very satisfied with the purchase. The seller was professional and the car is exactly as described in the listing.',
    verified: true,
    helpful_count: 10,
    user: {
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

    expect(screen.getByText(/verified/i)).toBeInTheDocument();
    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });

  it('hides badge for unverified reviews', () => {
    render(<ReviewCard review={mockUnverifiedReview} />);

    expect(screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
  });

  it('truncates long comments with "Read more"', () => {
    const longComment = 'This is a very long comment. '.repeat(20);
    const longReview = { ...mockReview, comment: longComment };

    render(<ReviewCard review={longReview} />);

    expect(screen.getByText(/read more/i)).toBeInTheDocument();
  });

  it('helpful/not helpful buttons work', () => {
    const mockOnHelpful = jest.fn();
    render(<ReviewCard review={mockReview} onHelpful={mockOnHelpful} />);

    const helpfulButton = screen.getByRole('button', { name: /helpful/i });
    fireEvent.click(helpfulButton);

    expect(mockOnHelpful).toHaveBeenCalledWith(mockReview.id, true);
  });

  it('flag button triggers report modal', () => {
    const mockOnFlag = jest.fn();
    render(<ReviewCard review={mockReview} onFlag={mockOnFlag} />);

    const flagButton = screen.getByRole('button', { name: /report/i });
    fireEvent.click(flagButton);

    expect(mockOnFlag).toHaveBeenCalledWith(mockReview.id);
  });

  it('displays star rating correctly', () => {
    render(<ReviewCard review={mockReview} />);

    const stars = screen.getAllByTestId('star-icon');
    const filledStars = stars.filter(star => star.classList.contains('filled'));
    expect(filledStars).toHaveLength(5);
  });

  it('shows helpful count', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText(/jan/i)).toBeInTheDocument();
  });

  it('expands truncated comment on "Read more" click', () => {
    const longComment = 'This is a very long comment. '.repeat(20);
    const longReview = { ...mockReview, comment: longComment };

    render(<ReviewCard review={longReview} />);

    const readMoreButton = screen.getByText(/read more/i);
    fireEvent.click(readMoreButton);

    expect(screen.getByText(/show less/i)).toBeInTheDocument();
  });

  it('handles null user gracefully', () => {
    const reviewWithoutUser = { ...mockReview, user: null };
    render(<ReviewCard review={reviewWithoutUser} />);

    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
  });
});
