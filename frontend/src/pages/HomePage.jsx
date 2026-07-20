import CatalogSection from '../components/CatalogSection.jsx';
import PageShell from '../components/PageShell.jsx';

const stats = [
  ['9+', 'rutas iniciales'],
  ['4', 'categorías'],
  ['100%', 'responsivo'],
];

const benefits = [
  {
    number: '01',
    title: 'Contenido estructurado',
    text: 'Cada ruta presenta nivel, duración, categoría y una descripción clara para tomar mejores decisiones.',
  },
  {
    number: '02',
    title: 'API en tiempo real',
    text: 'El catálogo se consulta mediante endpoints REST y puede actualizarse desde el panel administrativo.',
  },
  {
    number: '03',
    title: 'Acceso seguro',
    text: 'La autenticación JWT distingue entre usuarios y administradores para proteger las operaciones sensibles.',
  },
];

const mentors = [
  ['AD', 'Ana Díaz', 'Frontend y diseño de interfaces'],
  ['LM', 'Luis Mendoza', 'Backend y arquitectura de APIs'],
  ['SR', 'Sofía Ramírez', 'Datos, nube y automatización'],
];

export default function HomePage() {
  const scrollToCatalog = () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <PageShell>
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">Aprendizaje conectado</span>
            <h1>Construye habilidades tecnológicas con rutas claras y prácticas</h1>
            <p>
              Explora recursos organizados por categoría, consulta la información desde una API y administra el contenido con un flujo full-stack seguro.
            </p>
            <div className="hero__actions">
              <button type="button" className="button" onClick={scrollToCatalog}>Explorar catálogo</button>
              <a className="button button--ghost" href="#beneficios">Ver funcionamiento</a>
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
            <span className="eyebrow">Cómo funciona</span>
            <h2 id="benefits-title">Una experiencia completa de frontend y backend</h2>
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
            <span className="eyebrow eyebrow--light">Proyecto escalable</span>
            <h2>Diseñado con responsabilidades separadas</h2>
            <p>Componentes reutilizables, servicios de API, controladores, rutas, middlewares y consultas parametrizadas mantienen el código legible y fácil de ampliar.</p>
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

      <section id="mentores" className="section" aria-labelledby="mentors-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Equipo de referencia</span>
            <h2 id="mentors-title">Perfiles que inspiran cada ruta</h2>
          </div>
          <div className="mentor-grid">
            {mentors.map(([initials, name, role]) => (
              <article className="mentor-card" key={name}>
                <div className="mentor-card__avatar" aria-hidden="true">{initials}</div>
                <h3>{name}</h3>
                <p>{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
