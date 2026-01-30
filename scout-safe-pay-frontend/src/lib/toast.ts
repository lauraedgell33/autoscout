import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✓',
      style: {
        background: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #22c55e',
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      icon: '✕',
      duration: 5000,
      style: {
        background: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #ef4444',
      },
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      icon: '⚠',
      style: {
        background: '#fffbeb',
        color: '#b45309',
        border: '1px solid #f59e0b',
      },
    });
  },
  
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ',
      style: {
        background: '#f0f9ff',
        color: '#0369a1',
        border: '1px solid #0ea5e9',
      },
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
