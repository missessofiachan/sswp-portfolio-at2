/**
 * Enhanced Validation Middleware
 *
 * Provides flexible validation for different parts of HTTP requests
 * including body, query parameters, and route parameters.
 *
 * @fileoverview Enhanced validation middleware
 * @module api/middleware/validation
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Request part to validate
 */
type RequestPart = 'body' | 'query' | 'params' | 'headers';

/**
 * Enhanced validation middleware that can validate different parts of the request
 *
 * @param {Joi.Schema} schema - Joi schema for validation
 * @param {RequestPart} [part='body'] - Part of the request to validate
 * @returns {Function} Express middleware function
 */
export function validate(schema: Joi.Schema, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[part];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true, // Convert string numbers to numbers, etc.
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: details,
      });
      return;
    }

    // Replace the request part with validated and sanitized data
    if (part === 'query' || part === 'params') {
      const target = (req as any)[part] as Record<string, unknown>;
      if (target && typeof target === 'object') {
        // Remove existing keys to avoid stale values
        for (const key of Object.keys(target)) {
          delete target[key];
        }
        Object.assign(target, value);
      } else {
        (req as any)[part] = value;
      }
    } else {
      (req as any)[part] = value;
    }
    next();
  };
}

/**
 * Middleware to validate request body
 *
 * @param {Joi.Schema} schema - Joi schema for validation
 * @returns {Function} Express middleware function
 */
export function validateBody(schema: Joi.Schema) {
  return validate(schema, 'body');
}

/**
 * Middleware to validate query parameters
 *
 * @param {Joi.Schema} schema - Joi schema for validation
 * @returns {Function} Express middleware function
 */
export function validateQuery(schema: Joi.Schema) {
  return validate(schema, 'query');
}

/**
 * Middleware to validate route parameters
 *
 * @param {Joi.Schema} schema - Joi schema for validation
 * @returns {Function} Express middleware function
 */
export function validateParams(schema: Joi.Schema) {
  return validate(schema, 'params');
}
