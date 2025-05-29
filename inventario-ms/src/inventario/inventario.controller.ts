import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Inventario } from './entities/inventario.entity';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get(':id')
  getCantidad(@Param('id') id: string) {
    return this.inventarioService.getCantidad(id);
  }

  @Patch(':id')
  actualizarCantidad(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.inventarioService.actualizarCantidad(id, cantidad);
  }

  @Post()
  @ApiOperation({ summary: 'Crear inventario para un producto' })
  @ApiResponse({ status: 201, description: 'Inventario creado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async crearInventario(
    @Body() dto: CreateInventarioDto,
  ): Promise<Inventario> {
    return this.inventarioService.crearInventario(dto);
  }
  
}