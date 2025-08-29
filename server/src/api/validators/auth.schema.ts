import Joi from 'joi';
// Schema for validating user registration data
/**
 * Joi schema used to validate the request body for user registration.
 *
 * Validates the following fields:
 * - `email`: required string in a valid email format.
 * - `password`: required string with a minimum length of 6 characters.
 *
 * Intended for use when validating incoming registration payloads (e.g. request bodies).
 *
 * @example
 * // const { error, value } = registerSchema.validate(req.body);
 *
 * @constant
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Schema for validating user login data
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
