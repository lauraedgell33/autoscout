import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 text-error-500 text-sm mt-1 animate-slide-down">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
