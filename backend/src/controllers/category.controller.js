import { supabaseAdmin, supabasePublic, throwSupabaseError } from '../config/supabase.js';
import { demoCategories, shouldUseDemoCatalog } from '../data/demoCatalog.js';
import { slugify } from '../utils/slugify.js';

const normalizeCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  created_at: category.created_at,
  resource_count: category.resources?.[0]?.count ?? 0,
});

export const listCategories = async (request, response) => {
  try {
    const { data, error } = await supabasePublic
      .from('categories')
      .select('id, name, slug, description, created_at, resources(count)')
      .order('name', { ascending: true });

    throwSupabaseError(error);
    return response.json({ data: (data || []).map(normalizeCategory) });
  } catch (error) {
    if (shouldUseDemoCatalog(error)) {
      return response.json({ data: demoCategories });
    }

    throw error;
  }
};

export const createCategory = async (request, response) => {
  const { name, description = '' } = request.body;
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
    })
    .select('id, name, slug, description, created_at')
    .single();

  throwSupabaseError(error);
  return response.status(201).json({ data: { ...data, resource_count: 0 } });
};

export const updateCategory = async (request, response) => {
  const { name, description = '' } = request.body;
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
    })
    .eq('id', Number(request.params.id))
    .select('id, name, slug, description, created_at')
    .maybeSingle();

  throwSupabaseError(error);

  if (!data) {
    return response.status(404).json({ message: 'Categoría no encontrada.' });
  }

  return response.json({ data });
};

export const deleteCategory = async (request, response) => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', Number(request.params.id))
    .select('id')
    .maybeSingle();

  throwSupabaseError(error);

  if (!data) {
    return response.status(404).json({ message: 'Categoría no encontrada.' });
  }

  return response.status(204).send();
};
