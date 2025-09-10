import Joi from 'joi';

/**
 * Joi validation schema for creating a product.
 *
 * Validates an object with the following properties:
 * - name: required string.
 * - price: required number; must match a numeric format with up to two decimal places (examples: 12, 12.3, 12.34).
 *   The schema uses a custom validator that converts the value to a string and tests it against the regex: /^\d+(\.\d{1,2})?$/
 *   to ensure no more than two decimal places are provided.
 * - description: optional string; empty string is explicitly allowed.
 * - category: required string.
 * - rating: number constrained to the range 0–5 (inclusive); defaults to 0 when not provided.
 *
 * Remarks:
 * - Intended for validating product creation payloads (e.g., request bodies).
 * - Use this schema with Joi's validate/validateAsync or similar helpers to enforce request data integrity.
 *
 * Example (valid payload):
 * {
 *   name: "T-shirt",
 *   price: 19.99,
 *   description: "",
 *   category: "clothing",
 *   rating: 4.5
 * }
 *
 * Example (invalid price):
 * {
 *   name: "Sneakers",
 *   price: 12.345, // fails two-decimal validation
 *   category: "footwear"
 * }
 */
export const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Two decimal places validation'),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  rating: Joi.number().min(0).max(5).default(0),
  images: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        const v = String(value);
        // Accept absolute http(s) URLs or API-relative paths
        if (/^https?:\/\//.test(v) || v.startsWith('/')) return v;
        return helpers.error('any.invalid');
      }, 'absolute or relative URL')
    )
    .default([]),
});

// Require at least one field to be present when updating a product
// Update schema should NOT apply defaults (e.g., avoid resetting images to [])
export const productUpdateSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().custom((value, helpers) => {
    if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Two decimal places validation'),
  description: Joi.string().allow(''),
  category: Joi.string(),
  rating: Joi.number().min(0).max(5),
  images: Joi.array().items(
    Joi.string().custom((value, helpers) => {
      const v = String(value);
      if (/^https?:\/\//.test(v) || v.startsWith('/')) return v;
      return helpers.error('any.invalid');
    }, 'absolute or relative URL')
  ),
}).min(1);
