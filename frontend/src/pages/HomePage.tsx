import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-b from-brand-50/80 to-transparent border border-brand-100/60 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 mb-4">
          <ShoppingBag className="w-3.5 h-3.5" />
          Platform Mahasiswa Lintas Kampus
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
          Katalog Preloved, Barter, dan Hibah Kampus
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Temukan buku kuliah, alat teknik, perabot kos, hingga barang elektronik bekas layak pakai dari mahasiswa universitas di sekitarmu.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/jual"
            className="px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all min-h-[44px] flex items-center justify-center"
          >
            Pasang Iklan Barang
          </Link>
        </div>
      </section>

      <section className="py-8 text-center text-slate-500 text-sm">
        <p>Katalog interaktif dan fitur filter universitas akan dimuat di sini pada Fase 5.</p>
      </section>
    </div>
  );
};

export default HomePage;
