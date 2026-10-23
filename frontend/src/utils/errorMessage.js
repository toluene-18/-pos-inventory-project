/**
 * Sanitizes and humanizes technical API, network, and database errors
 * into user-friendly messages.
 */
export function humanizeErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const rawMessage = typeof error === 'string' ? error : error.message || '';
  const status = error?.status;

  // Database connection or SQLSTATE errors
  if (
    /SQLSTATE|Connection refused|2002|actively refused|database|mysql|pdo|QueryException/i.test(
      rawMessage
    ) ||
    status === 503
  ) {
    return 'Unable to connect to the database server. Please ensure the MySQL database service is running and try again.';
  }

  // Timeout or Aborted requests
  if (
    /abort|timeout|timed out|took too long/i.test(rawMessage) ||
    error.name === 'AbortError'
  ) {
    return 'The request timed out. The server took too long to respond. Please check your connection and try again.';
  }

  // Network offline or server unreachable
  if (
    /Failed to fetch|NetworkError|net::ERR_CONNECTION_REFUSED|TypeError/i.test(
      rawMessage
    )
  ) {
    return 'Unable to reach the server. Please check your internet connection or verify the backend service is running.';
  }

  // Common HTTP status codes
  if (status === 401) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (status === 403) {
    return rawMessage || 'Your account does not have permission or is awaiting manager approval.';
  }
  if (status === 404) {
    return 'The requested record or resource could not be found.';
  }
  if (status === 422) {
    return rawMessage || 'Please review the form for invalid inputs.';
  }
  if (status >= 500) {
    return 'The server encountered an internal issue. Please try again shortly or contact your system administrator.';
  }

  return rawMessage || 'An unexpected error occurred. Please try again.';
}
