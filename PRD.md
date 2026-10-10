# PRD — CampusPreloved

Platform preloved & barter barang mahasiswa lintas universitas.
Mata kuliah: Web and Mobile Programming.
Sumber: "Prompt Spesifikasi Teknis CampusPreloved" (Gemini NotebookLM).

---

## 1. Ringkasan

CampusPreloved adalah aplikasi web responsif (mobile-first) sebagai wadah transaksi barang bekas layak pakai (buku kuliah, perabot kos, alat elektronik) atau barter antar mahasiswa dari berbagai universitas. Pengguna dapat memfilter katalog berdasarkan universitas dan kategori, lalu menghubungi penjual langsung lewat WhatsApp.

## 2. Tujuan

- Mempertemukan penjual dan pembeli/penukar barang antar kampus dengan mudah.
- Mengurangi barang terbuang saat pergantian semester atau kelulusan.
- Mendemonstrasikan arsitektur **3-tier**, **RESTful API**, **database relasional**, dan **antarmuka responsif** (kriteria mata kuliah).

## 3. Target Pengguna

Mahasiswa dari berbagai universitas, dalam peran **penjual**, **pembeli**, atau **pihak barter**. Pengunjung dapat menelusuri katalog tanpa mendaftar.

## 4. Ruang Lingkup

### 4.1 MVP (wajib, sesuai spesifikasi)
1. Katalog barang dengan **filter universitas**, **filter kategori**, dan **pencarian nama barang**.
2. Detail barang.
3. Posting barang baru lewat form (nama, deskripsi, harga, kategori, kampus, foto) dengan validasi client dan server.
4. Ubah data/status barang (mis. `Tersedia` → `Terjual`) dan hapus barang.
5. Tombol "Hubungi Penjual via WA" pada kartu dan halaman detail.
6. Daftar universitas dan kategori dari API.
7. 7 endpoint REST sesuai bagian 8.

### 4.2 Penyesuaian kecil atas spesifikasi (mohon dikonfirmasi)
| # | Penyesuaian | Alasan |
|---|---|---|
| A | Tambah kolom `barang.jenis_transaksi` (`Jual` / `Barter` / `Hibah`) | Spesifikasi hanya menyebut "harga 0 jika Hibah/Barter" dan label "Barter/Gratis", tetapi tidak ada kolom untuk membedakannya |
| B | Data penjual dikirim bersama form posting dan backend membuat/memperbarui baris `pengguna` berdasarkan `email` | Spesifikasi tidak memuat login, namun `barang` butuh `id_pengguna` |
| C | Parameter opsional `page` & `limit` pada `GET /api/barang` | Katalog bisa panjang |
| D | Format respons JSON seragam (`data`, `message`, `error`) | Memudahkan frontend |

### 4.3 Opsional (jika waktu cukup)
- Autentikasi (password + JWT) agar hanya pemilik yang bisa mengubah/menghapus barang.
- Barter terstruktur (tabel tawaran), favorit, rating penjual.
- PWA (manifest + service worker), dark mode.
- Admin moderasi.

### 4.4 Di luar lingkup
Pembayaran online, pengiriman/kurir, chat in-app. Transaksi diselesaikan langsung antar pengguna (COD di area kampus).

## 5. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Menampilkan grid katalog berisi kartu barang (foto, badge universitas & kategori, nama, harga atau label Barter/Gratis, tombol WA) | Must |
| FR-02 | Filter katalog berdasarkan universitas, kategori, dan kata kunci; kombinasi filter berlaku bersamaan | Must |
| FR-03 | Filter tersimpan di URL query (`?univ=&kategori=&q=`) | Should |
| FR-04 | Halaman detail barang, termasuk info penjual (nama, universitas) dan 404 jika tidak ada | Must |
| FR-05 | Form posting barang dengan validasi HTML5 + JS sebelum submit | Must |
| FR-06 | Unggah foto (jpg/png/webp, maks. 2 MB) dengan pratinjau | Must |
| FR-07 | Ubah barang dan tandai `Terjual` | Must |
| FR-08 | Hapus barang dengan dialog konfirmasi | Must |
| FR-09 | Link WhatsApp `https://wa.me/<nomor>` dengan nomor dinormalisasi ke format `62…` | Must |
| FR-10 | State loading, kosong, dan error pada setiap halaman data | Must |
| FR-11 | Paginasi katalog | Should |

## 6. Kebutuhan Non-Fungsional

- **Responsif:** mobile-first, diuji pada 360px, 768px, 1280px; tanpa scroll horizontal.
- **Semantic HTML5 & aksesibilitas:** `<header>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<table>` (bila ada data tabular), `<footer>`; label pada input, `alt` pada gambar.
- **SEO dasar:** `<title>` dan meta description per halaman.
- **Keamanan:** query SQL berparameter, validasi input di server, batasi tipe/ukuran unggahan, CORS dibatasi, tidak ada rahasia di repo.
- **Performa:** gambar lazy-load; respons API katalog < 500 ms pada data demo.
- **Bahasa UI:** Bahasa Indonesia.

## 7. Arsitektur & Tech Stack

### 7.1 Arsitektur 3-Tier
```
[ Presentation ]  React SPA (browser)
       │ HTTP/JSON (REST)
[ Application ]   Express API: routes → controllers → services (validasi, logika bisnis)
       │ SQL
[ Data ]          PostgreSQL + folder uploads/ untuk foto
```

### 7.2 Pilihan teknologi
Spesifikasi memberi pilihan; berikut yang dipilih dokumen ini.

| Layer | Spesifikasi | Dipilih | Catatan |
|---|---|---|---|
| Frontend | React/Next.js/Vite + TS, Tailwind | **Vite + React + TypeScript + Tailwind CSS**, React Router | Cocok untuk SPA yang memanggil API terpisah |
| Backend | Express.js atau Laravel | **Node.js + Express + TypeScript** | Satu bahasa dengan frontend. Jika dosen mewajibkan Laravel, endpoint dan skema tetap sama |
| Database | PostgreSQL atau MySQL | **PostgreSQL** | `schema.sql` mudah dialihkan ke MySQL (ENUM) |
| Library | – | `pg`, `zod`, `multer`, `cors`, `helmet`, `dotenv`; frontend: `react-hook-form`, `axios` | – |
| Deployment | Web server + DB | Frontend: Vercel/Netlify · Backend: Render/Railway · DB: Neon/Supabase/Railway | Folder `uploads/` di hosting gratis bersifat sementara; untuk produksi gunakan object storage (opsional) |

## 8. Spesifikasi API (ringkas)

Detail lengkap, contoh request/response ada di `docs/API.md`.

| Method | Endpoint | Sukses | Gagal |
|---|---|---|---|
| GET | `/api/universitas` | 200 | 500 |
| GET | `/api/kategori` | 200 | 500 |
| GET | `/api/barang?id_universitas=&id_kategori=&search=` | 200 | 400 (param tidak valid) |
| GET | `/api/barang/{id}` | 200 | 404 |
| POST | `/api/barang` | 201 | 400 |
| PUT | `/api/barang/{id}` | 200 | 400, 404 |
| DELETE | `/api/barang/{id}` | 204 | 404 |

## 9. Basis Data

Skema DDL lengkap: `database/schema.sql`; data contoh: `database/seed.sql`.

Tabel: `universitas`, `pengguna`, `kategori`, `barang` (kolom dan relasi sesuai spesifikasi, ditambah `jenis_transaksi`).

Relasi: `pengguna.id_universitas → universitas`, `barang.id_pengguna → pengguna`, `barang.id_kategori → kategori`.
Filter universitas pada katalog dilakukan lewat **JOIN** `barang → pengguna → universitas`.

Aturan data:
- `jenis_transaksi = 'Jual'` → `harga > 0`; `Barter`/`Hibah` → `harga = 0` (dijaga dengan CHECK constraint dan validasi server).
- `kondisi` ∈ {`Sangat Baik`, `Layak Pakai`, `Perlu Perbaikan Sedikit`}.
- `status` ∈ {`Tersedia`, `Terjual`}; default `Tersedia`.
- `email` unik; `no_whatsapp` disimpan dalam format `62…`.

## 10. Halaman & UI

Pola **Header–Footer** dengan navigasi atas yang konsisten. Palet: Primary Emerald Green / Navy Blue, Neutral Slate Gray.

| Rute | Isi |
|---|---|
| `/` | Header (logo, tombol "Jual Barang", navigasi), **Hero Filter Bar** (`<select>` Universitas & Kategori + search bar), grid katalog, footer |
| `/barang/:id` | Detail barang, info penjual, tombol WA, aksi ubah/hapus |
| `/jual` | Form posting barang (nama, deskripsi, harga, kategori, kampus, foto, data penjual) |
| `/barang/:id/edit` | Form ubah barang & status |
| `*` | Halaman 404 |

Komponen reusable: `Header`, `Footer`, `FilterBar`, `ItemCard`, `ItemGrid`, `Badge`, `ImageUploader`, `ConfirmDialog`, `EmptyState`, `Spinner`.

## 11. Tahapan Pengembangan (SDLC)

| Tahap | Keluaran di proyek ini |
|---|---|
| Analisis kebutuhan | `PRD.md` |
| Perancangan sistem & DB | `database/schema.sql`, `docs/API.md` |
| Implementasi | `backend/`, `frontend/` |
| Pengujian | Uji validasi form, filter data, responsivitas (Fase 8 di `plan.md`) |
| Deployment & pemeliharaan | Fase 9 di `plan.md`, `README.md` |

## 12. Kriteria Penerimaan

- [ ] `GET /api/barang` dengan kombinasi `id_universitas`, `id_kategori`, `search` mengembalikan data yang benar.
- [ ] `GET /api/barang/{id}` mengembalikan 404 untuk id yang tidak ada.
- [ ] `POST /api/barang` dengan data valid → 201; data tidak valid → 400 dengan rincian error.
- [ ] Katalog menampilkan filter universitas & kategori + pencarian, dan hasilnya berubah sesuai pilihan.
- [ ] Form posting menolak input kosong/tidak valid di client sebelum dikirim.
- [ ] Barang yang diubah menjadi `Terjual` tampil dengan badge/terpisah dari yang `Tersedia`.
- [ ] Tampilan nyaman di 360px dan desktop.
- [ ] Aplikasi ter-deploy dan dapat diakses publik.

## 13. Risiko & Catatan

| Risiko | Mitigasi |
|---|---|
| **Tanpa login**, siapa pun bisa memanggil `PUT`/`DELETE` | Terima untuk MVP tugas (sesuai spesifikasi); dokumentasikan di README; kerjakan autentikasi JWT di Fase 10 bila waktu ada |
| Data penjual tidak terverifikasi | Tampilkan nama & universitas saja; sarankan COD di kampus |
| Upload merusak server | Batasi tipe & ukuran, ganti nama file, simpan di luar `src` |
| Hosting gratis menghapus `uploads/` | Gunakan data seed dengan gambar placeholder untuk demo |
| Spesifikasi dosen berubah | Tinjau bagian 7.2 dan 4.2 sebelum mulai koding |
