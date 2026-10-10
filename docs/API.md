# Dokumentasi REST API - WarisanKampus

Base URL lokal: `http://localhost:4000` · Semua endpoint di bawah awalan `/api`.
Format: JSON (kecuali POST/PUT barang yang memakai `multipart/form-data` bila ada foto).

## Format Respons

Sukses:
```json
{ "data": { }, "message": "Opsional" }
```
Gagal:
```json
{ "error": { "message": "Validasi gagal", "details": [{ "field": "harga", "message": "Harga harus lebih dari 0 untuk jenis Jual" }] } }
```

## Ringkasan Status Code
| Kode | Arti |
|---|---|
| 200 | OK |
| 201 | Created (POST berhasil) |
| 204 | No Content (DELETE berhasil) |
| 400 | Bad Request (data/parameter tidak valid) |
| 403 | Forbidden (PIN keamanan salah) |
| 404 | Not Found |
| 500 | Kesalahan server |

---

## GET /api/universitas
Daftar semua universitas. **200**
```json
{ "data": [ { "id_universitas": 1, "nama_universitas": "Institut Teknologi Bandung", "kota": "Bandung" } ] }
```

## GET /api/kategori
Daftar semua kategori. **200**
```json
{ "data": [ { "id_kategori": 1, "nama_kategori": "Buku Kuliah" } ] }
```

## GET /api/barang
Daftar barang terfilter, terbaru lebih dulu.

| Query | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id_universitas` | integer | tidak | Filter berdasarkan universitas penjual |
| `id_kategori` | integer | tidak | Filter kategori |
| `search` | string | tidak | Cari di `nama_barang` (case-insensitive) |
| `status` | `Tersedia`/`Terjual` | tidak | Default: semua |
| `page` | integer ≥ 1 | tidak | Default 1 |
| `limit` | integer 1–50 | tidak | Default 12 |

**200**
```json
{
  "data": [
    {
      "id_barang": 5,
      "nama_barang": "Kalkulus Edisi 9 (Purcell)",
      "deskripsi": "Masih mulus, ada sedikit coretan.",
      "harga": 85000,
      "jenis_transaksi": "Jual",
      "kondisi": "Layak Pakai",
      "status": "Tersedia",
      "gambar_url": "/uploads/abc123.jpg",
      "created_at": "2026-10-01T08:00:00.000Z",
      "kategori": { "id_kategori": 1, "nama_kategori": "Buku Kuliah" },
      "penjual": {
        "id_pengguna": 2,
        "nama_lengkap": "Dewi Anggraini",
        "no_whatsapp": "6281234567890",
        "universitas": { "id_universitas": 1, "nama_universitas": "Institut Teknologi Bandung" }
      }
    }
  ],
  "meta": { "page": 1, "limit": 12, "total": 1, "total_pages": 1 }
}
```
**400** bila `id_universitas`/`id_kategori`/`page`/`limit` bukan angka valid atau `status` di luar nilai yang diizinkan.

## GET /api/barang/{id}
Detail satu barang (struktur objek sama seperti satu elemen `data` di atas).
- **200** ditemukan
- **400** `id` bukan angka
- **404** `{ "error": { "message": "Barang tidak ditemukan" } }`

## POST /api/barang
Menambahkan barang baru. Content-Type: `multipart/form-data`.

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `nama_barang` | string | ya | 3–150 karakter |
| `deskripsi` | string | ya | 10–2000 karakter |
| `jenis_transaksi` | `Jual`/`Barter`/`Hibah` | ya | |
| `harga` | number | ya | > 0 untuk `Jual`; harus 0 untuk `Barter`/`Hibah` |
| `kondisi` | enum | ya | `Sangat Baik`, `Layak Pakai`, `Perlu Perbaikan Sedikit` |
| `id_kategori` | integer | ya | harus ada di tabel `kategori` |
| `id_universitas` | integer | ya | harus ada di tabel `universitas` |
| `nama_lengkap` | string | ya | data penjual, 3–100 karakter |
| `email` | string | ya | format email; kunci upsert penjual |
| `nim` | string | tidak | maks. 30 karakter |
| `no_whatsapp` | string | ya | 9–15 digit; `08…` otomatis menjadi `628…` |
| `pin` | string | ya | 4–6 digit angka (PIN keamanan edit/hapus) |
| `gambar` | file | tidak | jpg/png/webp, maks. 2 MB |

- **201** dengan objek barang lengkap pada `data`
- **400** validasi gagal (lihat `error.details`), tipe/ukuran file tidak sesuai, atau `id_kategori`/`id_universitas` tidak ada

## PUT /api/barang/{id}
Memperbarui barang (parsial: hanya kirim field yang diubah).
- Wajib menyertakan field `pin` (string) untuk otorisasi pemilik.
- Field yang boleh diubah: `nama_barang`, `deskripsi`, `jenis_transaksi`, `harga`, `kondisi`, `status`, `id_kategori`, `gambar`, `pin`.
- **200** objek barang terbaru
- **400** validasi gagal / body kosong
- **403** PIN keamanan salah
- **404** barang tidak ditemukan

## DELETE /api/barang/{id}
Menghapus barang beserta file gambarnya.
- Jika pengguna masuk sebagai pemilik: PIN tidak diperlukan.
- Jika tamu: Wajib menyertakan `pin` (dikirim di body JSON `{"pin": "1234"}` atau header `X-Item-PIN: 1234`).
- **204** tanpa body
- **403** PIN keamanan salah / bukan pemilik akun
- **404** barang tidak ditemukan

---

## GET /api/barang/saya
Daftar seluruh barang yang dimiliki oleh pengguna yang sedang login.
- Header: `Authorization: Bearer <jwt_token>`
- **200** `{"data": [...], "message": "Daftar barang saya berhasil diambil"}`
- **401** belum login

---

## POST /api/auth/register
Mendaftarkan akun mahasiswa baru.
- Body: `nama_lengkap`, `email`, `password`, `id_universitas`, `nim` (opsional), `no_whatsapp`.
- **201** `{"message": "Pendaftaran akun berhasil", "data": { "user": {...}, "token": "..." }}`
- **400** validasi gagal atau email sudah terdaftar

## POST /api/auth/login
Masuk ke akun mahasiswa terdaftar.
- Body: `email`, `password`.
- **200** `{"message": "Berhasil masuk ke akun", "data": { "user": {...}, "token": "..." }}`
- **401** email atau kata sandi salah

## GET /api/auth/me
Mendapatkan profil akun yang sedang login.
- Header: `Authorization: Bearer <jwt_token>`
- **200** `{"message": "Profil pengguna berhasil diambil", "data": {...}}`
- **401** token tidak valid atau kedaluwarsa

---

## GET /api/keranjang
Mengambil seluruh daftar barang incaran di keranjang pengguna dan total estimasi harga.
- Header: `Authorization: Bearer <jwt_token>`
- **200** `{"message": "Daftar keranjang berhasil diambil", "data": { "items": [...], "total_estimasi": 190000, "total_barang": 2 }}`
- **401** belum login

## POST /api/keranjang/{id_barang}
Menambahkan barang ke dalam keranjang incaran pengguna.
- Header: `Authorization: Bearer <jwt_token>`
- **201** `{"message": "Barang berhasil ditambahkan ke keranjang incaran"}`
- **400** barang milik sendiri
- **404** barang tidak ditemukan

## DELETE /api/keranjang/{id_barang}
Menghapus barang dari keranjang incaran pengguna.
- Header: `Authorization: Bearer <jwt_token>`
- **200** `{"message": "Barang berhasil dihapus dari keranjang"}`
- **404** barang tidak ada di keranjang

