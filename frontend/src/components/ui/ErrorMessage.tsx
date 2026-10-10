import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Gagal memuat data',
  message = 'Terjadi kendala saat menghubungi server. Pastikan koneksi server backend aktif.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      role="alert"
      className={`p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 max-w-lg mx-auto my-6 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-950 mb-1">{title}</h3>
      <p className="text-sm text-rose-800 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500 focus:outline-none min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
