import { axiosInstance } from '@client/lib/axios';

export async function listProducts(params?: { sort?: { field: string; dir: 'asc' | 'desc' } }) {
  const res = await axiosInstance.get('/products', { params });
  return res.data.data;
}
export async function getProduct(id: string) {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.data;
}
export async function createProduct(data: {
  name: string;
  price: number;
  description?: string;
  category: string;
  rating?: number;
}) {
  const res = await axiosInstance.post('/products', data);
  return res.data.data;
}
export async function updateProduct(
  id: string,
  patch: Partial<{
    name: string;
    price: number;
    description?: string;
    category: string;
    rating?: number;
  }>
) {
  const res = await axiosInstance.put(`/products/${id}`, patch);
  return res.data.data;
}
export async function deleteProduct(id: string) {
  await axiosInstance.delete(`/products/${id}`);
}
export async function getProductStats() {
  const res = await axiosInstance.get('/products/admin/stats');
  return res.data.data as { count: number; avgPrice: number };
}
