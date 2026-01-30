'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onAsyncClick: () => Promise<void>;
  children: React.ReactNode;
}

/**
 * AsyncButton - A button that automatically handles loading state for async operations
 * 
 * @example
 * <AsyncButton onAsyncClick={async () => await saveData()}>
 *   Save
 * </AsyncButton>
 */
export function AsyncButton({
  onAsyncClick,
  disabled,
  ...props
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onAsyncClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      loading={isLoading}
      disabled={disabled || isLoading}
    />
  );
}
