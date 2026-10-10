# Prompt untuk Dikirim ke AI di IDE

Letakkan file berikut di repo sebelum memulai: `PRD.md`, `plan.md`, `AGENTS.md`, `docs/API.md`, `database/schema.sql`, `database/seed.sql`.

---

## 1) Prompt Awal (sekali di awal)

```
Kamu adalah Full-Stack Web Developer senior. Kita membangun "CampusPreloved",
platform preloved & barter barang mahasiswa lintas universitas, untuk tugas
mata kuliah Web and Mobile Programming.

Baca file-file ini dulu, sebelum menulis kode apa pun:
1. PRD.md              — kebutuhan produk, tech stack, kriteria penerimaan
2. plan.md             — urutan implementasi per fase
3. AGENTS.md           — aturan koding dan konvensi proyek
4. docs/API.md         — kontrak REST API
5. database/schema.sql — skema database

Balas dengan:
- ringkasan pemahamanmu (maks. 8 poin)
- pertanyaan jika ada yang ambigu atau bertentangan antar file
  (khususnya bagian "Penyesuaian atas spesifikasi" di PRD.md butir 4.2)
- konfirmasi siap mengerjakan Fase 0

Jangan menulis kode sebelum aku menyetujui ringkasanmu.
```

## 2) Prompt Per Fase (ulangi, ganti nomor fase)

```
Kerjakan Fase 2 dari plan.md. Patuhi AGENTS.md, PRD.md, dan docs/API.md.
Jangan mengerjakan fase lain dan jangan mengubah skema DB atau kontrak API
tanpa bertanya. Setelah selesai:
1. centang item yang selesai di plan.md
2. daftar file yang dibuat/diubah
3. langkah menguji secara manual (perintah curl atau langkah di browser)
```

## 3) Prompt Tiga Deliverable Awal (jika dosen meminta kode cepat)

Ini mengikuti bagian "Instruksi Lengkap kepada AI" dari prompt Gemini:

```
Berdasarkan PRD.md, AGENTS.md, dan docs/API.md, buatkan:
1. Struktur folder project yang rapi
2. Skrip SQL DDL lengkap (sudah ada di database/schema.sql — tinjau dan sesuaikan bila perlu)
3. Komponen React untuk halaman katalog + filter universitas & kategori + pencarian
4. Route/Controller Express untuk filter pencarian barang dan pencatatan barang baru
Kerjakan bertahap dan berhenti setelah tiap nomor agar bisa kuperiksa.
```

## 4) Prompt Perbaikan Bug

```
Ada bug: [perilaku salah vs yang diharapkan].
Langkah reproduksi: [...]
Pesan error: [...]
Cari akar masalahnya, jelaskan singkat, lalu perbaiki dengan perubahan sekecil mungkin
tanpa mengubah kontrak API.
```

## Tips
- Satu fase per percakapan; jika AI melenceng, suruh membaca ulang `AGENTS.md`.
- Commit ke git setelah tiap fase selesai dan teruji.
- Jangan tempel `DATABASE_URL` produksi atau kunci rahasia ke chat AI.
- Minta AI menjalankan `npm run build` sebelum menyatakan fase selesai.
