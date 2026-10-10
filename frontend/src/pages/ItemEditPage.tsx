import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  UploadCloud,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../lib/api';
import { Barang, Kategori, JenisTransaksi, KondisiBarang, StatusBarang } from '../types';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ItemImage from '../components/ui/ItemImage';

interface ItemEditInputs {
  nama_barang: string;
  deskripsi: string;
  id_kategori: string;
  kondisi: KondisiBarang;
  jenis_transaksi: JenisTransaksi;
  harga: number;
  status: StatusBarang;
  pin: string;
}

export const ItemEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil PIN dari state jika sebelumnya sudah dimasukkan di modal
  const initialPin = (location.state as { pin?: string })?.pin || '';

  const [item, setItem] = useState<Barang | null>(null);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ItemEditInputs>({
    defaultValues: {
      nama_barang: '',
      deskripsi: '',
      id_kategori: '',
      kondisi: 'Layak Pakai',
      jenis_transaksi: 'Jual',
      harga: 0,
      status: 'Tersedia',
      pin: initialPin,
    },
  });

  const selectedJenisTransaksi = watch('jenis_transaksi');

  // Ambil data barang dan kategori
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const loadItemAndCategories = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [itemData, catData] = await Promise.all([
          api.getItemById(id),
          api.getCategories(),
        ]);

        if (isMounted) {
          setItem(itemData);
          setCategories(catData);

          // Isi nilai form dengan data yang sudah ada
          reset({
            nama_barang: itemData.nama_barang,
            deskripsi: itemData.deskripsi,
            id_kategori: String(itemData.kategori.id_kategori),
            kondisi: itemData.kondisi,
            jenis_transaksi: itemData.jenis_transaksi,
            harga: itemData.harga,
            status: itemData.status,
            pin: initialPin,
          });
        }
      } catch (err: unknown) {
        console.error('Gagal memuat barang untuk diedit:', err);
        if (isMounted) {
          setLoadError('Gagal memuat barang. Pastikan ID barang valid dan server menyala.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItemAndCategories();

    return () => {
      isMounted = false;
    };
  }, [id, initialPin, reset]);

  // Efek jika jenis transaksi diubah ke Barter atau Hibah, harga otomatis 0
  useEffect(() => {
    if (selectedJenisTransaksi === 'Barter' || selectedJenisTransaksi === 'Hibah') {
      setValue('harga', 0);
    }
  }, [selectedJenisTransaksi, setValue]);

  // Handle pilih file foto baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSubmitError('Format gambar harus berupa JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSubmitError('Ukuran gambar maksimal adalah 2 MB.');
      return;
    }

    setSubmitError(null);
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemoveNewImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const onSubmit = async (data: ItemEditInputs) => {
    if (!id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('pin', data.pin);
      formData.append('nama_barang', data.nama_barang);
      formData.append('deskripsi', data.deskripsi);
      formData.append('id_kategori', data.id_kategori);
      formData.append('kondisi', data.kondisi);
      formData.append('jenis_transaksi', data.jenis_transaksi);
      formData.append(
        'harga',
        data.jenis_transaksi === 'Jual' ? String(data.harga) : '0'
      );
      formData.append('status', data.status);

      if (selectedFile) {
        formData.append('gambar', selectedFile);
      }

      await api.updateItem(id, formData);

      // Berhasil update, alihkan kembali ke halaman detail
      navigate(`/barang/${id}`, {
        state: { message: 'Data barang berhasil diperbarui!' },
      });
    } catch (err: unknown) {
      console.error('Gagal memperbarui barang:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { status?: number; data?: { error?: { message?: string; details?: Array<{ message: string }> } } };
        };
        if (axiosError.response?.status === 403) {
          setSubmitError('PIN keamanan salah! Masukkan PIN yang Anda buat saat memposting barang ini.');
        } else {
          const serverError = axiosError.response?.data?.error;
          if (serverError?.details && serverError.details.length > 0) {
            setSubmitError(serverError.details.map((d) => d.message).join(', '));
          } else if (serverError?.message) {
            setSubmitError(serverError.message);
          } else {
            setSubmitError('Gagal memperbarui barang. Periksa kembali isian formulir.');
          }
        }
      } else {
        setSubmitError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // State Loading
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center flex-1">
        <Spinner size="lg" message="Memuat data barang untuk diedit..." />
      </div>
    );
  }

  // State Error
  if (loadError || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <ErrorMessage
          message={loadError || 'Barang tidak ditemukan.'}
          onRetry={() => window.location.reload()}
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      {/* Tombol Kembali */}
      <div className="mb-6">
        <Link
          to={`/barang/${item.id_barang}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors min-h-[44px] py-2 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Barang</span>
        </Link>
      </div>

      {/* Header Halaman Edit */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
          Perbarui Iklan Barang
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Ubah Data Barang #{item.id_barang}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Ubah rincian barang, harga, status ketersediaan, atau perbarui foto.
        </p>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Ada masalah pada formulir:</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* Formulir Edit */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
        noValidate
      >
        {/* BAGIAN 1: Status Ketersediaan */}
        <section aria-labelledby="section-status">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 id="section-status" className="text-base font-bold text-navy-900">
              1. Status Ketersediaan
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['Tersedia', 'Terjual'] as StatusBarang[]).map((st) => (
              <label
                key={st}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-bold cursor-pointer transition-all min-h-[44px] ${
                  watch('status') === st
                    ? st === 'Tersedia'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  value={st}
                  {...register('status')}
                  className="sr-only"
                />
                <CheckCircle2 className="w-4 h-4" />
                <span>{st === 'Tersedia' ? 'Masih Tersedia' : 'Sudah Terjual'}</span>
              </label>
            ))}
          </div>
        </section>

        {/* BAGIAN 2: Foto Barang */}
        <section aria-labelledby="section-foto-edit">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 id="section-foto-edit" className="text-base font-bold text-navy-900">
              2. Foto Barang
            </h2>
            <p className="text-xs text-slate-500">
              Biarkan kosong jika tetap ingin menggunakan foto yang sudah ada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Foto Saat Ini */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-2">
                Foto Saat Ini:
              </span>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <ItemImage
                  src={item.gambar_url}
                  alt={item.nama_barang}
                  categoryName={item.kategori.nama_kategori}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Foto Baru (Jika Diunggah) */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-2">
                Foto Baru (Opsional):
              </span>
              {previewUrl ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-brand-300 bg-brand-50/20">
                  <img
                    src={previewUrl}
                    alt="Pratinjau foto baru"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveNewImage}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/70 hover:bg-rose-600 text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors shadow-md"
                    title="Batalkan foto baru"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[4/3] border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-brand-50/20"
                >
                  <UploadCloud className="w-6 h-6 text-brand-600 mb-2" />
                  <span className="text-xs font-bold text-navy-900 block mb-0.5">
                    Ganti Foto Baru
                  </span>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WebP (maks 2 MB)
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                id="edit-gambar"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </div>
        </section>

        {/* BAGIAN 3: Informasi Barang */}
        <section aria-labelledby="section-info-edit">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h2 id="section-info-edit" className="text-base font-bold text-navy-900">
              3. Rincian Informasi Barang
            </h2>
          </div>

          <div className="space-y-4">
            {/* Nama Barang */}
            <div>
              <label htmlFor="edit_nama_barang" className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit_nama_barang"
                type="text"
                {...register('nama_barang', {
                  required: 'Nama barang wajib diisi',
                  minLength: { value: 3, message: 'Minimal 3 karakter' },
                  maxLength: { value: 100, message: 'Maksimal 100 karakter' },
                })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                  errors.nama_barang ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.nama_barang && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.nama_barang.message}</p>
              )}
            </div>

            {/* Kategori & Kondisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit_id_kategori" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  id="edit_id_kategori"
                  {...register('id_kategori', { required: 'Pilih kategori barang' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id_kategori} value={String(c.id_kategori)}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit_kondisi" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kondisi Barang <span className="text-rose-500">*</span>
                </label>
                <select
                  id="edit_kondisi"
                  {...register('kondisi', { required: 'Pilih kondisi' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors"
                >
                  <option value="Sangat Baik">Sangat Baik (Mulus / Seperti Baru)</option>
                  <option value="Layak Pakai">Layak Pakai (Fungsi Normal)</option>
                  <option value="Perlu Perbaikan Sedikit">Perlu Perbaikan Sedikit</option>
                </select>
              </div>
            </div>

            {/* Jenis Transaksi & Harga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit_jenis_transaksi" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenis Transaksi <span className="text-rose-500">*</span>
                </label>
                <select
                  id="edit_jenis_transaksi"
                  {...register('jenis_transaksi', { required: 'Pilih jenis transaksi' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors"
                >
                  <option value="Jual">Jual</option>
                  <option value="Barter">Barter (Tukar Tambah)</option>
                  <option value="Hibah">Hibah (Gratis)</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit_harga" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Harga (Rupiah) {selectedJenisTransaksi === 'Jual' && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-slate-400 pointer-events-none">
                    Rp
                  </span>
                  <input
                    id="edit_harga"
                    type="number"
                    disabled={selectedJenisTransaksi !== 'Jual'}
                    min="0"
                    step="1000"
                    {...register('harga', {
                      valueAsNumber: true,
                      validate: (val) => {
                        if (selectedJenisTransaksi === 'Jual' && (isNaN(val) || val <= 0)) {
                          return 'Harga untuk jenis Jual harus lebih dari 0';
                        }
                        return true;
                      },
                    })}
                    className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                      selectedJenisTransaksi !== 'Jual'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                        : errors.harga
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.harga && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.harga.message}</p>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="edit_deskripsi" className="block text-xs font-bold text-slate-700 mb-1.5">
                Deskripsi Barang <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="edit_deskripsi"
                rows={4}
                {...register('deskripsi', {
                  required: 'Deskripsi wajib diisi',
                  minLength: { value: 10, message: 'Minimal 10 karakter' },
                  maxLength: { value: 1000, message: 'Maksimal 1000 karakter' },
                })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors ${
                  errors.deskripsi ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.deskripsi && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.deskripsi.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* BAGIAN 4: Verifikasi PIN Keamanan */}
        <section aria-labelledby="section-pin-auth">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h2 id="section-pin-auth" className="text-base font-bold text-navy-900">
                4. Otorisasi PIN Keamanan
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan PIN angka yang Anda gunakan saat memposting barang ini untuk mengesahkan perubahan.
            </p>
          </div>

          <div className="max-w-xs">
            <label htmlFor="edit_pin" className="block text-xs font-bold text-slate-700 mb-1.5">
              PIN Keamanan Anda <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="edit_pin"
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                inputMode="numeric"
                placeholder="4-6 digit angka"
                {...register('pin', {
                  required: 'PIN keamanan wajib disertakan untuk menyimpan perubahan',
                  pattern: {
                    value: /^\d{4,6}$/,
                    message: 'PIN harus berupa 4 hingga 6 digit angka',
                  },
                })}
                className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm font-mono tracking-wider focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                  errors.pin ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center"
                aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.pin && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.pin.message}</p>
            )}
          </div>
        </section>

        {/* Tombol Aksi */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to={`/barang/${item.id_barang}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px]"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemEditPage;
