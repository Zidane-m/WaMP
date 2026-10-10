import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  RefreshCw,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { api } from '../lib/api';
import { Barang, Universitas, Kategori, PaginationMeta } from '../types';
import FilterBar from '../components/items/FilterBar';
import ItemGrid from '../components/items/ItemGrid';
import Pagination from '../components/items/Pagination';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogRef = useRef<HTMLElement | null>(null);

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

  // Fungsi scroll halus ke katalog
  const scrollToCatalog = () => {
    const el = catalogRef.current || document.getElementById('katalog-barang');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const hasActiveFilter = Boolean(univParam || categoryParam || searchParam);

  // Otomatis gulir ke katalog jika ada filter aktif atau sedang di halaman > 1
  useEffect(() => {
    if (hasActiveFilter || currentPage > 1) {
      const timer = setTimeout(() => {
        scrollToCatalog();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [univParam, categoryParam, searchParam, currentPage, hasActiveFilter]);

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
    scrollToCatalog();
  };

  // Handler reset semua filter
  const handleResetFilter = () => {
    setSearchParams({}, { replace: true });
  };

  // Nama universitas terpilih untuk teks header dinamis
  const selectedUnivName = univParam
    ? universities.find((u) => String(u.id_universitas) === univParam)?.nama_universitas
    : null;

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Hero Section: Tampilan Penuh Layar Awal (Above-the-fold) */}
      <section
        aria-labelledby="hero-title"
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 overflow-hidden bg-gradient-to-b from-brand-50/50 via-slate-50 to-white border-b border-slate-200/80"
      >
        {/* Dekorasi Latar: Ornamen Pencahayaan Kampus Halus */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-navy-200/25 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        </div>

        {/* Pembatas Ruang Atas */}
        <div className="w-full h-2 sm:h-4" />

        {/* Inti Konten Hero */}
        <div className="max-w-3xl mx-auto z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-100/90 text-brand-800 mb-6 border border-brand-200/60 shadow-xs">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Estafet Barang Mahasiswa Lintas Kampus</span>
          </div>

          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight mb-5 leading-[1.15]"
          >
            Warisan Barang Preloved, Barter, dan Hibah Kampus
          </h1>

          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-9 leading-relaxed">
            Teruskan buku kuliah, jas lab, kalkulator saintifik, hingga perlengkapan kos layak pakai ke adik tingkat dan sesama mahasiswa di sekitarmu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/jual"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm hover:shadow transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pasang Iklan Barang</span>
            </Link>

            <button
              type="button"
              onClick={scrollToCatalog}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-navy-900 active:bg-slate-100 transition-all min-h-[44px]"
            >
              <span>Jelajahi Katalog</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Indikator Gulir Bawah */}
        <div className="z-10 pt-6 pb-2">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="group inline-flex flex-col items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl p-2 min-h-[44px]"
            aria-label="Gulir ke katalog barang"
          >
            <span className="text-xs font-semibold tracking-wide">Lihat Katalog Barang</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white/90 group-hover:border-brand-300 group-hover:bg-brand-50 flex items-center justify-center transition-all group-hover:translate-y-1">
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* Bagian Katalog Barang */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <section
          ref={catalogRef}
          id="katalog-barang"
          aria-labelledby="catalog-heading"
          className="scroll-mt-20"
        >
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
    </div>
  );
};

export default HomePage;
