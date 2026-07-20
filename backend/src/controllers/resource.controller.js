import { supabaseAdmin, supabasePublic, throwSupabaseError } from '../config/supabase.js';
import { paginateDemoResources, shouldUseDemoCatalog } from '../data/demoCatalog.js';
import { slugify } from '../utils/slugify.js';

const selectFields = `
  id,
  title,
  slug,
  description,
  level,
  duration_hours,
  image_url,
  featured,
  created_at,
  updated_at,
  category:categories!inner(id, name, slug),
  author:profiles!inner(id, name)
`;

const sanitizeSearch = (value) => value.trim().replace(/[,%()]/g, ' ').replace(/\s+/g, ' ');

export const listResources = async (request, response) => {
  const page = Math.max(Number.parseInt(request.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit || '6', 10), 1), 24);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let databaseQuery = supabasePublic
      .from('resources')
      .select(selectFields, { count: 'exact' })
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (request.query.category) {
      databaseQuery = databaseQuery.eq('categories.slug', request.query.category);
    }

    if (request.query.search) {
      const search = sanitizeSearch(request.query.search);
      if (search) {
        databaseQuery = databaseQuery.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`,
        );
      }
    }

    if (request.query.featured === 'true') {
      databaseQuery = databaseQuery.eq('featured', true);
    }

    const { data, error, count } = await databaseQuery;
    throwSupabaseError(error);

    const total = count || 0;

    return response.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: from + (data?.length || 0) < total,
      },
    });
  } catch (error) {
    if (shouldUseDemoCatalog(error)) {
      return response.json(paginateDemoResources({
        page,
        limit,
        category: request.query.category || '',
        search: request.query.search || '',
        featured: request.query.featured === 'true',
      }));
    }

    throw error;
  }
};

export const getResource = async (request, response) => {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select(selectFields)
    .eq('id', Number(request.params.id))
    .maybeSingle();

  throwSupabaseError(error);

  if (!data) {
    return response.status(404).json({ message: 'Recurso no encontrado.' });
  }

  return response.json({ data });
};

export const createResource = async (request, response) => {
  const {
    title,
    description,
    level,
    durationHours,
    imageUrl,
    featured = false,
    categoryId,
  } = request.body;

  const { data, error } = await supabaseAdmin
    .from('resources')
    .insert({
      title: title.trim(),
      slug: `${slugify(title)}-${Date.now()}`,
      description: description.trim(),
      level,
      duration_hours: durationHours,
      image_url: imageUrl.trim(),
      featured: Boolean(featured),
      category_id: categoryId,
      author_id: request.user.sub,
    })
    .select(selectFields)
    .single();

  throwSupabaseError(error);
  return response.status(201).json({ data });
};

export const updateResource = async (request, response) => {
  const {
    title,
    description,
    level,
    durationHours,
    imageUrl,
    featured = false,
    categoryId,
  } = request.body;

  const { data, error } = await supabaseAdmin
    .from('resources')
    .update({
      title: title.trim(),
      slug: `${slugify(title)}-${request.params.id}`,
      description: description.trim(),
      level,
      duration_hours: durationHours,
      image_url: imageUrl.trim(),
      featured: Boolean(featured),
      category_id: categoryId,
    })
    .eq('id', Number(request.params.id))
    .select(selectFields)
    .maybeSingle();

  throwSupabaseError(error);

  if (!data) {
    return response.status(404).json({ message: 'Recurso no encontrado.' });
  }

  return response.json({ data });
};

export const deleteResource = async (request, response) => {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .delete()
    .eq('id', Number(request.params.id))
    .select('id')
    .maybeSingle();

  throwSupabaseError(error);

  if (!data) {
    return response.status(404).json({ message: 'Recurso no encontrado.' });
  }

  return response.status(204).send();
};
