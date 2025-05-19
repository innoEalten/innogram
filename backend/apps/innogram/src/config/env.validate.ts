import * as Joi from 'joi';

export const validationSchema = Joi.object({
  AUTH_SERVICE_URL: Joi.string().required(),
});
