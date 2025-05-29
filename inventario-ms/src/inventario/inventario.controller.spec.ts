import { Test, TestingModule } from '@nestjs/testing';
import { InventarioController } from '../../src/inventario/inventario.controller';
import { InventarioService } from '../../src/inventario/inventario.service';
import { CreateInventarioDto } from '../../src/inventario/dto/create-inventario.dto';

describe('InventarioController', () => {
  let controller: InventarioController;
  let service: InventarioService;

  const mockService = {
    getCantidad: jest.fn(),
    actualizarCantidad: jest.fn(),
    crearInventario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioController],
      providers: [{ provide: InventarioService, useValue: mockService }],
    }).compile();

    controller = module.get<InventarioController>(InventarioController);
    service = module.get<InventarioService>(InventarioService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getCantidad', () => {
    it('debe retornar cantidad e info del producto', async () => {
      const result = {
        producto: { id: '1', nombre: 'Test' },
        cantidad: 100,
      };
      mockService.getCantidad.mockResolvedValue(result);

      expect(await controller.getCantidad('1')).toBe(result);
      expect(mockService.getCantidad).toHaveBeenCalledWith('1');
    });
  });

  describe('actualizarCantidad', () => {
    it('debe actualizar la cantidad de un inventario', async () => {
      const result = { productoId: '1', cantidad: 50 };
      mockService.actualizarCantidad.mockResolvedValue(result);

      expect(await controller.actualizarCantidad('1', 50)).toBe(result);
      expect(mockService.actualizarCantidad).toHaveBeenCalledWith('1', 50);
    });
  });

  describe('crearInventario', () => {
    it('debe crear un nuevo inventario', async () => {
      const dto: CreateInventarioDto = { productoId: '1', cantidad: 30 };
      const result = { id: 1, ...dto };

      mockService.crearInventario.mockResolvedValue(result);

      expect(await controller.crearInventario(dto)).toBe(result);
      expect(mockService.crearInventario).toHaveBeenCalledWith(dto);
    });
  });
});