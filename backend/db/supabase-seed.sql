-- Ejecuta este archivo después de backend/db/supabase-schema.sql.
-- Requiere que existan en Supabase Auth los usuarios:
-- admin@nexotech.mx y user@nexotech.mx

insert into public.profiles (id, name, role)
select
  id,
  coalesce(raw_user_meta_data ->> 'name', split_part(email, '@', 1)),
  case when email = 'admin@nexotech.mx' then 'admin' else 'user' end
from auth.users
where email in ('admin@nexotech.mx', 'user@nexotech.mx')
on conflict (id) do update
set name = excluded.name,
    role = excluded.role;

delete from public.resources;
delete from public.categories;

insert into public.categories (name, slug, description)
values
  ('Desarrollo web', 'desarrollo-web', 'Frontend, backend y construcción de aplicaciones modernas.'),
  ('Datos', 'datos', 'Bases de datos, análisis y visualización de información.'),
  ('Cloud', 'cloud', 'Arquitectura, despliegue y servicios en la nube.'),
  ('Ciberseguridad', 'ciberseguridad', 'Buenas prácticas y protección de aplicaciones.');

insert into public.resources (
  title,
  slug,
  description,
  level,
  duration_hours,
  image_url,
  featured,
  category_id,
  author_id
)
select
  resource.title,
  resource.slug,
  resource.description,
  resource.level,
  resource.duration_hours,
  resource.image_url,
  resource.featured,
  category.id,
  admin_profile.id
from (
  values
    ('React desde cero', 'react-desde-cero-1', 'Componentes, estado, formularios y consumo de servicios en un proyecto guiado.', 'Inicial', 18, '/images/react.svg', true, 'desarrollo-web'),
    ('API REST con Node.js', 'api-rest-con-node-js-2', 'Endpoints, validaciones, autenticación y manejo de errores con Express.', 'Intermedio', 24, '/images/node.svg', true, 'desarrollo-web'),
    ('SQL y modelado relacional', 'sql-y-modelado-relacional-3', 'Consultas, relaciones, índices y buenas prácticas para diseñar tablas.', 'Inicial', 16, '/images/sql.svg', false, 'datos'),
    ('Analítica con Python', 'analitica-con-python-4', 'Limpieza de datos, automatización y reportes con scripts reutilizables.', 'Intermedio', 22, '/images/python.svg', false, 'datos'),
    ('Fundamentos de nube', 'fundamentos-de-nube-5', 'Servicios básicos de cómputo, redes, almacenamiento y despliegue.', 'Inicial', 14, '/images/cloud.svg', false, 'cloud'),
    ('Seguridad para APIs', 'seguridad-para-apis-6', 'Autenticación, validación de entrada, permisos y límites de uso.', 'Avanzado', 20, '/images/security.svg', true, 'ciberseguridad'),
    ('TypeScript aplicado', 'typescript-aplicado-7', 'Tipos, interfaces y patrones prácticos para aplicaciones React.', 'Intermedio', 15, '/images/typescript.svg', false, 'desarrollo-web'),
    ('Docker para equipos', 'docker-para-equipos-8', 'Imágenes, contenedores, redes y flujos reproducibles de trabajo.', 'Intermedio', 12, '/images/docker.svg', false, 'cloud'),
    ('Dashboards efectivos', 'dashboards-efectivos-9', 'Indicadores claros, visualización y criterios para tomar decisiones.', 'Inicial', 10, '/images/dashboard.svg', false, 'datos')
) as resource(title, slug, description, level, duration_hours, image_url, featured, category_slug)
join public.categories category on category.slug = resource.category_slug
cross join (
  select id
  from public.profiles
  where role = 'admin'
  order by created_at
  limit 1
) admin_profile;
