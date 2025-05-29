Guía de Implementación para Desarrolladores

Esta guía describe cómo levantar, ejecutar y extender el microservicio de productos en un entorno local o de desarrollo.

⸻

Requisitos Previos
	•	Node.js v18+
	•	Docker y Docker Compose
	•	PostgreSQL (si no usas el contenedor de Docker)

⸻

Estructura del Proyecto

productos-ms/
├── src/
│   ├── productos/         # Módulo principal del microservicio
│   ├── common/            # Interceptores, guards, filtros comunes
│   ├── app.module.ts
│   ├── main.ts
├── test/                 # Pruebas unitarias y e2e
├── ci/                   # Dockerfile y .dockerignore
├── docker-compose.yml
├── README.md


⸻

Instalación local

npm install
npm run start:dev

La API se expondrá en http://localhost:3000/v1

⸻

Usar Docker y Docker Compose
	1.	Construir la imagen:

docker-compose build

	2.	Levantar todo el stack:

docker-compose up

Esto levanta:
	•	Microservicio de productos
	•	PostgreSQL para persistencia

⸻

Documentación Swagger

Accede a la documentación en:

http://localhost:3000/api

Requiere una API Key en los headers: x-api-key: <valor>

⸻

Ejecutar pruebas

Pruebas unitarias

npm run test

Pruebas end-to-end

npm run test:e2e

Cobertura

npm run test:cov


⸻

Extender el microservicio
	•	Para agregar una nueva entidad: crear un nuevo módulo y registrar en AppModule.
	•	Para autenticación avanzada: integrar JWT o Cognito en lugar de API Keys.
	•	Para comunicación con otros servicios: usar HTTP o colas.

⸻

Seguridad
	•	Las rutas están protegidas con un guard que valida x-api-key.
	•	Agrega Helmet, Rate Limit y CORS para entornos productivos.

⸻

Notas adicionales
	•	La API está versionada con prefijo /v1
	•	Logs estructurados con Pino
	•	Health check disponible en /v1/health

⸻

Para cualquier duda técnica o contribuciones, contacta con el responsable técnico del proyecto.