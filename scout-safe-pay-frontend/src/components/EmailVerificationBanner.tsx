'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface EmailVerificationBannerProps {
  show?: boolean;
}

export function EmailVerificationBanner({ show = true }: EmailVerificationBannerProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await apiClient.get('/email/verification-status');
      setIsVerified(response.data.email_verified);
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await apiClient.post('/email/resend');
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend verification email';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  // Don't show banner if email is verified or user dismissed it
  if (!show || isVerified || !isVisible || isVerified === null) {
    return null;
  }

  return (
    <Alert className="mb-6 border-yellow-200 bg-yellow-50">
      <Mail className="h-4 w-4 text-yellow-600" />
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="flex-1">
          <AlertTitle className="text-yellow-800 mb-1">
            Please verify your email address
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-yellow-300 hover:bg-yellow-100"
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-yellow-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
}
