import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Logo />
          <p>Aprendizaje tecnológico organizado, claro y conectado con proyectos reales.</p>
        </div>
        <div>
          <h2 className="site-footer__title">Explora</h2>
          <a href="/#catalogo">Catálogo</a>
          <a href="/#beneficios">Beneficios</a>
          <a href="/#mentores">Mentores</a>
        </div>
        <div>
          <h2 className="site-footer__title">Proyecto</h2>
          <span>React + Express</span>
          <span>Supabase</span>
          <span>API REST</span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} NexoTech</span>
        <span>Desarrollado para el periodo de prueba</span>
      </div>
    </footer>
  );
}
