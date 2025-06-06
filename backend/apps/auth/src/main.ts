import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validationConfig } from '@app/shared/configs/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Innogram API')
    .setDescription("The innogram's auth app API description")
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(validationConfig);
  await app.listen(process.env['PORT'] ?? 3001);
}

void bootstrap();
