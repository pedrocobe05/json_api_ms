import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../../src/productos/entities/producto.entity';
import { Repository } from 'typeorm';

describe('Productos API (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<Producto>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Producto],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repo = moduleFixture.get('ProductoRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /productos crea un producto', async () => {
    const res = await request(app.getHttpServer())
      .post('/productos')
      .set('x-api-key', 'supersecreta123')
      .send({
        nombre: 'Café Test',
        precio: 10.5,
      })
      .expect(201);

    expect(res.body.data.type).toBe('producto');
    expect(res.body.data.attributes.nombre).toBe('Café Test');
  });

  it('GET /productos/:id retorna 404 si no existe', async () => {
    await request(app.getHttpServer())
      .get('/productos/uuid-no-existe')
      .set('x-api-key', 'supersecreta123')
      .expect(404);
  });
});