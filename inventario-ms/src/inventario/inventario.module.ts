import { Module } from '@nestjs/common';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Inventario])
  ],
  controllers: [InventarioController],
  providers: [InventarioService]
})
export class InventarioModule {}
