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
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

// Schema for validating user login data
export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const requestResetSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  newPassword: Joi.string().min(8).max(100).required(),
});
