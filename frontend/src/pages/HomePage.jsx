import CatalogSection from '../components/CatalogSection.jsx';
import PageShell from '../components/PageShell.jsx';

const stats = [
  ['9', 'rutas cargadas'],
  ['4', 'categorías base'],
  ['3', 'vistas protegidas'],
];

const benefits = [
  {
    number: '01',
    title: 'Catálogo administrable',
    text: 'Las rutas se consultan desde la API y el contenido puede mantenerse desde el panel de administración.',
  },
  {
    number: '02',
    title: 'Flujo completo',
    text: 'El proyecto conecta interfaz, validaciones, rutas REST, autenticación y persistencia en Supabase.',
  },
  {
    number: '03',
    title: 'Acceso por rol',
    text: 'Los usuarios pueden iniciar sesión y consultar su perfil; solo el administrador gestiona recursos y categorías.',
  },
];

const technicalNotes = [
  ['API', 'Paginación, filtros por categoría y búsqueda de texto en recursos publicados.'],
  ['Auth', 'Sesiones con Supabase Auth, refresh token y verificación JWT en el backend.'],
  ['Datos', 'Tablas relacionadas, llaves foráneas, RLS y datos iniciales reproducibles.'],
];

export default function HomePage() {
  const scrollToCatalog = () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <PageShell>
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">NexoTech Academy</span>
            <h1>Rutas técnicas conectadas a una API real</h1>
            <p>
              Una aplicación full-stack para consultar recursos, filtrar contenido y administrar el catálogo con usuarios diferenciados por rol.
            </p>
            <div className="hero__actions">
              <button type="button" className="button" onClick={scrollToCatalog}>Explorar catálogo</button>
              <a className="button button--ghost" href="#criterios">Ver criterios técnicos</a>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__orb hero__orb--large">&lt;/&gt;</div>
            <div className="hero__orb hero__orb--small">API</div>
            <div className="hero__line" />
          </div>
        </div>
        <div className="container stat-strip">
          {stats.map(([value, label]) => (
            <div className="stat-strip__item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <CatalogSection />

      <section id="beneficios" className="section" aria-labelledby="benefits-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Alcance del proyecto</span>
            <h2 id="benefits-title">Una entrega pensada para probarse de principio a fin</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.number}>
                <span className="benefit-card__number">{benefit.number}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="split-callout">
        <div className="container split-callout__grid">
          <div>
            <span className="eyebrow eyebrow--light">Prueba técnica</span>
            <h2>Separación clara entre interfaz, API y datos</h2>
            <p>La aplicación evita depender de datos estáticos: el catálogo se alimenta del backend, el backend consulta Supabase y las operaciones sensibles validan el rol antes de escribir.</p>
            <a href="/login" className="button">Probar acceso</a>
          </div>
          <div className="split-callout__panel" aria-label="Tecnologías principales">
            <span>React</span>
            <span>Express</span>
            <span>Supabase</span>
            <span>JWT</span>
          </div>
        </div>
      </section>

      <section id="criterios" className="section" aria-labelledby="criteria-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Criterios técnicos</span>
            <h2 id="criteria-title">Decisiones que sostienen la entrega</h2>
          </div>
          <div className="mentor-grid">
            {technicalNotes.map(([initials, title, text]) => (
              <article className="mentor-card" key={title}>
                <div className="mentor-card__avatar" aria-hidden="true">{initials}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
