import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import ResourceCard from './ResourceCard.jsx';

export default function CatalogSection() {
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categories.list().then(({ data }) => setCategories(data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api.resources
      .list({ page, limit: 6, category, search: appliedSearch })
      .then(({ data, pagination }) => {
        if (!active) return;
        setResources((current) => (page === 1 ? data : [...current, ...data]));
        setHasMore(pagination.hasMore);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message);
        if (page === 1) setResources([]);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page, category, appliedSearch]);

  const chooseCategory = (slug) => {
    setCategory(slug);
    setPage(1);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
    setPage(1);
  };

  return (
    <section id="catalogo" className="section section--soft" aria-labelledby="catalog-title">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Catálogo conectado a la API</span>
          <h2 id="catalog-title">Elige una ruta y avanza a tu ritmo</h2>
          <p>Los elementos de esta sección provienen del backend y pueden filtrarse por categoría o búsqueda.</p>
        </div>

        <form className="catalog-search" role="search" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="catalog-search">Buscar rutas</label>
          <input
            id="catalog-search"
            type="search"
            value={search}
            placeholder="Buscar por título o descripción"
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="button" type="submit">Buscar</button>
        </form>

        <div className="category-tabs" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={`category-tabs__button ${category === '' ? 'category-tabs__button--active' : ''}`}
            onClick={() => chooseCategory('')}
          >
            Todas
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`category-tabs__button ${category === item.slug ? 'category-tabs__button--active' : ''}`}
              onClick={() => chooseCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {error && <div className="alert alert--error" role="alert">{error}</div>}
        <div className="resource-grid" aria-live="polite">
          {resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
        {!loading && resources.length === 0 && !error && <p className="empty-state">No se encontraron rutas con esos filtros.</p>}
        {loading && <p className="loading-state" role="status">Cargando rutas...</p>}
        {hasMore && !loading && (
          <div className="catalog-actions">
            <button type="button" className="button button--outline" onClick={() => setPage((value) => value + 1)}>
              Cargar más
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
