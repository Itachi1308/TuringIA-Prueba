const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const saveSession = ({ token, refreshToken }) => {
  if (token) localStorage.setItem('nexotech_token', token);
  if (refreshToken) localStorage.setItem('nexotech_refresh_token', refreshToken);
};

const clearSession = () => {
  localStorage.removeItem('nexotech_token');
  localStorage.removeItem('nexotech_refresh_token');
};

const refreshSession = async () => {
  const refreshToken = localStorage.getItem('nexotech_refresh_token');
  if (!refreshToken) return false;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return false;
  }

  const payload = await response.json();
  saveSession(payload);
  return true;
};

const request = async (path, options = {}, allowRefresh = true) => {
  const token = localStorage.getItem('nexotech_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && allowRefresh && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshed = await refreshSession();
    if (refreshed) return request(path, options, false);
  }

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({ message: 'Respuesta inválida del servidor.' }));

  if (!response.ok) {
    const error = new Error(payload.message || 'No fue posible completar la solicitud.');
    error.details = payload.errors || [];
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const api = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false),
  me: () => request('/auth/me'),
  categories: {
    list: () => request('/categories'),
    create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },
  resources: {
    list: ({ page = 1, limit = 6, category = '', search = '', featured = false } = {}) => {
      const params = new URLSearchParams({ page, limit });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (featured) params.set('featured', 'true');
      return request(`/resources?${params.toString()}`);
    },
    get: (id) => request(`/resources/${id}`),
    create: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
  },
};
