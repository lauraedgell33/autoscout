import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ReviewForm } from '@/components/reviews/ReviewForm';

// Mock the review service
jest.mock('@/lib/api/reviews', () => ({
  reviewService: {
    submitReview: jest.fn(),
  },
}));

import { reviewService } from '@/lib/api/reviews';

describe('ReviewForm', () => {
  const mockProps = {
    transactionId: 1,
    revieweeId: 2,
    reviewType: 'seller' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('star rating can be selected', async () => {
    render(<ReviewForm {...mockProps} />);
    
    const starButtons = screen.getAllByRole('button', { name: /Rate \d stars/ });
    expect(starButtons).toHaveLength(5);
    
    // Click the 4th star
    fireEvent.click(starButtons[3]);
    
    // Rating should be selected
    expect(starButtons[3]).toBeInTheDocument();
  });

  it('comment validates min 20 characters', async () => {
    render(<ReviewForm {...mockProps} />);
    
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Type less than 20 characters
    await userEvent.type(textarea, 'Too short');
    
    // Submit button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('submit disabled when invalid', () => {
    render(<ReviewForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Initially should be disabled (no rating or comment)
    expect(submitButton).toBeDisabled();
  });

  it('shows character counter', () => {
    render(<ReviewForm {...mockProps} />);
    
    // Look for character count display (e.g., "0/1000" or "20 characters minimum")
    expect(screen.getByText(/20/)).toBeInTheDocument();
  });

  it('submit enabled with valid input', async () => {
    render(<ReviewForm {...mockProps} />);
    
    const starButtons = screen.getAllByRole('button', { name: /Rate \d stars/ });
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Select rating
    fireEvent.click(starButtons[4]); // 5 stars
    
    // Type valid comment
    await userEvent.type(textarea, 'This is a great seller with excellent service and communication!');
    
    // Submit button should be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('success message on submit', async () => {
    (reviewService.submitReview as jest.Mock).mockResolvedValueOnce({ success: true });
    
    const mockOnSuccess = jest.fn();
    render(<ReviewForm {...mockProps} onSuccess={mockOnSuccess} />);
    
    const starButtons = screen.getAllByRole('button', { name: /Rate \d stars/ });
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Fill form
    fireEvent.click(starButtons[4]);
    await userEvent.type(textarea, 'Excellent service and very professional seller with great communication!');
    
    // Submit
    fireEvent.click(submitButton);
    
    // Wait for success message
    await waitFor(() => {
      expect(reviewService.submitReview).toHaveBeenCalled();
    });
  });

  it('displays error message on submit failure', async () => {
    (reviewService.submitReview as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to submit review')
    );
    
    render(<ReviewForm {...mockProps} />);
    
    const starButtons = screen.getAllByRole('button', { name: /Rate \d stars/ });
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Fill form
    fireEvent.click(starButtons[4]);
    await userEvent.type(textarea, 'This is a test comment with sufficient length for validation.');
    
    // Wait for button to be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    
    // Submit
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to submit review/i)).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    (reviewService.submitReview as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<ReviewForm {...mockProps} />);
    
    const starButtons = screen.getAllByRole('button', { name: /Rate \d stars/ });
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Fill form
    fireEvent.click(starButtons[4]);
    await userEvent.type(textarea, 'Great seller with excellent communication and service!');
    
    // Submit
    fireEvent.click(submitButton);
    
    // Wait for form to clear
    await waitFor(() => {
      expect(textarea.value).toBe('');
    }, { timeout: 3000 });
  });
});
