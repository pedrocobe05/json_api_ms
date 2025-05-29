# Microservicios JSON API - Productos e Inventario

Este repositorio contiene dos microservicios desarrollados con NestJS y PostgreSQL, que se comunican entre sí utilizando HTTP (JSON API). El propósito es simular un entorno de arquitectura de microservicios para gestionar productos y su inventario.

## Microservicios

## productos-ms

- CRUD completo de productos
- Autenticación por API Key
- Logs estructurados con nestjs-pino
- Health check en /v1/health
- Documentación Swagger en /v1/api

## inventario-ms

- Gestión del inventario por producto
- Validación en tiempo real de productos vía HTTP al microservicio de productos
- Registro, actualización y consulta de inventarios
- Emisión de evento simple al actualizar (console.log)
- Autenticación por API Key

## Docker

### Requisitos

- Docker y Docker Compose instalados

### Estructura

.
├── productos-ms
│   ├── src/
│   ├── test/
│   ├── .env
│   └── Dockerfile
├── inventario-ms
│   ├── src/
│   ├── test/
│   ├── .env
│   └── Dockerfile
├── docker-compose.yml
└── README.md

### Variables de entorno

#### productos-ms/.env

DB_HOST=productos-db  
DB_PORT=5432  
DB_USERNAME=postgres  
DB_PASSWORD=postgres  
DB_DATABASE=productos  
API_KEY=supersecret  

#### inventario-ms/.env

DB_HOST=inventario-db  
DB_PORT=5432  
DB_USERNAME=postgres  
DB_PASSWORD=postgres  
DB_DATABASE=inventario  
PRODUCTOS_MS_URL=http://productos-ms:3000  
API_KEY=supersecret  

## Ejecutar con Docker Compose

docker-compose up --build

## Testing

### Pruebas unitarias

npm run test

### Pruebas e2e

npm run test:e2e

## Seguridad

- Las rutas están protegidas con API Key (x-api-key en el header)
- Las rutas /v1 de productos y /inventario requieren autenticación
- Las rutas como / y /health son públicas

## Documentación Swagger

- productos-ms: http://localhost:3000/v1/api
- inventario-ms: http://localhost:3001/v1/api

## Arquitectura (mermaid)

```mermaid
graph TD
  subgraph Cliente
    C[Cliente]
  end

  subgraph productos-ms
    PGuard[API Key Guard]
    PInterceptor[JSON:API Interceptor]
    PController[Productos Controller]
    PService[Productos Service]
    PDB[(PostgreSQL: Productos)]
  end

  subgraph inventario-ms
    IGuard[API Key Guard]
    IInterceptor[JSON:API Interceptor]
    IController[Inventario Controller]
    IService[Inventario Service]
    IDB[(PostgreSQL: Inventario)]
  end

  %% Flujo productos-ms
  PController --> PGuard
  PController --> PInterceptor
  PController --> PService
  PService --> PDB

  %% Flujo inventario-ms
  IController --> IGuard
  IController --> IInterceptor
  IController --> IService
  IService --> IDB

  %% Comunicación entre servicios
  IService -- Llama vía HTTP --> PController

  %% Cliente accede a ambos
  C --> PController
  C --> IController

  end
  ```

## Contribución y despliegue
	1.	Clonar el repositorio:
        
        git clone https://github.com/pedrocobe05/json_api_ms.git
	
    2.	Iniciar los contenedores:
        
        docker-compose up –build
	
    3.	Acceder a la documentación Swagger o probar desde Postman

## Autor

    Andrés Cobeña - https://github.com/pedrocobe05