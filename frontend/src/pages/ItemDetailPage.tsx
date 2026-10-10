import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors min-h-[44px] py-2 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Detail Barang #{id}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-6">
          Halaman detail lengkap, info penjual kampus, dan tombol hubungi WhatsApp akan diimplementasikan penuh pada Fase 7.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono">
          ID Barang: {id}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
