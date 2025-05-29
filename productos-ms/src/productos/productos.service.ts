import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  create(dto: CreateProductoDto) {
    const producto = this.repo.create(dto);
    return this.repo.save(producto);
  }

  findAll(limit = 10, offset = 0) {
    return this.repo.find({ skip: offset, take: limit });
  }

  async findOne(id: string) {
    const producto = await this.repo.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async update(id: string, dto: UpdateProductoDto) {
    await this.findOne(id); // verifica existencia
    await this.repo.update(id, dto);
    return this.findOne(id); // devuelve actualizado
  }

  async remove(id: string) {
    await this.findOne(id); // verifica existencia
    await this.repo.delete(id);
    return { deleted: true };
  }
}