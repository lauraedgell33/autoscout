import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 text-success-500 text-sm mt-1 animate-slide-down">
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
