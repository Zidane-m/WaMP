import { RowDataPacket } from 'mysql2';
import pool from '../db/pool';

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

interface KategoriRow extends RowDataPacket, Kategori {}

export async function getAllKategori(): Promise<Kategori[]> {
  const [rows] = await pool.query<KategoriRow[]>(
    'SELECT id_kategori, nama_kategori FROM kategori ORDER BY id_kategori ASC'
  );
  return rows;
}
