import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { AuthContext } from './auth-context.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexotech_token');

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem('nexotech_token');
        localStorage.removeItem('nexotech_refresh_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const result = await api.login(credentials);
    localStorage.setItem('nexotech_token', result.token);
    localStorage.setItem('nexotech_refresh_token', result.refreshToken);
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem('nexotech_token');
    localStorage.removeItem('nexotech_refresh_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
