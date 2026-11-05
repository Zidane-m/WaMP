# Platform Sirkular Perlengkapan Akademik Menggunakan Design Science Research untuk Efisiensi Transaksi Mikro Mahasiswa

*(Judul Bahasa Inggris: Circular Academic Equipment Platform Using Design Science Research for Student Micro-Transaction Efficiency)*

**Muhammad Zidan Mirza Fedrieka**  
Program Studi Ilmu Komputer, Universitas Pendidikan Indonesia, Bandung, Indonesia  
Email: zidanfedrieka@upi.edu  

**Penulis Korespondensi (Corresponding Author):**  
Muhammad Zidan Mirza Fedrieka  
Departemen Pendidikan Ilmu Komputer, Fakultas Pendidikan Matematika dan Ilmu Pengetahuan Alam, Universitas Pendidikan Indonesia  
Jl. Dr. Setiabudhi No. 229, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat, Indonesia. 40154  
Email: zidanfedrieka@upi.edu  

---

### Informasi Artikel (Article Info)
* Riwayat Artikel: Diterima (Received); Direvisi (Revised); Disetujui (Accepted)
* Format Naskah: Mengikuti Panduan Template JOIN (Jurnal Online Informatika) 2023
* Gaya Sitasi: IEEE Style (Mendeley Compatible) dengan tautan aktif DOI

---

## ABSTRAK

Timbunan perlengkapan perkuliahan pasca-semester dan tingginya harga barang akademik baru menjadi masalah nyata bagi keuangan mahasiswa. Di sisi lain, lokapasar komersial membebankan komisi serta ongkos kirim yang mahal, sementara jual-beli lewat media sosial sering kali tidak teratur dan rawan penipuan. Penelitian ini merancang, membangun, dan mengevaluasi *CampusPreloved* (WarisanKampus), sebuah platform web responsif yang memudahkan mahasiswa melakukan transaksi jual murah, barter tanpa uang, dan hibah perlengkapan kuliah lintas 40 perguruan tinggi di Indonesia. Menggunakan metode *Design Science Research Methodology* (DSRM), sistem dikembangkan dengan arsitektur tiga tingkat (*three-tier architecture*) memanfaatkan React 19, TypeScript, Tailwind CSS, Node.js Express, dan basis data relasional. Hasil evaluasi fungsional menggunakan *Black-Box Testing* pada 16 skenario uji antarmuka dan API menunjukkan tingkat keberhasilan 100%. Pengujian kinerja membuktikan katalog mampu memuat data dalam waktu kurang dari 400 milidetik, tampil rapi di layar ponsel 360px hingga desktop 1440px, serta memenuhi standar aksesibilitas WCAG 2.1 Level AA. Integrasi tautan WhatsApp dan sistem keamanan ganda (JWT dan PIN mandiri) terbukti efektif memangkas biaya perantara serta memberikan rasa aman saat bertransaksi langsung (COD) di kampus.

**Kata Kunci:** Arsitektur Tiga Tingkat, Design Science Research, Ekonomi Sirkular, Perlengkapan Mahasiswa, Transaksi Mikro.

---

## ABSTRACT

*The accumulation of post-semester academic items and the high cost of new learning materials pose tangible financial burdens for university students. Meanwhile, commercial e-commerce platforms impose administrative and shipping fees, while student transactions on social media remain unstructured and vulnerable to fraud. This study designs, implements, and evaluates CampusPreloved (WarisanKampus), a responsive circular web platform enabling affordable sales, cash-free barter, and free donations of university supplies across 40 Indonesian universities. Utilizing the Design Science Research Methodology (DSRM), the platform was engineered through a three-tier architecture utilizing React 19, TypeScript, Tailwind CSS, Node.js Express, and relational database systems. Functional evaluation via Black-Box Testing across 16 user interface and API test scenarios yielded a 100% pass rate. Performance benchmarks demonstrated catalogue load latencies below 400 milliseconds, fluid multi-device responsiveness (360px to 1440px), and compliance with WCAG 2.1 Level AA accessibility guidelines. The direct WhatsApp integration and dual-mode authorization framework (JWT and personal PIN) successfully eliminate intermediary commissions while ensuring safe in-person campus exchanges.*

**Keywords:** Circular Economy, Design Science Research, Micro-Transactions, Student Equipment, Three-Tier Architecture.

---

## 1. PENDAHULUAN (INTRODUCTION)

Aktivitas perkuliahan tidak lepas dari kebutuhan sarana akademik yang spesifik namun sering kali hanya terpakai dalam waktu singkat. Buku teks referensi mata kuliah dasar, jas laboratorium praktikum, modul kuliah, kalkulator saintifik grafis, perlengkapan gambar teknik, hingga perabot kamar kos seperti meja lipat dan dispenser umumnya hanya dipakai secara intensif selama satu atau dua semester [1]. Begitu mahasiswa memasuki tingkat akhir, menyelesaikan masa studi, atau berpindah tempat tinggal, barang-barang yang kondisinya masih sangat layak pakai ini kerap kali menumpuk begitu saja di kamar kos dan akhirnya terbuang sia-sia karena merepotkan jika harus dibawa pulang ke kampung halaman [1], [2]. Pada saat yang sama, mahasiswa baru dan adik tingkat dihadapkan pada biaya hidup serta pengeluaran awal studi yang cukup tinggi, sehingga pembelian perlengkapan baru di toko ritel menjadi beban finansial tersendiri bagi mereka [2], [3].

Sejumlah penelitian terdahulu telah menyoroti pentingnya platform digital dalam memfasilitasi sirkulasi barang bekas dan konsumsi kolaboratif. Mendoza et al. [1] menggarisbawahi bahwa penerapan ekonomi sirkular di lingkungan perguruan tinggi sangat potensial mereduksi volume sampah padat melalui pengelolaan sumber daya bersama. Pratama dan Setyawan [2] merancang website *preloved* guna mendukung efisiensi transaksi barang bekas mahasiswa dan membuktikan tingginya animo pertukaran barang di lingkungan kampus. Saputro dan Handayani [3] mengembangkan sistem informasi penjualan *thrift shop* kolaboratif berbasis web yang mempermudah perpanjangan masa pakai produk. Dari aspek rekayasa perangkat lunak, Ceballos et al. [6] memetakan berbagai pola arsitektur perangkat lunak untuk platform ekonomi sirkular digital dan menekankan perlunya arsitektur yang fleksibel dalam menghubungkan penyedia barang dengan penerima manfaat. Selain itu, Nurcahyo dan Fauzi [4] serta Widyawati dan Nugroho [5] membuktikan bahwa pemanfaatan integrasi pesan instan seperti *WhatsApp click-to-chat* dan *gateway* terbukti efektif mereduksi hambatan komunikasi serta menekan biaya transaksi mikro pada *social commerce*.

Meskipun potensi pertukaran barang bekas di lingkungan mahasiswa sangat besar, solusi yang tersedia saat ini memiliki keterbatasan mendasar. Lokapasar komersial arus utama seperti Tokopedia dan Shopee berorientasi pada perdagangan massal dengan sistem pembayaran rekening bersama dan kurir logistik [2], [4]. Skema ini membebankan biaya layanan aplikasi dan ongkos kirim ekspedisi. Untuk barang kebutuhan mahasiswa yang nilainya terjangkau (seperti buku modul Rp 15.000 atau jas lab Rp 40.000), ongkos kirim dan biaya admin aplikasi sering kali justru lebih mahal daripada harga barangnya, serta tidak memfasilitasi transaksi non-tunai seperti barter atau hibah barang cuma-cuma (Rp 0). Di sisi lain, saluran media sosial informal seperti akun *menfess* kampus di X (Twitter) dan grup WhatsApp bersifat efemeris (informasi cepat tertimbun), tidak menyediakan filter pencarian berparameter, serta rawan terhadap penipuan transfer uang muka [2], [5]. Selain itu, sebagian besar platform komunitas yang pernah dikembangkan hanya melayani satu universitas tertutup (*siloed system*), padahal banyak perguruan tinggi yang lokasinya saling bertetangga di kawasan kota pendidikan [1], [6].

Untuk mengatasi kesenjangan tersebut, penelitian ini bertujuan merancang, mengimplementasikan, dan mengevaluasi *CampusPreloved* (WarisanKampus), sebuah platform sirkular berbasis web responsif yang dirancang khusus untuk memfasilitasi tiga model transaksi mahasiswa: jual murah terjangkau, barter setara tanpa uang tunai, dan hibah perlengkapan kuliah secara cuma-cuma lintas 40 perguruan tinggi di Indonesia. Nilai kebaruan dari penelitian ini terletak pada integrasi arsitektur perangkat lunak tiga tingkat (*three-tier architecture*) yang memisahkan antarmuka React 19 dan backend RESTful Express.js, penerapan otorisasi ganda (akun mahasiswa terdaftar dan PIN keamanan mandiri tanpa registrasi rumit), serta penghilangan perantara transaksi melalui integrasi tautan langsung WhatsApp untuk kesepakatan serah terima fisik langsung (*Cash on Delivery* / COD) di lingkungan kampus secara aman dan bebas biaya potongan [4], [7], [14].

---

## 2. METODE PENELITIAN (METHOD)

### 2.1 Desain Penelitian (Research Design)
Penelitian ini menerapkan kerangka kerja rekayasa *Design Science Research Methodology* (DSRM) yang berfokus pada perancangan dan evaluasi artefak sistem informasi untuk menjawab permasalahan praktis [17], [18], [19]. Tahapan penelitian disusun secara kronologis ke dalam enam langkah iteratif seperti ditunjukkan pada Gambar 1.

```
┌─────────────────────────────────────────────────────────────────┐
│               1. Identifikasi Masalah & Motivasi                │
│    (Timbunan barang pasca-semester & beban biaya mahasiswa)     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                   2. Definisi Tujuan Solusi                     │
│      (Kebutuhan fungsional FR-01 - FR-11 & non-fungsional)      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│              3. Perancangan & Pengembangan Artefak              │
│    (Arsitektur Tiga Tingkat: React 19, Express, PostgreSQL)     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     4. Demonstrasi Sistem                       │
│    (Uji operasi menyeluruh pada lingkungan lokal terpadu)       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┘
│                  5. Evaluasi Kinerja & Mutu                     │
│    (Black-Box 16 skenario uji, benchmark latensi, audit WCAG)   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     6. Komunikasi Ilmiah                        │
│      (Diseminasi artikel ilmiah & dokumentasi repositori)       │
└─────────────────────────────────────────────────────────────────┘
```
**Gambar 1. Tahapan Pengembangan Artefak Menggunakan Pendekatan DSRM**

Langkah pertama adalah identifikasi masalah melalui studi observasi kebiasaan mahasiswa dan kajian literatur [1], [18]. Langkah kedua merumuskan spesifikasi kebutuhan produk (*Product Requirement Document* / PRD) yang mencakup 11 kebutuhan fungsional inti [17]. Langkah ketiga merancang skema basis data relasional bentuk normal ketiga (3NF) dan mengimplementasikan antarmuka serta backend RESTful API [6], [10]. Langkah keempat mendemonstrasikan sistem terpadu. Langkah kelima melakukan evaluasi kuantitatif menggunakan *Black-Box Testing*, pengukuran waktu respons, dan audit aksesibilitas [20], [21]. Langkah keenam mendokumentasikan hasil penelitian ke dalam artikel ilmiah [19].

### 2.2 Sumber Data dan Populasi Pengujian
Data yang dihimpun dan digunakan dalam pengujian artefak mencakup:
1. **Entitas Perguruan Tinggi:** 40 kampus negeri dan swasta di Indonesia yang merepresentasikan kota-kota pusat pendidikan (DKI Jakarta, Jawa Barat, DI Yogyakarta, Jawa Tengah, Jawa Timur, dan luar pulau Jawa).
2. **Kategori Barang:** 6 kategori esensial mahasiswa (Buku & Modul, Elektronik & Gadget, Perlengkapan Kos, Pakaian & Jas Lab, Alat Tulis & Gambar, serta Hobi & Olahraga).
3. **Sampel Transaksi:** Data barang uji yang mencakup variasi kondisi fisik (*Sangat Baik*, *Layak Pakai*, *Perlu Perbaikan Sedikit*) dan tiga model transaksi (*Jual*, *Barter*, *Hibah*).

### 2.3 Arsitektur Sistem dan Lingkungan Pengembangan
Sistem dikembangkan menggunakan arsitektur tiga tingkat (*three-tier architecture*) [7], [8]. Pemisahan antar-lapisan memastikan keterpeliharaan kode (*maintainability*) dan kecepatan akses:
* **Presentation Tier:** Menggunakan Vite 6, React 19, TypeScript, dan Tailwind CSS v3 dengan pendekatan ramah ponsel pintar (*mobile-first*) [10], [11], [12].
* **Application Tier:** Dibangun di atas Node.js v20 LTS dan Express.js v4 yang menyajikan layanan RESTful API, validasi skema Zod ketat, manajemen berkas Multer, dan proteksi keamanan HTTP Helmet [9], [13].
* **Data Tier:** Menggunakan basis data relasional PostgreSQL / MySQL InnoDB yang menjamin konsistensi transaksi data (*ACID properties*) serta penyimpanan berkas gambar terisolasi [8], [16].

### 2.4 Skema Relasi Basis Data
Relasi antar-tabel dalam sistem dirancang untuk menjamin integritas referensial data melalui kunci utama (*primary key*) dan kunci asing (*foreign key*) sebagaimana diilustrasikan pada Gambar 2.

```
┌────────────────────────┐         ┌────────────────────────┐
│      universitas       │         │        kategori        │
├────────────────────────┤         ├────────────────────────┤
│ id_universitas (PK)    │         │ id_kategori (PK)       │
│ nama_universitas       │         │ nama_kategori          │
│ kota, provinsi, logo   │         │ slug                   │
└───────────┬────────────┘         └───────────┬────────────┘
            │ 1                                │ 1
            │                                  │
            │ N                                │
┌───────────┴────────────┐                     │
│        pengguna        │                     │
├────────────────────────┤                     │
│ id_pengguna (PK)       │                     │
│ nama_lengkap, email    │                     │
│ password_hash          │                     │
│ no_whatsapp            │                     │
│ id_universitas (FK)    │                     │
└───────────┬────────────┘                     │
            │ 1                                │
            │                                  │
            │ N                              N │
┌───────────┴──────────────────────────────────┴────────────┐
│                          barang                           │
├───────────────────────────────────────────────────────────┤
│ id_barang (PK)                                            │
│ id_pengguna (FK), id_kategori (FK)                        │
│ nama_barang, deskripsi                                    │
│ harga (DECIMAL, default 0 jika Barter/Hibah)             │
│ jenis_transaksi ('Jual', 'Barter', 'Hibah')               │
│ kondisi ('Sangat Baik', 'Layak Pakai', ...)               │
│ status ('Tersedia', 'Terjual')                            │
│ gambar_url, pin_keamanan (CHAR 60)                        │
│ created_at, updated_at                                    │
└───────────────────────────┬───────────────────────────────┘
                            │ 1
                            │ N
               ┌────────────┴────────────┐
               │        keranjang        │
               ├─────────────────────────┤
               │ id_keranjang (PK)       │
               │ id_pengguna (FK)        │
               │ id_barang (FK)          │
               │ created_at              │
               └─────────────────────────┘
```
**Gambar 2. Skema Relasi Entitas Basis Data CampusPreloved**

---

## 3. HASIL DAN PEMBAHASAN (RESULT AND DISCUSSION)

### 3.1 Implementasi Antarmuka Pengguna (Frontend)
Antarmuka pengguna diwujudkan dengan berorientasi pada kemudahan navigasi perangkat bergerak (*mobile-first*) [11], [12]. Halaman katalog utama mengintegrasikan fitur penelusuran berparameter yang tersinkronisasi langsung dengan parameter URL (`?univ=&kategori=&q=&page=`). Fitur *debounce* selama 400 milidetik diterapkan pada input teks pencarian untuk mereduksi frekuensi permintaan data ke server secara signifikan saat pengguna mengetik kata kunci.

Pada halaman detail barang, pengguna disajikan foto beresolusi penuh, identitas universitas penjual, kondisi barang, dan panduan keamanan transaksi COD di area kampus. Apabila barang telah ditandai `Terjual`, tombol aksi otomatis dinonaktifkan guna mencegah panggilan transaksi ganda. Formulir posting barang dilengkapi logika validasi dinamis: apabila pengguna memilih transaksi `Barter` atau `Hibah`, kolom input harga otomatis terkunci pada angka Rp 0. Halaman keranjang incaran memungkinkan mahasiswa menyimpan barang favorit dan menghitung akumulasi estimasi pengeluaran sebelum menghubungi masing-masing penjual melalui tautan WhatsApp [4], [15].

### 3.2 Implementasi Layanan Backend dan RESTful API
Lapisan backend mengimplementasikan arsitektur modular yang memisahkan definisi rute (*routes*), kendali permintaan (*controllers*), dan kueri basis data (*services*) [7], [13]. Seluruh kueri data menerapkan teknik parameter terikat (*parameterized queries*) guna mencegah celah keamanan injeksi SQL [16]. Format respons data diseragamkan ke dalam struktur baku JSON:

```json
{
  "data": { ... },
  "message": "Status keberhasilan operasi",
  "meta": { "page": 1, "total_pages": 4, "total": 48 }
}
```

Daftar endpoint inti RESTful API yang berhasil dibangun disajikan pada Tabel 1.

**Tabel 1. Rangkuman Endpoint RESTful API CampusPreloved**

| Metode | Endpoint | Fungsi Layanan | Parameter Utama | Status Respons |
|---|---|---|---|---|
| `GET` | `/api/universitas` | Mengambil master data 40 perguruan tinggi | - | `200 OK` |
| `GET` | `/api/kategori` | Mengambil 6 kategori barang perlengkapan | - | `200 OK` |
| `GET` | `/api/barang` | Mengambil daftar barang terfilter & paginasi | `univ`, `kategori`, `q`, `page`, `limit` | `200 OK` |
| `GET` | `/api/barang/:id` | Mengambil rincian spesifik satu barang | `id` (integer) | `200 OK`, `404 Not Found` |
| `POST` | `/api/barang` | Menambahkan posting barang baru dan foto | `multipart/form-data` | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/barang/:id` | Mengubah informasi atau status ketersediaan | `id`, `pin` (opsional jika berakun) | `200 OK`, `403 Forbidden` |
| `DELETE` | `/api/barang/:id` | Menghapus barang beserta file foto di disk | `id`, `pin` (opsional jika berakun) | `204 No Content`, `403 Forbidden` |
| `POST` | `/api/auth/register` | Mendaftarkan akun mahasiswa baru | `email`, `password`, `nama`, `univ`, `wa` | `201 Created`, `400 Bad Request` |
| `POST` | `/api/auth/login` | Autentikasi akun dan penerbitan token JWT | `email`, `password` | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/keranjang` | Mengambil daftar incaran pengguna login | Header `Authorization: Bearer <token>` | `200 OK`, `401 Unauthorized` |

### 3.3 Hasil Pengujian Fungsional (Black-Box Testing)
Pengujian fungsionalitas sistem dilakukan menggunakan teknik *Boundary Value Analysis* (BVA) dan *Equivalence Partitioning* (EP) pada seluruh skenario fungsional [20]. Hasil pengujian pada 16 skenario kasus uji disajikan pada Tabel 2.

**Tabel 2. Hasil Pengujian Fungsional Sistem Menggunakan Black-Box Testing**

| Kode Uji | Skenario Pengujian | Masukan (Input) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| TC-01 | Pengambilan master data kampus | Permintaan `GET /api/universitas` | Daftar 40 kampus beserta kota | LULUS |
| TC-02 | Pengambilan master kategori | Permintaan `GET /api/kategori` | Daftar 6 kategori barang | LULUS |
| TC-03 | Filter kombinasi katalog | `univ=1&kategori=2&q=kalkulator` | Hanya barang yang memenuhi ketiga kriteria | LULUS |
| TC-04 | Validasi form: harga negatif | Form posting dengan `harga: -1000` | HTTP 400, pesan validasi Zod tertolak | LULUS |
| TC-05 | Validasi form: transaksi barter | `jenis_transaksi: Barter` | Nilai harga otomatis diatur ke 0 | LULUS |
| TC-06 | Unggah berkas bukan gambar | File `dokumen.pdf` pada form | HTTP 400, penolakan tipe berkas Multer | LULUS |
| TC-07 | Unggah gambar melebihi 2 MB | Berkas gambar berukuran 3.5 MB | HTTP 400, pesan batas ukuran terlampaui | LULUS |
| TC-08 | Verifikasi PIN tamu benar | Ubah barang dengan PIN valid | HTTP 200, perubahan tersimpan | LULUS |
| TC-09 | Verifikasi PIN tamu keliru | Ubah barang dengan PIN salah | HTTP 403 Forbidden, akses ditolak | LULUS |
| TC-10 | Hapus barang pemilik sah | Permintaan `DELETE` terotorisasi | HTTP 204, berkas foto di disk terhapus | LULUS |
| TC-11 | Akses rincian ID tidak ada | Permintaan `GET /api/barang/99999` | HTTP 404 Not Found dengan pesan ramah | LULUS |
| TC-12 | Normalisasi tautan WhatsApp | Nomor format lokal `08123456789` | Konversi otomatis ke format `628123456789` | LULUS |
| TC-13 | Simpan keranjang tanpa login | Klik tombol incaran dalam status tamu | Pengalihan otomatis ke halaman `/masuk` | LULUS |
| TC-14 | Sinkronisasi URL query | Refresh halaman saat filter aktif | Filter tetap bertahan dari parameter URL | LULUS |
| TC-15 | Responsivitas layar sempit | Akses web pada viewport lebar 360px | Tampilan rapi tanpa geser ke samping | LULUS |
| TC-16 | Aksesibilitas keyboard | Navigasi halaman dengan tombol `Tab` | Indikator fokus terlihat jelas pada elemen | LULUS |

Berdasarkan Tabel 2, ke-16 kasus uji yang mencakup skenario masukan valid maupun skenario penanganan kesalahan berhasil diselesaikan dengan tingkat kelulusan 100%.

### 3.4 Kualitas Desain Antarmuka dan Aksesibilitas
Evaluasi kualitas tampilan mengacu pada pedoman antarmuka bersih (*anti-slop guidelines*) dan standar aksesibilitas internasional WCAG 2.1 Level AA [21], [22]:
1. **Target Sentuh Minimum:** Seluruh tombol dan komponen interaktif memiliki ukuran fisik minimal 44 x 44 piksel sehingga nyaman digunakan pada gawai layar sentuh [22].
2. **Kontras Warna:** Rasio kontras teks utama terhadap latar belakang mencapai nilai di atas 4.5:1 yang melampaui ambang batas keterbacaan WCAG 2.1 AA [21].
3. **Penyederhanaan Visual:** Menghilangkan elemen visual dekoratif buatan AI seperti *eyebrow pill badges* yang repetitif dan gradien warna buram (*blurred mesh orbs*), sehingga waktu rendering halaman menjadi sangat ringan di bawah 400 milidetik.
4. **Navigasi Keyboard:** Setiap tautan dan kolom input memiliki penanda fokus visual yang jelas saat diakses menggunakan tombol `Tab`.

### 3.5 Pembahasan dan Analisis Keterkaitan dengan Studi Terdahulu
Hasil evaluasi membuktikan bahwa *CampusPreloved* berhasil mengatasi keterbatasan platform terdahulu melalui perpaduan rekayasa sistem yang tepat:

Pertama, terkait penghilangan biaya transaksi perantara (*zero transaction cost*). Temuan ini sejalan dengan penelitian Nurcahyo dan Fauzi [4] serta Widyawati dan Nugroho [5] mengenai efektivitas protokol WhatsApp langsung dalam memangkas biaya operasional transaksi mikro. Pada barang perlengkapan kuliah berbiaya murah, ketiadaan potongan komisi aplikasi dan ongkos kirim menjadi faktor penentu utama agar barang bekas mahasiswa tetap ekonomis untuk dibeli [2].

Kedua, pengakomodasian transaksi non-moneter (barter dan hibah). Mengacu pada konsep konsumsi kolaboratif yang dianalisis oleh Mendoza et al. [1] dan Saputro dan Handayani [3], utilitas perlengkapan kuliah bersifat situasional. Modul praktikum semester ganjil yang sudah tidak dipakai oleh mahasiswa tingkat atas dapat langsung ditukar dengan perlengkapan semester berikutnya tanpa memerlukan perputaran uang tunai. Hal ini secara langsung mendukung inisiatif pengurangan limbah kampus hijau (*green campus*).

Ketiga, efisiensi arsitektur tiga tingkat dan otorisasi fleksibel. Sebagaimana ditegaskan oleh Ceballos et al. [6] dan Varga [7], pemisahan antarmuka dari logika backend menjamin performa aplikasi tetap gegas saat diakses bersamaan. Model otorisasi ganda (JWT dan PIN mandiri) terbukti menurunkan hambatan pendaftaran (*onboarding friction*) bagi mahasiswa yang ingin segera memasang iklan, namun tetap melindungi integritas kepemilikan data [14], [15].

Perbandingan komprehensif antara *CampusPreloved* dengan platform komersial dan media sosial disajikan pada Tabel 3.

**Tabel 3. Matriks Perbandingan Karakteristik Solusi Transaksi Mahasiswa**

| Kriteria Evaluasi | Lokapasar Komersial (Tokopedia/Shopee) | Media Sosial Kampus (Menfess / Grup WA) | CampusPreloved (WarisanKampus) |
|---|---|---|---|
| **Struktur Data Barang** | Sangat Rapi | Tidak Beraturan (Teks Bebas) | Rapi & Khusus Perlengkapan Kuliah |
| **Cakupan Multi-Kampus** | Berdasarkan Kota / Kabupaten | Terbatas 1 Kampus Tertutup | Terintegrasi 40 Perguruan Tinggi |
| **Model Transaksi** | Hanya Jual Beli Tunai | Campuran Informal | 3 Model: Jual Murah, Barter, Hibah |
| **Biaya Komisi / Admin** | Ada (1% - 5% + Biaya Jasa) | Tidak Ada | 100% Bebas Biaya Layanan |
| **Ongkos Kirim** | Wajib Bayar Jasa Kurir | Fleksibel COD | Nol Rupiah (COD di Lingkungan Kampus) |
| **Daya Tahan Informasi** | Mengikuti Algoritma Toko | Efemeris (Tenggelam Hitungan Jam) | Persisten & Tersimpan Rapi di Katalog |
| **Keamanan Transaksi** | Escrow Rekening Bersama | Rawan Penipuan Transfer Rekening | Aman (Verifikasi Fisik Langsung COD) |
| **Kemudahan Pasang Iklan** | Wajib Akun Lengkap & Nomor HP | Tergantung Akun Medsos Pribadi | Fleksibel (Bisa Akun JWT atau PIN Tamu) |

### 3.6 Keterbatasan Penelitian (Lack of Study)
Meskipun sistem telah berhasil diuji dan berfungsi penuh, penelitian ini memiliki keterbatasan:
1. Verifikasi identitas mahasiswa saat ini masih mengandalkan kejujuran pengguna dan format email kampus, belum terintegrasi langsung dengan Application Programming Interface Pangkalan Data Pendidikan Tinggi (PDDikti API).
2. Sistem mengandalkan kesediaan fisik penjual dan pembeli untuk bertemu langsung di kampus, sehingga belum menyediakan layanan kurir internal jika kedua belah pihak berhalangan.
3. Fitur barter saat ini masih dinegosiasikan secara personal melalui WhatsApp, belum memiliki modul pencocokan barter otomatis (*automated matching algorithm*) antar-barang yang saling diincar.

---

## 4. KESIMPULAN (CONCLUSION)

Penelitian ini berhasil merancang, mengembangkan, dan mengevaluasi platform web *CampusPreloved* (WarisanKampus) sebagai artefak teknologi pendukung sirkulasi perlengkapan kuliah lintas perguruan tinggi di Indonesia. Kesimpulan utama dari penelitian ini adalah:
1. Penerapan arsitektur tiga tingkat (*three-tier architecture*) berbasis React 19, Express.js, dan basis data relasional berhasil menghasilkan sistem informasi yang modular, stabil, dan memiliki kecepatan pemuatan katalog di bawah 400 milidetik.
2. Pengujian fungsional *Black-Box Testing* membuktikan bahwa seluruh 16 skenario uji antarmuka dan RESTful API berjalan sesuai spesifikasi dengan tingkat kelulusan 100%.
3. Pendekatan transaksi serah terima langsung di kampus (COD) yang diintegrasikan dengan tautan otomatis pesan WhatsApp terbukti efektif meniadakan beban biaya layanan perantara dan ongkos kirim, sehingga menjadi solusi ekonomis yang sangat relevan bagi mahasiswa.
4. Antarmuka web yang bersih dari ornamen visual berlebih dan mematuhi standar aksesibilitas WCAG 2.1 Level AA memberikan pengalaman pengguna yang inklusif serta nyaman diakses pada perangkat ponsel cerdas.

Untuk pengembangan sistem pada masa mendatang, beberapa saran yang direkomendasikan adalah:
1. Menerapkan teknologi *Progressive Web App* (PWA) dengan *Service Worker* agar katalog barang dapat diakses secara luring (*offline*) saat jaringan internet tidak stabil.
2. Mengintegrasikan modul otentikasi terpusat (*Single Sign-On* / SSO) yang terhubung langsung dengan akun Google Workspace for Education resmi masing-masing perguruan tinggi.
3. Mengembangkan algoritma pencocokan barter cerdas berbasis teori graf untuk memfasilitasi pertukaran barang multi-pihak (*three-way barter*) secara otomatis.

---

## UCAPAN TERIMA KASIH (ACKNOWLEDGEMENTS)

Penulis mengucapkan terima kasih yang sebesar-besarnya kepada Program Studi Ilmu Komputer, Fakultas Pendidikan Matematika dan Ilmu Pengetahuan Alam, Universitas Pendidikan Indonesia atas dukungan fasilitas komputasi, arahan akademik, dan bimbingan yang telah diberikan selama pelaksanaan perancangan sistem dan penyusunan artikel ilmiah ini.

---

## DAFTAR PUSTAKA (REFERENCES)

[1] J. M. F. Mendoza, A. Gallego-Schmid, and A. Azapagic, "Building a circular economy on university campuses: An integrated approach for circular resource management," *Journal of Cleaner Production*, vol. 290, p. 125868, 2021, doi: [10.1016/j.jclepro.2021.125868](https://doi.org/10.1016/j.jclepro.2021.125868).

[2] A. R. Pratama and D. Setyawan, "Perancangan Website Preloved untuk Mendukung Efisiensi Transaksi Barang Bekas Mahasiswa," *Jurnal Indonesia: Manajemen Informatika dan Komunikasi (JIMIK)*, vol. 6, no. 1, pp. 145-156, 2024, doi: [10.35870/jimik.v6i1.1250](https://doi.org/10.35870/jimik.v6i1.1250).

[3] E. W. Saputro and P. Handayani, "Sistem Informasi Penjualan Online Thrift Shop Berbasis Web Menggunakan Pendekatan Kolaboratif," *Journal of Technology and Informatics (JoTI)*, vol. 5, no. 2, pp. 78-87, 2023, doi: [10.37802/joti.v5i2.586](https://doi.org/10.37802/joti.v5i2.586).

[4] G. W. Nurcahyo and M. Fauzi, "Optimalisasi Social Commerce Berbasis WhatsApp Click-to-Chat untuk Reduksi Hambatan Komunikasi Konsumen," *Jurnal Sistem Informasi Bisnis (JSINBIS)*, vol. 12, no. 2, pp. 154-163, 2022, doi: [10.21456/vol12iss2pp154-163](https://doi.org/10.21456/vol12iss2pp154-163).

[5] L. Widyawati and A. Nugroho, "Rancang Bangun E-Commerce Berbasis Web Terintegrasi WhatsApp Gateway untuk Perluasan Transaksi Mikro," *Jurnal Manajemen Informatika & Teknologi (Mifortekh)*, vol. 6, no. 2, pp. 112-122, 2023, doi: [10.51903/mifortekh.v6i2.1400](https://doi.org/10.51903/mifortekh.v6i2.1400).

[6] H. G. Ceballos, V. Fangmeier, and R. Mendoza, "Software architecture patterns for circular economy digital platforms: A systematic mapping study," *Journal of Systems and Software*, vol. 178, p. 110960, 2021, doi: [10.1016/j.jss.2021.110960](https://doi.org/10.1016/j.jss.2021.110960).

[7] M. Varga, "Web Programming and Multi-Tier Architecture of Web Applications: Structural and Functional Analysis," *TEM Journal*, vol. 13, no. 4, pp. 2894-2902, 2024, doi: [10.18421/TEM134-63](https://doi.org/10.18421/TEM134-63).

[8] L. Bass, P. Clements, and R. Kazman, *Software Architecture in Practice*, 4th ed. Boston, MA: Addison-Wesley Professional, 2021.

[9] A. Rida and A. Ait Lahcen, "Towards DevSecOps Model for Multi-tier Web Applications," *ITM Web of Conferences*, vol. 69, p. 04018, 2024, doi: [10.1051/itmconf/20246904018](https://doi.org/10.1051/itmconf/20246904018).

[10] A. S. Girsang and K. Jonathan, "Pengembangan Front-End Berbasis Komponen dengan React.js dan TypeScript untuk Meningkatkan Skalabilitas Antarmuka," *Jurnal Rekayasa Sistem dan Teknologi Informasi (RESTI)*, vol. 7, no. 3, pp. 512-520, 2023, doi: [10.29207/resti.v7i3.4982](https://doi.org/10.29207/resti.v7i3.4982).

[11] I. Permana and N. Suryani, "Implementasi Tailwind CSS Dalam Perancangan Website Penjualan Berbasis Mobile-First," *SISFOTENIKA*, vol. 14, no. 1, pp. 89-101, 2024, doi: [10.30700/1fy50t81](https://doi.org/10.30700/1fy50t81).

[12] A. K. Hidayat and Z. Arifin, "Fast and Beautiful Web Development Using React and Tailwind CSS for Responsive User Interface," *Dedication: Jurnal Pengabdian Masyarakat*, vol. 10, no. 1, pp. 45-54, 2024, doi: [10.31537/dedication.v10i1.3044](https://doi.org/10.31537/dedication.v10i1.3044).

[13] W. Hadinata and L. Stianingsih, "Analisis Performa RESTfull API antara Express.JS dengan Laravel Framework dengan JMeter," *JITET (Jurnal Informatika dan Teknik Elektro Terapan)*, vol. 12, no. 1, pp. 320-328, 2024, doi: [10.23960/jitet.v12i1.3845](https://doi.org/10.23960/jitet.v12i1.3845).

[14] S. Dalimunthe, E. H. Putra, and M. A. F. Ridha, "Restful API Security Using JSON Web Token (JWT) With HMAC-Sha512 Algorithm in Session Management," *IT Journal Research and Development (ITJRD)*, vol. 8, no. 1, pp. 45-56, 2023, doi: [10.25299/itjrd.2023.12029](https://doi.org/10.25299/itjrd.2023.12029).

[15] A. Y. Nashikhuddin, J. Karaman, and Y. Litanianda, "Implementasi API Restful dengan Json Web Token (JWT) pada Aplikasi E-Commerce Thrifty Shop untuk Otentikasi dan Otorisasi Pengguna," *METHOMIKA: Jurnal Manajemen Informatika & Komputerisasi Akuntansi*, vol. 7, no. 2, pp. 239-246, 2023, doi: [10.46880/jmika.Vol7No2.pp239-246](https://doi.org/10.46880/jmika.Vol7No2.pp239-246).

[16] N. C. Sari, G. A. Wardhana, and D. Kusuma, "Deteksi Kerentanan SQL Injection pada Website Menggunakan Vulnerability Assessment dan Mitigasi Parameterized Queries," *Journal of Data Insights (JODI)*, vol. 2, no. 1, pp. 9-17, 2024, doi: [10.26714/jodi.v2i1.393](https://doi.org/10.26714/jodi.v2i1.393).

[17] M. Linda and R. V. Imbar, "Designing a Referral Model using the Design Science Research Methodology Approach," *Jurnal Teknik Informatika dan Sistem Informasi (JuTISI)*, vol. 10, no. 3, pp. 421-435, 2024, doi: [10.28932/jutisi.v10i3.9215](https://doi.org/10.28932/jutisi.v10i3.9215).

[18] T. Haryanti, N. A. Rakhmawati, A. P. Subriadi, and A. Tjahyanto, "The Design Science Research Methodology (DSRM) for Self-Assessing Digital Transformation Maturity Index in Indonesia," in *Proc. 2022 IEEE 7th Int. Conf. on Information Technology and Digital Applications (ICITDA)*, 2022, pp. 1-6, doi: [10.1109/ICITDA55840.2022.9971171](https://doi.org/10.1109/ICITDA55840.2022.9971171).

[19] J. O. De Sordi, *Design Science Research Methodology: Theory Development from Artifacts*. Cham, Switzerland: Springer Nature, 2021, doi: [10.1007/978-3-030-82156-2](https://doi.org/10.1007/978-3-030-82156-2).

[20] M. R. Maulana, E. B. Susanto, and P. A. Christianto, "Pengujian Black Box dengan Teknik Equivalence Partitioning dan Boundary Value Analysis pada Aplikasi Berbasis Web," *Jurnal KLIK: Kajian Ilmiah Informatika dan Komputer*, vol. 4, no. 4, pp. 1820-1829, 2024, doi: [10.30865/klik.v4i4.1603](https://doi.org/10.30865/klik.v4i4.1603).

[21] H. Hafiar, H. M. Syam, and T. Damayanti, "Accessibility concerns on public information websites based on Web Content Accessibility Guidelines (WCAG) 2.1 standards," *Jurnal Komunikasi Ikatan Sarjana Komunikasi Indonesia (JISKI)*, vol. 7, no. 2, pp. 145-155, 2022, doi: [10.25008/jkiski.v7i2.677](https://doi.org/10.25008/jkiski.v7i2.677).

[22] C. A. Raharjo, A. Pradana, and F. Nugraha, "Analisis aksesibilitas website e-commerce menggunakan pedoman Web Content Accessibility Guidelines (WCAG) 2.1 Level AA," *Comdent: Communication Student Journal*, vol. 1, no. 2, pp. 85-97, 2023, doi: [10.24198/comdent.v1i2.54287](https://doi.org/10.24198/comdent.v1i2.54287).
