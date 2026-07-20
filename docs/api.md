# Documentación de la API NexoTech

Base local: `http://localhost:4000/api`
Base producción: `https://turing-ia-prueba-backend.vercel.app/api`

## Autenticación con Supabase Auth

### POST `/auth/login`

```json
{
  "email": "admin@nexotech.mx",
  "password": "Admin123!"
}
```

Respuesta:

```json
{
  "token": "access-token-de-supabase",
  "refreshToken": "refresh-token-de-supabase",
  "expiresAt": 1780000000,
  "user": {
    "id": "uuid",
    "name": "Administrador NexoTech",
    "email": "admin@nexotech.mx",
    "role": "admin"
  }
}
```

### POST `/auth/refresh`

```json
{
  "refreshToken": "refresh-token-de-supabase"
}
```

Genera una nueva sesión cuando el access token vence.

### GET `/auth/me`

Requiere `Authorization: Bearer ACCESS_TOKEN`. El backend verifica la firma mediante el endpoint JWKS de Supabase y consulta el rol en `profiles`.

## Categorías

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/categories` | Público | Lista categorías y cantidad de recursos |
| POST | `/categories` | Admin | Crea categoría |
| PUT | `/categories/:id` | Admin | Actualiza categoría |
| DELETE | `/categories/:id` | Admin | Elimina categoría sin recursos relacionados |

## Recursos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/resources` | Público | Lista paginada y filtrable |
| GET | `/resources/:id` | Público | Obtiene un recurso |
| POST | `/resources` | Admin | Crea un recurso |
| PUT | `/resources/:id` | Admin | Actualiza un recurso |
| DELETE | `/resources/:id` | Admin | Elimina un recurso |

Parámetros de consulta:

- `page`: página actual.
- `limit`: registros por página, máximo 24.
- `category`: slug de categoría.
- `search`: texto buscado.
- `featured=true`: únicamente destacados.

## Salud

### GET `/health`

Devuelve estado y fecha del servicio.
