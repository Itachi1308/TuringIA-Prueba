export default function ResourceCard({ resource, onSelect }) {
  const handleSelect = (event) => {
    if (!onSelect) return;
    event.preventDefault();
    onSelect(resource);
  };

  return (
    <article className="resource-card">
      <a
        className="resource-card__link"
        href={`#recurso-${resource.slug || resource.id}`}
        onClick={handleSelect}
        aria-label={`Ver detalles de ${resource.title}`}
      >
        <div className="resource-card__media">
          <img src={resource.image_url} alt="" loading="lazy" />
          {resource.featured && <span className="resource-card__badge">Destacado</span>}
        </div>
        <div className="resource-card__body">
          <span className="resource-card__category">{resource.category.name}</span>
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
          <dl className="resource-card__meta">
            <div>
              <dt>Nivel</dt>
              <dd>{resource.level}</dd>
            </div>
            <div>
              <dt>Duración</dt>
              <dd>{resource.duration_hours} h</dd>
            </div>
          </dl>
          <span className="resource-card__action">Ver detalles</span>
        </div>
      </a>
    </article>
  );
}
