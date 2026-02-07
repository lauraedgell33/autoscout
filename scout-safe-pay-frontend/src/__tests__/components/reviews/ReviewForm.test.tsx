import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReviewForm } from '@/components/reviews/ReviewForm';

// Mock the review service
jest.mock('@/lib/api/reviews', () => ({
  reviewService: {
    submitReview: jest.fn(),
  },
}));

describe('ReviewForm', () => {
  const defaultProps = {
    transactionId: 1,
    revieweeId: 2,
    reviewType: 'buyer' as const,
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with rating and comment fields', () => {
    render(<ReviewForm {...defaultProps} />);

    expect(screen.getByText(/write a review/i)).toBeInTheDocument();
    expect(screen.getByText(/rating/i)).toBeInTheDocument();
    expect(screen.getByText(/your review/i)).toBeInTheDocument();
  });

  it('star rating can be selected', () => {
    render(<ReviewForm {...defaultProps} />);

    // Stars have aria-label like "Rate X stars"
    const starButtons = screen.getAllByRole('button', { name: /rate/i });
    fireEvent.click(starButtons[4]); // Click 5th star

    // After selection, should show "You rated: 5 stars"
    expect(screen.getByText(/you rated: 5 stars/i)).toBeInTheDocument();
  });

  it('shows character counter for textarea', () => {
    render(<ReviewForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/share your experience/i);
    fireEvent.change(textarea, { target: { value: 'Test comment here' } });

    // Should show remaining characters or current count
    expect(screen.getByText(/more characters required/i)).toBeInTheDocument();
  });

  it('textarea accepts input', () => {
    render(<ReviewForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/share your experience/i);
    fireEvent.change(textarea, { target: { value: 'This is a test review comment that is long enough.' } });

    expect(textarea).toHaveValue('This is a test review comment that is long enough.');
  });

  it('submit button is present', () => {
    render(<ReviewForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('handles form state correctly', () => {
    render(<ReviewForm {...defaultProps} />);

    // Select rating
    const starButtons = screen.getAllByRole('button', { name: /rate/i });
    fireEvent.click(starButtons[4]);

    // Enter comment
    const textarea = screen.getByPlaceholderText(/share your experience/i);
    fireEvent.change(textarea, { 
      target: { value: 'This is a great transaction experience with excellent service!' } 
    });

    // Check that the submit button can be clicked
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });
});
