import React from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada barang ditemukan',
  message = 'Coba ubah kata kunci pencarian atau sesuaikan pilihan filter universitas dan kategori.',
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <PackageSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none min-h-[44px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
