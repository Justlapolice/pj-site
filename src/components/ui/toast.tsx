import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-gradient-to-r from-blue-600 via-white to-red-600 text-black font-semibold px-6 py-3 rounded-lg shadow-2xl border border-gray-300 animate-pulse" style={{ borderRadius: '10px' }}>
        {message}
      </div>
    </div>
  );
}
