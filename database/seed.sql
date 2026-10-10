-- CampusPreloved — Data Sampel / Seed MySQL
-- Jalankan setelah database/schema.sql

USE campuspreloved;

-- 1. Data Universitas
INSERT INTO universitas (id_universitas, nama_universitas, kota) VALUES
  (1, 'Institut Teknologi Bandung', 'Bandung'),
  (2, 'Universitas Padjadjaran', 'Bandung'),
  (3, 'Universitas Telkom', 'Bandung'),
  (4, 'Universitas Indonesia', 'Depok'),
  (5, 'Universitas Gadjah Mada', 'Yogyakarta'),
  (6, 'Institut Pertanian Bogor', 'Bogor'),
  (7, 'Institut Teknologi Sepuluh Nopember', 'Surabaya'),
  (8, 'Universitas Brawijaya', 'Malang');

-- 2. Data Kategori
INSERT INTO kategori (id_kategori, nama_kategori) VALUES
  (1, 'Buku Kuliah'),
  (2, 'Elektronik'),
  (3, 'Perabot Kos'),
  (4, 'Alat Tulis'),
  (5, 'Pakaian & Almamater'),
  (6, 'Lainnya');

-- 3. Data Pengguna (Penjual)
INSERT INTO pengguna (id_pengguna, id_universitas, nama_lengkap, email, nim, no_whatsapp) VALUES
  (1, 1, 'Dewi Anggraini',  'dewi@students.itb.ac.id',   '13522001', '6281234567801'),
  (2, 2, 'Rizky Pratama',   'rizky@students.unpad.ac.id','140110220010', '6281234567802'),
  (3, 3, 'Salsabila Putri', 'salsa@student.telkomuniversity.ac.id', '1301223344', '6281234567803'),
  (4, 4, 'Ahmad Fauzan',    'fauzan@ui.ac.id',           '2206012345', '6281234567804'),
  (5, 5, 'Nadia Kusuma',    'nadia@mail.ugm.ac.id',      '22/500001/TK/55000', '6281234567805'),
  (6, 6, 'Bagas Wicaksono', 'bagas@apps.ipb.ac.id',      'G6401221001', '6281234567806');

-- 4. Data Barang (PIN demo: '1234', hash bcrypt disimpan di pin_keamanan)
-- Hash '$2a$10$wN166/3QvC.hSjZzZg/uG.Z4h4d8k7w3e1e5h2e6h5e8h2e6h5e8h' atau string hash bcrypt 60 karakter
INSERT INTO barang
  (id_barang, id_pengguna, id_kategori, nama_barang, deskripsi, harga, jenis_transaksi, kondisi, status, gambar_url, pin_keamanan) VALUES
  (1, 1, 1, 'Kalkulus Edisi 9 (Purcell)',
      'Buku kalkulus dasar, masih mulus, hanya ada sedikit coretan pensil.',
      85000.00, 'Jual', 'Layak Pakai', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (2, 1, 2, 'Kalkulator Casio fx-991EX',
      'Dipakai 2 semester, semua tombol normal, baterai baru diganti.',
      180000.00, 'Jual', 'Sangat Baik', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (3, 2, 3, 'Rak Buku Kayu 3 Tingkat',
      'Cocok untuk kamar kos, bisa dibongkar pasang. Ambil di sekitar Jatinangor.',
      120000.00, 'Jual', 'Layak Pakai', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (4, 2, 4, 'Set Alat Gambar Teknik',
      'Penggaris segitiga, jangka, dan mal huruf. Dilepas gratis untuk adik tingkat.',
      0.00, 'Hibah', 'Layak Pakai', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (5, 3, 2, 'Keyboard Mekanik Hot-swap',
      'Ingin barter dengan mouse wireless atau headset dengan kondisi setara.',
      0.00, 'Barter', 'Sangat Baik', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (6, 4, 1, 'Fisika Dasar Halliday Jilid 1',
      'Buku bekas, halaman lengkap, sedikit lecek di sampul.',
      70000.00, 'Jual', 'Perlu Perbaikan Sedikit', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (7, 5, 3, 'Kipas Angin Meja',
      'Masih kencang dan tidak berisik. Sudah laku terjual.',
      55000.00, 'Jual', 'Layak Pakai', 'Terjual', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (8, 6, 5, 'Jas Almamater Ukuran L',
      'Dipakai satu tahun, bersih. Bisa barter dengan jaket hoodie ukuran L.',
      0.00, 'Barter', 'Sangat Baik', 'Tersedia', NULL,
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG');
