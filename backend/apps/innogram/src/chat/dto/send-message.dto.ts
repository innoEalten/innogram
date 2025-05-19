import * as Joi from 'joi';

export const sendMessageSchema = Joi.object({
  message: Joi.string().required(),
});
