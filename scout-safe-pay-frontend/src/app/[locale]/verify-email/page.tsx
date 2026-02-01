'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'required'>('loading');
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Check if this is a "verification required" redirect
    const required = searchParams.get('required');
    
    if (required === 'true') {
      setStatus('required');
      setMessage('Please verify your email address to access this feature.');
      setCanResend(true);
      return;
    }

    const verifyEmail = async () => {
      const id = searchParams.get('id');
      const hash = searchParams.get('hash');
      const signature = searchParams.get('signature');
      const expires = searchParams.get('expires');

      if (!id || !hash || !signature || !expires) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await apiClient.get(
          `/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`
        );

        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard/buyer');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
        setCanResend(true);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResendEmail = async () => {
    try {
      await apiClient.post('/email/resend');
      toast.success('Verification email sent! Please check your inbox.');
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000); // Allow resend after 1 minute
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
            {status === 'required' && (
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'required' && 'Email Verification Required'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="text-center text-sm text-gray-600">
              Redirecting to dashboard in 3 seconds...
            </div>
          )}

          {(status === 'error' || status === 'required') && canResend && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                {status === 'required' 
                  ? "We've sent a verification link to your email. Click the link to verify your account."
                  : "Didn't receive the email? Check your spam folder or request a new one."}
              </p>
              <Button
                onClick={handleResendEmail}
                className="w-full"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>
            </div>
          )}

          <Button
            onClick={() => router.push('/')}
            className="w-full"
            variant={status === 'error' || status === 'required' ? 'default' : 'outline'}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
