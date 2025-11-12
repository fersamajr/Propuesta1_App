import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Configuración Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API Propuesta1')
    .setDescription('Documentación automática generada por Swagger para Propuesta1_App')
    .setVersion('1.0')
    .addTag('propuesta1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // <--- URL: /api-docs

  await app.listen(3000);
}
bootstrap();
