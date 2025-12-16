import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-lg border border-red-500/50 bg-red-950/90 px-4 py-3 text-red-200 shadow-xl backdrop-blur-md animate-in slide-in-from-right-full fade-in duration-300">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-auto rounded-full p-1 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;