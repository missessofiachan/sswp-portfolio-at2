// TS types, invariants
/**
 * Describes a product available in the system.
 *
 * @remarks
 * Instances of this type represent catalog entries or items that can be displayed,
 * purchased, or otherwise managed by the application.
 *
 * @property id - Unique identifier for the product.
 * @property name - Human-readable name of the product.
 * @property price - Numeric price of the product (currency value).
 * @property description - Optional longer description or details about the product.
 * @property category - Category or classification the product belongs to.
 * @property rating - Average rating for the product, from 1.0 to 5.0 (inclusive). Decimals are allowed.
 * @property createdAt - Creation timestamp as a Unix epoch in milliseconds.
 *
 * @example
 * // Example product
 * // {
 * //   id: "prod_01",
 * //   name: "Wireless Headphones",
 * //   price: 99.99,
 * //   description: "Over-ear, noise-cancelling headphones.",
 * //   category: "electronics",
 * //   rating: 4.7,
 * //   createdAt: 1625247600000
 * // }
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  rating: number; // rating from 1.0 to 5.0 (inclusive), decimals allowed
  createdAt: number; // Unix timestamp in milliseconds
  /**
   * One or more image URLs associated with the product. URLs should be absolute (http/https).
   * Clients may render the first image as the primary thumbnail.
   */
  images?: string[];
};
