# 🛒 Microservicio de Productos

Este microservicio es parte de una arquitectura orientada a microservicios. Su función principal es gestionar productos (CRUD) mediante una API RESTful compatible con JSON:API.

Tecnologías utilizadas:

- [NestJS](https://nestjs.com/)
- PostgreSQL
- TypeORM
- Swagger
- Docker
- Jest (unit e e2e testing)

---

## 🚀 Requisitos

- Node.js 18+
- Docker y Docker Compose
- PostgreSQL (si no usas Docker para DB)

---

## ⚙️ Instalación local (modo desarrollo)

1. Clona el repositorio y entra al microservicio:

```bash
git clone <repo_url>
cd productos-ms
```

2. Instala dependencias:

```bash
npm install
```

3. Configura el entorno:

Crea el archivo `.env` y completa según tu entorno:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=productos
API_KEY=supersecreta123
```

4. Corre la aplicación:

```bash
npm run start:dev
```

---

## 🐳 Docker

### Estructura esperada

```bash
productos-ms/
├── ci/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
```

### Ejecutar con Docker Compose

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Accede a Swagger en:

```
http://localhost:3000/api
```

> Recuerda enviar siempre el header: `x-api-key: supersecreta123`

---

## 📘 Documentación Swagger

Disponible en:  
📎 [http://localhost:3000/api](http://localhost:3000/api)

Incluye especificación de endpoints, schemas y modelos de respuesta en formato JSON:API.

---

## 🔐 Autenticación

Este microservicio protege todos sus endpoints mediante **API Key**.

**Header requerido** en cada petición:

```http
x-api-key: supersecreta123
```

---

## 🧪 Testing

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

## 📂 Estructura de carpetas

```
src/
├── productos/
│   ├── dto/
│   ├── entities/
│   ├── productos.controller.ts
│   └── productos.service.ts
├── common/
│   ├── interceptors/json-api.interceptor.ts
│   └── guards/api-key.guard.ts
├── app.module.ts
├── app.controller.ts (opcional)
└── app.service.ts (opcional)
```

---

## 🧑‍💻 Autor

Andrés Cobeña  
[Tech Lead Candidate – Senior Backend Developer]

---

## 📝 Licencia

MIT