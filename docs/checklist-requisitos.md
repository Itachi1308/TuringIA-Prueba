# Revisión de requisitos

Esta lista resume el alcance implementado y los puntos que se validan antes de entregar la liga pública.

## Frontend

- [x] Aplicación en React con Vite.
- [x] Componentes separados por responsabilidad.
- [x] Rutas con React Router: inicio, login, perfil y administración.
- [x] Catálogo consumido desde la API.
- [x] Búsqueda, filtro por categoría y carga progresiva.
- [x] Diseño adaptable para escritorio, tableta y móvil.
- [x] Configuración de Vercel para recargar rutas internas sin 404.

## Backend

- [x] API REST con Express.
- [x] Separación de rutas, controladores, middlewares y configuración.
- [x] Endpoints GET, POST, PUT y DELETE.
- [x] CRUD de recursos y categorías.
- [x] Validación de datos de entrada.
- [x] CORS, Helmet, rate limiting y manejador centralizado de errores.
- [x] Autenticación con Supabase Auth y verificación de JWT mediante JWKS.
- [x] Protección por rol para operaciones de administración.

## Base de datos

- [x] Script SQL para instalar `profiles`, `categories` y `resources`.
- [x] Relaciones, restricciones, índices y normalización hasta 3NF.
- [x] Row Level Security y políticas de acceso.
- [x] Script de datos iniciales para usuarios, categorías y recursos.

## Entrega

- [x] README con instalación local, variables y despliegue.
- [x] Documentación de API.
- [x] Diagrama y explicación de base de datos.
- [x] Colección Postman.
- [x] Reportes de avance y guion de video.

## Validación final

- [ ] Ejecutar `backend/db/supabase-schema.sql` en Supabase.
- [ ] Ejecutar `npm run db:seed`.
- [ ] Confirmar que `/api/health`, `/api/categories` y `/api/resources` respondan en Vercel.
- [ ] Confirmar que el frontend público use el backend público, no `localhost`.
