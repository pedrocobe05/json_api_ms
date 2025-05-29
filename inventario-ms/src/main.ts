import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
  bufferLogs: true,
  });

  app.setGlobalPrefix('v1');
  app.useLogger(app.get(Logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Inventario')
    .setDescription('Microservicio CRUD de inventario')
    .setVersion('1.0')
    .addTag('Inventario')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'apiKey',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Inyectar ConfigService y aplicar el ApiKeyGuard globalmente
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ApiKeyGuard(configService, reflector));

  await app.listen(process.env.PORT || 3001);
}
bootstrap();