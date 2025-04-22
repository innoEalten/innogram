import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
});
