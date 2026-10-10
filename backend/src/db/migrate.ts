import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  console.log('[Migrasi] Menghubungkan ke MySQL Laragon...');

  const rootConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    // 1. Baca dan eksekusi schema.sql
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    console.log(`[Migrasi] Membaca skema dari: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[Migrasi] Mengeksekusi database/schema.sql...');
    await rootConnection.query(schemaSql);
    console.log('[Migrasi] Skema database berhasil dibuat.');

    // 2. Baca dan eksekusi seed.sql
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    console.log(`[Migrasi] Membaca data sampel dari: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('[Migrasi] Mengeksekusi database/seed.sql...');
    await rootConnection.query(seedSql);
    console.log('[Migrasi] Data sampel (seed) berhasil dimasukkan.');

    // 3. Verifikasi dengan query JOIN
    console.log('[Verifikasi] Menjalankan query JOIN: barang + pengguna + universitas + kategori...');
    const [rows] = await rootConnection.query(`
      SELECT 
        b.id_barang,
        b.nama_barang,
        b.harga,
        b.jenis_transaksi,
        b.kondisi,
        b.status,
        k.nama_kategori,
        p.nama_lengkap AS penjual,
        p.no_whatsapp,
        u.nama_universitas AS universitas
      FROM campuspreloved.barang b
      INNER JOIN campuspreloved.kategori k ON b.id_kategori = k.id_kategori
      INNER JOIN campuspreloved.pengguna p ON b.id_pengguna = p.id_pengguna
      INNER JOIN campuspreloved.universitas u ON p.id_universitas = u.id_universitas
      ORDER BY b.id_barang ASC
    `);

    console.log(`[Verifikasi] Berhasil! Ditemukan ${(rows as any[]).length} barang dari hasil JOIN:`);
    console.table(rows);

  } catch (error) {
    console.error('[Migrasi Gagal]:', error);
    process.exit(1);
  } finally {
    await rootConnection.end();
  }
}

runMigration();
