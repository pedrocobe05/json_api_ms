import { Test, TestingModule } from '@nestjs/testing';
import { InventarioService } from '../../src/inventario/inventario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventario } from '../../src/inventario/entities/inventario.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('InventarioService', () => {
  let service: InventarioService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'PRODUCTOS_MS_URL') return 'http://localhost:3001';
      if (key === 'API_KEY') return 'test-api-key';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventarioService,
        { provide: getRepositoryToken(Inventario), useValue: mockRepo },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<InventarioService>(InventarioService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearInventario', () => {
    it('crea inventario cuando el producto existe', async () => {
      const dto = { productoId: '1', cantidad: 10 };
      const productoMock = { id: '1', nombre: 'Producto A' };

      mockHttpService.axiosRef.get.mockResolvedValueOnce({ data: productoMock });
      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValueOnce(dto);

      const result = await service.crearInventario(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });

    it('lanza excepción si el producto no existe', async () => {
      const dto = { productoId: '1', cantidad: 10 };
      mockHttpService.axiosRef.get.mockRejectedValueOnce({ response: { status: 404 } });

      await expect(service.crearInventario(dto)).rejects.toThrow('Producto con ID 1 no encontrado');
    });
  });

  describe('getCantidad', () => {
    it('devuelve cantidad e información del producto', async () => {
      const productoId = '1';
      const inventario = { productoId, cantidad: 20 };
      const producto = { id: '1', nombre: 'Test' };

      mockRepo.findOne.mockResolvedValueOnce(inventario);
      mockHttpService.axiosRef.get.mockResolvedValueOnce({ data: producto });

      const result = await service.getCantidad(productoId);
      expect(result).toEqual({
        producto,
        cantidad: inventario.cantidad,
      });
    });

    it('lanza error si no encuentra inventario', async () => {
      mockRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.getCantidad('2')).rejects.toThrow('Inventario no encontrado para producto ID 2');
    });
  });

  describe('actualizarCantidad', () => {
    it('actualiza la cantidad de inventario existente', async () => {
      const productoId = '1';
      const inventario = { productoId, cantidad: 5 };
      mockRepo.findOne.mockResolvedValueOnce(inventario);
      mockRepo.save.mockResolvedValueOnce({ ...inventario, cantidad: 10 });

      const result = await service.actualizarCantidad(productoId, 10);
      expect(result.cantidad).toBe(10);
    });

    it('lanza error si inventario no existe', async () => {
      mockRepo.findOne.mockResolvedValueOnce(undefined);
      await expect(service.actualizarCantidad('3', 5)).rejects.toThrow('Inventario no encontrado para producto ID 3');
    });
  });
});