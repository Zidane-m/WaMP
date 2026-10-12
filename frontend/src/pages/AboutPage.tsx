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
  ArrowRight,
  GraduationCap,
  Code2
} from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-navy-900 font-semibold">Tentang WarisanKampus</span>
        </nav>

        {/* Hero Section */}
        <ScrollReveal direction="up" delay={50}>
          <header className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-navy-700">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                Platform Estafet Barang Mahasiswa
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Menghubungkan Mahasiswa, Menghemat Biaya Kuliah.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                WarisanKampus adalah platform sirkular terpadu yang memfasilitasi mahasiswa di seluruh Indonesia untuk menjual barang bekas layak pakai, tukar tambah barang, hingga membagikan hibah cuma-cuma demi mendukung adik tingkat dan sesama anak kos.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"
            />
          </header>
        </ScrollReveal>

        {/* Latar Belakang & Misi */}
        <ScrollReveal direction="up">
          <section aria-labelledby="latar-belakang-heading" className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 id="latar-belakang-heading" className="text-xl sm:text-2xl font-extrabold text-navy-900">
                  Latar Belakang & Budaya Warisan Kating
                </h2>
                <p className="text-xs text-slate-500">Filosofi di balik lahirnya WarisanKampus</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Kehidupan perkuliahan menuntut berbagai perlengkapan yang sering kali hanya digunakan selama 1 atau 2 semester, mulai dari buku teks referensi tebal, kalkulator saintifik, perlengkapan gambar teknik, jas laboratorium, hingga perabot kamar kos. Ketika masa studi selesai atau mahasiswa berpindah kos, barang-barang berharga ini kerap menumpuk tanpa guna.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Di sisi lain, mahasiswa baru dan adik tingkat sering kesulitan menanggung biaya pembelian barang-barang baru yang harganya relatif tinggi. Melalui konsep <strong>Warisan Kating</strong> yang dikemas secara digital, platform ini menjembatani perputaran barang agar terus bermanfaat, menghemat anggaran bulanan mahasiswa, dan mengurangi limbah barang di lingkungan kampus.
            </p>
          </section>
        </ScrollReveal>

        {/* 3 Model Transaksi Ramah Mahasiswa */}
        <section aria-labelledby="model-transaksi-heading" className="space-y-6">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 id="model-transaksi-heading" className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Tiga Model Transaksi Tanpa Ribet
              </h2>
              <p className="text-sm text-slate-600">
                Fleksibilitas transaksi yang disesuaikan dengan kebutuhan kantong anak kos.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jual Preloved */}
            <ScrollReveal delay={100} className="h-full">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">Jual Preloved</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Jual barang layak pakai dengan harga terjangkau khusus mahasiswa. Pemilik mendapat tambahan uang saku, pembeli berhemat hingga puluhan persen dibandingkan barang baru di toko.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Harga Mahasiswa
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Barter Setara */}
            <ScrollReveal delay={200} className="h-full">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">Tukar Tambah (Barter)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Solusi tanpa uang tunai. Tukarkan barang yang sudah tidak Anda gunakan (seperti keyboard, buku referensi, atau pakaian) dengan perlengkapan lain yang sedang Anda butuhkan.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Tanpa Uang Tunai (Rp 0)
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Hibah Gratis */}
            <ScrollReveal delay={300} className="h-full">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">Hibah Gratis</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bagikan barang cuma-cuma untuk adik tingkat yang membutuhkan. Estafetkan modul praktikum, catatan kuliah, atau gantungan baju tanpa memungut biaya sepeser pun.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                    100% Cuma-Cuma
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Alur Cara Kerja */}
        <ScrollReveal direction="up">
          <section aria-labelledby="cara-kerja-heading" className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 id="cara-kerja-heading" className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Cara Kerja Platform
              </h2>
              <p className="text-sm text-slate-600">
                Transaksi langsung yang praktis dalam 3 langkah mudah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  1
                </div>
                <h3 className="text-base font-bold text-navy-900">Pilih Kampus & Cari Barang</h3>
                <p className="text-sm text-slate-600">
                  Filter katalog berdasarkan 40 perguruan tinggi terkemuka dan kategori barang untuk menemukan penjual terdekat di kampus Anda.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  2
                </div>
                <h3 className="text-base font-bold text-navy-900">Chat Langsung via WhatsApp</h3>
                <p className="text-sm text-slate-600">
                  Klik tombol WhatsApp pada halaman barang. Pesan sopan otomatis terisi lengkap dengan nama barang dan ajakan bertransaksi.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  3
                </div>
                <h3 className="text-base font-bold text-navy-900">Ketemuan & COD di Kampus</h3>
                <p className="text-sm text-slate-600">
                  Sepakati lokasi di lingkungan kampus untuk memeriksa kondisi fisik barang secara langsung sebelum serah terima dilakukan.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Panduan Keamanan COD (Safety Guidelines) */}
        <ScrollReveal direction="up">
          <section aria-labelledby="panduan-keamanan-heading" className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 text-amber-900">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h2 id="panduan-keamanan-heading" className="text-xl sm:text-2xl font-extrabold text-amber-950">
                  Panduan Keamanan Transaksi (Safety Guidelines)
                </h2>
                <p className="text-xs text-amber-800">
                  Langkah bijak agar pengalaman bertransaksi mahasiswa tetap aman dan nyaman.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  COD di Tempat Publik Kampus
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilihlah tempat yang ramai dan terang seperti perpustakaan pusat, kantin fakultas, gazebo, atau selasar gedung kuliah.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Periksa Kondisi Fisik Barang
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cek fungsi alat elektronik, kelengkapan halaman buku, atau ukuran pakaian secara langsung sebelum melakukan pembayaran.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Hindari Pembayaran Uang Muka (DP)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jangan pernah mentransfer uang muka atau tanda jadi sebelum bertemu dan memegang fisik barang secara nyata.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Verifikasi Identitas Mahasiswa
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gunakan email kampus resmi saat mendaftar akun agar rekan mahasiswa lain merasa tenang saat bertransaksi dengan Anda.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Profil Akademik & Pengembang */}
        <ScrollReveal direction="up">
          <section aria-labelledby="informasi-akademik-heading" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 id="informasi-akademik-heading" className="text-xl font-extrabold text-navy-900">
                  Informasi Proyek Akademik
                </h2>
                <p className="text-xs text-slate-500">Tugas Akhir Mata Kuliah Web and Mobile Programming (WaMP)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pengembang</p>
                <p className="font-bold text-navy-900 text-base mt-0.5">Muhammad Zidan Mirza Fedrieka</p>
                <p className="text-xs text-slate-500 mt-1">Mahasiswa Ilmu Komputer Universitas Pendidikan Indonesia</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mata Kuliah</p>
                <p className="font-bold text-navy-900 text-base mt-0.5">Web and Mobile Programming (WaMP)</p>
                <p className="text-xs text-slate-500 mt-1">Semester 3 — Proyek Akhir Full-Stack Web</p>
              </div>

              <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Teknologi yang Digunakan</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">React 19</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">TypeScript (Strict)</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Vite</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Tailwind CSS</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Node.js Express</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">MySQL Laragon (InnoDB)</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">Zod Schema</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">JWT Auth</span>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal direction="up">
          <section aria-labelledby="cta-heading" className="text-center bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-6">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-black">
                Siap Menemukan atau Mengestafetkan Barang?
              </h2>
              <p className="text-brand-100 text-sm sm:text-base">
                Mulai jelajahi katalog perlengkapan kuliah di kampus Anda atau iklankan barang yang sudah selesai Anda gunakan sekarang juga.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                Jelajahi Katalog Barang
              </Link>
              <Link
                to="/jual"
                className="inline-flex items-center gap-2 bg-brand-800/60 hover:bg-brand-800 text-white border border-brand-400/40 px-6 py-3 rounded-xl font-bold text-sm transition-all min-h-[44px]"
              >
                Pasang Iklan Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AboutPage;
