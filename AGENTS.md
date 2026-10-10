# AGENTS.md — Aturan untuk AI Coding Assistant

Proyek: **CampusPreloved** — platform preloved & barter barang mahasiswa lintas universitas (tugas Web and Mobile Programming).

Baca sebelum menulis kode: `PRD.md` (apa yang dibangun), `plan.md` (urutan kerja), `docs/API.md` (kontrak API), `database/schema.sql` (skema DB).

## Cara Bekerja
- Kerjakan **satu fase `plan.md` per sesi**; jangan lompat fase.
- Jelaskan singkat rencana sebelum mengubah banyak file.
- Setelah selesai: centang item di `plan.md`, sebutkan file yang dibuat/diubah, beri langkah uji manual.
- Jangan menambah fitur di luar `PRD.md`. Jangan mengubah skema DB atau kontrak API tanpa izin; jika perlu, usulkan dulu.
- Jika spesifikasi ambigu atau bertentangan, tanyakan.

## Tech Stack
- **Frontend:** Vite + React + TypeScript (strict), Tailwind CSS, React Router, react-hook-form, axios
- **Backend:** Node.js + Express + TypeScript (strict), `pg`, `zod`, `multer`, `cors`, `helmet`, `dotenv`
- **Database:** PostgreSQL

## Struktur Folder
```
backend/src/
  index.ts  app.ts
  config/env.ts
  db/pool.ts
  routes/        (universitas, kategori, barang)
  controllers/
  services/      (logika bisnis + query SQL)
  middleware/    (upload, validate, errorHandler, notFound)
  validations/   (skema Zod)
  uploads/       (di luar git)
frontend/src/
  main.tsx  App.tsx
  pages/         (HomePage, ItemDetailPage, ItemFormPage, NotFoundPage)
  components/    (layout/, items/, ui/)
  lib/           (api.ts, whatsapp.ts, format.ts)
  types/
```

## Aturan Backend
- Arsitektur berlapis: **route → controller → service → db**. Controller tidak berisi SQL.
- **Semua query SQL berparameter** (`$1, $2`). Dilarang menggabungkan input pengguna ke string SQL.
- Validasi semua input (body, query, params) dengan Zod; kembalikan 400 dengan rincian error.
- Format respons seragam:
  - sukses: `{ "data": ..., "message": "..." }` (+ `meta` untuk paginasi)
  - gagal: `{ "error": { "message": "...", "details": [...] } }`
- Status code sesuai `docs/API.md`: 200, 201, 204, 400, 404, 500. Error tak terduga → 500 tanpa membocorkan stack trace.
- Nama field JSON = nama kolom DB (`id_barang`, `nama_barang`, dst.).
- Upload: field `gambar`, hanya jpg/png/webp, maks. 2 MB, nama file acak, simpan di `uploads/`, `gambar_url` berbentuk `/uploads/<nama>`.
- Normalisasi `no_whatsapp` ke format `62…` sebelum disimpan.
- CORS hanya untuk origin dari env `CORS_ORIGIN`.
- Gunakan `async/await` dengan penanganan error terpusat.

## Aturan Bisnis
- `jenis_transaksi = 'Jual'` ⇒ `harga > 0`. `'Barter'` atau `'Hibah'` ⇒ `harga = 0`.
- `kondisi` ∈ {`Sangat Baik`, `Layak Pakai`, `Perlu Perbaikan Sedikit`}; `status` ∈ {`Tersedia`, `Terjual`}.
- Filter universitas memakai JOIN `barang → pengguna` (`pengguna.id_universitas`).
- `POST /api/barang` membuat/memperbarui `pengguna` berdasarkan `email` (upsert).
- Penghapusan barang juga menghapus file gambarnya.

## Aturan Frontend
- Komponen fungsi + hooks; **dilarang `any`**.
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<form>`, `<footer>`; satu `<h1>` per halaman; hierarki heading berurutan.
- Setiap `<input>/<select>/<textarea>` punya `<label>`; setiap `<img>` punya `alt`; fokus keyboard terlihat.
- Tailwind saja, **mobile-first** (gaya dasar untuk layar kecil, lalu `md:`/`lg:`). Target sentuh ≥ 44px.
- Warna: Primary Emerald Green / Navy Blue, Neutral Slate Gray.
- Filter katalog disinkronkan ke URL query (`?univ=&kategori=&q=`).
- Wajib ada state loading, kosong, dan error untuk setiap data yang diambil dari API.
- Validasi form: atribut HTML5 + react-hook-form sebelum submit; tampilkan error server per field.
- URL API dari `import.meta.env.VITE_API_URL`; jangan hardcode.
- Teks UI Bahasa Indonesia; nama variabel/fungsi Bahasa Inggris.
- Tautan WhatsApp: `https://wa.me/<nomor>?text=<pesan ter-encode>`.

## Keamanan
- Jangan commit `.env`, kunci, atau folder `uploads/`. Sediakan `.env.example`.
- Pakai `helmet`, batasi ukuran body JSON, batasi unggahan.
- Catatan: MVP **tanpa autentikasi** (sesuai spesifikasi). Jangan mengklaim endpoint `PUT`/`DELETE` aman; dokumentasikan batasan ini di README.

## Git
- Commit kecil dan sering: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`.
- Jangan commit `node_modules`, `dist`, `.env`, `uploads/`.

## Definisi Selesai (per fitur)
- [ ] Berjalan tanpa error; `npm run build` berhasil di backend & frontend
- [ ] Sesuai kontrak `docs/API.md`
- [ ] Tampilan baik di 360px dan desktop
- [ ] Kasus loading/kosong/error tertangani
- [ ] Item `plan.md` dicentang
