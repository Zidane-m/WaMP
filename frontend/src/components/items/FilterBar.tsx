import React, { useState, useEffect } from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { Universitas, Kategori } from '../../types';

interface FilterBarProps {
  universities: Universitas[];
  categories: Kategori[];
  selectedUniv: string;
  selectedCategory: string;
  searchQuery: string;
  onFilterChange: (filters: { univ?: string; category?: string; search?: string }) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  universities,
  categories,
  selectedUniv,
  selectedCategory,
  searchQuery,
  onFilterChange,
  onReset,
  isLoading = false,
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sinkronkan input lokal jika query dari URL berubah
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounce input pencarian otomatis setelah 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchQuery) {
        onFilterChange({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, searchQuery, onFilterChange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const hasActiveFilters = Boolean(selectedUniv || selectedCategory || searchQuery);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-8">
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-4"
        aria-label="Filter katalog barang"
      >
        {/* Baris Atas: Input Pencarian */}
        <div className="relative w-full">
          <label htmlFor="search-input" className="sr-only">
            Cari barang atau nama buku
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari buku kuliah, kalkulator, dispenser, jas lab..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 min-h-[44px] transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Baris Bawah: Dropdown Filter Kampus & Kategori + Tombol Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Dropdown Universitas */}
          <div>
            <label htmlFor="filter-univ" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Universitas Asal Mahasiswa
            </label>
            <div className="relative">
              <select
                id="filter-univ"
                value={selectedUniv}
                onChange={(e) => onFilterChange({ univ: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 min-h-[44px] transition-colors"
              >
                <option value="">Semua Universitas ({universities.length} Kampus)</option>
                {universities.map((u) => (
                  <option key={u.id_universitas} value={String(u.id_universitas)}>
                    {u.nama_universitas} ({u.kota})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropdown Kategori */}
          <div>
            <label htmlFor="filter-kategori" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Kategori Barang
            </label>
            <div className="relative">
              <select
                id="filter-kategori"
                value={selectedCategory}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 min-h-[44px] transition-colors"
              >
                <option value="">Semua Kategori ({categories.length} Kategori)</option>
                {categories.map((c) => (
                  <option key={c.id_kategori} value={String(c.id_kategori)}>
                    {c.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Reset Filter */}
          <div className="flex items-end">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onReset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Reset Filter
              </button>
            ) : (
              <div className="w-full hidden lg:flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-500 min-h-[44px]">
                <Filter className="w-4 h-4 text-slate-400" />
                <span>Pilih kampus atau kategori untuk memfilter barang.</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;
