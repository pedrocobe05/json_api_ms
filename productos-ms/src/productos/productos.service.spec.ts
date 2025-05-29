import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from '../../src/productos/productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../../src/productos/entities/producto.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockProducto = {
  id: 'uuid-test',
  nombre: 'Café Premium',
  precio: 15.5,
};

describe('ProductosService', () => {
  let service: ProductosService;
  let repo: Repository<Producto>;

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockProducto),
    save: jest.fn().mockResolvedValue(mockProducto),
    find: jest.fn().mockResolvedValue([mockProducto]),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      id === mockProducto.id ? mockProducto : null,
    ),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repo = module.get<Repository<Producto>>(getRepositoryToken(Producto));
  });

  afterEach(() => jest.clearAllMocks());

  it('debe crear un producto', async () => {
    const res = await service.create({ nombre: 'Café Premium', precio: 15.5 });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(mockProducto);
    expect(res).toEqual(mockProducto);
  });

  it('debe retornar un arreglo de productos', async () => {
    const productos = await service.findAll(10, 0);
    expect(repo.find).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(productos).toEqual([mockProducto]);
  });

  it('debe encontrar un producto por ID', async () => {
    const producto = await service.findOne('uuid-test');
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'uuid-test' });
    expect(producto).toEqual(mockProducto);
  });

  it('debe lanzar error si el producto no existe', async () => {
    await expect(service.findOne('otro-id')).rejects.toThrow(NotFoundException);
  });

  it('debe actualizar un producto', async () => {
    const updated = await service.update('uuid-test', { precio: 20 });
    expect(repo.update).toHaveBeenCalledWith('uuid-test', { precio: 20 });
    expect(updated).toEqual(mockProducto);
  });

  it('debe eliminar un producto', async () => {
    const result = await service.remove('uuid-test');
    expect(repo.delete).toHaveBeenCalledWith('uuid-test');
    expect(result).toEqual({ deleted: true });
  });
});