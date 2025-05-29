import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { ConfigService } from '@nestjs/config';
import { CreateInventarioDto } from './dto/create-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async validarProducto(productoId: string): Promise<any> {
  
    const productosUrl = this.configService.get<string>('PRODUCTOS_MS_URL');
    const apiKey = this.configService.get<string>('API_KEY');
    try {
      
      console.log("🚀 ~ InventarioService ~ validarProducto ~ productosUrl:", `${productosUrl}/v1/productos/${productoId}`)
    const response = await this.httpService.axiosRef.get(`${productosUrl}/v1/productos/${productoId}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    
    console.log("🚀 ~ InventarioService ~ validarProducto ~ response:", response)
    return response.data;

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error('Error al consultar el microservicio de productos');
  }
}

  async getCantidad(productoId: string) {
    const inventario = await this.inventarioRepo.findOne({ where: { productoId } });

    if (!inventario) {
      throw new Error(`Inventario no encontrado para producto ID ${productoId}`);
    }

    // Comunicación con productos-ms
    const productosUrl = this.configService.get<string>('PRODUCTOS_MS_URL');
    const apiKey = this.configService.get<string>('API_KEY');
    const producto = await this.httpService.axiosRef.get(`${productosUrl}/v1/productos/${productoId}`, {
      headers: { 'x-api-key': apiKey },
    });

    return {
      producto: producto.data,
      cantidad: inventario.cantidad,
    };
  }

  async actualizarCantidad(productoId: string, cantidad: number) {
    const inventario = await this.inventarioRepo.findOne({ where: { productoId } });

    if (!inventario) {
      throw new Error(`Inventario no encontrado para producto ID ${productoId}`);
    }

    inventario.cantidad = cantidad;
    await this.inventarioRepo.save(inventario);

    console.log(`Inventario actualizado para producto ${productoId}: ${cantidad}`);
    return inventario;
  }

  async crearInventario(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
  const { productoId, cantidad } = createInventarioDto;

  const producto = await this.validarProducto(productoId);
  if (!producto) {
    throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
  }

  const nuevoInventario = this.inventarioRepo.create({
    productoId,
    cantidad,
  });

  const saved = await this.inventarioRepo.save(nuevoInventario);
  console.log(`🔄 Inventario creado para producto ${productoId} con cantidad ${cantidad}`);
  return saved;
}

}
