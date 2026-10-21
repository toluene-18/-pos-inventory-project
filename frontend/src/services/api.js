const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken() {
  return sessionStorage.getItem('auth_token');
}

export function getStoredUser() {
  const token = getAuthToken();
  const savedUser = sessionStorage.getItem('auth_user');

  if (!token || !savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

export function clearAuth() {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_user');
}

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await readJson(response);

  if (response.status === 401) {
    clearAuth();
    throw new ApiError(
      'Your session has expired. Please sign in again.',
      401,
      data
    );
  }

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed (HTTP ${response.status}).`,
      response.status,
      data
    );
  }

  return data;
}

export async function loginUser(email, password) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new TypeError('Network request failed');
  }

  const data = await readJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError('Invalid email or password.', 401, data);
    }

    throw new ApiError(
      data.message || `Login failed (HTTP ${response.status}).`,
      response.status,
      data
    );
  }

  if (!data.token || !data.user) {
    throw new ApiError(
      'The server returned an unexpected login response.',
      200,
      data
    );
  }

  sessionStorage.setItem('auth_token', data.token);
  sessionStorage.setItem('auth_user', JSON.stringify(data.user));

  return data;
}

export async function getCurrentUser() {
  return apiRequest('/user');
}

export async function getProducts() {
  const data = await apiRequest('/products');
  return Array.isArray(data) ? data : data.products || [];
}

export async function getSales({ from, to, page = 1 } = {}) {
  const params = new URLSearchParams();

  if (from) params.set('from', from);
  if (to) params.set('to', to);
  params.set('page', String(page));

  return apiRequest(`/sales?${params.toString()}`);
}

export async function getSalesInRange({ from, to, maxPages = 20 } = {}) {
  const first = await getSales({ from, to, page: 1 });
  const sales = [...(first.data || [])];
  const lastPage = Math.min(Number(first.last_page) || 1, maxPages);

  for (let page = 2; page <= lastPage; page += 1) {
    const next = await getSales({ from, to, page });
    sales.push(...(next.data || []));
  }

  return {
    sales,
    total: Number(first.total) || sales.length,
    truncated: (Number(first.last_page) || 1) > maxPages,
  };
}

export async function getSalesReport({ from, to } = {}) {
  const params = new URLSearchParams();

  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const query = params.toString();
  return apiRequest(query ? `/reports/sales?${query}` : '/reports/sales');
}
