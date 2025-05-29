import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productoId: string;

  @Column('int')
  cantidad: number;
}