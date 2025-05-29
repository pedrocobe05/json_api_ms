# Inventario Microservicio

Este microservicio es parte de una arquitectura orientada a microservicios. Su función principal es gestionar inventarios de productos: permite registrar inventario, consultar cantidad disponible por ID y actualizar la cantidad disponible tras una compra. Se comunica con el microservicio de productos para validar la existencia de productos.

Tecnologías utilizadas:

- [NestJS](https://nestjs.com/)
- PostgreSQL
- TypeORM
- Swagger
- Docker
- Jest (unit y e2e testing)
- Axios (para comunicación entre microservicios)
- `nestjs-pino` para logs estructurados

---

## Requisitos

- Node.js 18+
- Docker y Docker Compose
- PostgreSQL (si no usas Docker para DB)

---

## Instalación local (modo desarrollo)

1. Clona el repositorio y entra al microservicio:

```bash
git clone https://github.com/pedrocobe05/json_api_ms.git
cd inventario-ms
```

2. Instala dependencias:

```bash
npm install
```

3. Configura el entorno:

Crea el archivo `.env` en la raíz del microservicio con este contenido:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=inventario
PRODUCTOS_MS_URL=http://localhost:3000
API_KEY=supersecreta123
```

4. Corre la aplicación:

```bash
npm run start:dev
```

---

## Docker

### Estructura esperada

```bash
inventario-ms/
├── ci/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
```

### Ejecutar con Docker Compose

Desde la raíz del proyecto (`json_api_ms/`):

```bash
docker compose up --build
```

Accede a Swagger en:

```
http://localhost:3001/api
```

> Recuerda enviar siempre el header: `x-api-key: supersecreta123`

---

## Documentación Swagger

Disponible en:  
http://localhost:3001/api

Incluye especificación de endpoints para registrar, consultar y actualizar inventarios, así como validación cruzada de productos.

---

## Autenticación

Este microservicio protege sus endpoints mediante **API Key**.

**Header requerido** en cada petición:

```http
x-api-key: supersecreta123
```

Las rutas `/` y `/health` están públicas.

---

## Testing

### Pruebas unitarias:

```bash
npm run test
```

### Pruebas con cobertura:

```bash
npm run test:cov
```

### Pruebas de integración (e2e):

```bash
npm run test:e2e
```

> Se usa SQLite en memoria para pruebas e2e.

---

## Comunicación con otros servicios

Este microservicio se comunica con `productos-ms` para validar que el producto exista antes de crear o actualizar un inventario. Se realiza vía HTTP usando Axios e incluye autenticación con API Key en el header.

---

## Estructura de carpetas

```
src/
├── inventario/
│   ├── dto/
│   ├── entities/
│   ├── inventario.controller.ts
│   └── inventario.service.ts
├── common/
│   ├── decorators/public.decorator.ts
│   ├── interceptors/json-api.interceptor.ts
│   └── guards/api-key.guard.ts
├── app.module.ts
├── app.controller.ts
└── app.service.ts
```

---

## Autor

Andrés Cobeña  
[Tech Lead Candidate – Senior Backend Developer]

---

## Licencia

MIT