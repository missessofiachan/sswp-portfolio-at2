import { axiosInstance } from '@client/lib/axios';

export async function listProducts(params?: { sort?: { field: string; dir: 'asc' | 'desc' } }) {
  const res = await axiosInstance.get('/products', { params });
  return res.data.data;
}
export async function getProduct(id: string) {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.data;
}
type ProductInput = {
  name: string;
  price: number;
  description?: string;
  category: string;
  rating?: number;
  images?: string[];
};

export async function createProduct(data: ProductInput) {
  const res = await axiosInstance.post('/products', data);
  return res.data.data;
}
export async function updateProduct(id: string, patch: Partial<ProductInput>) {
  const res = await axiosInstance.put(`/products/${id}`, patch);
  return res.data.data;
}
export async function deleteProduct(id: string) {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data.data;
}
/**
 * Fetches aggregated product statistics from the admin API.
 *
 * Sends a GET request to '/products/admin/stats' and returns the parsed
 * data payload containing the total number of products and the average price.
 *
 * @returns Promise resolving to an object with the following properties:
 *  - count: number — total number of products
 *  - avgPrice: number — average product price
 *
 * @throws Will throw an AxiosError (or other network error) if the HTTP request fails.
 * @throws May throw if the response does not include the expected `data.data` shape.
 */
export async function getProductStats(): Promise<{ count: number; avgPrice: number }> {
  const res = await axiosInstance.get('/products/admin/stats');
  return res.data.data as { count: number; avgPrice: number };
}

// Upload images and get back public URLs
export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  for (const f of files) fd.append('files', f);
  const res = await axiosInstance.post('/uploads', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (res.data?.urls as string[]) ?? [];
}
