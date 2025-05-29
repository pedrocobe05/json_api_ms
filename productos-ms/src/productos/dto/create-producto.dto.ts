import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precio: number;
}