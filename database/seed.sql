-- CampusPreloved — Data Sampel / Seed MySQL
-- Jalankan setelah database/schema.sql

USE campuspreloved;

-- 1. Data Universitas (40 Perguruan Tinggi Terkemuka di Indonesia)
INSERT INTO universitas (id_universitas, nama_universitas, kota, provinsi) VALUES
  -- Jawa Barat
  (1, 'Institut Teknologi Bandung', 'Bandung', 'Jawa Barat'),
  (2, 'Universitas Padjadjaran', 'Bandung', 'Jawa Barat'),
  (3, 'Universitas Telkom', 'Bandung', 'Jawa Barat'),
  (6, 'Institut Pertanian Bogor', 'Bogor', 'Jawa Barat'),
  (9, 'Universitas Pendidikan Indonesia', 'Bandung', 'Jawa Barat'),
  (10, 'Universitas Katolik Parahyangan', 'Bandung', 'Jawa Barat'),
  (11, 'Universitas Pasundan', 'Bandung', 'Jawa Barat'),
  (12, 'Universitas Siliwangi', 'Tasikmalaya', 'Jawa Barat'),
  (13, 'Politeknik Negeri Bandung', 'Bandung', 'Jawa Barat'),
  (14, 'Universitas Swadaya Gunung Jati', 'Cirebon', 'Jawa Barat'),
  
  -- DKI Jakarta & Banten
  (4, 'Universitas Indonesia', 'Depok', 'DKI Jakarta & Banten'),
  (15, 'Universitas Negeri Jakarta', 'Jakarta', 'DKI Jakarta & Banten'),
  (16, 'UIN Syarif Hidayatullah', 'Tangerang Selatan', 'DKI Jakarta & Banten'),
  (17, 'Universitas Bina Nusantara', 'Jakarta', 'DKI Jakarta & Banten'),
  (18, 'Universitas Trisakti', 'Jakarta', 'DKI Jakarta & Banten'),
  (19, 'Universitas Tarumanagara', 'Jakarta', 'DKI Jakarta & Banten'),
  (20, 'Universitas Sultan Ageng Tirtayasa', 'Serang', 'DKI Jakarta & Banten'),
  
  -- DI Yogyakarta
  (5, 'Universitas Gadjah Mada', 'Yogyakarta', 'DI Yogyakarta'),
  (21, 'Universitas Negeri Yogyakarta', 'Yogyakarta', 'DI Yogyakarta'),
  (22, 'Universitas Islam Indonesia', 'Yogyakarta', 'DI Yogyakarta'),
  (23, 'Universitas Muhammadiyah Yogyakarta', 'Yogyakarta', 'DI Yogyakarta'),
  (24, 'Universitas Atma Jaya Yogyakarta', 'Yogyakarta', 'DI Yogyakarta'),
  
  -- Jawa Tengah
  (25, 'Universitas Diponegoro', 'Semarang', 'Jawa Tengah'),
  (26, 'Universitas Sebelas Maret', 'Surakarta', 'Jawa Tengah'),
  (27, 'Universitas Negeri Semarang', 'Semarang', 'Jawa Tengah'),
  (28, 'Universitas Jenderal Soedirman', 'Purwokerto', 'Jawa Tengah'),
  (29, 'Universitas Dian Nuswantoro', 'Semarang', 'Jawa Tengah'),
  
  -- Jawa Timur
  (7, 'Institut Teknologi Sepuluh Nopember', 'Surabaya', 'Jawa Timur'),
  (8, 'Universitas Brawijaya', 'Malang', 'Jawa Timur'),
  (30, 'Universitas Airlangga', 'Surabaya', 'Jawa Timur'),
  (31, 'Universitas Negeri Malang', 'Malang', 'Jawa Timur'),
  (32, 'Universitas Jember', 'Jember', 'Jawa Timur'),
  (33, 'UPN Veteran Jawa Timur', 'Surabaya', 'Jawa Timur'),
  
  -- Sumatera
  (34, 'Universitas Sumatera Utara', 'Medan', 'Sumatera'),
  (35, 'Universitas Andalas', 'Padang', 'Sumatera'),
  (36, 'Universitas Sriwijaya', 'Palembang', 'Sumatera'),
  (37, 'Universitas Syiah Kuala', 'Banda Aceh', 'Sumatera'),
  (38, 'Universitas Lampung', 'Bandar Lampung', 'Sumatera'),
  
  -- Bali, Nusa Tenggara, & Sulawesi
  (39, 'Universitas Udayana', 'Denpasar', 'Bali & Nusa Tenggara'),
  (40, 'Universitas Hasanuddin', 'Makassar', 'Sulawesi');

-- 2. Data Kategori
INSERT INTO kategori (id_kategori, nama_kategori) VALUES
  (1, 'Buku Kuliah'),
  (2, 'Elektronik'),
  (3, 'Perabot Kos'),
  (4, 'Alat Tulis'),
  (5, 'Pakaian & Almamater'),
  (6, 'Lainnya');

-- 3. Data Pengguna (Penjual / Akun Mahasiswa Demo)
-- Password demo untuk semua akun: 'password123'
-- Hash bcrypt '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'
INSERT INTO pengguna (id_pengguna, id_universitas, nama_lengkap, email, password_hash, nim, no_whatsapp) VALUES
  (1, 1, 'Dewi Anggraini',  'dewi@students.itb.ac.id',   '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', '13522001', '6281234567801'),
  (2, 2, 'Rizky Pratama',   'rizky@students.unpad.ac.id','$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', '140110220010', '6281234567802'),
  (3, 3, 'Salsabila Putri', 'salsa@student.telkomuniversity.ac.id', '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', '1301223344', '6281234567803'),
  (4, 4, 'Ahmad Fauzan',    'fauzan@ui.ac.id',           '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', '2206012345', '6281234567804'),
  (5, 5, 'Nadia Kusuma',    'nadia@mail.ugm.ac.id',      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', '22/500001/TK/55000', '6281234567805'),
  (6, 6, 'Bagas Wicaksono', 'bagas@apps.ipb.ac.id',      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG', 'G6401221001', '6281234567806');

-- 4. Data Barang (PIN demo: '1234')
INSERT INTO barang
  (id_barang, id_pengguna, id_kategori, nama_barang, deskripsi, harga, jenis_transaksi, kondisi, status, gambar_url, pin_keamanan) VALUES
  (1, 1, 1, 'Kalkulus Edisi 9 (Purcell)',
      'Buku kalkulus dasar, masih mulus, hanya ada sedikit coretan pensil.',
      85000.00, 'Jual', 'Layak Pakai', 'Tersedia', '/uploads/sample-calculus.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (2, 1, 2, 'Kalkulator Casio fx-991EX',
      'Dipakai 2 semester, semua tombol normal, baterai baru diganti.',
      180000.00, 'Jual', 'Sangat Baik', 'Tersedia', '/uploads/sample-casio.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (3, 2, 3, 'Rak Buku Kayu 3 Tingkat',
      'Cocok untuk kamar kos, bisa dibongkar pasang. Ambil di sekitar Jatinangor.',
      120000.00, 'Jual', 'Layak Pakai', 'Tersedia', '/uploads/sample-bookshelf.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (4, 2, 4, 'Set Alat Gambar Teknik',
      'Penggaris segitiga, jangka, dan mal huruf. Dilepas gratis untuk adik tingkat.',
      0.00, 'Hibah', 'Layak Pakai', 'Tersedia', '/uploads/sample-drawing-set.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (5, 3, 2, 'Keyboard Mekanik Hot-swap',
      'Ingin barter dengan mouse wireless atau headset dengan kondisi setara.',
      0.00, 'Barter', 'Sangat Baik', 'Tersedia', '/uploads/sample-keyboard.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (6, 4, 1, 'Fisika Dasar Halliday Jilid 1',
      'Buku bekas, halaman lengkap, sedikit lecek di sampul.',
      70000.00, 'Jual', 'Perlu Perbaikan Sedikit', 'Tersedia', '/uploads/sample-physics.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (7, 5, 3, 'Kipas Angin Meja',
      'Masih kencang dan tidak berisik. Sudah laku terjual.',
      55000.00, 'Jual', 'Layak Pakai', 'Terjual', '/uploads/sample-fan.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG'),
  (8, 6, 5, 'Jas Almamater Ukuran L',
      'Dipakai satu tahun, bersih. Bisa barter dengan jaket hoodie ukuran L.',
      0.00, 'Barter', 'Sangat Baik', 'Tersedia', '/uploads/sample-almamater.jpg',
      '$2b$10$fV2F2cHQK90bZeqm5oE08OXkK1P6hUqPqZgXhYcZb7l7jZlZ6n8yG');

-- 5. Data Sampel Keranjang Incaran
INSERT INTO keranjang (id_pengguna, id_barang) VALUES
  (1, 3), -- Dewi mengincar Rak Buku Kayu
  (1, 6); -- Dewi mengincar Buku Fisika Dasar

