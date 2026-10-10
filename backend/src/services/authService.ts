import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { normalizeWhatsApp } from '../lib/whatsapp';

export interface UserProfile {
  id_pengguna: number;
  nama_lengkap: string;
  email: string;
  nim: string | null;
  no_whatsapp: string;
  created_at: string;
  universitas: {
    id_universitas: number;
    nama_universitas: string;
    kota: string;
    provinsi: string;
  };
}

export interface AuthResult {
  user: UserProfile;
  token: string;
}

export interface RegisterDTO {
  nama_lengkap: string;
  email: string;
  password: string;
  id_universitas: number;
  nim?: string;
  no_whatsapp: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

interface RawUserRow extends RowDataPacket {
  id_pengguna: number;
  nama_lengkap: string;
  email: string;
  password_hash: string | null;
  nim: string | null;
  no_whatsapp: string;
  created_at: string;
  id_universitas: number;
  nama_universitas: string;
  kota: string;
  provinsi: string;
}

function mapRowToUserProfile(row: RawUserRow): UserProfile {
  return {
    id_pengguna: row.id_pengguna,
    nama_lengkap: row.nama_lengkap,
    email: row.email,
    nim: row.nim || null,
    no_whatsapp: row.no_whatsapp,
    created_at: row.created_at,
    universitas: {
      id_universitas: row.id_universitas,
      nama_universitas: row.nama_universitas,
      kota: row.kota,
      provinsi: row.provinsi
    }
  };
}

function generateToken(payload: { id_pengguna: number; email: string; nama_lengkap: string; id_universitas: number }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(data: RegisterDTO): Promise<AuthResult> {
  // 1. Cek universitas ada
  const [univRows] = await pool.query<RowDataPacket[]>(
    'SELECT id_universitas, nama_universitas, kota, provinsi FROM universitas WHERE id_universitas = ?',
    [data.id_universitas]
  );
  if (univRows.length === 0) {
    throw new AppError('Universitas yang dipilih tidak ditemukan', 400);
  }

  const normalizedPhone = normalizeWhatsApp(data.no_whatsapp);
  const passwordHash = await bcrypt.hash(data.password, 10);

  // 2. Cek apakah pengguna dengan email ini sudah ada
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT id_pengguna, password_hash FROM pengguna WHERE email = ?',
    [data.email]
  );

  let userId: number;

  if (existingRows.length > 0) {
    const existing = existingRows[0];
    if (existing.password_hash) {
      throw new AppError('Email sudah terdaftar. Silakan masuk dengan akun Anda.', 400);
    }

    // Jika pengguna sebelumnya dibuat dari guest post tanpa password_hash, perbarui
    await pool.query(
      `UPDATE pengguna SET 
        id_universitas = ?, 
        nama_lengkap = ?, 
        password_hash = ?, 
        nim = ?, 
        no_whatsapp = ? 
      WHERE id_pengguna = ?`,
      [data.id_universitas, data.nama_lengkap, passwordHash, data.nim || null, normalizedPhone, existing.id_pengguna]
    );
    userId = existing.id_pengguna;
  } else {
    // Pengguna baru
    const [insertResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO pengguna (id_universitas, nama_lengkap, email, password_hash, nim, no_whatsapp) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.id_universitas, data.nama_lengkap, data.email, passwordHash, data.nim || null, normalizedPhone]
    );
    userId = insertResult.insertId;
  }

  const user = await getMe(userId);
  const token = generateToken({
    id_pengguna: user.id_pengguna,
    email: user.email,
    nama_lengkap: user.nama_lengkap,
    id_universitas: user.universitas.id_universitas
  });

  return { user, token };
}

export async function login(data: LoginDTO): Promise<AuthResult> {
  const [rows] = await pool.query<RawUserRow[]>(
    `SELECT p.*, u.nama_universitas, u.kota, u.provinsi 
     FROM pengguna p 
     JOIN universitas u ON p.id_universitas = u.id_universitas 
     WHERE p.email = ?`,
    [data.email]
  );

  if (rows.length === 0) {
    throw new AppError('Email atau kata sandi tidak sesuai', 401);
  }

  const row = rows[0];
  if (!row.password_hash) {
    throw new AppError('Email atau kata sandi tidak sesuai', 401);
  }

  const isMatch = await bcrypt.compare(data.password, row.password_hash);
  if (!isMatch) {
    throw new AppError('Email atau kata sandi tidak sesuai', 401);
  }

  const user = mapRowToUserProfile(row);
  const token = generateToken({
    id_pengguna: user.id_pengguna,
    email: user.email,
    nama_lengkap: user.nama_lengkap,
    id_universitas: user.universitas.id_universitas
  });

  return { user, token };
}

export async function getMe(userId: number): Promise<UserProfile> {
  const [rows] = await pool.query<RawUserRow[]>(
    `SELECT p.*, u.nama_universitas, u.kota, u.provinsi 
     FROM pengguna p 
     JOIN universitas u ON p.id_universitas = u.id_universitas 
     WHERE p.id_pengguna = ?`,
    [userId]
  );

  if (rows.length === 0) {
    throw new AppError('Pengguna tidak ditemukan', 404);
  }

  return mapRowToUserProfile(rows[0]);
}
