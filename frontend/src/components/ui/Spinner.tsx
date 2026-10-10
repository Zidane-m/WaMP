import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  label = 'Memuat data...',
  message,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex flex-col items-center justify-center text-center ${className}`}
    >
      <div
        className={`${sizeMap[size]} rounded-full border-slate-200 border-t-brand-600 animate-spin`}
      />
      <span className="sr-only">{label}</span>
      {message && (
        <p className="text-xs text-slate-500 font-medium mt-3 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Spinner;
