const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid email or password.');
    }

    throw new Error(data.message || `Login failed (HTTP ${response.status}).`);
  }

  if (!data.token || !data.user) {
    throw new Error('The server returned an unexpected login response.');
  }

  sessionStorage.setItem('auth_token', data.token);
  sessionStorage.setItem('auth_user', JSON.stringify(data.user));

  return data;
}

export function getStoredUser() {
  const token = sessionStorage.getItem('auth_token');
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
