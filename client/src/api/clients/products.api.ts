import { axiosInstance } from '@client/lib/axios';

/**
 * Product input data structure for creating and updating products.
 *
 * @interface ProductInput
 * @property {string} name - Product name (required, min 2 characters)
 * @property {number} price - Product price (required, non-negative)
 * @property {string} [description] - Optional product description
 * @property {string} category - Product category (required, min 2 characters)
 * @property {number} [rating] - Product rating (optional, 0-5 scale)
 * @property {string[]} [images] - Optional array of image URLs
 */
type ProductInput = {
  name: string;
  price: number;
  description?: string;
  category: string;
  rating?: number;
  images?: string[];
};

/**
 * Retrieves a list of all products with optional sorting.
 *
 * @param {Object} [params] - Optional query parameters
 * @param {Object} [params.sort] - Sorting configuration
 * @param {string} params.sort.field - Field to sort by (e.g., 'price', 'name', 'createdAt')
 * @param {'asc'|'desc'} params.sort.dir - Sort direction
 * @returns {Promise<any[]>} Promise resolving to array of product objects
 *
 * @example
 * ```typescript
 * const products = await listProducts({
 *   sort: { field: 'price', dir: 'asc' }
 * });
 * ```
 */
export async function listProducts(params?: { sort?: { field: string; dir: 'asc' | 'desc' } }) {
  const res = await axiosInstance.get('/products', { params });
  return res.data.data;
}

/**
 * Retrieves a single product by its ID.
 *
 * @param {string} id - The unique product identifier
 * @returns {Promise<any>} Promise resolving to the product object
 * @throws {AxiosError} When product is not found (404) or other API errors
 *
 * @example
 * ```typescript
 * const product = await getProduct('12345');
 * console.log(product.name, product.price);
 * ```
 */
export async function getProduct(id: string) {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.data;
}

/**
 * Retrieves a paginated list of products with advanced filtering and sorting.
 *
 * **Features:**
 * - Pagination support with configurable page size
 * - Text search across product names and descriptions
 * - Category filtering
 * - Price range filtering
 * - Flexible sorting options
 *
 * @param {Object} [params] - Query parameters for filtering, sorting, and pagination
 * @param {Object} [params.sort] - Sorting configuration
 * @param {string} params.sort.field - Field to sort by
 * @param {'asc'|'desc'} params.sort.dir - Sort direction
 * @param {Object} [params.filter] - Filtering options
 * @param {string} [params.filter.q] - Text search query
 * @param {string} [params.filter.category] - Category filter
 * @param {number} [params.filter.minPrice] - Minimum price filter
 * @param {number} [params.filter.maxPrice] - Maximum price filter
 * @param {number} [params.page] - Page number (1-based)
 * @param {number} [params.pageSize] - Number of items per page
 * @returns {Promise<{data: any[], meta: {total: number, page: number, pageSize: number}}>}
 *   Promise resolving to paginated product data with metadata
 *
 * @example
 * ```typescript
 * const result = await listProductsPaged({
 *   filter: { q: 'ceramic', category: 'pottery', minPrice: 20 },
 *   sort: { field: 'price', dir: 'asc' },
 *   page: 1,
 *   pageSize: 12
 * });
 * console.log(`Found ${result.meta.total} products`);
 * ```
 */
export async function listProductsPaged(params?: {
  sort?: { field: string; dir: 'asc' | 'desc' };
  filter?: { q?: string; category?: string; minPrice?: number; maxPrice?: number };
  page?: number;
  pageSize?: number;
}): Promise<{ data: any[]; meta: { total: number; page: number; pageSize: number } }> {
  const res = await axiosInstance.get('/products', { params });
  return res.data as { data: any[]; meta: { total: number; page: number; pageSize: number } };
}

/**
 * Creates a new product with the provided data.
 *
 * **Requirements:**
 * - User must be authenticated with admin role
 * - All required fields must be provided
 * - Images should be valid URLs (use uploadImages() for file uploads)
 *
 * @param {ProductInput} data - Product data for creation
 * @returns {Promise<any>} Promise resolving to the created product object
 * @throws {AxiosError} When validation fails (400), unauthorized (401), or server error (500)
 *
 * @example
 * ```typescript
 * const newProduct = await createProduct({
 *   name: 'Handcrafted Ceramic Bowl',
 *   price: 45.99,
 *   description: 'Beautiful hand-thrown ceramic bowl...',
 *   category: 'ceramics',
 *   rating: 4.5,
 *   images: ['/api/v1/files/bowl1.jpg', '/api/v1/files/bowl2.jpg']
 * });
 * ```
 */
export async function createProduct(data: ProductInput) {
  const res = await axiosInstance.post('/products', data);
  return res.data.data;
}

/**
 * Updates an existing product with partial data.
 *
 * **Requirements:**
 * - User must be authenticated with admin role
 * - Product must exist (will return 404 if not found)
 * - Only provided fields will be updated
 *
 * @param {string} id - The unique product identifier to update
 * @param {Partial<ProductInput>} patch - Partial product data for update
 * @returns {Promise<any>} Promise resolving to the updated product object
 * @throws {AxiosError} When product not found (404), unauthorized (401), or validation fails (400)
 *
 * @example
 * ```typescript
 * // Update only the price and description
 * const updated = await updateProduct('12345', {
 *   price: 39.99,
 *   description: 'Updated description with new details'
 * });
 * ```
 */
export async function updateProduct(id: string, patch: Partial<ProductInput>) {
  const res = await axiosInstance.put(`/products/${id}`, patch);
  return res.data.data;
}

/**
 * Deletes a product by its ID.
 *
 * **Requirements:**
 * - User must be authenticated with admin role
 * - Product must exist (will return 404 if not found)
 * - Associated uploaded images will be cleaned up automatically
 *
 * @param {string} id - The unique product identifier to delete
 * @returns {Promise<any>} Promise resolving to deletion confirmation
 * @throws {AxiosError} When product not found (404), unauthorized (401), or server error (500)
 *
 * @example
 * ```typescript
 * await deleteProduct('12345');
 * console.log('Product deleted successfully');
 * ```
 */
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

export type ProductsTimeseriesPoint = { t: number; count: number; avgPrice: number };
export async function getProductsTimeseries(params?: {
  windowDays?: number;
  interval?: 'day' | 'week' | 'month';
}): Promise<ProductsTimeseriesPoint[]> {
  const res = await axiosInstance.get('/products/admin/timeseries', { params });
  return res.data.data as ProductsTimeseriesPoint[];
}

/**
 * Uploads multiple image files to the server and returns their public URLs.
 *
 * **Features:**
 * - Supports multiple file upload in a single request
 * - Returns array of public URLs for uploaded files
 * - Automatically includes authentication token from axios instance
 * - Handles multipart/form-data encoding
 *
 * **Usage Example:**
 * ```typescript
 * const files = Array.from(fileInput.files);
 * const urls = await uploadImages(files);
 * console.log('Uploaded URLs:', urls);
 * ```
 *
 * **Error Handling:**
 * - 401: Authentication required - user needs to log in
 * - 400: Invalid file type or no files provided
 * - 413: File too large (exceeds server size limit)
 * - 500: Server error during upload processing
 *
 * @param {File[]} files - Array of File objects to upload
 * @returns {Promise<string[]>} Promise resolving to array of public URLs
 * @throws {AxiosError} When upload fails due to network, auth, or validation errors
 *
 * @example
 * ```typescript
 * try {
 *   const uploadedUrls = await uploadImages([file1, file2]);
 *   setImageUrls(uploadedUrls);
 * } catch (error) {
 *   console.error('Upload failed:', error);
 *   if (error.response?.status === 401) {
 *     // Handle authentication error
 *   }
 * }
 * ```
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  const fd = new FormData();
  for (const f of files) {
    // Validate file type on client side before upload
    if (!f.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${f.type}. Only images are supported.`);
    }
    fd.append('files', f);
  }

  // Do not set Content-Type manually; the browser will include the correct boundary
  const res = await axiosInstance.post('/uploads', fd);

  const urls = res.data?.urls;
  if (!Array.isArray(urls)) {
    throw new Error('Invalid response format: expected array of URLs');
  }

  return urls;
}
