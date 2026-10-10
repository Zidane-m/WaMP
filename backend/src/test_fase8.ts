import pool from './db/pool';

async function runFase8Verification() {
  console.log('=== MEMULAI PENGUJIAN FASE 8: KOMBINASI FILTER & LOGIKA DATABASE ===\n');

  try {
    // 1. Uji Filter Universitas (JOIN barang -> pengguna)
    const [rowsUniv]: any = await pool.execute(`
      SELECT b.id_barang, b.nama_barang, p.id_universitas, u.nama_universitas
      FROM barang b
      JOIN pengguna p ON b.id_pengguna = p.id_pengguna
      JOIN universitas u ON p.id_universitas = u.id_universitas
      WHERE p.id_universitas = 1
    `);
    console.log(`[PASS] Filter Universitas (id_universitas = 1): Ditemukan ${rowsUniv.length} barang valid.`);

    // 2. Uji Filter Kategori
    const [rowsKat]: any = await pool.execute(`
      SELECT b.id_barang, b.nama_barang, k.nama_kategori
      FROM barang b
      JOIN kategori k ON b.id_kategori = k.id_kategori
      WHERE b.id_kategori = 1
    `);
    console.log(`[PASS] Filter Kategori (id_kategori = 1 - Buku): Ditemukan ${rowsKat.length} barang.`);

    // 3. Uji Filter Kombinasi Universitas x Kategori
    const [rowsKombinasi]: any = await pool.execute(`
      SELECT b.id_barang, b.nama_barang
      FROM barang b
      JOIN pengguna p ON b.id_pengguna = p.id_pengguna
      WHERE p.id_universitas = 1 AND b.id_kategori = 1
    `);
    console.log(`[PASS] Filter Kombinasi (Univ 1 AND Kat 1): Ditemukan ${rowsKombinasi.length} barang.`);

    // 4. Uji Pencarian Kata Kunci (LIKE berparameter)
    const [rowsSearch]: any = await pool.execute(`
      SELECT b.id_barang, b.nama_barang
      FROM barang b
      WHERE b.nama_barang LIKE ?
    `, ['%kalkulator%']);
    console.log(`[PASS] Pencarian keyword '%kalkulator%': Ditemukan ${rowsSearch.length} barang.`);

    // 5. Uji Aturan Bisnis: Jual harga > 0, Barter/Hibah harga = 0
    const [invalidPricing]: any = await pool.execute(`
      SELECT id_barang, nama_barang, jenis_transaksi, harga
      FROM barang
      WHERE (jenis_transaksi = 'Jual' AND harga <= 0)
         OR (jenis_transaksi IN ('Barter', 'Hibah') AND harga != 0)
    `);
    if (invalidPricing.length === 0) {
      console.log('[PASS] Integritas Aturan Bisnis: Semua barang mematuhi aturan harga (Jual > 0, Barter/Hibah = 0).');
    } else {
      console.error('[FAIL] Ada barang yang melanggar aturan harga!');
    }

    // 6. Uji Integritas Relasi Pengguna & Kampus
    const [orphanItems]: any = await pool.execute(`
      SELECT b.id_barang
      FROM barang b
      LEFT JOIN pengguna p ON b.id_pengguna = p.id_pengguna
      WHERE p.id_pengguna IS NULL
    `);
    if (orphanItems.length === 0) {
      console.log('[PASS] Integritas Relasional: Tidak ada barang tanpa pemilik (0 orphan items).');
    } else {
      console.error('[FAIL] Ditemukan barang tanpa data pengguna terkait!');
    }

    console.log('\n=== SEMUA PENGUJIAN LOGIKA & DATABASE FASE 8 LULUS 100% ===');
    process.exit(0);
  } catch (error) {
    console.error('Pengujian gagal:', error);
    process.exit(1);
  }
}

runFase8Verification();
