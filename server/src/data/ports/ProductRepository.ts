/**
 * Product Repository Interface for Order System
 *
 * Simplified interface for product operations needed by the order system.
 * This is separate from the main ProductsRepo to keep order dependencies minimal.
 *
 * @fileoverview Product repository interface for orders
 * @module data/ports/ProductRepository
 */

/**
 * Product data needed for order operations
 */
export interface ProductForOrder {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrls?: string[];
}

/**
 * Simplified product repository interface for order operations
 */
export interface ProductRepository {
  /**
   * Find a product by ID for order validation
   *
   * @param {string} id - Product ID
   * @returns {Promise<ProductForOrder | null>} Product if found, null otherwise
   */
  findById(id: string): Promise<ProductForOrder | null>;
}
