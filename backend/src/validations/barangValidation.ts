import { z } from 'zod';

export const filterBarangSchema = z.object({
  id_universitas: z
    .string()
    .optional()
    .refine((val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'id_universitas harus berupa angka valid'
    })
    .transform((val) => (val ? Number(val) : undefined)),
  id_kategori: z
    .string()
    .optional()
    .refine((val) => val === undefined || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'id_kategori harus berupa angka valid'
    })
    .transform((val) => (val ? Number(val) : undefined)),
  search: z.string().trim().optional(),
  status: z.enum(['Tersedia', 'Terjual']).optional(),
  page: z
    .string()
    .optional()
    .refine((val) => val === undefined || (!isNaN(Number(val)) && Number(val) >= 1), {
      message: 'page harus berupa angka minimal 1'
    })
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .string()
    .optional()
    .refine((val) => val === undefined || (!isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 50), {
      message: 'limit harus berupa angka antara 1 sampai 50'
    })
    .transform((val) => (val ? Number(val) : 12))
});

export const createBarangSchema = z
  .object({
    nama_barang: z
      .string({ required_error: 'Nama barang wajib diisi' })
      .trim()
      .min(3, 'Nama barang minimal 3 karakter')
      .max(150, 'Nama barang maksimal 150 karakter'),
    deskripsi: z
      .string({ required_error: 'Deskripsi wajib diisi' })
      .trim()
      .min(10, 'Deskripsi minimal 10 karakter')
      .max(2000, 'Deskripsi maksimal 2000 karakter'),
    jenis_transaksi: z.enum(['Jual', 'Barter', 'Hibah'], {
      required_error: 'Jenis transaksi wajib dipilih (Jual, Barter, atau Hibah)'
    }),
    harga: z.coerce
      .number({ invalid_type_error: 'Harga harus berupa angka' })
      .min(0, 'Harga tidak boleh bernilai negatif'),
    kondisi: z.enum(['Sangat Baik', 'Layak Pakai', 'Perlu Perbaikan Sedikit'], {
      required_error: 'Kondisi barang wajib dipilih'
    }),
    id_kategori: z.coerce
      .number({ invalid_type_error: 'Kategori wajib dipilih' })
      .int()
      .positive('Kategori tidak valid'),
    id_universitas: z.coerce
      .number({ invalid_type_error: 'Universitas wajib dipilih' })
      .int()
      .positive('Universitas tidak valid'),
    nama_lengkap: z
      .string({ required_error: 'Nama lengkap penjual wajib diisi' })
      .trim()
      .min(3, 'Nama lengkap minimal 3 karakter')
      .max(100, 'Nama lengkap maksimal 100 karakter'),
    email: z
      .string({ required_error: 'Email wajib diisi' })
      .trim()
      .email('Format email tidak valid'),
    nim: z.string().trim().max(30, 'NIM maksimal 30 karakter').optional(),
    no_whatsapp: z
      .string({ required_error: 'Nomor WhatsApp wajib diisi' })
      .trim()
      .min(9, 'Nomor WhatsApp minimal 9 digit')
      .max(20, 'Nomor WhatsApp maksimal 20 digit'),
    pin: z
      .string()
      .trim()
      .regex(/^\d{4,6}$/, 'PIN keamanan harus berupa 4-6 digit angka')
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.jenis_transaksi === 'Jual' && data.harga <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['harga'],
        message: 'Harga harus lebih dari 0 untuk jenis transaksi Jual'
      });
    }
    if ((data.jenis_transaksi === 'Barter' || data.jenis_transaksi === 'Hibah') && data.harga !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['harga'],
        message: 'Harga harus 0 untuk jenis transaksi Barter atau Hibah'
      });
    }
  });

export const updateBarangSchema = z
  .object({
    pin: z
      .string()
      .trim()
      .optional(),
    nama_barang: z.string().trim().min(3).max(150).optional(),
    deskripsi: z.string().trim().min(10).max(2000).optional(),
    jenis_transaksi: z.enum(['Jual', 'Barter', 'Hibah']).optional(),
    harga: z.coerce.number().min(0).optional(),
    kondisi: z.enum(['Sangat Baik', 'Layak Pakai', 'Perlu Perbaikan Sedikit']).optional(),
    status: z.enum(['Tersedia', 'Terjual']).optional(),
    id_kategori: z.coerce.number().int().positive().optional(),
    new_pin: z.string().trim().regex(/^\d{4,6}$/, 'PIN baru harus 4-6 digit angka').optional()
  });

export const idParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) > 0, {
      message: 'ID barang harus berupa bilangan bulat positif'
    })
    .transform((val) => Number(val))
});
