import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct variant styles', () => {
    const { rerender } = render(<Button variant="default">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
  });

  it('shows loading spinner when isLoading=true', () => {
    render(<Button isLoading={true}>Submit</Button>);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('button disabled when isLoading=true', () => {
    render(<Button isLoading={true}>Submit</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('onClick handler fires when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick} disabled={true}>Disabled</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
