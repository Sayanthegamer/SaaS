'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  formAction?: any;
}

export default function SubmitButton({ children, formAction, className = '', ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      formAction={formAction}
      disabled={pending || props.disabled}
      className={`${className} flex items-center justify-center gap-2 disabled:opacity-50 transition-all`}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? 'Processing...' : children}
    </button>
  );
}
