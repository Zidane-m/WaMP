import axios from 'axios';
import {
  Universitas,
  Kategori,
  Barang,
  BarangListResponse,
  ApiResponse,
  FilterParams
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

export async function fetchUniversitas(): Promise<Universitas[]> {
  const response = await apiClient.get<ApiResponse<Universitas[]>>('/universitas');
  return response.data.data;
}

export async function fetchKategori(): Promise<Kategori[]> {
  const response = await apiClient.get<ApiResponse<Kategori[]>>('/kategori');
  return response.data.data;
}

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
  pin: string
): Promise<void> {
  await apiClient.delete(`/barang/${id}`, {
    data: { pin },
    headers: {
      'X-Item-PIN': pin
    }
  });
}

export const api = {
  getUniversities: fetchUniversitas,
  getCategories: fetchKategori,
  getItems: fetchBarang,
  getItemById: fetchBarangDetail,
  createItem: createBarang,
  updateItem: updateBarang,
  deleteItem: deleteBarang,
};

export default apiClient;
