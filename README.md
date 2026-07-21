# NexoTech - Catálogo técnico

NexoTech permite consultar rutas técnicas, filtrar recursos y mantener el contenido desde un panel privado. El frontend usa React y Vite; el backend está hecho con Node.js y Express; la autenticación y la base PostgreSQL viven en Supabase.

## Enlaces de entrega

- Frontend: `https://turing-ia-prueba-frontend-vxd8.vercel.app`
- Backend: `https://turing-ia-prueba-backend.vercel.app`
- Health check: `https://turing-ia-prueba-backend.vercel.app/api/health`

## Estructura

```text
turing-nexotech/
├── frontend/                         # React + Vite
│   ├── src/
│   ├── .env.example
│   └── vercel.json                   # Reescritura para React Router
├── backend/                          # Node.js + Express
│   ├── db/supabase-schema.sql        # Tablas, relaciones, triggers, grants y RLS
│   ├── db/supabase-seed.sql          # Datos iniciales para SQL Editor
│   ├── scripts/seedSupabase.js       # Usuarios y datos iniciales
│   ├── src/
│   └── .env.example
├── docs/
├── postman/
├── package.json
└── README.md
```

## Arquitectura

- **Frontend:** React, Vite, React Router y Boneyard para los estados de carga del catálogo.
- **Backend:** Express, validación, rate limiting, CORS y Helmet.
- **Base de datos:** Supabase PostgreSQL.
- **Autenticación:** Supabase Auth con usuarios `admin` y `user`.
- **Tokens:** JWT de Supabase verificados en el backend mediante el endpoint JWKS.
- **Seguridad de datos:** Row Level Security en `profiles`, `categories` y `resources`.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Proyecto de Supabase activo.
- Cuenta de GitHub y cuenta de Vercel.

## 1. Seguridad antes de comenzar

La variables de Supabase son privadas y no se incluyen en GitHub, React, archivos públicos ni capturas.


## 2. Crear las tablas en Supabase

1. Abre tu proyecto en Supabase.
2. Entra en **SQL Editor**.
3. Crea una consulta nueva.
4. Copia todo el contenido de:

```text
backend/db/supabase-schema.sql
```

5. Presiona **Run**.

El script crea:

- `profiles`: perfil y rol de cada usuario de Supabase Auth.
- `categories`: categorías del catálogo.
- `resources`: recursos relacionados con una categoría y un autor.
- Llaves foráneas e índices.
- Trigger para crear o actualizar perfiles desde `auth.users`.
- Trigger para actualizar `updated_at`.
- Políticas RLS para lectura pública y escritura administrativa.

## 3. Configurar variables locales del backend

Desde la raíz del proyecto:

```powershell
Copy-Item backend/.env.example backend/.env
```

Abre `backend/.env` y completa:

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://fahjewvnxdvaezyzxpzf.supabase.co
SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
SUPABASE_SECRET_KEY=TU_NUEVA_CLAVE_SECRETA
SUPABASE_JWKS_URL=https://fahjewvnxdvaezyzxpzf.supabase.co/auth/v1/.well-known/jwks.json
CORS_ORIGIN=http://localhost:5173,https://turing-ia-prueba-frontend-vxd8.vercel.app
```

`SUPABASE_SECRET_KEY` se usa para ejecutar el seed local contra Supabase Auth. El backend en producción opera con la publishable key y las políticas RLS. `backend/.env` está ignorado por Git y no debe subirse.

## 4. Crear usuarios y datos iniciales

Instala las dependencias:

```bash
npm install
```

Después ejecuta:

```bash
npm run db:seed
```

Este comando crea o actualiza usuarios operativos en Supabase Auth y llena `profiles`, `categories` y `resources`.

Si prefieres hacerlo desde Supabase Dashboard, después del esquema ejecuta también:

```text
backend/db/supabase-seed.sql
```

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@nexotech.mx | Admin123! |
| User | user@nexotech.mx | User123! |

El seed reemplaza las categorías y recursos iniciales. No debe ejecutarse sobre una base con información real que se quiera conservar.

## 5. Ejecutar localmente

Copia la configuración del frontend:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

El contenido local debe ser:

```env
VITE_API_URL=http://localhost:4000/api
```

Inicia ambos proyectos:

```bash
npm run dev
```

Direcciones locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Estado: `http://localhost:4000/api/health`

## 6. Verificación antes de subir

```bash
npm run check
```

El comando revisa la sintaxis del backend, ejecuta ESLint y compila el frontend.

Si modificas el layout del catálogo, regenera los skeletons de carga con:

```bash
npm run dev --workspace frontend
npm run bones --workspace frontend
```

Boneyard captura la UI real y actualiza `frontend/src/bones`.

## 7. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: complete fullstack application with Supabase"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Confirma que no aparezca ningún archivo `.env` en el commit:

```bash
git status
```

## 8. Desplegar el backend en Vercel

1. En Vercel selecciona **Add New > Project**.
2. Importa el repositorio.
3. En **Root Directory**, selecciona `backend`.
4. Usa **Framework Preset: Other**. El archivo `src/server.js` exporta la app Express para que Vercel la ejecute como función.
5. En **Environment Variables**, agrega:

```text
NODE_ENV=production
SUPABASE_URL=https://fahjewvnxdvaezyzxpzf.supabase.co
SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
SUPABASE_JWKS_URL=https://fahjewvnxdvaezyzxpzf.supabase.co/auth/v1/.well-known/jwks.json
CORS_ORIGIN=https://TU-FRONTEND.vercel.app
```

6. Despliega el proyecto.

Cuando todavía no conozcas el dominio final del frontend, puedes colocar temporalmente `http://localhost:5173` y actualizar `CORS_ORIGIN` después.

Prueba:

```text
https://turing-ia-prueba-backend.vercel.app/api/health
https://turing-ia-prueba-backend.vercel.app/api/categories
https://turing-ia-prueba-backend.vercel.app/api/resources
```

## 9. Desplegar el frontend en Vercel

1. Crea otro proyecto de Vercel importando el mismo repositorio.
2. En **Root Directory**, selecciona `frontend`.
3. Usa **Framework Preset: Vite**.
4. Configura:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Agrega la variable:

```text
VITE_API_URL=https://TU-BACKEND.vercel.app/api
```

Para esta entrega, el valor es:

```text
VITE_API_URL=https://turing-ia-prueba-backend.vercel.app/api
```

6. Despliega.

`frontend/vercel.json` evita errores 404 al recargar `/login`, `/perfil` o `/admin`.

## 10. Ajustar CORS definitivamente

Cuando tengas el dominio real del frontend:

1. Abre el proyecto del backend en Vercel.
2. Ve a **Settings > Environment Variables**.
3. Cambia `CORS_ORIGIN` por el dominio exacto del frontend, sin `/` al final.
4. Vuelve a desplegar el backend.

Ejemplo:

```text
CORS_ORIGIN=https://turing-ia-prueba-frontend-vxd8.vercel.app
```

También puedes admitir desarrollo local separando valores con coma:

```text
CORS_ORIGIN=https://turing-ia-prueba-frontend-vxd8.vercel.app,http://localhost:5173
```

## 11. Prueba final

Comprueba:

1. El catálogo muestra registros obtenidos desde Supabase.
2. Funcionan búsqueda, categorías y carga progresiva.
3. El administrador puede crear, modificar y eliminar recursos.
4. El administrador puede crear y eliminar categorías sin recursos asociados.
5. El usuario normal puede iniciar sesión, pero no abrir `/admin`.
6. La sesión se renueva mediante el refresh token de Supabase.
7. El diseño funciona en escritorio, tableta y teléfono.

## Variables por proyecto

### Backend de Vercel

```text
NODE_ENV
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_JWKS_URL
CORS_ORIGIN
```

`SUPABASE_SECRET_KEY` solo es necesaria para el seed local (`npm run db:seed`) o tareas privadas de administración; no debe exponerse al frontend.

### Frontend de Vercel

```text
VITE_API_URL
```

Nunca agregues `SUPABASE_SECRET_KEY` a una variable que comience con `VITE_`, porque esas variables se incorporan al código enviado al navegador.

## Scripts

```bash
npm run dev       # Frontend y backend localmente
npm run db:seed   # Crea usuarios y carga datos iniciales en Supabase
npm run bones     # Regenera los skeletons de Boneyard del frontend
npm run build     # Compila el frontend
npm run start     # Inicia el backend
npm run lint      # Revisa el frontend
npm run check     # Verificación completa previa al despliegue
```
