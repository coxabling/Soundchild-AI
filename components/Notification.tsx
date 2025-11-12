import React, { useEffect, useState } from 'react';
import type { NotificationMessage } from '../types';
import { CheckCircleIcon, AlertTriangleIcon, XIcon } from './icons';

interface NotificationProps {
  message: NotificationMessage;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
        setShow(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const isSuccess = message.type === 'success';
  const Icon = isSuccess ? CheckCircleIcon : AlertTriangleIcon;
  const colors = isSuccess 
    ? { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', icon: 'text-green-400' }
    : { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-400' };

  return (
    <div
      className={`
        w-full max-w-sm overflow-hidden rounded-lg shadow-lg pointer-events-auto
        ring-1 ring-black ring-opacity-5 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        bg-[var(--surface-primary)] border ${isSuccess ? 'border-[var(--positive)]/30' : 'border-[var(--negative)]/30'}
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${isSuccess ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${isSuccess ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>{message.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-primary)] focus:ring-[var(--accent-primary)]"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};