import { ApiError, getAuthToken, saveAuth, clearAuth } from './authStorage';
export { ApiError, getAuthToken, getStoredUser, clearAuth } from './authStorage';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = { Accept: 'application/json', ...options.headers };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await readJson(response);

  if (response.status === 401) {
    clearAuth();
    throw new ApiError('Your session has expired. Please sign in again.', 401, data);
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed (HTTP ${response.status}).`;
    throw new ApiError(errorMsg, response.status, data);
  }

  return data;
}

export async function loginUser(email, password) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    const data = await readJson(response);

    if (!response.ok) {
      if (response.status === 401) throw new ApiError('Invalid email or password.', 401, data);
      if (response.status === 403) {
        throw new ApiError(data.message || 'Your account is awaiting approval.', 403, data);
      }
      throw new ApiError(data.message || `Login failed (HTTP ${response.status}).`, response.status, data);
    }

    if (!data.token || !data.user) {
      throw new ApiError('Unexpected login response from server.', 200, data);
    }

    saveAuth(data.token, data.user);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(
        'Sign in timed out. The server took too long to respond. Please check that MySQL and the backend service are running.',
        408
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function registerUser({ name, email, password, role = 'cashier' }) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, password_confirmation: password, role }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    const errorMsg = data?.errors ? Object.values(data.errors).flat()[0] : data?.message;
    throw new ApiError(errorMsg || 'Account creation failed.', response.status, data);
  }

  if (data.token && data.user) saveAuth(data.token, data.user);
  return data;
}

export async function getCurrentUser() {
  return apiRequest('/user');
}

export async function getProducts() {
  const data = await apiRequest('/products');
  return Array.isArray(data) ? data : data.products || [];
}

export async function createProduct(payload) {
  try {
    return await apiRequest('/products/create', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.data?.errors) {
      const first = Object.values(error.data.errors).flat()[0];
      if (first) throw new ApiError(first, 422, error.data);
    }
    throw error;
  }
}

export async function updateProduct(id, payload) {
  try {
    return await apiRequest(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.data?.errors) {
      const first = Object.values(error.data.errors).flat()[0];
      if (first) throw new ApiError(first, 422, error.data);
    }
    throw error;
  }
}

export async function deactivateProduct(id) {
  return apiRequest(`/products/${id}`, { method: 'DELETE' });
}

export async function getStockAdjustments() {
  return apiRequest('/stock-adjustments');
}

export async function adjustStock(productId, { type, quantity, reason }) {
  try {
    return await apiRequest(`/products/${productId}/stock-adjustments`, {
      method: 'POST',
      body: JSON.stringify({ type, quantity, reason }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.data?.errors) {
      const first = Object.values(error.data.errors).flat()[0];
      if (first) throw new ApiError(first, 422, error.data);
    }
    throw error;
  }
}

export async function getSales({ from, to, payment_method, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (payment_method && payment_method !== 'all') params.set('payment_method', payment_method);
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

  return { sales, total: Number(first.total) || sales.length, truncated: (Number(first.last_page) || 1) > maxPages };
}

export async function getSalesReport({ from, to } = {}) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const query = params.toString();
  return apiRequest(query ? `/reports/sales?${query}` : '/reports/sales');
}

export async function createSale({ paymentMethod, items }) {
  try {
    const data = await apiRequest('/sales', {
      method: 'POST',
      body: JSON.stringify({ payment_method: paymentMethod, items }),
    });
    return data.sale;
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.data?.errors) {
      const first = Object.values(error.data.errors).flat()[0];
      if (first) throw new ApiError(first, 422, error.data);
    }
    throw error;
  }
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  return apiRequest('/products/upload-image', {
    method: 'POST',
    body: formData,
  });
}

export async function getStaff() {
  return apiRequest('/staff');
}

export async function updateStaffStatus(userId, { role, status }) {
  return apiRequest(`/staff/${userId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ role, status }),
  });
}

export async function updateUserProfile({ name }) {
  return apiRequest('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export async function resetPasswordWithCode({ email, code, password }) {
  const response = await fetch(`${API_BASE_URL}/reset-password-with-code`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password }),
  });
  const data = await readJson(response);
  if (!response.ok) {
    const errorMsg = data?.errors ? Object.values(data.errors).flat()[0] : data?.message;
    throw new ApiError(errorMsg || 'Password reset failed.', response.status, data);
  }
  return data;
}

export async function changePassword({ current_password, new_password }) {
  return apiRequest('/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password, new_password }),
  });
}
