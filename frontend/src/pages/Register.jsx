import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/login-brand.css';
import '../styles/login-form.css';
import '../styles/login-responsive.css';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cashier');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser({ name, email, password, role });
      setSuccess(
        'Account created successfully. Please wait for the owner to approve your access.'
      );
      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');

      window.setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          'Could not reach the server. Check that Laravel is running and that CORS allows this frontend.'
        );
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="CWG Retail introduction">
        <div className="brand-panel-overlay" />
        <div className="brand-panel-content">
          <a className="brand" href="/" aria-label="CWG Retail home">
            <span className="brand-icon" aria-hidden="true">
              C
            </span>
            <span className="brand-name">
              <strong>CWG</strong>
              <span>Retail Suite</span>
            </span>
          </a>

          <div className="location-pill">
            <span className="location-dot" />
            Lagos, Nigeria
          </div>

          <div className="brand-message">
            <p className="eyebrow">NEW STAFF ACCOUNT</p>
            <h1>Request access to your store workspace.</h1>
            <p className="brand-description">
              Create your staff account and wait for the owner to approve your
              role before you can sign in.
            </p>
          </div>

          <p className="brand-panel-footer">
            Built for better retail operations.
          </p>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="register-title">
        <div className="login-container">
          <div className="mobile-brand">
            <span className="brand-icon" aria-hidden="true">
              C
            </span>
            <span className="brand-name">
              <strong>CWG</strong>
              <span>Retail Suite</span>
            </span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">CREATE ACCOUNT</p>
            <h2 id="register-title">Set up your staff profile</h2>
            <p>Choose your role and wait for the owner’s approval.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <div className="input-wrap">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                    <path d="m4.5 7 7.5 5.5L19.5 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@cwgretail.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14v2" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(visible => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m3 3 18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.8" />
                      <path d="M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9 9 0 0 0 3-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Requested role</label>
              <div className="input-wrap">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={event => setRole(event.target.value)}
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="login-success" role="status">
                {success}
              </p>
            )}

            <button className="login-button" type="submit" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
            </button>
          </form>

          <div className="security-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <span>Owner approval required before sign-in</span>
          </div>

          <footer className="login-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Register;
