import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, PlusCircle, Menu, X, ShoppingCart, Package, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, cartCount, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isJual = location.pathname === '/jual';
  const isCart = location.pathname === '/keranjang';
  const isMyItems = location.pathname === '/barang-saya';
  const isAbout = location.pathname === '/tentang';

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const handleKatalogClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById('katalog-barang')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              onClick={handleKatalogClick}
              className={`text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                isHome
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Katalog
            </Link>

            <Link
              to="/tentang"
              className={`text-sm font-semibold transition-colors px-3 py-2 rounded-lg ${
                isAbout
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Tentang
            </Link>

            {/* Keranjang Incaran */}
            <Link
              to="/keranjang"
              className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                isCart
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
              title="Keranjang Incaran"
              aria-label={`Keranjang Incaran, ada ${cartCount} barang`}
            >
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <span>Incaran</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-brand-600 rounded-full animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Jual Barang Button */}
            <Link
              to="/jual"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition-all min-h-[44px] ${
                isJual
                  ? 'bg-brand-700 text-white shadow-brand-200'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-100 active:scale-98'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Jual Barang
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px]"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menu akun pengguna"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center text-xs">
                    {user.nama_lengkap.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-navy-900 leading-tight truncate max-w-[120px]">
                      {user.nama_lengkap}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {user.universitas.nama_universitas}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-900 truncate">{user.nama_lengkap}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/barang-saya"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium ${
                        isMyItems ? 'text-brand-700 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      Barang Saya
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar Akun
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/masuk"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-navy-800 hover:text-brand-700 hover:bg-slate-50 rounded-xl transition-colors min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  className="inline-flex items-center px-3.5 py-2 text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors min-h-[44px]"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Right Action Bar */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/keranjang"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Keranjang Incaran, ada ${cartCount} barang`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

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
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                  {user.nama_lengkap.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{user.nama_lengkap}</p>
                  <p className="text-xs text-slate-500">{user.universitas.nama_universitas}</p>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleKatalogClick(e);
            }}
            className={`flex items-center h-12 px-4 rounded-xl text-sm font-semibold ${
              isHome
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Katalog Barang
          </Link>

          <Link
            to="/tentang"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center h-12 px-4 rounded-xl text-sm font-semibold ${
              isAbout
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tentang WarisanKampus
          </Link>

          <Link
            to="/keranjang"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between h-12 px-4 rounded-xl text-sm font-semibold ${
              isCart ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Keranjang Incaran
            </span>
            {cartCount > 0 && (
              <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <Link
              to="/barang-saya"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold ${
                isMyItems ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Barang Saya (Kelola)
            </Link>
          )}

          <Link
            to="/jual"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Jual Barang Baru
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 mt-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar Akun
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/masuk"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center h-12 rounded-xl text-sm font-bold text-navy-800 bg-slate-100 hover:bg-slate-200"
              >
                Masuk
              </Link>
              <Link
                to="/daftar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center h-12 rounded-xl text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
