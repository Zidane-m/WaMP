# Laporan Hasil Pengujian (Test Report) — WarisanKampus

Dokumen ini memuat rangkuman hasil pengujian komprehensif platform **WarisanKampus** sesuai spesifikasi Fase 8 `plan.md` dan kontrak `docs/API.md`.

---

## 1. Tabel Kasus Uji Endpoint API Backend

Seluruh endpoint telah diuji secara otomatis melalui skrip `backend/src/test_api.ts` terhadap server yang berjalan di port 4000 dan basis data MySQL 8.4 Laragon:

| No | Endpoint & Metode | Skenario Uji | Status Code Diharapkan | Status Code Aktual | Hasil |
|---|---|---|:---:|:---:|:---:|
| 1 | `GET /api/universitas` | Mengambil seluruh universitas mitra | 200 OK | 200 OK | **LULUS** |
| 2 | `GET /api/kategori` | Mengambil seluruh kategori barang | 200 OK | 200 OK | **LULUS** |
| 3 | `GET /api/barang` | Mengambil katalog dengan paginasi dan filter default | 200 OK | 200 OK | **LULUS** |
| 4 | `GET /api/barang?id_universitas=abc` | Validasi tipe parameter ID tidak valid | 400 Bad Request | 400 Bad Request | **LULUS** |
| 5 | `GET /api/barang?search=zzzzzz` | Pencarian kata kunci nihil | 200 OK (data kosong) | 200 OK (data kosong) | **LULUS** |
| 6 | `GET /api/barang/:id` | Mengambil barang valid | 200 OK | 200 OK | **LULUS** |
| 7 | `GET /api/barang/999999` | Mengambil barang dengan ID tidak ada | 404 Not Found | 404 Not Found | **LULUS** |
| 8 | `POST /api/barang` | Menambahkan barang baru valid | 201 Created | 201 Created | **LULUS** |
| 9 | `POST /api/barang` | Menambahkan barang tanpa nama barang | 400 Bad Request | 400 Bad Request | **LULUS** |
| 10 | `POST /api/barang` | Transaksi 'Jual' dengan harga Rp 0 | 400 Bad Request | 400 Bad Request | **LULUS** |
| 11 | `POST /api/barang` | Transaksi 'Hibah' dengan harga > 0 | 400 Bad Request | 400 Bad Request | **LULUS** |
| 12 | `PUT /api/barang/:id` | Ubah barang dengan PIN salah | 403 Forbidden | 403 Forbidden | **LULUS** |
| 13 | `PUT /api/barang/:id` | Ubah barang dengan PIN benar | 200 OK | 200 OK | **LULUS** |
| 14 | `PUT /api/barang/999999` | Ubah barang ID tidak ada | 404 Not Found | 404 Not Found | **LULUS** |
| 15 | `DELETE /api/barang/:id` | Hapus barang dengan PIN salah | 403 Forbidden | 403 Forbidden | **LULUS** |
| 16 | `DELETE /api/barang/:id` | Hapus barang dengan PIN benar | 204 No Content | 204 No Content | **LULUS** |

**Tingkat Kelulusan API:** **16/16 (100% Lulus)**.

---

## 2. Pengujian Logika Relasional & Kombinasi Filter Database

Diuji melalui skrip `backend/src/test_fase8.ts`:
1. **Filter Universitas (`p.id_universitas = 1`):** Mengembalikan data barang mahasiswa UI dengan benar (JOIN `barang -> pengguna -> universitas`).
2. **Filter Kategori (`b.id_kategori = 1`):** Mengembalikan data barang kategori Buku & Modul dengan benar.
3. **Filter Kombinasi (Universitas 1 AND Kategori 1):** Mengembalikan irisan data yang tepat tanpa data bocor dari kampus lain.
4. **Pencarian Kata Kunci (`nama_barang LIKE ?`):** Parameterized query SQL aman dari injeksi SQL, berhasil menemukan barang dengan kata kunci.
5. **Integritas Aturan Bisnis Harga:** 0 baris pelanggaran aturan harga pada basis data (`Jual > 0`, `Barter/Hibah = 0`).
6. **Integritas Relasional Data Pengguna:** 0 baris *orphan item* (semua barang terhubung ke pengguna yang sah).

---

## 3. Pengujian Validasi Formulir Frontend (Client-side)

Diuji pada formulir posting (`/jual`) dan formulir edit (`/barang/:id/edit`):
- [x] Input wajib kosong: Muncul pesan error merah spesifik di bawah field.
- [x] Format email tidak valid: Muncul peringatan *"Format email tidak valid"*.
- [x] Panjang nama barang < 3 karakter: Muncul peringatan *"Nama barang minimal 3 karakter"*.
- [x] Transaksi 'Jual' dengan harga 0: Tertahan dengan pesan *"Harga barang untuk jenis transaksi Jual harus lebih dari 0"*.
- [x] Format file foto selain JPG/PNG/WebP: Ditolak dengan pesan *"Format gambar harus berupa JPG, PNG, atau WebP"*.
- [x] Ukuran file foto > 2 MB: Ditolak dengan pesan *"Ukuran gambar maksimal adalah 2 MB"*.
- [x] Konfirmasi PIN tidak cocok: Muncul pesan *"Konfirmasi PIN tidak cocok dengan PIN di atas"*.

---

## 4. Pengujian Responsivitas & Aksesibilitas Antarmuka

- **Mobile Viewport (360px):**
  - Grid barang menjadi 1 kolom yang nyaman dibaca.
  - Tidak ada luapan horizontal (*no horizontal overflow/scrollbar*).
  - Target sentuh semua tombol dan dropdown form memenuhi standar minimal 44px (`min-h-[44px]`).
- **Tablet Viewport (768px):**
  - Grid barang tertata 2 kolom.
  - Filter bar menyusun dropdown kampus dan kategori berdampingan.
- **Desktop Viewport (1280px):**
  - Grid barang tertata 3-4 kolom dengan navigasi header yang luas.
  - Halaman detail menampilkan layout 2 kolom (galeri foto di kiri, detail informasi dan aksi kontak di kanan).
- **Aksesibilitas (a11y):**
  - Semantic HTML5: satu `<h1>` per halaman, hierarki heading terstruktur (`<h2>`, `<h3>`).
  - Setiap input dan select memiliki `<label>` yang terhubung.
  - Semua elemen interaktif memiliki `focus-visible:ring-2` yang terlihat jelas saat dinavigasi menggunakan keyboard (Tab).
  - Standar antislop: tidak menggunakan karakter em dash pada teks UI maupun pesan WhatsApp otomatis.

---

## 5. Kesimpulan
Semua modul dari backend, basis data, hingga frontend telah lulus uji sesuai spesifikasi Fase 8. Aplikasi siap untuk Fase 9 (Deployment & Dokumentasi README).
