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
    ('React desde cero', 'react-desde-cero-1', 'Componentes, estado, eventos y consumo de servicios REST con un proyecto práctico.', 'Inicial', 18, '/images/react.svg', true, 'desarrollo-web'),
    ('API REST con Node.js', 'api-rest-con-node-js-2', 'Diseña una API mantenible con Express, validación, seguridad, autenticación y Supabase.', 'Intermedio', 24, '/images/node.svg', true, 'desarrollo-web'),
    ('SQL y modelado relacional', 'sql-y-modelado-relacional-3', 'Aprende consultas, relaciones, índices y normalización hasta tercera forma normal.', 'Inicial', 16, '/images/sql.svg', false, 'datos'),
    ('Analítica con Python', 'analitica-con-python-4', 'Procesa datos, automatiza tareas y crea reportes reproducibles con Python.', 'Intermedio', 22, '/images/python.svg', false, 'datos'),
    ('Fundamentos de nube', 'fundamentos-de-nube-5', 'Comprende redes, almacenamiento, cómputo, observabilidad y despliegue continuo.', 'Inicial', 14, '/images/cloud.svg', false, 'cloud'),
    ('Seguridad para APIs', 'seguridad-para-apis-6', 'Protege endpoints mediante JWT, validación, rate limiting y control de acceso.', 'Avanzado', 20, '/images/security.svg', true, 'ciberseguridad'),
    ('TypeScript aplicado', 'typescript-aplicado-7', 'Tipado práctico para interfaces, servicios y aplicaciones React escalables.', 'Intermedio', 15, '/images/typescript.svg', false, 'desarrollo-web'),
    ('Docker para equipos', 'docker-para-equipos-8', 'Contenedores, imágenes, redes y flujos reproducibles para desarrollo y producción.', 'Intermedio', 12, '/images/docker.svg', false, 'cloud'),
    ('Dashboards efectivos', 'dashboards-efectivos-9', 'Convierte datos en indicadores claros mediante diseño visual y narrativa analítica.', 'Inicial', 10, '/images/dashboard.svg', false, 'datos')
) as resource(title, slug, description, level, duration_hours, image_url, featured, category_slug)
join public.categories category on category.slug = resource.category_slug
cross join (
  select id
  from public.profiles
  where role = 'admin'
  order by created_at
  limit 1
) admin_profile;
