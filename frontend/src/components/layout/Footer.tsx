import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-navy-900">WarisanKampus</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Platform estafet barang bekas layak pakai, barter, dan hibah gratis antar mahasiswa lintas universitas di Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Katalog Barang
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Tentang WarisanKampus
                </Link>
              </li>
              <li>
                <Link to="/jual" className="text-slate-600 hover:text-brand-600 transition-colors">
                  Pasang Iklan Barang
                </Link>
              </li>
            </ul>
          </div>

          {/* University Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Mata Kuliah
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tugas Besar Web and Mobile Programming (WaMP).
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Transaksi diselesaikan secara langsung (COD) di lingkungan kampus.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} WarisanKampus. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1 text-slate-500">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk mahasiswa Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
