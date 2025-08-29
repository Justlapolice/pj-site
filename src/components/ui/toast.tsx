import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X } from 'lucide-react';

import { cn } from '../../lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-xl border p-4 pr-10 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white text-gray-900',
        success: 'border-green-500/30 bg-gray-900/90 text-green-100 backdrop-blur-md',
        error: 'border-red-500/30 bg-gray-900/90 text-red-100 backdrop-blur-md',
        warning: 'border-yellow-500/30 bg-gray-900/90 text-yellow-100 backdrop-blur-md',
        info: 'border-blue-500/30 bg-gray-900/90 text-blue-100 backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
  duration?: number;
  open?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, action, onDismiss, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          'relative',
          className
        )}
        {...props}
      >
        {/* Icone succès à gauche si variant success */}
        {variant === 'success' && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400">
            <Check className="h-4 w-4" />
          </div>
        )}

        <div className="flex flex-1 flex-col space-y-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {action}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
export type { ToastProps };
