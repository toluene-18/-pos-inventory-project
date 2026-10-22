/**
 * Client authentication and token storage helpers.
 */
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
  if (!token || !savedUser) return null;
  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

export function saveAuth(token, user) {
  if (token) sessionStorage.setItem('auth_token', token);
  if (user) sessionStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_user');
}
