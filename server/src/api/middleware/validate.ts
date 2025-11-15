// schema -> 400 on bad payload
import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';

/**
 * Creates an Express middleware function that validates and sanitizes `req.body`
 * using the provided Joi schema.
 *
 * Validation details:
 * - Calls `schema.validate(req.body, { abortEarly: false, stripUnknown: true })`.
 * - If validation fails, responds with HTTP 400 and JSON: `{ error: { message: string } }`.
 * - If validation succeeds, merges the validated/sanitized `value` back into `req.body`
 *   (using `Object.assign`) and calls `next()` to continue the request lifecycle.
 *
 * @param schema - Joi.Schema used to validate and sanitize the incoming request body.
 * @returns An Express middleware function of the form `(req: Request, res: Response, next: NextFunction) => void`.
 */
export function validate(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      res.status(400).json({ error: { message: error.message } });
      return;
    }
    Object.assign(req.body, value);
    next();
  };
}
