import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class JsonApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return { data: null };
        }

        if (Array.isArray(data)) {
          return {
            data: data.map((item) => ({
              type: 'producto',
              id: item.id,
              attributes: { ...item, id: undefined },
            })),
          };
        }

        if (typeof data === 'object' && 'deleted' in data) {
          return {
            meta: {
              deleted: true,
            },
          };
        }

        return {
          data: {
            type: 'producto',
            id: data.id,
            attributes: { ...data, id: undefined },
          },
        };
      }),
    );
  }
}