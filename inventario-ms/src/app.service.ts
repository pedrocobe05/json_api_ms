import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'Inventario MS - OK';
  }
}