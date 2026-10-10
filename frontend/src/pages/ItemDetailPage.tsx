import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Sparkles,
  ShoppingCart,
  BookmarkCheck,
  UserCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { Barang, StatusBarang } from '../types';
import { formatRupiah, formatDate } from '../lib/format';
import { buildWhatsAppLink } from '../lib/whatsapp';
import Badge from '../components/ui/Badge';
import ItemImage from '../components/ui/ItemImage';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import PinVerificationModal, { PinActionType } from '../components/items/PinVerificationModal';
import { useAuth } from '../context/AuthContext';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshCartCount } = useAuth();

  const [item, setItem] = useState<Barang | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Status Keranjang
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [isCartSubmitting, setIsCartSubmitting] = useState<boolean>(false);

  // Pesan Flash dari navigasi sebelumnya (misal baru posting)
  const [flashMessage, setFlashMessage] = useState<string | null>(
    (location.state as { message?: string })?.message || null
  );

  // State Modal Verifikasi PIN (untuk fallback tamu)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<PinActionType>('edit');
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Ambil detail barang
  const fetchItemDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getItemById(id);
      setItem(data);

      // Cek apakah ada di keranjang jika user login
      if (user) {
        try {
          const cart = await api.getCart();
          const exists = cart.items.some((c) => c.id_barang === Number(id));
          setIsInCart(exists);
        } catch {
          // Ignored
        }
      }
    } catch (err: unknown) {
      console.error('Gagal memuat detail barang:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: { message?: string } } } };
        if (axiosError.response?.status === 404) {
          setError('Barang tidak ditemukan atau telah dihapus oleh pemiliknya.');
          return;
        }
      }
      setError('Terjadi kesalahan saat memuat barang. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchItemDetail();
  }, [fetchItemDetail]);

  // Hapus flash message setelah 6 detik
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const isOwner = Boolean(user && item && user.id_pengguna === item.penjual.id_pengguna);

  // Handler Tambah/Hapus Keranjang
  const handleToggleCart = async () => {
    if (!item) return;

    if (!user) {
      navigate('/masuk', { state: { from: location } });
      return;
    }

    try {
      setIsCartSubmitting(true);
      if (isInCart) {
        await api.removeFromCart(item.id_barang);
        setIsInCart(false);
        setFlashMessage(`"${item.nama_barang}" dihapus dari keranjang incaran.`);
      } else {
        await api.addToCart(item.id_barang);
        setIsInCart(true);
        setFlashMessage(`"${item.nama_barang}" berhasil ditambahkan ke keranjang incaran!`);
      }
      await refreshCartCount();
    } catch (err: any) {
      setFlashMessage(err.response?.data?.error?.message || 'Gagal mengubah status keranjang.');
    } finally {
      setIsCartSubmitting(false);
    }
  };

  // Handler Aksi Pemilik Langsung (Tanpa PIN)
  const handleOwnerDirectAction = async (action: 'edit' | 'toggle_status' | 'delete') => {
    if (!item) return;

    if (action === 'edit') {
      navigate(`/jual?edit=${item.id_barang}`);
      return;
    }

    if (action === 'toggle_status') {
      const newStatus: StatusBarang = item.status === 'Tersedia' ? 'Terjual' : 'Tersedia';
      try {
        const formData = new FormData();
        formData.append('status', newStatus);
        const updated = await api.updateItem(item.id_barang, formData);
        setItem(updated);
        setFlashMessage(`Status barang berhasil diubah menjadi ${newStatus}.`);
      } catch (err: any) {
        setFlashMessage(err.response?.data?.error?.message || 'Gagal memperbarui status barang.');
      }
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Yakin ingin menghapus "${item.nama_barang}"? Tindakan ini tidak dapat dibatalkan.`)) {
        return;
      }
      try {
        await api.deleteItem(item.id_barang);
        navigate('/', {
          state: { message: `Barang "${item.nama_barang}" berhasil dihapus dari WarisanKampus.` }
        });
      } catch (err: any) {
        setFlashMessage(err.response?.data?.error?.message || 'Gagal menghapus barang.');
      }
    }
  };

  // Handler Buka Modal PIN (Fallback untuk tamu yang belum login)
  const handleOpenPinModal = (action: PinActionType) => {
    setModalAction(action);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Handler Submit PIN Modal
  const handleSubmitPin = async (pin: string) => {
    if (!item) return;
    setIsModalLoading(true);
    setModalError(null);

    try {
      if (modalAction === 'delete') {
        await api.deleteItem(item.id_barang, pin);
        setIsModalOpen(false);
        navigate('/', {
          state: { message: `Barang "${item.nama_barang}" berhasil dihapus dari WarisanKampus.` }
        });
      } else if (modalAction === 'mark_sold') {
        const formData = new FormData();
        formData.append('pin', pin);
        formData.append('status', 'Terjual');

        const updated = await api.updateItem(item.id_barang, formData);
        setItem(updated);
        setIsModalOpen(false);
        setFlashMessage('Status barang berhasil diperbarui menjadi Sudah Terjual.');
      } else if (modalAction === 'edit') {
        setIsModalOpen(false);
        navigate(`/jual?edit=${item.id_barang}`, {
          state: { pin }
        });
      }
    } catch (err: unknown) {
      console.error('Error aksi dengan PIN:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { status?: number; data?: { error?: { message?: string } } };
        };
        if (axiosError.response?.status === 403) {
          setModalError('PIN keamanan yang Anda masukkan salah. Coba lagi.');
        } else if (axiosError.response?.data?.error?.message) {
          setModalError(axiosError.response.data.error.message);
        } else {
          setModalError('Gagal memproses permintaan. Periksa PIN Anda.');
        }
      } else {
        setModalError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setIsModalLoading(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center flex-1">
        <Spinner size="lg" message="Memuat detail barang dari server..." />
      </div>
    );
  }

  // Error State / Not Found
  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <ErrorMessage
          message={error || 'Barang tidak ditemukan.'}
          onRetry={fetchItemDetail}
        />
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSold = item.status === 'Terjual';
  const whatsappUrl = buildWhatsAppLink(
    item.penjual.no_whatsapp,
    item.nama_barang,
    item.harga,
    item.jenis_transaksi,
    item.penjual.nama_lengkap
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      {/* Flash Notifikasi Sukses */}
      {flashMessage && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Status:</span>
            <span>{flashMessage}</span>
          </div>
        </div>
      )}

      {/* Navigasi Breadcrumb / Kembali */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors min-h-[44px] py-2 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>

        <span className="text-xs font-mono text-slate-400">
          ID #{item.id_barang}
        </span>
      </div>

      {/* Konten Utama 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Kolom Kiri: Foto Barang (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            <ItemImage
              src={item.gambar_url}
              alt={item.nama_barang}
              categoryName={item.kategori.nama_kategori}
              className="w-full h-full object-cover"
            />

            {/* Overlay jika barang sudah terjual */}
            {isSold && (
              <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Sudah Terjual
                </span>
                <p className="text-white/90 text-xs max-w-xs">
                  Barang ini telah berpindah tangan ke mahasiswa lain.
                </p>
              </div>
            )}
          </div>

          {/* Kotak Tip Keamanan COD Mahasiswa */}
          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/60 text-xs text-brand-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Tips Transaksi Aman:</strong> Sepakati lokasi COD yang ramai di lingkungan kampus (seperti kantin, perpustakaan, atau lobi fakultas). Cek kondisi barang sebelum membayar.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Rincian & Aksi (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Barang */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={item.jenis_transaksi} size="md">
                {item.jenis_transaksi}
              </Badge>
              <Badge variant={item.kondisi} size="md">
                Kondisi: {item.kondisi}
              </Badge>
              <Badge variant={item.status} size="md">
                Status: {item.status}
              </Badge>
              {isOwner && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-navy-900 text-white shadow-xs">
                  <UserCheck className="w-3.5 h-3.5" />
                  Barang Milik Anda
                </span>
              )}
            </div>

            {/* Judul Barang */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight leading-snug">
              {item.nama_barang}
            </h1>

            {/* Kampus, Kategori, Tanggal */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 font-semibold text-navy-800">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{item.penjual.universitas.nama_universitas} ({item.penjual.universitas.kota})</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.kategori.nama_kategori}</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Diposting {formatDate(item.created_at)}</span>
              </span>
            </div>

            {/* Harga */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between mt-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {item.jenis_transaksi === 'Jual' ? 'Harga Barang' : 'Model Transaksi'}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                  {item.jenis_transaksi === 'Jual'
                    ? formatRupiah(item.harga)
                    : item.jenis_transaksi === 'Barter'
                    ? 'Siap Barter Barang'
                    : 'Gratis (Hibah Mahasiswa)'}
                </span>
              </div>

              {item.jenis_transaksi === 'Barter' && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg font-medium">
                  Tukar Sesuai Kesepakatan
                </span>
              )}
            </div>

            {/* Deskripsi Lengkap */}
            <div className="pt-3">
              <h2 className="text-sm font-bold text-navy-900 mb-2">Deskripsi Barang</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {item.deskripsi}
              </div>
            </div>
          </div>

          {/* Kotak Kontak Penjual & Aksi Keranjang / WhatsApp */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Kontak & Pemesanan
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                {item.penjual.nama_lengkap.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-navy-900 text-base block truncate">
                  {item.penjual.nama_lengkap}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  Mahasiswa di {item.penjual.universitas.nama_universitas}
                </span>
              </div>
            </div>

            {/* Action Buttons: Chat WhatsApp & Simpan ke Keranjang */}
            <div className="space-y-3 pt-2">
              {isSold ? (
                <div className="p-3.5 rounded-xl bg-slate-100 text-slate-500 text-xs text-center font-medium">
                  Barang sudah terjual. Kontak WhatsApp dinonaktifkan.
                </div>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all min-h-[44px] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                  aria-label={`Hubungi penjual ${item.penjual.nama_lengkap} lewat WhatsApp`}
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Chat Penjual di WhatsApp</span>
                </a>
              )}

              {/* Tombol Simpan ke Keranjang Incaran (Hanya jika bukan pemilik) */}
              {!isOwner && (
                <button
                  type="button"
                  onClick={handleToggleCart}
                  disabled={isCartSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all min-h-[44px] ${
                    isInCart
                      ? 'bg-brand-50 border-brand-300 text-brand-800 hover:bg-brand-100'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-brand-500 hover:text-brand-700'
                  }`}
                >
                  {isInCart ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-brand-600" />
                      <span>Tersimpan di Keranjang Incaran</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-slate-600" />
                      <span>Simpan ke Keranjang Incaran</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bagian Manajemen Pemilik (Direct jika Login, PIN modal jika Tamu) */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isOwner ? 'Kelola Barang Anda (Akun Terverifikasi)' : 'Kelola Iklan Anda (Khusus Pemilik)'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isOwner
                ? 'Anda adalah pemilik barang ini. Anda dapat mengedit, memperbarui ketersediaan, atau menghapusnya secara langsung tanpa perlu PIN.'
                : 'Jika Anda memasang iklan ini sebagai tamu, gunakan PIN keamanan yang dibuat saat memposting untuk mengelola iklan.'}
            </p>

            {isOwner ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOwnerDirectAction('edit')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors min-h-[44px]"
                >
                  <Edit3 className="w-4 h-4 text-brand-600" />
                  <span>Ubah Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOwnerDirectAction('toggle_status')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  <span>{isSold ? 'Tandai Tersedia' : 'Tandai Terjual'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOwnerDirectAction('delete')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors min-h-[44px]"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hapus Iklan</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenPinModal('edit')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  <Edit3 className="w-4 h-4 text-slate-500" />
                  <span>Ubah (PIN)</span>
                </button>

                {!isSold && (
                  <button
                    type="button"
                    onClick={() => handleOpenPinModal('mark_sold')}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Tandai Terjual</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenPinModal('delete')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors min-h-[44px]"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hapus Iklan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Verifikasi PIN (Khusus Tamu) */}
      <PinVerificationModal
        isOpen={isModalOpen}
        actionType={modalAction}
        itemName={item.nama_barang}
        onClose={() => setIsModalOpen(false)}
        onSubmitPin={handleSubmitPin}
        isLoading={isModalLoading}
        errorMessage={modalError}
      />
    </div>
  );
};

export default ItemDetailPage;
