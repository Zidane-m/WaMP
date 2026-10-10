import { z } from 'zod';

export const registerSchema = z.object({
  nama_lengkap: z
    .string({ required_error: 'Nama lengkap wajib diisi' })
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .trim()
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  id_universitas: z.coerce
    .number({ invalid_type_error: 'Universitas wajib dipilih' })
    .int()
    .positive('Universitas tidak valid'),
  nim: z.string().trim().max(30, 'NIM maksimal 30 karakter').optional(),
  no_whatsapp: z
    .string({ required_error: 'Nomor WhatsApp wajib diisi' })
    .trim()
    .min(9, 'Nomor WhatsApp minimal 9 digit')
    .max(20, 'Nomor WhatsApp maksimal 20 digit')
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .trim()
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(1, 'Password wajib diisi')
});

export const keranjangParamSchema = z.object({
  id_barang: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) > 0, {
      message: 'ID barang harus berupa bilangan bulat positif'
    })
    .transform((val) => Number(val))
});
