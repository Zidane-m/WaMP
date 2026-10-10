export interface Universitas {
  id_universitas: number;
  nama_universitas: string;
  kota: string;
}

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export type JenisTransaksi = 'Jual' | 'Barter' | 'Hibah';
export type KondisiBarang = 'Sangat Baik' | 'Layak Pakai' | 'Perlu Perbaikan Sedikit';
export type StatusBarang = 'Tersedia' | 'Terjual';

export interface Penjual {
  id_pengguna: number;
  nama_lengkap: string;
  no_whatsapp: string;
  universitas: Universitas;
}

export interface Barang {
  id_barang: number;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  jenis_transaksi: JenisTransaksi;
  kondisi: KondisiBarang;
  status: StatusBarang;
  gambar_url: string | null;
  created_at: string;
  kategori: Kategori;
  penjual: Penjual;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BarangListResponse {
  data: Barang[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export interface FilterParams {
  id_universitas?: number | '';
  id_kategori?: number | '';
  search?: string;
  status?: StatusBarang | '';
  page?: number;
  limit?: number;
}
