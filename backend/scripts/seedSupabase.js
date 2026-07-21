import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const requiredVariables = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY'];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(`Faltan variables: ${missingVariables.join(', ')}`);
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const categories = [
  { name: 'Desarrollo web', slug: 'desarrollo-web', description: 'Frontend, backend y construcción de aplicaciones modernas.' },
  { name: 'Datos', slug: 'datos', description: 'Bases de datos, análisis y visualización de información.' },
  { name: 'Cloud', slug: 'cloud', description: 'Arquitectura, despliegue y servicios en la nube.' },
  { name: 'Ciberseguridad', slug: 'ciberseguridad', description: 'Buenas prácticas y protección de aplicaciones.' },
];

const resources = [
  ['React desde cero', 'Componentes, estado, formularios y consumo de servicios en un proyecto guiado.', 'Inicial', 18, '/images/react.svg', true, 'desarrollo-web'],
  ['API REST con Node.js', 'Endpoints, validaciones, autenticación y manejo de errores con Express.', 'Intermedio', 24, '/images/node.svg', true, 'desarrollo-web'],
  ['SQL y modelado relacional', 'Consultas, relaciones, índices y buenas prácticas para diseñar tablas.', 'Inicial', 16, '/images/sql.svg', false, 'datos'],
  ['Analítica con Python', 'Limpieza de datos, automatización y reportes con scripts reutilizables.', 'Intermedio', 22, '/images/python.svg', false, 'datos'],
  ['Fundamentos de nube', 'Servicios básicos de cómputo, redes, almacenamiento y despliegue.', 'Inicial', 14, '/images/cloud.svg', false, 'cloud'],
  ['Seguridad para APIs', 'Autenticación, validación de entrada, permisos y límites de uso.', 'Avanzado', 20, '/images/security.svg', true, 'ciberseguridad'],
  ['TypeScript aplicado', 'Tipos, interfaces y patrones prácticos para aplicaciones React.', 'Intermedio', 15, '/images/typescript.svg', false, 'desarrollo-web'],
  ['Docker para equipos', 'Imágenes, contenedores, redes y flujos reproducibles de trabajo.', 'Intermedio', 12, '/images/docker.svg', false, 'cloud'],
  ['Dashboards efectivos', 'Indicadores claros, visualización y criterios para tomar decisiones.', 'Inicial', 10, '/images/dashboard.svg', false, 'datos'],
];

const ensureUser = async ({ email, password, name, role }) => {
  const { data: userList, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) throw listError;

  const existing = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  let user;

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      user_metadata: { name },
      app_metadata: { role },
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role },
    });
    if (error) throw error;
    user = data.user;
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    name,
    role,
  });

  if (profileError) throw profileError;
  return user;
};

const run = async () => {
  const admin = await ensureUser({
    email: 'admin@nexotech.mx',
    password: 'Admin123!',
    name: 'Administrador NexoTech',
    role: 'admin',
  });

  await ensureUser({
    email: 'user@nexotech.mx',
    password: 'User123!',
    name: 'Coordinador NexoTech',
    role: 'user',
  });

  const { error: resourcesDeleteError } = await supabase
    .from('resources')
    .delete()
    .gte('id', 0);
  if (resourcesDeleteError) throw resourcesDeleteError;

  const { error: categoriesDeleteError } = await supabase
    .from('categories')
    .delete()
    .gte('id', 0);
  if (categoriesDeleteError) throw categoriesDeleteError;

  const { data: insertedCategories, error: categoriesError } = await supabase
    .from('categories')
    .insert(categories)
    .select('id, slug');
  if (categoriesError) throw categoriesError;

  const categoryIds = Object.fromEntries(insertedCategories.map((category) => [category.slug, category.id]));
  const records = resources.map(([title, description, level, duration, imageUrl, featured, categorySlug], index) => ({
    title,
    slug: `${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
    description,
    level,
    duration_hours: duration,
    image_url: imageUrl,
    featured,
    category_id: categoryIds[categorySlug],
    author_id: admin.id,
  }));

  const { error: resourcesError } = await supabase.from('resources').insert(records);
  if (resourcesError) throw resourcesError;

  console.log('Supabase quedó poblado correctamente.');
  console.log('Admin: admin@nexotech.mx / Admin123!');
  console.log('User: user@nexotech.mx / User123!');
};

run().catch((error) => {
  if (error.code === 'PGRST205') {
    console.error('No se encontraron las tablas públicas del proyecto en Supabase.');
    console.error('Ejecuta primero backend/db/supabase-schema.sql desde Supabase Dashboard > SQL Editor.');
    process.exit(1);
  }

  console.error('No fue posible poblar Supabase:', error.message || error);
  console.error('Verifica que backend/db/supabase-schema.sql ya se haya ejecutado en el SQL Editor.');
  process.exit(1);
});
