import React from 'react';
import { Barang } from '../../types';
import ItemCard from './ItemCard';
import EmptyState from '../ui/EmptyState';
import ErrorMessage from '../ui/ErrorMessage';

interface ItemGridProps {
  items: Barang[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetFilter?: () => void;
  hasActiveFilter?: boolean;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  isLoading,
  error,
  onRetry,
  onResetFilter,
  hasActiveFilter = false,
}) => {
  // State Error
  if (error && !isLoading) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  // State Loading Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between animate-pulse"
          >
            <div>
              <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-5 bg-slate-200 rounded w-4/5 mb-3" />
              <div className="h-3 bg-slate-200 rounded w-full mb-1.5" />
              <div className="h-3 bg-slate-200 rounded w-2/3 mb-4" />
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-6 bg-slate-200 rounded w-24" />
              <div className="h-9 bg-slate-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // State Kosong (Tidak ada barang ditemukan)
  if (items.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title={hasActiveFilter ? 'Tidak Ada Barang yang Cocok' : 'Belum Ada Barang Diposting'}
          description={
            hasActiveFilter
              ? 'Coba sesuaikan kata kunci pencarian, pilih universitas lain, atau reset filter untuk melihat semua barang.'
              : 'Jadilah yang pertama memposting barang preloved, barter, atau hibah untuk teman kampusmu!'
          }
          actionText={hasActiveFilter ? 'Reset Semua Filter' : 'Pasang Iklan Pertama'}
          actionHref={hasActiveFilter ? undefined : '/jual'}
          onAction={hasActiveFilter ? onResetFilter : undefined}
        />
      </div>
    );
  }

  // State Berisi Barang
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <ItemCard key={item.id_barang} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
