# System Tickets Backend

Backend para gestion de tickets de soporte tecnico con Node.js, Express y PostgreSQL.

## Estructura

```txt
app.js                  # Configura Express, middlewares, Swagger y rutas
server.js               # Arranca el servidor HTTP
config/
  env.js                # Centraliza variables de entorno
  database.js           # Configura el pool de PostgreSQL
  swagger.js            # Configuracion de Swagger
controllers/            # Adaptan request/response HTTP
services/               # Reglas de negocio
repositories/           # Consultas SQL y acceso a datos
routes/                 # Definicion de endpoints
middleware/             # Auth y manejo de errores
utils/                  # Utilidades compartidas
```

## Requisitos

- Node.js 20+
- PostgreSQL

## Instalacion

```bash
npm install
```

## Configuracion

Crea un archivo `.env` usando `.env.example` como guia.

En local puedes usar variables separadas:

```env
PORT=8007
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bd_tickets
DB_PASSWORD=12345
DB_PORT=5432
JWT_SECRET=firma_secreta_123
```

En Dockploy usa la URL interna de PostgreSQL:

```env
DATABASE_URL=postgresql://usuario:password@servicio-postgres:5432/nombre_db
JWT_SECRET=firma_secreta_123
```

La URL externa de PostgreSQL se usa solo desde fuera de la red interna del deploy.

## Ejecucion

```bash
npm run dev
```

Produccion:

```bash
npm start
```

## Health checks

```txt
GET /api/health
GET /api/health/db
```

## Swagger

```txt
/api-docs
```
