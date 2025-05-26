import { ApiBody } from '@nestjs/swagger';

export const ApiBodyUploadPost: MethodDecorator = (
  target,
  propertyKey,
  descriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Sunset at the beach',
          description: 'Title of the post',
        },
        body: {
          type: 'string',
          example: 'A beautiful photo from today.',
          description: 'Body/content of the post',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files (max 5)',
        },
      },
      required: ['title', 'body', 'files'],
    },
  })(target, propertyKey, descriptor);
};
