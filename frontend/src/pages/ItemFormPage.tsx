import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
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
import { Universitas, Kategori, JenisTransaksi, KondisiBarang } from '../types';

interface ItemFormInputs {
  nama_barang: string;
  deskripsi: string;
  id_kategori: string;
  kondisi: KondisiBarang;
  jenis_transaksi: JenisTransaksi;
  harga: number;
  nama_lengkap: string;
  email: string;
  no_whatsapp: string;
  id_universitas: string;
  pin: string;
  konfirmasi_pin: string;
}

export const ItemFormPage: React.FC = () => {
  const navigate = useNavigate();

  // Data Referensi
  const [universities, setUniversities] = useState<Universitas[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isLoadingDropdown, setIsLoadingDropdown] = useState<boolean>(true);

  // Status Form & Upload
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
    formState: { errors },
  } = useForm<ItemFormInputs>({
    defaultValues: {
      nama_barang: '',
      deskripsi: '',
      id_kategori: '',
      kondisi: 'Layak Pakai',
      jenis_transaksi: 'Jual',
      harga: 0,
      nama_lengkap: '',
      email: '',
      no_whatsapp: '',
      id_universitas: '',
      pin: '',
      konfirmasi_pin: '',
    },
  });

  const selectedJenisTransaksi = watch('jenis_transaksi');
  const watchPin = watch('pin');

  // Ambil data universitas & kategori saat halaman dimuat
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [univs, cats] = await Promise.all([
          api.getUniversities(),
          api.getCategories(),
        ]);
        if (isMounted) {
          setUniversities(univs);
          setCategories(cats);
        }
      } catch (err) {
        console.error('Gagal memuat universitas & kategori:', err);
      } finally {
        if (isMounted) {
          setIsLoadingDropdown(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efek jika jenis transaksi berubah menjadi Barter atau Hibah, set harga otomatis ke 0
  useEffect(() => {
    if (selectedJenisTransaksi === 'Barter' || selectedJenisTransaksi === 'Hibah') {
      setValue('harga', 0);
    }
  }, [selectedJenisTransaksi, setValue]);

  // Handle pilih file foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSubmitError('Format gambar harus berupa JPG, PNG, atau WebP.');
      return;
    }

    // Validasi ukuran maks 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setSubmitError('Ukuran gambar maksimal adalah 2 MB.');
      return;
    }

    setSubmitError(null);
    setSelectedFile(file);

    // Buat URL pratinjau lokal
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Bersihkan URL pratinjau saat unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemoveImage = () => {
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
  const onSubmit = async (data: ItemFormInputs) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('nama_barang', data.nama_barang);
      formData.append('deskripsi', data.deskripsi);
      formData.append('id_kategori', data.id_kategori);
      formData.append('kondisi', data.kondisi);
      formData.append('jenis_transaksi', data.jenis_transaksi);
      formData.append(
        'harga',
        data.jenis_transaksi === 'Jual' ? String(data.harga) : '0'
      );
      formData.append('nama_lengkap', data.nama_lengkap);
      formData.append('email', data.email);
      formData.append('no_whatsapp', data.no_whatsapp);
      formData.append('id_universitas', data.id_universitas);
      formData.append('pin', data.pin);

      if (selectedFile) {
        formData.append('gambar', selectedFile);
      }

      const createdItem = await api.createItem(formData);

      // Alihkan ke halaman detail barang setelah berhasil dibuat
      navigate(`/barang/${createdItem.id_barang}`, {
        state: { message: 'Iklan barang berhasil diposting di WarisanKampus!' },
      });
    } catch (err: unknown) {
      console.error('Gagal membuat barang:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { error?: { message?: string; details?: Array<{ message: string }> } } };
        };
        const serverError = axiosError.response?.data?.error;
        if (serverError?.details && serverError.details.length > 0) {
          setSubmitError(serverError.details.map((d) => d.message).join(', '));
        } else if (serverError?.message) {
          setSubmitError(serverError.message);
        } else {
          setSubmitError('Gagal memposting barang. Mohon periksa kembali formulir.');
        }
      } else {
        setSubmitError('Terjadi kesalahan jaringan. Pastikan backend server menyala.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
      {/* Navigasi Kembali */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors min-h-[44px] py-2 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      {/* Header Formulir */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
          Formulir Estafet Barang
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Pasang Barang di WarisanKampus
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Teruskan buku kuliah, jas lab, atau perabot kos ke adik tingkat dan teman mahasiswa lainnya.
        </p>
      </div>

      {/* Alert Error Terpusat */}
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

      {/* Kontainer Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
        noValidate
      >
        {/* BAGIAN 1: Foto Barang */}
        <section aria-labelledby="section-foto">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h2 id="section-foto" className="text-base font-bold text-navy-900">
              1. Foto Barang
            </h2>
            <p className="text-xs text-slate-500">
              Format JPG, PNG, atau WebP (maksimal 2 MB).
            </p>
          </div>

          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-w-sm mx-auto aspect-[4/3]">
                <img
                  src={previewUrl}
                  alt="Pratinjau barang yang akan diunggah"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/70 hover:bg-rose-600 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  aria-label="Hapus dan ganti foto"
                  title="Hapus foto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Pilih foto barang dari perangkat"
                className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none bg-slate-50/50 hover:bg-brand-50/20"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-navy-900 mb-1">
                  Klik untuk unggah foto barang
                </p>
                <p className="text-xs text-slate-500">
                  Foto yang jelas membantu barangmu lebih cepat diminati.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              id="gambar"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </section>

        {/* BAGIAN 2: Informasi Barang */}
        <section aria-labelledby="section-info-barang">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h2 id="section-info-barang" className="text-base font-bold text-navy-900">
              2. Informasi Barang
            </h2>
          </div>

          <div className="space-y-5">
            {/* Nama Barang */}
            <div>
              <label htmlFor="nama_barang" className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                id="nama_barang"
                type="text"
                placeholder="Contoh: Kalkulator Casio fx-991EX / Buku Fisika Dasar"
                {...register('nama_barang', {
                  required: 'Nama barang wajib diisi',
                  minLength: { value: 3, message: 'Nama barang minimal 3 karakter' },
                  maxLength: { value: 100, message: 'Nama barang maksimal 100 karakter' },
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
                <label htmlFor="id_kategori" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori <span className="text-rose-500">*</span>
                </label>
                <select
                  id="id_kategori"
                  disabled={isLoadingDropdown}
                  {...register('id_kategori', { required: 'Pilih kategori barang' })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                    errors.id_kategori ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id_kategori} value={String(c.id_kategori)}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
                {errors.id_kategori && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.id_kategori.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="kondisi" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kondisi Barang <span className="text-rose-500">*</span>
                </label>
                <select
                  id="kondisi"
                  {...register('kondisi', { required: 'Pilih kondisi barang' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors"
                >
                  <option value="Sangat Baik">Sangat Baik (Mulus / Seperti Baru)</option>
                  <option value="Layak Pakai">Layak Pakai (Fungsi Normal)</option>
                  <option value="Perlu Perbaikan Sedikit">Perlu Perbaikan Sedikit</option>
                </select>
              </div>
            </div>

            {/* Model Transaksi (Jual / Barter / Hibah) */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-2">
                Jenis Transaksi <span className="text-rose-500">*</span>
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Jual', 'Barter', 'Hibah'] as JenisTransaksi[]).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center px-3 py-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all min-h-[44px] text-center ${
                      selectedJenisTransaksi === type
                        ? 'bg-brand-50 border-brand-500 text-brand-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register('jenis_transaksi')}
                      className="sr-only"
                    />
                    <span>
                      {type === 'Jual'
                        ? 'Jual'
                        : type === 'Barter'
                        ? 'Tukar (Barter)'
                        : 'Gratis (Hibah)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Harga Barang (Hanya aktif jika Jual) */}
            <div>
              <label htmlFor="harga" className="block text-xs font-bold text-slate-700 mb-1.5">
                Harga Barang (Rupiah) {selectedJenisTransaksi === 'Jual' && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-slate-400 pointer-events-none">
                  Rp
                </span>
                <input
                  id="harga"
                  type="number"
                  disabled={selectedJenisTransaksi !== 'Jual'}
                  placeholder="0"
                  min="0"
                  step="1000"
                  {...register('harga', {
                    valueAsNumber: true,
                    validate: (val) => {
                      if (selectedJenisTransaksi === 'Jual' && (isNaN(val) || val <= 0)) {
                        return 'Harga barang untuk jenis transaksi Jual harus lebih dari 0';
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
              {selectedJenisTransaksi !== 'Jual' && (
                <p className="text-slate-500 text-xs mt-1.5">
                  Untuk barter atau hibah, harga otomatis ditetapkan Rp 0.
                </p>
              )}
              {errors.harga && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.harga.message}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="deskripsi" className="block text-xs font-bold text-slate-700 mb-1.5">
                Deskripsi Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="deskripsi"
                rows={4}
                placeholder="Jelaskan kondisi barang, kelengkapan, alasan dijual/dioper, dan lokasi COD kampus..."
                {...register('deskripsi', {
                  required: 'Deskripsi barang wajib diisi',
                  minLength: { value: 10, message: 'Deskripsi minimal 10 karakter' },
                  maxLength: { value: 1000, message: 'Deskripsi maksimal 1000 karakter' },
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

        {/* BAGIAN 3: Informasi Kontak & Kampus */}
        <section aria-labelledby="section-kontak">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h2 id="section-kontak" className="text-base font-bold text-navy-900">
              3. Identitas Penjual & Kampus
            </h2>
            <p className="text-xs text-slate-500">
              Data ini digunakan calon pembeli untuk menghubungi via WhatsApp dan verifikasi lokasi COD.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label htmlFor="nama_lengkap" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="nama_lengkap"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  {...register('nama_lengkap', {
                    required: 'Nama lengkap wajib diisi',
                    minLength: { value: 2, message: 'Nama minimal 2 karakter' },
                  })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                    errors.nama_lengkap ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.nama_lengkap && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.nama_lengkap.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Mahasiswa <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="budi@student.ac.id atau gmail"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format email tidak valid',
                    },
                  })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nomor WhatsApp */}
              <div>
                <label htmlFor="no_whatsapp" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  id="no_whatsapp"
                  type="tel"
                  placeholder="Contoh: 08123456789 atau 628123456789"
                  {...register('no_whatsapp', {
                    required: 'Nomor WhatsApp wajib diisi',
                    minLength: { value: 9, message: 'Nomor WhatsApp minimal 9 digit' },
                    maxLength: { value: 16, message: 'Nomor WhatsApp maksimal 16 digit' },
                  })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                    errors.no_whatsapp ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.no_whatsapp && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.no_whatsapp.message}</p>
                )}
              </div>

              {/* Pilihan Universitas */}
              <div>
                <label htmlFor="id_universitas" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Universitas Anda <span className="text-rose-500">*</span>
                </label>
                <select
                  id="id_universitas"
                  disabled={isLoadingDropdown}
                  {...register('id_universitas', { required: 'Pilih asal universitas Anda' })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                    errors.id_universitas ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                >
                  <option value="">Pilih Kampus Anda</option>
                  {universities.map((u) => (
                    <option key={u.id_universitas} value={String(u.id_universitas)}>
                      {u.nama_universitas} ({u.kota})
                    </option>
                  ))}
                </select>
                {errors.id_universitas && (
                  <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.id_universitas.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BAGIAN 4: PIN Keamanan (Tanpa Login) */}
        <section aria-labelledby="section-keamanan">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h2 id="section-keamanan" className="text-base font-bold text-navy-900">
                4. PIN Keamanan Barang
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Karena platform ini tanpa registrasi akun, PIN angka 4-6 digit ini berfungsi sebagai kunci otorisasi jika Anda ingin mengubah harga atau menghapus barang ini nanti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field PIN */}
            <div>
              <label htmlFor="pin" className="block text-xs font-bold text-slate-700 mb-1.5">
                Buat PIN (4-6 Digit Angka) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  placeholder="Misal: 1234"
                  inputMode="numeric"
                  {...register('pin', {
                    required: 'PIN wajib dibuat untuk otorisasi barang',
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

            {/* Konfirmasi PIN */}
            <div>
              <label htmlFor="konfirmasi_pin" className="block text-xs font-bold text-slate-700 mb-1.5">
                Konfirmasi PIN <span className="text-rose-500">*</span>
              </label>
              <input
                id="konfirmasi_pin"
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                placeholder="Ulangi PIN di atas"
                inputMode="numeric"
                {...register('konfirmasi_pin', {
                  required: 'Konfirmasi PIN wajib diisi',
                  validate: (val) => val === watchPin || 'Konfirmasi PIN tidak cocok dengan PIN di atas',
                })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-wider focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[44px] transition-colors ${
                  errors.konfirmasi_pin ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.konfirmasi_pin && (
                <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.konfirmasi_pin.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Tombol Submit & Aksi */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to="/"
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
                <span>Sedang Memposting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Posting Barang Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemFormPage;
