# Esquema de Supabase PostgreSQL

El esquema se instala ejecutando `backend/db/supabase-schema.sql` en el SQL Editor de Supabase.

## Diagrama entidad-relación

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : tiene
    PROFILES ||--o{ RESOURCES : publica
    CATEGORIES ||--o{ RESOURCES : clasifica

    AUTH_USERS {
      uuid id PK
      varchar email
    }

    PROFILES {
      uuid id PK_FK
      varchar name
      varchar role
      timestamptz created_at
    }

    CATEGORIES {
      bigint id PK
      varchar name UK
      varchar slug UK
      varchar description
      timestamptz created_at
    }

    RESOURCES {
      bigint id PK
      varchar title
      varchar slug UK
      text description
      varchar level
      int duration_hours
      varchar image_url
      boolean featured
      bigint category_id FK
      uuid author_id FK
      timestamptz created_at
      timestamptz updated_at
    }
```

## Relaciones

- Supabase Auth administra credenciales dentro de `auth.users`.
- Cada usuario autenticado tiene un registro asociado en `public.profiles`.
- Un perfil puede publicar muchos recursos.
- Una categoría puede clasificar muchos recursos.
- Cada recurso pertenece a una categoría y a un autor.

## Normalización hasta 3NF

1. Cada columna contiene valores atómicos.
2. Los atributos dependen de la llave primaria completa de su tabla.
3. Los datos de identidad, perfil y categoría no se duplican dentro de `resources`; se relacionan mediante llaves foráneas.

## Seguridad

- RLS está habilitado en las tres tablas públicas.
- Categorías y recursos admiten lectura pública.
- Solo un usuario autenticado con rol `admin` puede crear, modificar o eliminar datos.
- La lectura pública de autores expone solo `id` y `name`.
- Los usuarios autenticados leen su propio perfil con `id`, `name` y `role`.
- El backend usa la publishable key y el JWT del usuario para que Supabase aplique RLS en operaciones protegidas.
- La clave secreta se reserva para el seed local y tareas privadas de administración.
