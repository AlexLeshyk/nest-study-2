import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(logger);
  const config = new DocumentBuilder()
    .setTitle('Innogram for InnoTrainee')
    .setDescription('API description for application Innogram for InnoTrainee')
    .setVersion('1.0')
    .addTag('API methods')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  const port = process.env.PORT ?? 8000;
  await app.listen(port, () =>
    console.log(`⚡️ Server started on http://[::1]:${port}`),
  );
}
bootstrap();
