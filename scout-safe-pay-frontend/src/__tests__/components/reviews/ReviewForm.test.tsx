import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '@/components/reviews/ReviewForm';

describe('ReviewForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('star rating can be selected', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[4]); // Click 5th star

    expect(starButtons[4]).toHaveClass('selected');
  });

  it('comment textarea validates min 20 chars', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(textarea, { target: { value: 'Too short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/minimum 20 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submit button disabled when invalid', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();
  });

  it('shows character counter', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    fireEvent.change(textarea, { target: { value: 'Test comment here' } });

    expect(screen.getByText(/17\/1000/)).toBeInTheDocument();
  });

  it('displays success message on submit', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });

    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[4]);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    fireEvent.change(textarea, {
      target: { value: 'Great vehicle, highly recommended for everyone!' }
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/review submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('validates maximum character limit', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    const longText = 'a'.repeat(1001);

    fireEvent.change(textarea, { target: { value: longText } });

    await waitFor(() => {
      expect(screen.getByText(/maximum 1000 characters/i)).toBeInTheDocument();
    });
  });

  it('enables submit button when form is valid', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[4]);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    fireEvent.change(textarea, {
      target: { value: 'This is a valid review comment with sufficient length.' }
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).not.toBeDisabled();
  });

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });

    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[4]);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    fireEvent.change(textarea, {
      target: { value: 'Great vehicle, highly recommended!' }
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('displays error message on submission failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[4]);

    const textarea = screen.getByRole('textbox', { name: /comment/i });
    fireEvent.change(textarea, {
      target: { value: 'Great vehicle, highly recommended!' }
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
    });
  });
});
