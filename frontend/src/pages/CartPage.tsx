import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, School, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CartItem } from '../types';
import { formatRupiah } from '../lib/format';
import { buildWhatsAppLink } from '../lib/whatsapp';

export const CartPage: React.FC = () => {
  const { user, isLoading: authLoading, refreshCartCount } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalEstimasi, setTotalEstimasi] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCart();
      setItems(data.items);
      setTotalEstimasi(data.total_estimasi);
      await refreshCartCount();
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/masuk', { state: { from: { pathname: '/keranjang' } } });
      } else {
        loadCart();
      }
    }
  }, [user, authLoading, navigate]);

  const handleRemove = async (idBarang: number, namaBarang: string) => {
    try {
      await api.removeFromCart(idBarang);
      setFeedbackMessage(`"${namaBarang}" berhasil dihapus dari keranjang incaran.`);
      await loadCart();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage('Gagal menghapus barang dari keranjang.');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Memuat keranjang incaran Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Lanjut Jelajah Katalog
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
              Daftar Incaran
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Keranjang Incaran Kampus
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Simpan barang yang ingin Anda beli, barter, atau klaim hibah untuk kemudahan COD di kampus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl">
            {items.length} Barang Disimpan
          </span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center gap-3 text-brand-900 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-brand-600" />
          <p className="font-semibold">{feedbackMessage}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl mt-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-xs">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-navy-900">Keranjang Incaran Masih Kosong</h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
            Temukan buku kuliah, kalkulator, perlengkapan lab, atau barang kos preloved dari teman kampus lain dan simpan di sini!
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all min-h-[44px]"
          >
            <span>Jelajahi Katalog Barang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Item List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isSold = item.status === 'Terjual';
              const waUrl = buildWhatsAppLink(
                item.penjual.no_whatsapp,
                item.nama_barang,
                item.harga,
                item.jenis_transaksi,
                item.penjual.nama_lengkap
              );

              return (
                <div
                  key={item.id_keranjang}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-xs hover:shadow-sm transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/barang/${item.id_barang}`}
                    className="relative w-full sm:w-28 h-28 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden group"
                  >
                    {item.gambar_url ? (
                      <img
                        src={item.gambar_url.startsWith('http') ? item.gambar_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${item.gambar_url}`}
                        alt={item.nama_barang}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ${isSold ? 'grayscale opacity-75' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                    {isSold && (
                      <span className="absolute inset-0 bg-navy-900/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[11px] font-bold">
                        Terjual
                      </span>
                    )}
                  </Link>

                  {/* Detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.kategori.nama_kategori}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
                        {item.jenis_transaksi}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {item.kondisi}
                      </span>
                    </div>

                    <Link
                      to={`/barang/${item.id_barang}`}
                      className="text-base font-bold text-navy-900 hover:text-brand-600 transition-colors line-clamp-1 block"
                    >
                      {item.nama_barang}
                    </Link>

                    {/* Penjual & Kampus */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{item.penjual.nama_lengkap} • {item.penjual.universitas.nama_universitas}</span>
                    </div>

                    {/* Harga */}
                    <div className="mt-2">
                      {item.jenis_transaksi === 'Jual' ? (
                        <span className="text-base font-extrabold text-brand-600">
                          {formatRupiah(item.harga)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {item.jenis_transaksi === 'Barter' ? 'Barter Barang' : 'Gratis / Hibah'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {!isSold ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors min-h-[44px]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat WhatsApp</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 py-2">
                        Barang sudah laku
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id_barang, item.nama_barang)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Hapus dari incaran"
                      aria-label={`Hapus ${item.nama_barang} dari keranjang`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card (1 col) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-lg font-extrabold text-navy-900 border-b border-slate-100 pb-3">
              Ringkasan Incaran
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Barang Incaran</span>
                <span className="font-bold text-navy-900">{items.length} item</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Barang Siap Dibeli (Jual)</span>
                <span className="font-bold text-navy-900">
                  {items.filter((i) => i.jenis_transaksi === 'Jual' && i.status === 'Tersedia').length} item
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Barang Barter / Hibah</span>
                <span className="font-bold text-navy-900">
                  {items.filter((i) => i.jenis_transaksi !== 'Jual').length} item
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-navy-900">Estimasi Total Biaya</span>
                <span className="text-xl font-black text-brand-600">
                  {formatRupiah(totalEstimasi)}
                </span>
              </div>
            </div>

            {/* COD Safety Notice */}
            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/60 text-xs text-brand-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-brand-800">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Tips Transaksi Mahasiswa:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                WarisanKampus mengutamakan sistem COD langsung di area kampus yang aman (misal: perpustakaan, kantin, atau gedung kuliah). Hubungi nomor WhatsApp penjual untuk kesepakatan waktu dan tempat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
