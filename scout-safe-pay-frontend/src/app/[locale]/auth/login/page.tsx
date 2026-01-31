'use client';

import { useState } from 'react';
import { useSearchParams , useParams} from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, LogIn, Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;
  const returnUrl = searchParams.get('returnUrl');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect is handled by AuthContext
      if (returnUrl) {
        window.location.href = returnUrl;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href={`/${locale}/auth/register`}
              className="font-medium text-accent-500 hover:text-orange-600"
            >
              create a new account
            </Link>
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-green-500 hover:bg-green-600">
              <Shield className="w-3 h-3 mr-1" />
              Secure Login
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600">
              SafeTrade
            </Badge>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <Card className="bg-red-50 border-red-200 p-4">
              <div className="text-sm text-red-800">
                {error}
              </div>
            </Card>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="font-medium text-accent-500 hover:text-orange-600"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </>
            )}
          </Button>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Your data is secure and encrypted
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
