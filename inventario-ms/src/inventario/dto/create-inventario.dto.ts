import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventarioDto {
  @ApiProperty({ example: 'uuid-del-producto' })
  @IsUUID()
  productoId: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  cantidad: number;
}