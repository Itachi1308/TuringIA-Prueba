import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Logo />
          <p>Catálogo de rutas técnicas conectado a una API REST, con autenticación y administración de contenido.</p>
        </div>
        <div>
          <h2 className="site-footer__title">Explora</h2>
          <a href="/#catalogo">Catálogo</a>
          <a href="/#beneficios">Beneficios</a>
          <a href="/#criterios">Criterios</a>
        </div>
        <div>
          <h2 className="site-footer__title">Proyecto</h2>
          <span>React + Vite</span>
          <span>Express + Supabase</span>
          <span>JWT + roles</span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} NexoTech</span>
        <span>Periodo de prueba de desarrollo de software</span>
      </div>
    </footer>
  );
}
