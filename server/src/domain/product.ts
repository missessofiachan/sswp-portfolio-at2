/**
 * Domain model definitions and invariants for catalog products.
 */

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  rating: number; // rating from 1.0 to 5.0 (inclusive), decimals allowed
  stock: number; // available inventory count (>= 0)
  createdAt: number; // Unix timestamp in milliseconds
  /**
   * One or more image URLs associated with the product. URLs should be absolute (http/https).
   * Clients may render the first image as the primary thumbnail.
   */
  images?: string[];
};
