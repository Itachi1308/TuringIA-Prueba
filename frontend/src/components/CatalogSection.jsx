import { useEffect, useState } from 'react';
import { Skeleton } from 'boneyard-js/react';
import { api } from '../services/api.js';
import ResourceCard from './ResourceCard.jsx';

const catalogFixtureResources = [
  {
    id: 'fixture-react',
    title: 'React desde cero',
    description: 'Componentes, estado, eventos y consumo de servicios REST con un proyecto práctico.',
    level: 'Inicial',
    duration_hours: 18,
    image_url: '/images/react.svg',
    featured: true,
    category: { name: 'Desarrollo web' },
  },
  {
    id: 'fixture-api',
    title: 'API REST con Node.js',
    description: 'Diseña una API mantenible con Express, validación, seguridad, autenticación y Supabase.',
    level: 'Intermedio',
    duration_hours: 24,
    image_url: '/images/node.svg',
    featured: true,
    category: { name: 'Desarrollo web' },
  },
  {
    id: 'fixture-sql',
    title: 'SQL y modelado relacional',
    description: 'Aprende consultas, relaciones, índices y normalización hasta tercera forma normal.',
    level: 'Inicial',
    duration_hours: 16,
    image_url: '/images/sql.svg',
    featured: false,
    category: { name: 'Datos' },
  },
  {
    id: 'fixture-python',
    title: 'Analítica con Python',
    description: 'Procesa datos, automatiza tareas y crea reportes reproducibles con Python.',
    level: 'Intermedio',
    duration_hours: 22,
    image_url: '/images/python.svg',
    featured: false,
    category: { name: 'Datos' },
  },
  {
    id: 'fixture-cloud',
    title: 'Fundamentos de nube',
    description: 'Comprende redes, almacenamiento, cómputo, observabilidad y despliegue continuo.',
    level: 'Inicial',
    duration_hours: 14,
    image_url: '/images/cloud.svg',
    featured: false,
    category: { name: 'Cloud' },
  },
  {
    id: 'fixture-security',
    title: 'Seguridad para APIs',
    description: 'Protege endpoints mediante JWT, validación, rate limiting y control de acceso.',
    level: 'Avanzado',
    duration_hours: 20,
    image_url: '/images/security.svg',
    featured: true,
    category: { name: 'Ciberseguridad' },
  },
];

const renderResourceGrid = (items, onSelect) => (
  <div className="resource-grid" aria-live="polite">
    {items.map((resource) => (
      <ResourceCard key={resource.id} resource={resource} onSelect={onSelect} />
    ))}
  </div>
);

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
  const [selectedResource, setSelectedResource] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

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

  useEffect(() => {
    if (!selectedResource) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedResource(null);
        setDetailError('');
        setDetailLoading(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedResource]);

  const chooseCategory = (slug) => {
    setCategory(slug);
    setPage(1);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
    setPage(1);
  };

  const openResourceDetail = (resource) => {
    setSelectedResource(resource);
    setDetailLoading(true);
    setDetailError('');

    api.resources
      .get(resource.id)
      .then(({ data }) => setSelectedResource(data))
      .catch((requestError) => setDetailError(requestError.message))
      .finally(() => setDetailLoading(false));
  };

  const closeResourceDetail = () => {
    setSelectedResource(null);
    setDetailError('');
    setDetailLoading(false);
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
        <Skeleton
          name="catalog-resource-grid"
          loading={loading && page === 1}
          animate="shimmer"
          transition
          stagger={35}
          fixture={renderResourceGrid(catalogFixtureResources, () => {})}
          fallback={renderResourceGrid(catalogFixtureResources, () => {})}
          snapshotConfig={{
            excludeSelectors: ['.resource-card__badge'],
          }}
        >
          {renderResourceGrid(
            loading && page === 1 ? catalogFixtureResources : resources,
            openResourceDetail,
          )}
        </Skeleton>
        {!loading && resources.length === 0 && !error && <p className="empty-state">No se encontraron rutas con esos filtros.</p>}
        {loading && page > 1 && <p className="loading-state" role="status">Cargando rutas...</p>}
        {hasMore && !loading && (
          <div className="catalog-actions">
            <button type="button" className="button button--outline" onClick={() => setPage((value) => value + 1)}>
              Cargar más
            </button>
          </div>
        )}
      </div>
      {selectedResource && (
        <div className="resource-modal" role="presentation" onMouseDown={closeResourceDetail}>
          <article
            className="resource-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="resource-modal__close"
              aria-label="Cerrar detalle"
              onClick={closeResourceDetail}
            >
              ×
            </button>
            <div className="resource-modal__media">
              <img src={selectedResource.image_url} alt="" />
            </div>
            <div className="resource-modal__content">
              <span className="resource-card__category">{selectedResource.category.name}</span>
              <h3 id="resource-detail-title">{selectedResource.title}</h3>
              <p>{selectedResource.description}</p>
              {detailError && <div className="alert alert--error" role="alert">{detailError}</div>}
              {detailLoading && <p className="loading-state" role="status">Cargando detalle...</p>}
              <dl className="resource-modal__facts">
                <div>
                  <dt>Nivel</dt>
                  <dd>{selectedResource.level}</dd>
                </div>
                <div>
                  <dt>Duración</dt>
                  <dd>{selectedResource.duration_hours} h</dd>
                </div>
                <div>
                  <dt>Autor</dt>
                  <dd>{selectedResource.author?.name || 'Equipo NexoTech'}</dd>
                </div>
              </dl>
              <a className="button" href="/login">Entrar a la ruta</a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
