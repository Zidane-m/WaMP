import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  actionLabel?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada barang ditemukan',
  message,
  description,
  actionLabel,
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  const finalMessage = description || message || 'Coba ubah kata kunci pencarian atau sesuaikan pilihan filter universitas dan kategori.';
  const finalActionLabel = actionText || actionLabel;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <PackageSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{finalMessage}</p>

      {finalActionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none min-h-[44px]"
        >
          {finalActionLabel}
        </Link>
      )}

      {finalActionLabel && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none min-h-[44px]"
        >
          {finalActionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
