import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth-context.js';
import Logo from './Logo.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__content">
          <span>Rutas tecnológicas prácticas</span>
          <span>Proyecto full-stack de evaluación</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__content">
          <Link to="/" onClick={closeMenu}><Logo /></Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Abrir navegación</span>
            <span aria-hidden="true">☰</span>
          </button>
          <nav id="main-navigation" className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Principal">
            <a href="/#catalogo" onClick={closeMenu}>Catálogo</a>
            <a href="/#beneficios" onClick={closeMenu}>Beneficios</a>
            <a href="/#mentores" onClick={closeMenu}>Mentores</a>
            {user ? (
              <>
                <NavLink to="/perfil" onClick={closeMenu}>Mi perfil</NavLink>
                {user.role === 'admin' && <NavLink to="/admin" onClick={closeMenu}>Administración</NavLink>}
                <button type="button" className="button button--small button--outline" onClick={() => { logout(); closeMenu(); }}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink to="/login" className="button button--small" onClick={closeMenu}>Ingresar</NavLink>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
