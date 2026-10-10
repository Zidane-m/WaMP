import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  // Bangun rentang nomor halaman yang ditampilkan
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Tampilkan 1 halaman di kiri dan kanan halaman aktif

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-10"
      aria-label="Navigasi Halaman Katalog"
    >
      {/* Tombol Sebelumnya */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        aria-label="Halaman Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {/* Nomor-nomor Halaman */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={`dots-${idx}`}
              className="inline-flex items-center justify-center w-10 h-10 text-slate-400 select-none text-sm"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={`page-${p}`}
            type="button"
            onClick={() => onPageChange(Number(p))}
            disabled={isLoading || isCurrent}
            aria-current={isCurrent ? 'page' : undefined}
            className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
              isCurrent
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Tombol Selanjutnya */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        aria-label="Halaman Selanjutnya"
      >
        <span className="hidden sm:inline">Selanjutnya</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
