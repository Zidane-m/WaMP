import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../db/pool';
import { AppError } from '../middleware/errorHandler';

export interface CartItem {
  id_keranjang: number;
  added_at: string;
  id_barang: number;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  jenis_transaksi: 'Jual' | 'Barter' | 'Hibah';
  kondisi: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  status: 'Tersedia' | 'Terjual';
  gambar_url: string | null;
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

export interface CartSummary {
  items: CartItem[];
  total_estimasi: number;
  total_barang: number;
}

interface RawCartRow extends RowDataPacket {
  id_keranjang: number;
  added_at: string;
  id_barang: number;
  nama_barang: string;
  deskripsi: string;
  harga: string | number;
  jenis_transaksi: 'Jual' | 'Barter' | 'Hibah';
  kondisi: 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
  status: 'Tersedia' | 'Terjual';
  gambar_url: string | null;
  id_kategori: number;
  nama_kategori: string;
  id_penjual: number;
  nama_penjual: string;
  no_whatsapp: string;
  id_universitas: number;
  nama_universitas: string;
}

export async function getKeranjang(userId: number): Promise<CartSummary> {
  const [rows] = await pool.query<RawCartRow[]>(
    `SELECT 
      k.id_keranjang,
      k.created_at AS added_at,
      b.id_barang,
      b.nama_barang,
      b.deskripsi,
      b.harga,
      b.jenis_transaksi,
      b.kondisi,
      b.status,
      b.gambar_url,
      kat.id_kategori,
      kat.nama_kategori,
      p.id_pengguna AS id_penjual,
      p.nama_lengkap AS nama_penjual,
      p.no_whatsapp,
      u.id_universitas,
      u.nama_universitas
    FROM keranjang k
    JOIN barang b ON k.id_barang = b.id_barang
    JOIN kategori kat ON b.id_kategori = kat.id_kategori
    JOIN pengguna p ON b.id_pengguna = p.id_pengguna
    JOIN universitas u ON p.id_universitas = u.id_universitas
    WHERE k.id_pengguna = ?
    ORDER BY k.created_at DESC`,
    [userId]
  );

  const items: CartItem[] = rows.map((r) => ({
    id_keranjang: r.id_keranjang,
    added_at: r.added_at,
    id_barang: r.id_barang,
    nama_barang: r.nama_barang,
    deskripsi: r.deskripsi,
    harga: Number(r.harga),
    jenis_transaksi: r.jenis_transaksi,
    kondisi: r.kondisi,
    status: r.status,
    gambar_url: r.gambar_url,
    kategori: {
      id_kategori: r.id_kategori,
      nama_kategori: r.nama_kategori
    },
    penjual: {
      id_pengguna: r.id_penjual,
      nama_lengkap: r.nama_penjual,
      no_whatsapp: r.no_whatsapp,
      universitas: {
        id_universitas: r.id_universitas,
        nama_universitas: r.nama_universitas
      }
    }
  }));

  const total_estimasi = items.reduce((acc, curr) => {
    if (curr.jenis_transaksi === 'Jual' && curr.status === 'Tersedia') {
      return acc + curr.harga;
    }
    return acc;
  }, 0);

  return {
    items,
    total_estimasi,
    total_barang: items.length
  };
}

export async function tambahKeranjang(userId: number, barangId: number): Promise<{ message: string }> {
  // Cek apakah barang ada
  const [barangRows] = await pool.query<RowDataPacket[]>(
    'SELECT id_barang, id_pengguna FROM barang WHERE id_barang = ?',
    [barangId]
  );

  if (barangRows.length === 0) {
    throw new AppError('Barang tidak ditemukan', 404);
  }

  if (barangRows[0].id_pengguna === userId) {
    throw new AppError('Anda tidak dapat memasukkan barang jualan sendiri ke keranjang', 400);
  }

  await pool.query(
    'INSERT IGNORE INTO keranjang (id_pengguna, id_barang) VALUES (?, ?)',
    [userId, barangId]
  );

  return { message: 'Barang berhasil ditambahkan ke keranjang incaran' };
}

export async function hapusKeranjang(userId: number, barangId: number): Promise<{ message: string }> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM keranjang WHERE id_pengguna = ? AND id_barang = ?',
    [userId, barangId]
  );

  if (result.affectedRows === 0) {
    throw new AppError('Barang tidak ditemukan di dalam keranjang', 404);
  }

  return { message: 'Barang berhasil dihapus dari keranjang' };
}
