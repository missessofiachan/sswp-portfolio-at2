import { axiosInstance } from '@client/lib/axios';

export async function listProducts(params?: { sort?: { field: string; dir: 'asc' | 'desc' } }) {
  const res = await axiosInstance.get('/products', { params });
  return res.data.data;
}
export async function getProduct(id: string) {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.data;
}
