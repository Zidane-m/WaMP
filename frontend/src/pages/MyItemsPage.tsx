import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, PlusCircle, CheckCircle2, RefreshCw, Trash2, Edit3, ExternalLink, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Barang, StatusBarang } from '../types';
import { formatRupiah } from '../lib/format';

export const MyItemsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<Barang[]>([]);
  const [activeTab, setActiveTab] = useState<'Semua' | StatusBarang>('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadMyItems = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMyItems();
      setItems(data);
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Gagal memuat barang jualan Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/masuk', { state: { from: { pathname: '/barang-saya' } } });
      } else {
        loadMyItems();
      }
    }
  }, [user, authLoading, navigate]);

  const handleToggleStatus = async (item: Barang) => {
    setActionError(null);
    setActionSuccess(null);
    const newStatus: StatusBarang = item.status === 'Tersedia' ? 'Terjual' : 'Tersedia';

    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      await api.updateItem(item.id_barang, formData);
      setActionSuccess(`Status "${item.nama_barang}" berhasil diubah menjadi ${newStatus}.`);
      await loadMyItems();
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Gagal mengubah status barang.');
    }
  };

  const handleDelete = async (item: Barang) => {
    if (!window.confirm(`Yakin ingin menghapus "${item.nama_barang}" dari katalog? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);

    try {
      await api.deleteItem(item.id_barang);
      setActionSuccess(`Barang "${item.nama_barang}" berhasil dihapus.`);
      await loadMyItems();
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Gagal menghapus barang.');
    }
  };

  const filteredItems = items.filter((it) => {
    if (activeTab === 'Semua') return true;
    return it.status === activeTab;
  });

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Memuat daftar barang jualan Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Package className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
              Dashboard Penjual
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Barang Jualan Saya
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Kelola barang preloved, perbarui ketersediaan, atau hapus barang langsung tanpa repot memasukkan PIN.
          </p>
        </div>

        <Link
          to="/jual"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-98 transition-all min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Barang Baru
        </Link>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <p className="font-semibold">{actionSuccess}</p>
        </div>
      )}

      {actionError && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <p className="font-semibold">{actionError}</p>
        </div>
      )}

      {/* Tab Filter */}
      <div className="flex items-center gap-2 mt-8 mb-6 border-b border-slate-200 pb-2">
        {(['Semua', 'Tersedia', 'Terjual'] as const).map((tab) => {
          const count = items.filter((it) => (tab === 'Semua' ? true : it.status === tab)).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl mt-6">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-navy-900">Belum ada barang di tab ini</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {activeTab === 'Semua'
              ? 'Anda belum pernah memposting barang preloved. Mulai jual atau barter barang kampus sekarang!'
              : `Tidak ada barang dengan status "${activeTab}".`}
          </p>
          {activeTab === 'Semua' && (
            <Link
              to="/jual"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Mulai Jual Barang
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSold = item.status === 'Terjual';
            return (
              <div
                key={item.id_barang}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status Badge */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    {item.gambar_url ? (
                      <img
                        src={item.gambar_url.startsWith('http') ? item.gambar_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${item.gambar_url}`}
                        alt={item.nama_barang}
                        className={`w-full h-full object-cover transition-transform hover:scale-105 duration-300 ${isSold ? 'grayscale opacity-75' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full shadow-xs ${
                          isSold
                            ? 'bg-slate-800 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-white/95 backdrop-blur-xs text-navy-800 shadow-xs">
                        {item.jenis_transaksi}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      {item.kategori.nama_kategori} • {item.kondisi}
                    </p>
                    <h3 className="text-base font-bold text-navy-900 line-clamp-2 leading-snug">
                      {item.nama_barang}
                    </h3>

                    <div className="mt-3">
                      {item.jenis_transaksi === 'Jual' ? (
                        <p className="text-lg font-black text-brand-600">
                          {formatRupiah(item.harga)}
                        </p>
                      ) : (
                        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {item.jenis_transaksi === 'Barter' ? 'Siap Barter' : 'Gratis / Hibah'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-5 pt-0 border-t border-slate-100 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors min-h-[44px] ${
                        isSold
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {isSold ? 'Tandai Tersedia' : 'Tandai Terjual'}
                    </button>

                    <Link
                      to={`/jual?edit=${item.id_barang}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors min-h-[44px]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Barang
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to={`/barang/${item.id_barang}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-600 min-h-[36px]"
                    >
                      <span>Lihat Halaman</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 min-h-[36px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;
