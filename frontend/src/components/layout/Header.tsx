import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, PlusCircle, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isJual = location.pathname === '/jual';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl focus:outline-none p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-navy-900 tracking-tight">Warisan</span>
              <span className="text-xl font-extrabold text-brand-600 tracking-tight">Kampus</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                isHome
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Katalog Barang
            </Link>

            <Link
              to="/jual"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all min-h-[44px] ${
                isJual
                  ? 'bg-brand-700 text-white shadow-brand-200'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-100 active:scale-98'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Jual Barang
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center h-12 px-4 rounded-xl text-sm font-semibold ${
              isHome
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Katalog Barang
          </Link>

          <Link
            to="/jual"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Jual Barang Baru
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
