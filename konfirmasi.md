# Dokumen Konfirmasi & Rencana Akhir — CampusPreloved

Dokumen ini merupakan hasil kesepakatan dan analisis akhir terhadap perencanaan proyek **CampusPreloved** untuk mata kuliah **Web and Mobile Programming (WaMP)** setelah sesi diskusi.

---

## 1. Kesepakatan Final Hasil Diskusi

Berdasarkan diskusi dengan Anda, berikut keputusan final untuk proyek ini:

| Poin | Keputusan | Alasan & Dampak Teknis |
|---|---|---|
| **1. Tech Stack** | **Frontend: Vite + React + TS + Tailwind**<br>**Backend: Node.js + Express + TS** | Dosen membebaskan tech stack. Kombinasi ini modern, terstruktur, sangat cepat (*HMR*), dan satu bahasa (TypeScript) untuk meminimalkan beban belajar. |
| **2. Database** | **MySQL (via Laragon Lokal)** | Sangat praktis! Laragon sudah terpasang di laptop Anda, tinggal klik *Start All*. Menggunakan driver `mysql2/promise` dengan query berparameter (`?`). Skema disesuaikan ke format MySQL InnoDB. |
| **3. Keamanan Edit/Hapus** | **Fitur PIN Sederhana (4–6 Digit)** | **Disetujui.** Saat posting barang, penjual membuat PIN 4–6 digit. Saat ingin Edit atau Hapus, sistem meminta PIN tersebut. Solusi cerdas: sangat aman, logis, tanpa kerumitan sistem auth/login JWT. |
| **4. Penanganan Gambar** | **Fallback Placeholder Otomatis** | **Disetujui.** Gambar tidak perlu disiapkan sekarang. Frontend akan menyediakan fallback gambar/ilustrasi otomatis per kategori (Buku, Gadget, dll.). Foto asli baru diuji saat mencoba form upload di Fase 6. |

---

## 2. Rincian Teknis & Penyesuaian

### 2.1 Database MySQL (Laragon)
Karena kita menggunakan MySQL bawaan Laragon:
1. **Koneksi:** Default Laragon adalah `host: localhost`, `port: 3306`, `user: root`, `password: ''` (kosong), database: `campuspreloved`.
2. **Skema SQL:**
   * Tipe ID: `INT AUTO_INCREMENT PRIMARY KEY`.
   * Tanggal: `DATETIME DEFAULT CURRENT_TIMESTAMP`.
   * Mesin tabel: `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`.
   * Pencarian: `LIKE ?` (di MySQL default sudah *case-insensitive*).
   * File skema disiapkan sebagai `schema.sql` (disesuaikan untuk MySQL).

### 2.2 Mekanisme Fitur PIN Barang
1. **Database:**
   * Kolom tambahan di tabel `barang`: `pin_keamanan VARCHAR(60) NOT NULL` (disimpan dalam bentuk hash sederhana menggunakan `bcryptjs`).
2. **Backend:**
   * `POST /api/barang`: Menerima field `pin` (4–6 digit angka, misal `1234`).
   * `PUT /api/barang/:id`: Wajib menyertakan `pin` di body atau header. Jika PIN cocok, update diproses; jika salah, kembalikan HTTP `403 Forbidden` (`"PIN keamanan salah"`).
   * `DELETE /api/barang/:id`: Wajib menyertakan `pin` di body atau header (`X-Item-PIN`). Jika cocok, data dan file gambar dihapus.
3. **Frontend:**
   * Form Jual: Input tambahan "PIN Keamanan (4-6 digit angka)" dengan petunjuk *"Digunakan untuk mengedit atau menghapus barang ini nanti"*.
   * Tombol Edit & Hapus: Memunculkan pop-up modal dialog *"Masukkan PIN Keamanan"* sebelum aksi dijalankan.

### 2.3 Penanganan Gambar & Fallback
* Anda **tidak perlu mengumpulkan gambar saat ini**.
* Pada `seed.sql`, data awal tetap memiliki `gambar_url = NULL`.
* Komponen `ItemImage` di frontend akan otomatis menampilkan gambar placeholder tematik berkualitas tinggi (misalnya via ilustrasi vektor atau Unsplash placeholder tematik per kategori) jika `gambar_url` kosong.
* Saat masuk **Fase 6 (Form Posting)**, Anda cukup mencoba mengunggah foto apa saja dari laptop (maksimal 2 MB, format JPG/PNG/WebP).

---

## 3. Rencana Kerja Per Fase (Roadmap Eksekusi)

Sesuai aturan di **AGENTS.md**, pengerjaan akan dilakukan **satu fase per sesi** secara tuntas:

* **Fase 0 — Inisialisasi Proyek & Monorepo:**
  * Penataan folder (`backend/`, `frontend/`, `database/`, `docs/`).
  * Inisialisasi backend Express + TypeScript + `mysql2` + `zod` + `multer` + `bcryptjs`.
  * Inisialisasi frontend Vite + React + TypeScript + Tailwind CSS.
  * Uji jalannya `npm run dev` di kedua sisi.
* **Fase 1 — Database MySQL (Laragon):**
  * Membuat database `campuspreloved` di Laragon.
  * Menjalankan `schema.sql` dan `seed.sql` versi MySQL.
  * Verifikasi data contoh dan relasi tabel.
* **Fase 2 — Backend Fondasi & Master Data:**
  * Koneksi pool `mysql2` + middleware (`cors`, `helmet`, error handler).
  * Endpoint `GET /api/universitas`, `GET /api/kategori`, dan `GET /api/health`.
* **Fase 3 — Backend CRUD Barang, Upload & Verifikasi PIN:**
  * Endpoint `GET /api/barang` (filter universitas, kategori, search, paginasi).
  * Endpoint `GET /api/barang/:id`.
  * Endpoint `POST /api/barang` (upsert penjual + hashing PIN + upload multer).
  * Endpoint `PUT /api/barang/:id` dan `DELETE /api/barang/:id` (verifikasi PIN + pembersihan file gambar).
* **Fase 4 — Frontend Fondasi & Layout Responsif:**
  * Desain sistem Tailwind (Emerald Green / Navy / Slate Gray).
  * Layout Header-Footer, React Router, UI primitives.
* **Fase 5 — Frontend Katalog & Fitur Filter:**
  * Filter bar (Universitas, Kategori, Search dengan debounce).
  * Grid barang responsif, fallback gambar placeholder, tombol WhatsApp.
* **Fase 6 — Frontend Form Posting Barang:**
  * Form posting + react-hook-form + input PIN keamanan + pratinjau gambar.
* **Fase 7 — Frontend Detail, Edit & Hapus Berbasis PIN:**
  * Halaman detail `/barang/:id`.
  * Modal input PIN saat ingin edit atau hapus barang.
* **Fase 8 — Pengujian Menyeluruh (Testing):**
  * Uji 14 kasus uji API + uji validasi PIN salah.
  * Uji responsivitas 360px (mobile) dan desktop.
* **Fase 9 — Dokumentasi & Persiapan Demo:**
  * Dokumentasi lengkap di `README.md`.
  * Panduan menjalankan dengan Laragon untuk presentasi dosen.

---

## 4. Status Saat Ini

Dokumen rencana akhir telah diperbarui. Jika Anda sudah menyetujui poin-poin di atas, kita siap melangkah ke **Fase 0 (Setup Proyek)**.
