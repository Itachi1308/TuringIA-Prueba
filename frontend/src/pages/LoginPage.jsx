import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/auth-context.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@nexotech.mx', password: 'Admin123!' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/perfil'} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const currentUser = await login(form);
      navigate(currentUser.role === 'admin' ? '/admin' : '/perfil', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <a href="/" className="auth-card__brand"><Logo /></a>
        <span className="eyebrow">Acceso seguro</span>
        <h1 id="login-title">Inicia sesión</h1>
        <p>Utiliza uno de los usuarios de demostración incluidos en el README.</p>
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        <form className="form" onSubmit={submit}>
          <label>
            Correo electrónico
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              required
              minLength="8"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button type="submit" className="button button--full" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <a href="/" className="text-link">Volver al inicio</a>
      </section>
    </main>
  );
}
