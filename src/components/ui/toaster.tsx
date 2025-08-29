'use client';

import * as React from 'react';
import { useToast } from './use-toast';
import { Toast } from './toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col items-end gap-3 p-4">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          title={title}
          description={description}
          action={action}
          onDismiss={() => dismiss(id)}
          {...props}
          className="pointer-events-auto"
        />
      ))}
    </div>
  );
}
