import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 mb-6 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center">
        <HelpCircle className="w-10 h-10" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-brand-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl font-extrabold text-navy-900 mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-slate-600 text-sm leading-relaxed mb-8">
        Halaman yang kamu cari tidak tersedia atau tautan yang kamu ikuti telah kedaluwarsa.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all min-h-[44px]"
      >
        <Home className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
