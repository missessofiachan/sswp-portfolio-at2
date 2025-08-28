import Joi from 'joi';
export const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  rating: Joi.number().min(0).max(5).default(0),
});
export const productUpdateSchema = productCreateSchema.min(1);
