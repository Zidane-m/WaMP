# Dokumentasi REST API — CampusPreloved

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
| `search` | string | tidak | Cari di `nama_barang` (tidak peka huruf besar/kecil) |
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
| `gambar` | file | tidak | jpg/png/webp, maks. 2 MB |

- **201** dengan objek barang lengkap pada `data`
- **400** validasi gagal (lihat `error.details`), tipe/ukuran file tidak sesuai, atau `id_kategori`/`id_universitas` tidak ada

## PUT /api/barang/{id}
Memperbarui barang (parsial: hanya kirim field yang diubah). Field yang boleh diubah: `nama_barang`, `deskripsi`, `jenis_transaksi`, `harga`, `kondisi`, `status`, `id_kategori`, `gambar`. Aturan harga–jenis transaksi tetap berlaku pada hasil akhir.
- **200** objek barang terbaru
- **400** validasi gagal / body kosong
- **404** barang tidak ditemukan

## DELETE /api/barang/{id}
Menghapus barang beserta file gambarnya.
- **204** tanpa body
- **404** barang tidak ditemukan

---

## Contoh cURL
```bash
# Katalog terfilter
curl "http://localhost:4000/api/barang?id_universitas=1&id_kategori=1&search=kalkulus"

# Tambah barang
curl -X POST http://localhost:4000/api/barang \
  -F nama_barang="Kipas Angin Kecil" -F deskripsi="Masih kencang, bekas kos 1 tahun." \
  -F jenis_transaksi=Jual -F harga=45000 -F kondisi="Layak Pakai" \
  -F id_kategori=3 -F id_universitas=2 \
  -F nama_lengkap="Budi Santoso" -F email=budi@mail.ac.id -F no_whatsapp=081234567890 \
  -F gambar=@kipas.jpg

# Tandai terjual
curl -X PUT http://localhost:4000/api/barang/5 -H "Content-Type: application/json" -d '{"status":"Terjual"}'

# Hapus
curl -X DELETE http://localhost:4000/api/barang/5 -i
```

## Tabel Kasus Uji (untuk Fase 8)
| # | Kasus | Hasil yang diharapkan |
|---|---|---|
| 1 | GET /api/universitas | 200, minimal 1 data |
| 2 | GET /api/barang tanpa filter | 200 |
| 3 | GET /api/barang?id_universitas=abc | 400 |
| 4 | GET /api/barang?search=zzzzzz | 200, `data: []` |
| 5 | GET /api/barang/999999 | 404 |
| 6 | POST valid | 201 |
| 7 | POST tanpa `nama_barang` | 400 |
| 8 | POST `Jual` dengan harga 0 | 400 |
| 9 | POST `Hibah` dengan harga 5000 | 400 |
| 10 | POST file `.pdf` | 400 |
| 11 | PUT `status=Terjual` | 200 |
| 12 | PUT id tidak ada | 404 |
| 13 | DELETE valid | 204 |
| 14 | DELETE id tidak ada | 404 |
