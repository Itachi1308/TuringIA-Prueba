import CatalogSection from '../components/CatalogSection.jsx';
import PageShell from '../components/PageShell.jsx';

const stats = [
  ['9', 'rutas'],
  ['4', 'categorías'],
  ['2', 'perfiles'],
];

const benefits = [
  {
    number: '01',
    title: 'Rutas claras',
    text: 'Cada recurso resume nivel, duración y tema para elegir sin perder tiempo.',
  },
  {
    number: '02',
    title: 'Contenido ordenado',
    text: 'El catálogo se mantiene por categorías y se puede actualizar desde el panel interno.',
  },
  {
    number: '03',
    title: 'Acceso privado',
    text: 'Cada persona entra con su cuenta y ve las secciones que le corresponden.',
  },
];

const technicalNotes = [
  ['Ruta', 'Programas cortos para avanzar por nivel y reforzar conceptos prácticos.'],
  ['Filtro', 'Búsqueda por texto y categorías para llegar rápido al contenido adecuado.'],
  ['Panel', 'Herramientas internas para mantener recursos y categorías al día.'],
];

export default function HomePage() {
  const scrollToCatalog = () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <PageShell>
      <section className="hero">
        <div className="container hero__content">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--light">NexoTech Academy</span>
            <h1>Rutas técnicas para aprender con orden</h1>
            <p>
              Explora recursos por tema, revisa el nivel de cada ruta y entra con tu cuenta cuando quieras continuar.
            </p>
            <div className="hero__actions">
              <button type="button" className="button" onClick={scrollToCatalog}>Explorar catálogo</button>
              <a className="button button--ghost" href="#criterios">Ver rutas</a>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero-card hero-card--primary">
              <span>Desarrollo web</span>
              <strong>React desde cero</strong>
              <small>18 h · Inicial</small>
            </div>
            <div className="hero-card hero-card--secondary">
              <span>Datos</span>
              <strong>SQL y modelado relacional</strong>
              <small>16 h · Inicial</small>
            </div>
            <div className="hero-card hero-card--accent">
              <span>Cloud</span>
              <strong>Fundamentos de nube</strong>
              <small>14 h · Inicial</small>
            </div>
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
            <span className="eyebrow">Catálogo</span>
            <h2 id="benefits-title">Todo queda fácil de encontrar</h2>
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
            <span className="eyebrow eyebrow--light">Panel interno</span>
            <h2>El contenido se mantiene desde un solo lugar</h2>
            <p>El administrador puede publicar rutas, ajustar categorías y mantener el catálogo actualizado sin tocar la interfaz pública.</p>
            <a href="/login" className="button">Probar acceso</a>
          </div>
          <div className="split-callout__panel" aria-label="Tecnologías principales">
            <span>Publicar</span>
            <span>Editar</span>
            <span>Ordenar</span>
            <span>Revisar</span>
          </div>
        </div>
      </section>

      <section id="criterios" className="section" aria-labelledby="criteria-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Rutas</span>
            <h2 id="criteria-title">Opciones para empezar o profundizar</h2>
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
