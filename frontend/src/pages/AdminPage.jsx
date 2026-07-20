import { useCallback, useEffect, useMemo, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { api } from '../services/api.js';

const emptyResource = {
  title: '',
  description: '',
  level: 'Inicial',
  durationHours: 8,
  imageUrl: '/images/react.svg',
  featured: false,
  categoryId: '',
};

export default function AdminPage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [resourceForm, setResourceForm] = useState(emptyResource);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [resourceResult, categoryResult] = await Promise.all([
        api.resources.list({ page: 1, limit: 24 }),
        api.categories.list(),
      ]);
      setResources(resourceResult.data);
      setCategories(categoryResult.data);
      setResourceForm((current) => ({
        ...current,
        categoryId: current.categoryId || categoryResult.data[0]?.id || '',
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryOptions = useMemo(
    () => categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>),
    [categories],
  );

  const resetResourceForm = () => {
    setResourceForm({ ...emptyResource, categoryId: categories[0]?.id || '' });
    setEditingId(null);
  };

  const submitResource = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const payload = {
        ...resourceForm,
        durationHours: Number(resourceForm.durationHours),
        categoryId: Number(resourceForm.categoryId),
      };
      if (editingId) {
        await api.resources.update(editingId, payload);
        setMessage('Recurso actualizado correctamente.');
      } else {
        await api.resources.create(payload);
        setMessage('Recurso creado correctamente.');
      }
      resetResourceForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const editResource = (resource) => {
    setEditingId(resource.id);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      level: resource.level,
      durationHours: resource.duration_hours,
      imageUrl: resource.image_url,
      featured: resource.featured,
      categoryId: resource.category.id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeResource = async (id) => {
    if (!window.confirm('¿Eliminar este recurso?')) return;
    try {
      await api.resources.remove(id);
      setMessage('Recurso eliminado.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    try {
      await api.categories.create({ name: categoryName, description: categoryDescription });
      setCategoryName('');
      setCategoryDescription('');
      setMessage('Categoría creada correctamente.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Solo es posible si no tiene recursos.')) return;
    try {
      await api.categories.remove(id);
      setMessage('Categoría eliminada.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <PageShell>
      <section className="section page-hero">
        <div className="container">
          <span className="eyebrow">Panel protegido</span>
          <h1>Administración de contenido</h1>
          <p>Gestiona recursos y categorías mediante operaciones CRUD conectadas a Supabase PostgreSQL.</p>
          {message && <div className="alert alert--success" role="status">{message}</div>}
          {error && <div className="alert alert--error" role="alert">{error}</div>}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container admin-layout">
          <article className="admin-panel">
            <h2>{editingId ? 'Editar recurso' : 'Nuevo recurso'}</h2>
            <form className="form form--grid" onSubmit={submitResource}>
              <label className="form__wide">Título
                <input required minLength="4" maxLength="140" value={resourceForm.title} onChange={(event) => setResourceForm({ ...resourceForm, title: event.target.value })} />
              </label>
              <label>Categoría
                <select required value={resourceForm.categoryId} onChange={(event) => setResourceForm({ ...resourceForm, categoryId: event.target.value })}>{categoryOptions}</select>
              </label>
              <label>Nivel
                <select value={resourceForm.level} onChange={(event) => setResourceForm({ ...resourceForm, level: event.target.value })}>
                  <option>Inicial</option><option>Intermedio</option><option>Avanzado</option>
                </select>
              </label>
              <label>Duración en horas
                <input type="number" min="1" max="1000" required value={resourceForm.durationHours} onChange={(event) => setResourceForm({ ...resourceForm, durationHours: event.target.value })} />
              </label>
              <label>Imagen
                <input required value={resourceForm.imageUrl} onChange={(event) => setResourceForm({ ...resourceForm, imageUrl: event.target.value })} />
              </label>
              <label className="form__wide">Descripción
                <textarea required minLength="20" maxLength="1200" rows="5" value={resourceForm.description} onChange={(event) => setResourceForm({ ...resourceForm, description: event.target.value })} />
              </label>
              <label className="checkbox-field form__wide">
                <input type="checkbox" checked={resourceForm.featured} onChange={(event) => setResourceForm({ ...resourceForm, featured: event.target.checked })} />
                Mostrar como destacado
              </label>
              <div className="form-actions form__wide">
                <button className="button" type="submit">{editingId ? 'Guardar cambios' : 'Crear recurso'}</button>
                {editingId && <button type="button" className="button button--outline" onClick={resetResourceForm}>Cancelar</button>}
              </div>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Nueva categoría</h2>
            <form className="form" onSubmit={submitCategory}>
              <label>Nombre
                <input required minLength="2" maxLength="80" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
              </label>
              <label>Descripción
                <textarea maxLength="240" rows="3" value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} />
              </label>
              <button className="button" type="submit">Crear categoría</button>
            </form>
            <div className="compact-list">
              {categories.map((category) => (
                <div className="compact-list__item" key={category.id}>
                  <span><strong>{category.name}</strong><small>{category.resource_count} recursos</small></span>
                  <button type="button" className="icon-button" onClick={() => removeCategory(category.id)} aria-label={`Eliminar ${category.name}`}>×</button>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--left">
            <span className="eyebrow">Registros actuales</span>
            <h2>Recursos publicados</h2>
          </div>
          {loading ? <p>Cargando...</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Título</th><th>Categoría</th><th>Nivel</th><th>Horas</th><th>Acciones</th></tr></thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td>{resource.title}</td><td>{resource.category.name}</td><td>{resource.level}</td><td>{resource.duration_hours}</td>
                      <td><div className="table-actions"><button type="button" onClick={() => editResource(resource)}>Editar</button><button type="button" onClick={() => removeResource(resource.id)}>Eliminar</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
