// schema -> 400 on bad payload
import type { Request, Response, NextFunction } from 'express';
import type Joi from 'joi';

export function validate(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      res.status(400).json({ error: { message: error.message } });
      return;
    }
    req.body = value;
    next();
    return;
  };
}
