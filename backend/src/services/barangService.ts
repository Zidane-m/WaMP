import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import pool from '../db/pool';
import { AppError } from '../middleware/errorHandler';
import { normalizeWhatsApp } from '../lib/whatsapp';

export interface BarangItem {
  id_barang: number;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  jenis_transaksi: 'Jual' | 'Barter' | 'Hibah';
  kondisi: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  status: 'Tersedia' | 'Terjual';
  gambar_url: string | null;
  created_at: string;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
  penjual: {
    id_pengguna: number;
    nama_lengkap: string;
    no_whatsapp: string;
    universitas: {
      id_universitas: number;
      nama_universitas: string;
    };
  };
}

interface RawBarangRow extends RowDataPacket {
  id_barang: number;
  nama_barang: string;
  deskripsi: string;
  harga: string | number;
  jenis_transaksi: 'Jual' | 'Barter' | 'Hibah';
  kondisi: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  status: 'Tersedia' | 'Terjual';
  gambar_url: string | null;
  pin_keamanan?: string;
  created_at: string;
  id_kategori: number;
  nama_kategori: string;
  id_pengguna: number;
  nama_lengkap: string;
  no_whatsapp: string;
  id_universitas: number;
  nama_universitas: string;
}

function mapRowToBarangItem(row: RawBarangRow): BarangItem {
  return {
    id_barang: row.id_barang,
    nama_barang: row.nama_barang,
    deskripsi: row.deskripsi,
    harga: Number(row.harga),
    jenis_transaksi: row.jenis_transaksi,
    kondisi: row.kondisi,
    status: row.status,
    gambar_url: row.gambar_url,
    created_at: row.created_at,
    kategori: {
      id_kategori: row.id_kategori,
      nama_kategori: row.nama_kategori
    },
    penjual: {
      id_pengguna: row.id_pengguna,
      nama_lengkap: row.nama_lengkap,
      no_whatsapp: row.no_whatsapp,
      universitas: {
        id_universitas: row.id_universitas,
        nama_universitas: row.nama_universitas
      }
    }
  };
}

async function removeUploadedFile(gambarUrl: string | null): Promise<void> {
  if (!gambarUrl || !gambarUrl.startsWith('/uploads/')) return;
  const fileName = gambarUrl.replace('/uploads/', '');
  const filePath = path.join(__dirname, '../../uploads', fileName);
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.error('[Hapus File Gagal]:', err);
  }
}

export interface FilterParams {
  id_universitas?: number;
  id_kategori?: number;
  search?: string;
  status?: 'Tersedia' | 'Terjual';
  page?: number;
  limit?: number;
}

export async function getBarangList(filters: FilterParams): Promise<{
  data: BarangItem[];
  meta: { page: number; limit: number; total: number; total_pages: number };
}> {
  const page = filters.page && filters.page >= 1 ? filters.page : 1;
  const limit = filters.limit && filters.limit >= 1 ? filters.limit : 12;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: Array<number | string> = [];

  if (filters.id_universitas) {
    conditions.push('p.id_universitas = ?');
    params.push(filters.id_universitas);
  }

  if (filters.id_kategori) {
    conditions.push('b.id_kategori = ?');
    params.push(filters.id_kategori);
  }

  if (filters.status) {
    conditions.push('b.status = ?');
    params.push(filters.status);
  }

  if (filters.search) {
    conditions.push('b.nama_barang LIKE ?');
    params.push(`%${filters.search}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // 1. Query Total Data
  const countSql = `
    SELECT COUNT(*) AS total
    FROM barang b
    INNER JOIN pengguna p ON b.id_pengguna = p.id_pengguna
    ${whereClause}
  `;
  const [countResult] = await pool.query<RowDataPacket[]>(countSql, params);
  const total = Number(countResult[0]?.total || 0);
  const total_pages = total === 0 ? 0 : Math.ceil(total / limit);

  // 2. Query Data dengan Paginasi
  const dataSql = `
    SELECT 
      b.id_barang,
      b.nama_barang,
      b.deskripsi,
      b.harga,
      b.jenis_transaksi,
      b.kondisi,
      b.status,
      b.gambar_url,
      b.created_at,
      k.id_kategori,
      k.nama_kategori,
      p.id_pengguna,
      p.nama_lengkap,
      p.no_whatsapp,
      u.id_universitas,
      u.nama_universitas
    FROM barang b
    INNER JOIN kategori k ON b.id_kategori = k.id_kategori
    INNER JOIN pengguna p ON b.id_pengguna = p.id_pengguna
    INNER JOIN universitas u ON p.id_universitas = u.id_universitas
    ${whereClause}
    ORDER BY b.created_at DESC, b.id_barang DESC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [...params, limit, offset];
  const [rows] = await pool.query<RawBarangRow[]>(dataSql, queryParams);

  return {
    data: rows.map(mapRowToBarangItem),
    meta: {
      page,
      limit,
      total,
      total_pages
    }
  };
}

export async function getBarangById(id: number): Promise<BarangItem> {
  const sql = `
    SELECT 
      b.id_barang,
      b.nama_barang,
      b.deskripsi,
      b.harga,
      b.jenis_transaksi,
      b.kondisi,
      b.status,
      b.gambar_url,
      b.created_at,
      k.id_kategori,
      k.nama_kategori,
      p.id_pengguna,
      p.nama_lengkap,
      p.no_whatsapp,
      u.id_universitas,
      u.nama_universitas
    FROM barang b
    INNER JOIN kategori k ON b.id_kategori = k.id_kategori
    INNER JOIN pengguna p ON b.id_pengguna = p.id_pengguna
    INNER JOIN universitas u ON p.id_universitas = u.id_universitas
    WHERE b.id_barang = ?
  `;

  const [rows] = await pool.query<RawBarangRow[]>(sql, [id]);
  if (rows.length === 0) {
    throw new AppError('Barang tidak ditemukan', 404);
  }

  return mapRowToBarangItem(rows[0]);
}

export async function getBarangSaya(userId: number): Promise<BarangItem[]> {
  const [rows] = await pool.query<RawBarangRow[]>(
    `SELECT 
      b.id_barang,
      b.nama_barang,
      b.deskripsi,
      b.harga,
      b.jenis_transaksi,
      b.kondisi,
      b.status,
      b.gambar_url,
      b.created_at,
      kat.id_kategori,
      kat.nama_kategori,
      p.id_pengguna,
      p.nama_lengkap,
      p.no_whatsapp,
      u.id_universitas,
      u.nama_universitas
    FROM barang b
    JOIN kategori kat ON b.id_kategori = kat.id_kategori
    JOIN pengguna p ON b.id_pengguna = p.id_pengguna
    JOIN universitas u ON p.id_universitas = u.id_universitas
    WHERE b.id_pengguna = ?
    ORDER BY b.created_at DESC`,
    [userId]
  );

  return rows.map(mapRowToBarangItem);
}

export interface CreateBarangInput {
  nama_barang: string;
  deskripsi: string;
  jenis_transaksi: 'Jual' | 'Barter' | 'Hibah';
  harga: number;
  kondisi: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  id_kategori: number;
  id_universitas: number;
  nama_lengkap: string;
  email: string;
  nim?: string;
  no_whatsapp: string;
  pin?: string;
}

export async function createBarang(
  data: CreateBarangInput,
  file?: Express.Multer.File,
  authUser?: { id_pengguna: number }
): Promise<BarangItem> {
  // 1. Verifikasi Universitas & Kategori ada
  const [univCheck] = await pool.query<RowDataPacket[]>(
    'SELECT id_universitas FROM universitas WHERE id_universitas = ?',
    [data.id_universitas]
  );
  if (univCheck.length === 0) {
    throw new AppError('Universitas yang dipilih tidak ditemukan', 400);
  }

  const [katCheck] = await pool.query<RowDataPacket[]>(
    'SELECT id_kategori FROM kategori WHERE id_kategori = ?',
    [data.id_kategori]
  );
  if (katCheck.length === 0) {
    throw new AppError('Kategori yang dipilih tidak ditemukan', 400);
  }

  const normalizedPhone = normalizeWhatsApp(data.no_whatsapp);

  // 2. Upsert Pengguna berdasarkan Email atau Gunakan id_pengguna dari sesi login
  let userId: number;
  if (authUser) {
    userId = authUser.id_pengguna;
    // Perbarui data pengguna jika ada perubahan
    await pool.query(
      `UPDATE pengguna SET 
        nama_lengkap = ?, 
        id_universitas = ?, 
        nim = ?, 
        no_whatsapp = ? 
       WHERE id_pengguna = ?`,
      [data.nama_lengkap, data.id_universitas, data.nim || null, normalizedPhone, userId]
    );
  } else {
    const [userRows] = await pool.query<RowDataPacket[]>(
      'SELECT id_pengguna FROM pengguna WHERE email = ?',
      [data.email]
    );

    if (userRows.length > 0) {
      userId = userRows[0].id_pengguna;
      await pool.query(
        `UPDATE pengguna SET 
          nama_lengkap = ?, 
          id_universitas = ?, 
          nim = ?, 
          no_whatsapp = ? 
         WHERE id_pengguna = ?`,
        [data.nama_lengkap, data.id_universitas, data.nim || null, normalizedPhone, userId]
      );
    } else {
      const [insertUser] = await pool.query<ResultSetHeader>(
        `INSERT INTO pengguna (id_universitas, nama_lengkap, email, nim, no_whatsapp) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.id_universitas, data.nama_lengkap, data.email, data.nim || null, normalizedPhone]
      );
      userId = insertUser.insertId;
    }
  }

  // 3. Hash PIN Keamanan (Wajib jika tidak login, opsional jika login)
  let hashedPin: string | null = null;
  if (data.pin) {
    hashedPin = await bcrypt.hash(data.pin, 10);
  } else if (!authUser) {
    throw new AppError('PIN keamanan wajib diisi untuk pengguna yang belum masuk', 400);
  }

  const gambarUrl = file ? `/uploads/${file.filename}` : null;

  // 4. Insert Barang
  const [insertBarang] = await pool.query<ResultSetHeader>(
    `INSERT INTO barang (
      id_pengguna, 
      id_kategori, 
      nama_barang, 
      deskripsi, 
      harga, 
      jenis_transaksi, 
      kondisi, 
      status, 
      gambar_url, 
      pin_keamanan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Tersedia', ?, ?)`,
    [
      userId,
      data.id_kategori,
      data.nama_barang,
      data.deskripsi,
      data.harga,
      data.jenis_transaksi,
      data.kondisi,
      gambarUrl,
      hashedPin
    ]
  );

  return getBarangById(insertBarang.insertId);
}

export interface UpdateBarangInput {
  pin?: string;
  nama_barang?: string;
  deskripsi?: string;
  jenis_transaksi?: 'Jual' | 'Barter' | 'Hibah';
  harga?: number;
  kondisi?: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  status?: 'Tersedia' | 'Terjual';
  id_kategori?: number;
  new_pin?: string;
}

export async function updateBarang(
  id: number,
  data: UpdateBarangInput,
  file?: Express.Multer.File,
  authUser?: { id_pengguna: number }
): Promise<BarangItem> {
  // 1. Ambil data barang yang ada
  const [currentRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM barang WHERE id_barang = ?',
    [id]
  );

  if (currentRows.length === 0) {
    if (file) await removeUploadedFile(`/uploads/${file.filename}`);
    throw new AppError('Barang tidak ditemukan', 404);
  }

  const current = currentRows[0];

  // 2. Verifikasi Otorisasi: Pemilik yang sudah login bypass PIN, tamu wajib PIN
  const isOwnerLoggedIn = authUser && authUser.id_pengguna === current.id_pengguna;

  if (!isOwnerLoggedIn) {
    if (!data.pin) {
      if (file) await removeUploadedFile(`/uploads/${file.filename}`);
      throw new AppError('PIN keamanan wajib disertakan', 400);
    }

    if (!current.pin_keamanan) {
      if (file) await removeUploadedFile(`/uploads/${file.filename}`);
      throw new AppError('Barang ini hanya dapat diedit oleh akun pemilik yang sedang masuk', 403);
    }

    const isPinValid = await bcrypt.compare(data.pin, current.pin_keamanan);
    if (!isPinValid) {
      if (file) await removeUploadedFile(`/uploads/${file.filename}`);
      throw new AppError('PIN keamanan salah', 403);
    }
  }

  // 3. Verifikasi kategori jika ada perubahan
  if (data.id_kategori !== undefined) {
    const [katCheck] = await pool.query<RowDataPacket[]>(
      'SELECT id_kategori FROM kategori WHERE id_kategori = ?',
      [data.id_kategori]
    );
    if (katCheck.length === 0) {
      if (file) await removeUploadedFile(`/uploads/${file.filename}`);
      throw new AppError('Kategori yang dipilih tidak ditemukan', 400);
    }
  }

  // 4. Validasi aturan harga vs jenis transaksi hasil update
  const finalJenis = data.jenis_transaksi !== undefined ? data.jenis_transaksi : current.jenis_transaksi;
  const finalHarga = data.harga !== undefined ? data.harga : Number(current.harga);

  if (finalJenis === 'Jual' && finalHarga <= 0) {
    if (file) await removeUploadedFile(`/uploads/${file.filename}`);
    throw new AppError('Harga harus lebih dari 0 untuk jenis transaksi Jual', 400);
  }
  if ((finalJenis === 'Barter' || finalJenis === 'Hibah') && finalHarga !== 0) {
    if (file) await removeUploadedFile(`/uploads/${file.filename}`);
    throw new AppError('Harga harus 0 untuk jenis transaksi Barter atau Hibah', 400);
  }

  // 5. Penanganan file gambar baru
  let newGambarUrl = current.gambar_url;
  if (file) {
    if (current.gambar_url) {
      await removeUploadedFile(current.gambar_url);
    }
    newGambarUrl = `/uploads/${file.filename}`;
  }

  // 6. Penanganan PIN baru jika diperbarui
  let newHashedPin = current.pin_keamanan;
  if (data.new_pin) {
    newHashedPin = await bcrypt.hash(data.new_pin, 10);
  }

  // 7. Update database
  await pool.query(
    `UPDATE barang SET
      nama_barang = COALESCE(?, nama_barang),
      deskripsi = COALESCE(?, deskripsi),
      jenis_transaksi = COALESCE(?, jenis_transaksi),
      harga = ?,
      kondisi = COALESCE(?, kondisi),
      status = COALESCE(?, status),
      id_kategori = COALESCE(?, id_kategori),
      gambar_url = ?,
      pin_keamanan = ?
     WHERE id_barang = ?`,
    [
      data.nama_barang || null,
      data.deskripsi || null,
      data.jenis_transaksi || null,
      finalHarga,
      data.kondisi || null,
      data.status || null,
      data.id_kategori || null,
      newGambarUrl,
      newHashedPin,
      id
    ]
  );

  return getBarangById(id);
}

export async function deleteBarang(
  id: number,
  pin?: string,
  authUser?: { id_pengguna: number }
): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM barang WHERE id_barang = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('Barang tidak ditemukan', 404);
  }

  const current = rows[0];

  // Verifikasi Otorisasi: Pemilik yang sudah login bypass PIN
  const isOwnerLoggedIn = authUser && authUser.id_pengguna === current.id_pengguna;

  if (!isOwnerLoggedIn) {
    if (!pin) {
      throw new AppError('PIN keamanan wajib disertakan', 400);
    }

    if (!current.pin_keamanan) {
      throw new AppError('Barang ini hanya dapat dihapus oleh akun pemilik yang sedang masuk', 403);
    }

    const isPinValid = await bcrypt.compare(pin, current.pin_keamanan);
    if (!isPinValid) {
      throw new AppError('PIN keamanan salah', 403);
    }
  }

  // Hapus file fisik gambar jika ada
  if (current.gambar_url) {
    await removeUploadedFile(current.gambar_url);
  }

  // Hapus dari database
  await pool.query('DELETE FROM barang WHERE id_barang = ?', [id]);
}
