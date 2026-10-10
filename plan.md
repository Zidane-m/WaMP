# plan.md — Rencana Implementasi CampusPreloved

Kerjakan **berurutan**. Selesaikan dan uji satu fase sebelum lanjut, lalu centang itemnya.
Acuan: `PRD.md` (kebutuhan), `docs/API.md` (kontrak API), `database/schema.sql` (skema), `AGENTS.md` (aturan koding).

## Struktur Repo (monorepo)
```
campuspreloved/
├─ backend/        # Express + TypeScript
├─ frontend/       # Vite + React + TypeScript + Tailwind
├─ database/       # schema.sql, seed.sql
├─ docs/           # API.md
├─ PRD.md  plan.md  AGENTS.md  README.md
```

---

## Fase 0 — Setup Proyek
- [x] Buat folder repo, `git init`, `.gitignore` (node_modules, .env, uploads/, dist)
- [x] Pindahkan `database/` dan `docs/` ke repo
- [x] `backend/`: `npm init`, pasang `express mysql2 zod multer bcryptjs cors helmet dotenv` + dev: `typescript tsx @types/*`
- [x] `frontend/`: pasang React Vite TS, `tailwindcss react-router-dom axios react-hook-form lucide-react`
- [x] Salin `.env.example` → `.env` di backend & frontend
- [x] Commit pertama

**Selesai bila:** `npm run dev` jalan di kedua folder.

## Fase 1 — Database
- [x] Buat database MySQL `campuspreloved` di Laragon
- [x] Jalankan `database/schema.sql` (skema MySQL InnoDB + pin_keamanan)
- [x] Jalankan `database/seed.sql` (8 univ, 6 kategori, 6 penjual, 8 barang sampel)
- [x] Verifikasi dengan query JOIN: barang + penjual + universitas + kategori

**Selesai bila:** query JOIN mengembalikan data contoh dengan benar.

## Fase 2 — Backend Dasar
- [x] Struktur `src/`: `config/`, `db/`, `routes/`, `controllers/`, `services/`, `middleware/`, `validations/`
- [x] Koneksi pool MySQL Laragon + cek koneksi saat start server
- [x] Middleware: `helmet`, `cors` (origin dari env), `express.json`, error handler global, 404 handler
- [x] `GET /api/universitas` dan `GET /api/kategori`
- [x] Endpoint `GET /api/health`

**Selesai bila:** kedua endpoint referensi mengembalikan 200 dan data seed.

## Fase 3 — Backend: Endpoint Barang
- [x] Skema Zod: query filter, body POST, body PUT (+ verifikasi PIN)
- [x] `GET /api/barang` — JOIN, filter `id_universitas`, `id_kategori`, `search` (LIKE, berparameter), `page`, `limit`, urut terbaru
- [x] `GET /api/barang/:id` — 404 bila tidak ada
- [x] Middleware `multer`: field `gambar`, jpg/png/webp, ≤ 2 MB, nama file acak, serve statis `/uploads`
- [x] `POST /api/barang` — validasi, upsert `pengguna` by email, simpan barang, 201
- [x] `PUT /api/barang/:id` — update parsial, 200 / 404 / 403 / 400 (+ verifikasi PIN)
- [x] `DELETE /api/barang/:id` — hapus (dan file gambarnya), 204 / 404 / 403 (+ verifikasi PIN)
- [x] Aturan: `Jual` ⇒ harga > 0, `Barter`/`Hibah` ⇒ harga = 0
- [x] Uji semua endpoint dengan Postman/Thunder Client/curl; simpan koleksi di `docs/`

**Selesai bila:** semua status code di `docs/API.md` terbukti lewat pengujian.

## Fase 4 — Frontend: Fondasi & Layout
- [x] Konfigurasi Tailwind (warna Emerald/Navy/Slate), font, base style
- [x] `lib/api.ts` (axios, base URL dari env) + tipe TypeScript dari API
- [x] Router: `/`, `/barang/:id`, `/jual`, `/barang/:id/edit`, `*`
- [x] `Header` (logo, tombol "Jual Barang", navigasi), `Footer`, layout dengan `<main>`
- [x] Komponen dasar: `Badge`, `Spinner`, `EmptyState`, `ErrorMessage`

**Selesai bila:** navigasi antar halaman kosong berjalan dan layout rapi di 360px & 1280px.

## Fase 5 — Frontend: Katalog + Filter
- [x] `FilterBar`: `<select>` Universitas, `<select>` Kategori (dari API), input pencarian (debounce)
- [x] `ItemCard`: foto (lazy), badge universitas & kategori, nama, harga/label Barter/Gratis, tombol WA
- [x] `ItemGrid` responsif (1 / 2 / 3–4 kolom)
- [x] Hubungkan filter ke URL query dan ke `GET /api/barang`
- [x] State loading / kosong / error; paginasi atau "muat lebih banyak"
- [x] Fungsi helper `buildWhatsAppLink(no, namaBarang)`

**Selesai bila:** mengubah universitas/kategori/kata kunci memperbarui grid dengan benar, dan refresh halaman mempertahankan filter.

## Fase 6 — Frontend: Form Posting
- [x] Form `<form>` semantik: nama, deskripsi, jenis transaksi, harga (nonaktif jika Barter/Hibah), kondisi, kategori, kampus, foto, data penjual (nama, email, WA), PIN keamanan
- [x] Validasi HTML5 + JS (react-hook-form): wajib isi, panjang, format email & nomor WA, harga ≥ 0, ukuran/tipe foto
- [x] Pratinjau foto, kirim `multipart/form-data`
- [x] Tampilkan error server (400) per field; setelah sukses arahkan ke detail barang

**Selesai bila:** barang baru muncul di katalog, dan input tidak valid tertahan di client.

## Fase 7 — Frontend: Detail, Ubah, Hapus
- [x] Halaman detail: foto, info lengkap, penjual, tombol WA, badge status
- [x] Halaman ubah (form prefilled), tombol "Tandai Terjual"
- [x] Hapus dengan `ConfirmDialog` / `PinVerificationModal`
- [x] Penanganan 404 (barang tidak ada)
- [x] Barang `Terjual` ditampilkan berbeda (badge, tombol WA nonaktif)

**Selesai bila:** siklus buat → lihat → ubah → tandai terjual → hapus berjalan.

## Fase 8 — Pengujian
- [x] API: tabel kasus uji (200/201/204/400/403/404) lolos (16/16 lulus di backend/src/test_api.ts)
- [x] Filter: kombinasi universitas × kategori × kata kunci menghasilkan data benar (cek dengan query SQL di backend/src/test_fase8.ts)
- [x] Validasi form: kosong, email salah, harga negatif, file bukan gambar, file > 2 MB, PIN
- [x] Responsivitas: 360px, 768px, 1280px; tidak ada scroll horizontal
- [x] Aksesibilitas: label form, alt gambar, urutan heading, navigasi keyboard
- [x] Audit Lighthouse & kepatuhan antislop (tap target ≥ 44px, kontras tinggi, bebas em dash)
- [x] Perbaiki bug yang ditemukan (dokumen docs/TEST_REPORT.md dibuat)

## Fase 9 — Deployment & Dokumentasi
- [ ] Deploy database (Neon/Railway/Supabase) dan jalankan `schema.sql` + `seed.sql`
- [ ] Deploy backend (Render/Railway); set env: `DATABASE_URL`, `CORS_ORIGIN`, `PORT`
- [ ] Deploy frontend (Vercel/Netlify); set `VITE_API_URL`
- [ ] Uji end-to-end di URL produksi
- [ ] `README.md`: deskripsi, fitur, tech stack, cara menjalankan lokal, URL demo, screenshot, batasan (tanpa login)
- [ ] Siapkan data demo dan bahan presentasi (diagram 3-tier, ERD, demo alur)

## Fase 10 — Opsional (setelah Fase 0–9 selesai)
- [ ] Autentikasi: kolom `password_hash`, `POST /api/auth/daftar|masuk`, JWT, batasi `PUT/DELETE` ke pemilik
- [ ] PWA (manifest + service worker)
- [ ] Favorit, rating, barter terstruktur
- [ ] Simpan foto di object storage (Supabase Storage / Cloudinary)

---

## Urutan Prioritas Jika Waktu Mepet
1. Fase 0–3 (database + API)
2. Fase 4–5 (katalog + filter universitas) — inti penilaian
3. Fase 6 (posting) lalu Fase 7 (detail/ubah/hapus)
4. Fase 8–9 (uji, deploy, README)
5. Fase 10 hanya jika ada waktu
