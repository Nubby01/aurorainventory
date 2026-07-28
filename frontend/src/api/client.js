import { API_BASE } from '../utils/constants';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fieldMsg = data.fields
      ? Object.values(data.fields).join(' · ')
      : null;
    throw new Error(fieldMsg || data.error || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  getCategories: () => request('/categories'),
  createCategory: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  getProducts: () => request('/products'),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  getMovements: () => request('/stock/movements'),
  createMovement: (body) => request('/stock/movements', { method: 'POST', body: JSON.stringify(body) }),

  getAlerts: () => request('/alerts'),
  getOpenAlerts: () => request('/alerts/open'),
  resolveAlert: (id) => request(`/alerts/${id}/resolve`, { method: 'POST' }),

  getReportSummary: () => request('/reports/summary'),
};
