import axios from 'axios';
import {
  Universitas,
  Kategori,
  Barang,
  BarangListResponse,
  ApiResponse,
  FilterParams,
  User,
  AuthResponse,
  CartSummary
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

// Interceptor untuk menyisipkan JWT token jika tersedia di localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Master Data ---
export async function fetchUniversitas(): Promise<Universitas[]> {
  const response = await apiClient.get<ApiResponse<Universitas[]>>('/universitas');
  return response.data.data;
}

export async function fetchKategori(): Promise<Kategori[]> {
  const response = await apiClient.get<ApiResponse<Kategori[]>>('/kategori');
  return response.data.data;
}

// --- Barang Catalog ---
export async function fetchBarang(params?: FilterParams): Promise<BarangListResponse> {
  const cleanParams: Record<string, string | number> = {};

  if (params?.id_universitas) cleanParams.id_universitas = params.id_universitas;
  if (params?.id_kategori) cleanParams.id_kategori = params.id_kategori;
  if (params?.search && params.search.trim() !== '') cleanParams.search = params.search.trim();
  if (params?.status) cleanParams.status = params.status;
  if (params?.page) cleanParams.page = params.page;
  if (params?.limit) cleanParams.limit = params.limit;

  const response = await apiClient.get<BarangListResponse>('/barang', {
    params: cleanParams
  });
  return response.data;
}

export async function fetchBarangDetail(id: number | string): Promise<Barang> {
  const response = await apiClient.get<ApiResponse<Barang>>(`/barang/${id}`);
  return response.data.data;
}

export async function fetchBarangSaya(): Promise<Barang[]> {
  const response = await apiClient.get<ApiResponse<Barang[]>>('/barang/saya');
  return response.data.data;
}

export async function createBarang(formData: FormData): Promise<Barang> {
  const response = await apiClient.post<ApiResponse<Barang>>('/barang', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
}

export async function updateBarang(
  id: number | string,
  formData: FormData
): Promise<Barang> {
  const response = await apiClient.put<ApiResponse<Barang>>(`/barang/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
}

export async function deleteBarang(
  id: number | string,
  pin?: string
): Promise<void> {
  const headers: Record<string, string> = {};
  if (pin) {
    headers['X-Item-PIN'] = pin;
  }
  await apiClient.delete(`/barang/${id}`, {
    data: pin ? { pin } : {},
    headers
  });
}

// --- Autentikasi Pengguna ---
export async function loginApi(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return response.data.data;
}

export async function registerApi(userData: {
  nama_lengkap: string;
  email: string;
  password: string;
  id_universitas: number;
  nim?: string;
  no_whatsapp: string;
}): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  return response.data.data;
}

export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

// --- Keranjang Incaran ---
export async function fetchKeranjang(): Promise<CartSummary> {
  const response = await apiClient.get<ApiResponse<CartSummary>>('/keranjang');
  return response.data.data;
}

export async function addToCartApi(id_barang: number): Promise<void> {
  await apiClient.post(`/keranjang/${id_barang}`);
}

export async function removeFromCartApi(id_barang: number): Promise<void> {
  await apiClient.delete(`/keranjang/${id_barang}`);
}

export const api = {
  getUniversities: fetchUniversitas,
  getCategories: fetchKategori,
  getItems: fetchBarang,
  getItemById: fetchBarangDetail,
  getMyItems: fetchBarangSaya,
  createItem: createBarang,
  updateItem: updateBarang,
  deleteItem: deleteBarang,
  login: loginApi,
  register: registerApi,
  getMe: getMeApi,
  getCart: fetchKeranjang,
  addToCart: addToCartApi,
  removeFromCart: removeFromCartApi
};

export default apiClient;
