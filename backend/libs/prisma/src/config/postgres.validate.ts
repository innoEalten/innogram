import * as Joi from 'joi';

export const validationSchema = Joi.object({
  POSTGRES_URI: Joi.string().required(),
});
