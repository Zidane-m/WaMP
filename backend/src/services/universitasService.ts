import { RowDataPacket } from 'mysql2';
import pool from '../db/pool';

export interface Universitas {
  id_universitas: number;
  nama_universitas: string;
  kota: string;
  provinsi: string;
}

interface UniversitasRow extends RowDataPacket, Universitas {}

export async function getAllUniversitas(): Promise<Universitas[]> {
  const [rows] = await pool.query<UniversitasRow[]>(
    'SELECT id_universitas, nama_universitas, kota, provinsi FROM universitas ORDER BY provinsi ASC, nama_universitas ASC'
  );
  return rows;
}
