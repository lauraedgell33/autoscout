import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct variant', () => {
    const { rerender } = render(<Button variant="primary">Click Me</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-900');
    
    rerender(<Button variant="secondary">Click Me</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent-500');
    
    rerender(<Button variant="outline">Click Me</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('shows loading spinner when isLoading=true', () => {
    render(<Button loading={true}>Submit</Button>);
    
    const loader = screen.getByLabelText('Loading');
    expect(loader).toBeInTheDocument();
  });

  it('disabled when isLoading=true', () => {
    render(<Button loading={true}>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('onClick fires when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3');
    
    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-4');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6');
  });

  it('renders full width when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid="left-icon">←</span>;
    render(<Button leftIcon={<Icon />}>With Icon</Button>);
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const Icon = () => <span data-testid="right-icon">→</span>;
    render(<Button rightIcon={<Icon />}>With Icon</Button>);
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    const Icon = () => <span data-testid="icon">✓</span>;
    render(<Button leftIcon={<Icon />} rightIcon={<Icon />} loading>Loading</Button>);
    
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
