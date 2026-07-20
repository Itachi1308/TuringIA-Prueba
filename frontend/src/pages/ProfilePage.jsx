import PageShell from '../components/PageShell.jsx';
import { useAuth } from '../context/auth-context.js';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageShell>
      <section className="section page-hero">
        <div className="container narrow-container">
          <span className="eyebrow">Cuenta activa</span>
          <h1>Hola, {user.name}</h1>
          <p>Tu sesión se valida con Supabase Auth y el backend verifica el token mediante JWKS.</p>
          <dl className="profile-card">
            <div><dt>Nombre</dt><dd>{user.name}</dd></div>
            <div><dt>Correo</dt><dd>{user.email}</dd></div>
            <div><dt>Rol</dt><dd>{user.role}</dd></div>
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
