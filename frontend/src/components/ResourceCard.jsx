export default function ResourceCard({ resource }) {
  return (
    <article className="resource-card">
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
      </div>
    </article>
  );
}
