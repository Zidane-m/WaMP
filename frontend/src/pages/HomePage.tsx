import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { Barang, Universitas, Kategori, PaginationMeta } from '../types';
import FilterBar from '../components/items/FilterBar';
import ItemGrid from '../components/items/ItemGrid';
import Pagination from '../components/items/Pagination';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parameter dari URL query
  const univParam = searchParams.get('univ') || '';
  const categoryParam = searchParams.get('kategori') || '';
  const searchParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Data State
  const [items, setItems] = useState<Barang[]>([]);
  const [universities, setUniversities] = useState<Universitas[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data referensi (Universitas & Kategori) sekali saat mount
  useEffect(() => {
    let isMounted = true;

    const fetchDropdownData = async () => {
      try {
        const [univData, catData] = await Promise.all([
          api.getUniversities(),
          api.getCategories(),
        ]);
        if (isMounted) {
          setUniversities(univData);
          setCategories(catData);
        }
      } catch (err) {
        console.error('Gagal memuat data master filter:', err);
      }
    };

    fetchDropdownData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Ambil data barang berdasarkan filter aktif dan halaman
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getItems({
        id_universitas: univParam ? Number(univParam) : undefined,
        id_kategori: categoryParam ? Number(categoryParam) : undefined,
        search: searchParam || undefined,
        page: currentPage,
        limit: 12,
      });

      setItems(response.data);
      setPagination(response.meta);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memuat data barang. Periksa koneksi internet Anda.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [univParam, categoryParam, searchParam, currentPage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handler update filter ke URL search params
  const handleFilterChange = (newFilters: { univ?: string; category?: string; search?: string }) => {
    const updated = new URLSearchParams(searchParams);

    if (newFilters.univ !== undefined) {
      if (newFilters.univ) {
        updated.set('univ', newFilters.univ);
      } else {
        updated.delete('univ');
      }
    }

    if (newFilters.category !== undefined) {
      if (newFilters.category) {
        updated.set('kategori', newFilters.category);
      } else {
        updated.delete('kategori');
      }
    }

    if (newFilters.search !== undefined) {
      if (newFilters.search.trim()) {
        updated.set('q', newFilters.search.trim());
      } else {
        updated.delete('q');
      }
    }

    // Reset ke halaman 1 saat filter berubah
    updated.delete('page');

    setSearchParams(updated, { replace: true });
  };

  // Handler ubah halaman
  const handlePageChange = (newPage: number) => {
    const updated = new URLSearchParams(searchParams);
    if (newPage > 1) {
      updated.set('page', String(newPage));
    } else {
      updated.delete('page');
    }
    setSearchParams(updated);

    // Scroll halus ke bagian katalog
    const catalogSection = document.getElementById('katalog-barang');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler reset semua filter
  const handleResetFilter = () => {
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilter = Boolean(univParam || categoryParam || searchParam);

  // Nama universitas terpilih untuk teks header dinamis
  const selectedUnivName = univParam
    ? universities.find((u) => String(u.id_universitas) === univParam)?.nama_universitas
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-title"
        className="text-center py-12 sm:py-16 px-4 sm:px-8 rounded-3xl bg-gradient-to-b from-brand-50/70 via-slate-50 to-white border border-brand-100/60 shadow-sm mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Pasar Preloved Mahasiswa Lintas Kampus</span>
        </div>

        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 max-w-3xl mx-auto leading-tight"
        >
          Katalog Preloved, Barter, dan Hibah Kampus
        </h1>

        <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Temukan buku kuliah, jas lab, kalkulator saintifik, kos perlengkapan, hingga elektronik bekas berkualitas langsung dari mahasiswa universitas di sekitarmu.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/jual"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm transition-all min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pasang Iklan Barang</span>
          </Link>

          <a
            href="#katalog-barang"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all min-h-[44px]"
          >
            <span>Jelajahi Katalog</span>
          </a>
        </div>
      </section>

      {/* Bagian Katalog Barang */}
      <section id="katalog-barang" aria-labelledby="catalog-heading" className="scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 id="catalog-heading" className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              {selectedUnivName ? `Barang di ${selectedUnivName}` : 'Daftar Barang Tersedia'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {isLoading
                ? 'Sedang menyinkronkan data dengan server...'
                : pagination
                ? `Menampilkan ${items.length} dari total ${pagination.total} barang`
                : 'Pilih filter untuk mempersempit pencarian'}
            </p>
          </div>

          {/* Tombol Segarkan */}
          <button
            type="button"
            onClick={fetchItems}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors disabled:opacity-50 min-h-[44px]"
            title="Segarkan daftar barang"
            aria-label="Segarkan daftar barang"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {/* Bilah Filter dan Pencarian */}
        <FilterBar
          universities={universities}
          categories={categories}
          selectedUniv={univParam}
          selectedCategory={categoryParam}
          searchQuery={searchParam}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          isLoading={isLoading}
        />

        {/* Grid Katalog Barang */}
        <ItemGrid
          items={items}
          isLoading={isLoading}
          error={error}
          onRetry={fetchItems}
          onResetFilter={handleResetFilter}
          hasActiveFilter={hasActiveFilter}
        />

        {/* Paginasi */}
        {pagination && pagination.total_pages > 1 && !isLoading && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;
