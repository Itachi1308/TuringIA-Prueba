const now = new Date('2026-07-20T00:00:00.000Z').toISOString();

export const demoCategories = [
  {
    id: 1,
    name: 'Desarrollo web',
    slug: 'desarrollo-web',
    description: 'Frontend, backend y construcción de aplicaciones modernas.',
    created_at: now,
    resource_count: 3,
  },
  {
    id: 2,
    name: 'Datos',
    slug: 'datos',
    description: 'Bases de datos, análisis y visualización de información.',
    created_at: now,
    resource_count: 3,
  },
  {
    id: 3,
    name: 'Cloud',
    slug: 'cloud',
    description: 'Arquitectura, despliegue y servicios en la nube.',
    created_at: now,
    resource_count: 2,
  },
  {
    id: 4,
    name: 'Ciberseguridad',
    slug: 'ciberseguridad',
    description: 'Buenas prácticas y protección de aplicaciones.',
    created_at: now,
    resource_count: 1,
  },
];

const author = {
  id: 'demo-admin',
  name: 'Administrador NexoTech',
};

const categoryBySlug = Object.fromEntries(demoCategories.map((category) => [category.slug, category]));

const buildResource = (id, title, description, level, durationHours, imageUrl, featured, categorySlug) => ({
  id,
  title,
  slug: `${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}-${id}`,
  description,
  level,
  duration_hours: durationHours,
  image_url: imageUrl,
  featured,
  created_at: now,
  updated_at: now,
  category: {
    id: categoryBySlug[categorySlug].id,
    name: categoryBySlug[categorySlug].name,
    slug: categoryBySlug[categorySlug].slug,
  },
  author,
});

export const demoResources = [
  buildResource(1, 'React desde cero', 'Componentes, estado, eventos y consumo de servicios REST con un proyecto práctico.', 'Inicial', 18, '/images/react.svg', true, 'desarrollo-web'),
  buildResource(2, 'API REST con Node.js', 'Diseña una API mantenible con Express, validación, seguridad, autenticación y Supabase.', 'Intermedio', 24, '/images/node.svg', true, 'desarrollo-web'),
  buildResource(3, 'SQL y modelado relacional', 'Aprende consultas, relaciones, índices y normalización hasta tercera forma normal.', 'Inicial', 16, '/images/sql.svg', false, 'datos'),
  buildResource(4, 'Analítica con Python', 'Procesa datos, automatiza tareas y crea reportes reproducibles con Python.', 'Intermedio', 22, '/images/python.svg', false, 'datos'),
  buildResource(5, 'Fundamentos de nube', 'Comprende redes, almacenamiento, cómputo, observabilidad y despliegue continuo.', 'Inicial', 14, '/images/cloud.svg', false, 'cloud'),
  buildResource(6, 'Seguridad para APIs', 'Protege endpoints mediante JWT, validación, rate limiting y control de acceso.', 'Avanzado', 20, '/images/security.svg', true, 'ciberseguridad'),
  buildResource(7, 'TypeScript aplicado', 'Tipado práctico para interfaces, servicios y aplicaciones React escalables.', 'Intermedio', 15, '/images/typescript.svg', false, 'desarrollo-web'),
  buildResource(8, 'Docker para equipos', 'Contenedores, imágenes, redes y flujos reproducibles para desarrollo y producción.', 'Intermedio', 12, '/images/docker.svg', false, 'cloud'),
  buildResource(9, 'Dashboards efectivos', 'Convierte datos en indicadores claros mediante diseño visual y narrativa analítica.', 'Inicial', 10, '/images/dashboard.svg', false, 'datos'),
];

export const shouldUseDemoCatalog = (error) => {
  const message = error?.message || '';

  return error?.code === 'PGRST205'
    || message.includes('Faltan variables de Supabase')
    || message.includes('Invalid API key')
    || message.includes('No API key found');
};

export const paginateDemoResources = ({ page, limit, category = '', search = '', featured = false }) => {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = demoResources.filter((resource) => {
    const matchesCategory = !category || resource.category.slug === category;
    const matchesFeatured = !featured || resource.featured;
    const matchesSearch = !normalizedSearch
      || resource.title.toLowerCase().includes(normalizedSearch)
      || resource.description.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesFeatured && matchesSearch;
  });

  const from = (page - 1) * limit;
  const data = filtered.slice(from, from + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: from + data.length < filtered.length,
    },
  };
};
