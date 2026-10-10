import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, School, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Universitas } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [universitasList, setUniversitasList] = useState<Universitas[]>([]);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    id_universitas: '',
    no_whatsapp: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await api.getUniversities();
        setUniversitasList(data);
      } catch {
        // Fallback error
      }
    };
    loadUniversities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nama_lengkap || !formData.email || !formData.password || !formData.id_universitas || !formData.no_whatsapp) {
      setError('Mohon lengkapi semua bidang yang wajib diisi.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        nama_lengkap: formData.nama_lengkap.trim(),
        email: formData.email.trim(),
        password: formData.password,
        id_universitas: Number(formData.id_universitas),
        no_whatsapp: formData.no_whatsapp.trim()
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Pendaftaran akun gagal. Silakan periksa data Anda.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Katalog
          </Link>

          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Daftar Akun Mahasiswa
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Bergabung dengan ribuan mahasiswa untuk jual, barter, dan hibah barang kampus dengan mudah.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Baris 1: Nama Lengkap */}
          <div>
            <label htmlFor="reg-nama" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Lengkap Mahasiswa *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="reg-nama"
                name="nama_lengkap"
                type="text"
                required
                value={formData.nama_lengkap}
                onChange={handleChange}
                placeholder="Contoh: Muhammad Zidan"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-navy-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Baris 2: Email & Kata Sandi (2 Kolom Sejajar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Kampus / Pribadi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@kampus.ac.id"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-navy-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-navy-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Baris 3: Universitas & WhatsApp (2 Kolom Sejajar Simetris) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-univ" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Universitas / Kampus Asal *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <School className="w-5 h-5" />
                </div>
                <select
                  id="reg-univ"
                  name="id_universitas"
                  required
                  value={formData.id_universitas}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[44px]"
                >
                  <option value="">Pilih universitas...</option>
                  {universitasList.map((u) => (
                    <option key={u.id_universitas} value={u.id_universitas}>
                      {u.nama_universitas} ({u.kota})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reg-wa" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor WhatsApp *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="reg-wa"
                  name="no_whatsapp"
                  type="tel"
                  required
                  value={formData.no_whatsapp}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-navy-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all min-h-[48px] mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mendaftarkan Akun...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Daftar Akun Sekarang
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Sudah memiliki akun?{' '}
            <Link to="/masuk" className="font-bold text-brand-600 hover:text-brand-800 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
