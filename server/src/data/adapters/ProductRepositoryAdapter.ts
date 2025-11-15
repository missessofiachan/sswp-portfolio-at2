/**
 * Product Repository Adapter for Order System
 *
 * Adapts the existing ProductsRepo interface to the simplified ProductRepository
 * interface needed by the order system.
 *
 * @fileoverview Product repository adapter for orders
 * @module data/adapters/ProductRepositoryAdapter
 */

import type { ProductForOrder, ProductRepository } from '../ports/ProductRepository';
import type { ProductsRepo } from '../ports/products.repo';

/**
 * Adapter that implements ProductRepository using ProductsRepo
 */
export class ProductRepositoryAdapter implements ProductRepository {
  private productsRepo: ProductsRepo;

  /**
   * Create a new ProductRepositoryAdapter
   *
   * @param {ProductsRepo} productsRepo - The existing products repository
   */
  constructor(productsRepo: ProductsRepo) {
    this.productsRepo = productsRepo;
  }

  /**
   * Find a product by ID for order validation
   *
   * @param {string} id - Product ID
   * @returns {Promise<ProductForOrder | null>} Product if found, null otherwise
   */
  async findById(id: string): Promise<ProductForOrder | null> {
    const product = await this.productsRepo.getById(id);

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      imageUrls: product.images || [],
    };
  }
}
