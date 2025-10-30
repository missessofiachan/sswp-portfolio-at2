/**
 * Product Types for Frontend
 *
 * TypeScript types and interfaces for product management in the frontend.
 * These types correspond to the backend product domain but are optimized for UI use.
 *
 * @fileoverview Frontend product types and interfaces
 * @module types/product
 */

/**
 * Product entity for frontend use
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  rating: number;
  stock: number; // Available inventory count (>= 0)
  createdAt: number; // Unix timestamp in milliseconds
  images?: string[];
  imageUrls?: string[]; // Alternative property name for compatibility
}

/**
 * Product input data structure for creating and updating products
 */
export interface ProductInput {
  name: string;
  price: number;
  description?: string;
  category: string;
  rating?: number;
  stock?: number; // Available inventory count (>= 0)
  images?: string[];
}

/**
 * Product filter options for search and filtering
 */
export interface ProductFilter {
  q?: string; // Text search query
  category?: string; // Category filter
  minPrice?: number; // Minimum price filter
  maxPrice?: number; // Maximum price filter
}

/**
 * Product sort options
 */
export interface ProductSort {
  field: string; // Field to sort by
  dir: 'asc' | 'desc'; // Sort direction
}

/**
 * Product list parameters for API calls
 */
export interface ProductListParams {
  sort?: ProductSort;
  filter?: ProductFilter;
  page?: number;
  pageSize?: number;
}

/**
 * Product list response with pagination metadata
 */
export interface ProductListResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

/**
 * Product statistics for admin dashboard
 */
export interface ProductStats {
  count: number;
  avgPrice: number;
}

/**
 * Product timeseries data point
 */
export interface ProductTimeseriesPoint {
  t: number; // Timestamp
  count: number; // Number of products
  avgPrice: number; // Average price
}
