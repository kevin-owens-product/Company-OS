import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - allow all origins if CORS_ORIGIN not set
  app.enableCors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('EMS API')
    .setDescription('The Enterprise Management System API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server - bind to 0.0.0.0 for container/cloud deployments
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
  console.log(`API documentation is available at: /api`);
  console.log(`Health check available at: /health`);
}

bootstrap(); 