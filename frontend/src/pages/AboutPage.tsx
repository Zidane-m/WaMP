import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Repeat,
  Gift,
  Coins,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Code2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-navy-900 font-semibold">Tentang WarisanKampus</span>
        </nav>

        {/* Header Pengenalan */}
        <header className="bg-navy-900 text-white rounded-2xl p-8 sm:p-12 border border-navy-800">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
              Menghubungkan Mahasiswa, Menghemat Biaya Kuliah
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              WarisanKampus adalah platform sirkular mahasiswa untuk jual-beli barang bekas layak pakai, tukar tambah (barter), dan hibah perlengkapan kuliah antar rekan satu kampus maupun lintas universitas.
            </p>
          </div>
        </header>

        {/* Latar Belakang */}
        <section aria-labelledby="latar-belakang-heading" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 id="latar-belakang-heading" className="text-lg sm:text-xl font-bold text-navy-900">
                Latar Belakang dan Budaya Warisan Kating
              </h2>
              <p className="text-xs text-slate-500">Tujuan dan konteks kebutuhan mahasiswa</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Perlengkapan kuliah seperti buku referensi semester awal, kalkulator saintifik, modul praktikum, jas lab, hingga perabot kos sering kali hanya dipakai beberapa bulan. Saat mahasiswa lulus atau pindah kos, barang-barang tersebut kerap menumpuk di gudang atau terbuang sia-sia.
          </p>

          <p className="text-sm text-slate-700 leading-relaxed">
            Sementara itu, mahasiswa baru membutuhkan perlengkapan tersebut namun terbebani oleh harga barang baru yang cukup mahal. WarisanKampus memformalkan tradisi estafet perlengkapan kuliah ini agar barang tetap terpakai, biaya kuliah lebih hemat, dan sampah lingkungan berkurang.
          </p>
        </section>

        {/* Model Transaksi */}
        <section aria-labelledby="model-transaksi-heading" className="space-y-4">
          <div>
            <h2 id="model-transaksi-heading" className="text-lg sm:text-xl font-bold text-navy-900">
              Pilihan Transaksi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tersedia tiga skema kepemilikan sesuai kesepakatan antar mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900">Jual Preloved</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Penjual menetapkan harga terjangkau untuk mahasiswa. Cocok untuk buku teks tebal, peralatan elektronik, dan furnitur kos.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Harga Mahasiswa
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900">Tukar Tambah (Barter)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pertukaran barang setara tanpa uang tunai. Misalnya menukar buku mata kuliah semester lalu dengan buku semester berjalan.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Tanpa Tunai (Rp 0)
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900">Hibah Gratis</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pemberian sukarela untuk adik tingkat atau mahasiswa yang membutuhkan tanpa biaya apapun.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                  Cuma-Cuma (Hibah)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Alur Transaksi */}
        <section aria-labelledby="cara-kerja-heading" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div>
            <h2 id="cara-kerja-heading" className="text-lg sm:text-xl font-bold text-navy-900">
              Alur Transaksi COD di Kampus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mekanisme transaksi langsung antar pengguna di lingkungan universitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-navy-900">1. Temukan Barang di Kampus Terdekat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gunakan filter universitas dan kategori untuk mencari barang yang dijual atau dihibahkan oleh mahasiswa satu kampus.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-navy-900">2. Hubungi Penjual via WhatsApp</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gunakan tautan WhatsApp yang tersedia di halaman detail untuk menyepakati harga, barter, atau waktu pertemuan.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-navy-900">3. Ketemuan dan Periksa Fisik Barang</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bertemu di lokasi umum kampus untuk memastikan kondisi barang sesuai sebelum melakukan pembayaran atau serah terima.
              </p>
            </div>
          </div>
        </section>

        {/* Panduan Keamanan */}
        <section aria-labelledby="panduan-keamanan-heading" className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-amber-900">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 id="panduan-keamanan-heading" className="text-lg sm:text-xl font-bold text-amber-950">
                Panduan Keamanan Transaksi
              </h2>
              <p className="text-xs text-amber-800">
                Hal yang perlu diperhatikan saat bertransaksi secara mandiri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pilih Lokasi Publik di Kampus</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih tempat yang ramai dan terang seperti perpustakaan, lobi fakultas, kantin, atau gazebo kampus.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Periksa Fisik Barang Secara Menyeluruh</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pastikan fungsi peralatan elektronik, kelengkapan lembar buku, atau kebersihan perlengkapan sebelum membayar.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hindari Pembayaran Uang Muka (DP)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jangan mentransfer uang tanda jadi sebelum melihat dan memegang langsung fisik barang di tempat pertemuan.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gunakan Identitas Mahasiswa yang Jelas</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Daftarkan akun dengan email kampus atau nama asli agar transaksi antar mahasiswa saling terpercaya.
              </p>
            </div>
          </div>
        </section>

        {/* Informasi Akademik */}
        <section aria-labelledby="informasi-akademik-heading" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="informasi-akademik-heading" className="text-lg font-bold text-navy-900">
                Informasi Proyek Akademik
              </h2>
              <p className="text-xs text-slate-500">Tugas Akhir Mata Kuliah Web and Mobile Programming (WaMP)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-medium">Pengembang</p>
              <p className="font-bold text-navy-900 text-base mt-0.5">Muhammad Zidan Mirza Fedrieka</p>
              <p className="text-xs text-slate-500 mt-1">Mahasiswa Ilmu Komputer Universitas Pendidikan Indonesia</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Mata Kuliah</p>
              <p className="font-bold text-navy-900 text-base mt-0.5">Web and Mobile Programming (WaMP)</p>
              <p className="text-xs text-slate-500 mt-1">Semester 3, Proyek Akhir Full-Stack Web</p>
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium mb-1.5">Teknologi yang Digunakan</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">React 19</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">TypeScript</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Vite</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Tailwind CSS</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Node.js Express</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">PostgreSQL</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Zod</span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">JWT Auth</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Sederhana & Fungsional */}
        <section aria-labelledby="cta-heading" className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 space-y-4 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 id="cta-heading" className="text-xl sm:text-2xl font-bold">
              Mulai Cari atau Iklankan Barang
            </h2>
            <p className="text-slate-300 text-sm">
              Temukan perlengkapan kuliah bekas di kampus Anda atau iklankan barang yang sudah tidak terpakai.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buka Katalog Barang</span>
            </Link>
            <Link
              to="/jual"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors min-h-[44px]"
            >
              <span>Pasang Iklan Barang</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
