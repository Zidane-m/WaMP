-- CampusPreloved — Data contoh (jalankan setelah schema.sql)

INSERT INTO universitas (nama_universitas, kota) VALUES
  ('Institut Teknologi Bandung', 'Bandung'),
  ('Universitas Padjadjaran', 'Bandung'),
  ('Universitas Telkom', 'Bandung'),
  ('Universitas Indonesia', 'Depok'),
  ('Universitas Gadjah Mada', 'Yogyakarta'),
  ('Institut Pertanian Bogor', 'Bogor'),
  ('Institut Teknologi Sepuluh Nopember', 'Surabaya'),
  ('Universitas Brawijaya', 'Malang');

INSERT INTO kategori (nama_kategori) VALUES
  ('Buku Kuliah'),
  ('Elektronik'),
  ('Perabot Kos'),
  ('Alat Tulis'),
  ('Pakaian & Almamater'),
  ('Lainnya');

INSERT INTO pengguna (id_universitas, nama_lengkap, email, nim, no_whatsapp) VALUES
  (1, 'Dewi Anggraini',  'dewi@students.itb.ac.id',   '13522001', '6281234567801'),
  (2, 'Rizky Pratama',   'rizky@students.unpad.ac.id','140110220010', '6281234567802'),
  (3, 'Salsabila Putri', 'salsa@student.telkomuniversity.ac.id', '1301223344', '6281234567803'),
  (4, 'Ahmad Fauzan',    'fauzan@ui.ac.id',           '2206012345', '6281234567804'),
  (5, 'Nadia Kusuma',    'nadia@mail.ugm.ac.id',      '22/500001/TK/55000', '6281234567805'),
  (6, 'Bagas Wicaksono', 'bagas@apps.ipb.ac.id',      'G6401221001', '6281234567806');

INSERT INTO barang
  (id_pengguna, id_kategori, nama_barang, deskripsi, harga, jenis_transaksi, kondisi, status, gambar_url) VALUES
  (1, 1, 'Kalkulus Edisi 9 (Purcell)',
      'Buku kalkulus dasar, masih mulus, hanya ada sedikit coretan pensil.',
      85000, 'Jual', 'Layak Pakai', 'Tersedia', NULL),
  (1, 2, 'Kalkulator Casio fx-991EX',
      'Dipakai 2 semester, semua tombol normal, baterai baru diganti.',
      180000, 'Jual', 'Sangat Baik', 'Tersedia', NULL),
  (2, 3, 'Rak Buku Kayu 3 Tingkat',
      'Cocok untuk kamar kos, bisa dibongkar pasang. Ambil di sekitar Jatinangor.',
      120000, 'Jual', 'Layak Pakai', 'Tersedia', NULL),
  (2, 4, 'Set Alat Gambar Teknik',
      'Penggaris segitiga, jangka, dan mal huruf. Dilepas gratis untuk adik tingkat.',
      0, 'Hibah', 'Layak Pakai', 'Tersedia', NULL),
  (3, 2, 'Keyboard Mekanik Hot-swap',
      'Ingin barter dengan mouse wireless atau headset dengan kondisi setara.',
      0, 'Barter', 'Sangat Baik', 'Tersedia', NULL),
  (4, 1, 'Fisika Dasar Halliday Jilid 1',
      'Buku bekas, halaman lengkap, sedikit lecek di sampul.',
      70000, 'Jual', 'Perlu Perbaikan Sedikit', 'Tersedia', NULL),
  (5, 3, 'Kipas Angin Meja',
      'Masih kencang dan tidak berisik. Sudah laku terjual.',
      55000, 'Jual', 'Layak Pakai', 'Terjual', NULL),
  (6, 5, 'Jas Almamater Ukuran L',
      'Dipakai satu tahun, bersih. Bisa barter dengan jaket hoodie ukuran L.',
      0, 'Barter', 'Sangat Baik', 'Tersedia', NULL);
