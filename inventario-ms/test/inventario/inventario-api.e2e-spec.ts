import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { InventarioModule } from '../../src/inventario/inventario.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Inventario } from '../../src/inventario/entities/inventario.entity';
import { HttpModule } from '@nestjs/axios';
import { AppModule } from '../../src/app.module';
import { ApiKeyGuard } from '../../src/common/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';

describe('Inventario API (e2e)', () => {
  let app: INestApplication;
  let apiKey: string;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Inventario],
          synchronize: true,
        }),
        InventarioModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get(ConfigService);
    apiKey = configService.get<string>('API_KEY') || 'test-api-key';

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/inventario (POST) debería fallar si el producto no existe', async () => {
    const dto = {
      productoId: 'producto-invalido',
      cantidad: 10,
    };

    const res = await request(app.getHttpServer())
      .post('/inventario')
      .set('x-api-key', apiKey)
      .send(dto);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Producto con ID');
  });

  it('/inventario/:id (GET) debería fallar si el inventario no existe', async () => {
    const res = await request(app.getHttpServer())
      .get('/inventario/abc123')
      .set('x-api-key', apiKey);

    expect(res.status).toBe(500); // Podrías manejar esto como 404 en producción
    expect(res.body.message).toContain('Inventario no encontrado');
  });

});