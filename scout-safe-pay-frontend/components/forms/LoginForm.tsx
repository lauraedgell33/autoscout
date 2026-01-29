'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type LoginFormData } from '@/lib/schemas';
import { useLogin } from '@/lib/hooks/api';
import { useUserStore } from '@/lib/stores/userStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const login = useLogin();
  const setUser = useUserStore((state) => state.setUser);
  const addToast = useUIStore((state) => state.addToast);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login.mutateAsync(data);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      addToast('Login successful!', 'success');
      // Router will handle redirect
    } catch (error) {
      addToast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
        />
        {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
        {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {login.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </motion.form>
  );
};
