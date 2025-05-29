import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from '../../src/productos/productos.controller';
import { ProductosService } from '../../src/productos/productos.service';
import { CreateProductoDto } from '../../src/productos/dto/create-producto.dto';
import { UpdateProductoDto } from '../../src/productos/dto/update-producto.dto';

const mockProducto = {
  id: 'uuid-test',
  nombre: 'Café Premium',
  precio: 15.5,
};

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockProducto),
    findAll: jest.fn().mockResolvedValue([mockProducto]),
    findOne: jest.fn().mockResolvedValue(mockProducto),
    update: jest.fn().mockResolvedValue(mockProducto),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('debe crear un producto', async () => {
    const dto: CreateProductoDto = { nombre: 'Café Premium', precio: 15.5 };
    expect(await controller.create(dto)).toEqual(mockProducto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('debe retornar todos los productos', async () => {
    expect(await controller.findAll(10, 0)).toEqual([mockProducto]);
    expect(service.findAll).toHaveBeenCalledWith(10, 0);
  });

  it('debe retornar un producto por id', async () => {
    expect(await controller.findOne('uuid-test')).toEqual(mockProducto);
    expect(service.findOne).toHaveBeenCalledWith('uuid-test');
  });

  it('debe actualizar un producto', async () => {
    const dto: UpdateProductoDto = { precio: 20 };
    expect(await controller.update('uuid-test', dto)).toEqual(mockProducto);
    expect(service.update).toHaveBeenCalledWith('uuid-test', dto);
  });

  it('debe eliminar un producto', async () => {
    expect(await controller.remove('uuid-test')).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('uuid-test');
  });
});