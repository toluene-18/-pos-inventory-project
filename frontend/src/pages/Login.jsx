import { useState, useMemo, useEffect } from 'react';
import { loginUser, getStoreSettings } from '../services/api';
import { humanizeErrorMessage } from '../utils/errorMessage';
import PasswordResetModal from '../components/auth/PasswordResetModal';
import '../styles/login-brand.css';
import '../styles/login-form.css';
import '../styles/login-responsive.css';

function formatStateCountry(rawState) {
  if (!rawState) return 'Lagos, Nigeria';
  const cleaned = rawState.replace(/\bstate\b/gi, '').trim();
  if (!cleaned) return 'Lagos, Nigeria';
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  return `${capitalized}, Nigeria`;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const [storeProfile, setStoreProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_store_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    getStoreSettings().then(data => {
      if (data && data.name) {
        setStoreProfile(data);
        localStorage.setItem('cwg_store_profile', JSON.stringify(data));
      }
    }).catch(() => {});
  }, []);

  const locationDisplay = useMemo(() => {
    return formatStateCountry(storeProfile?.state);
  }, [storeProfile]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      onLogin(data.user);
      setPassword('');
    } catch (err) {
      setError(humanizeErrorMessage(err));
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
              <strong>{storeProfile?.name?.split(' ')[0] || 'CWG'}</strong>
              <span>{storeProfile?.name?.split(' ').slice(1).join(' ') || 'Retail Suite'}</span>
            </span>
          </a>

          <div className="location-pill">
            <span className="location-dot" />
            {locationDisplay}
          </div>

          <div className="brand-message">
            <p className="eyebrow">YOUR STORE. IN CONTROL.</p>

            <h1>
              Every sale counted.
              <br />
              Every shelf accounted for.
            </h1>

            <p className="brand-description">
              Keep your sales moving and your inventory in check. One workspace
              for the people who keep your store running.
            </p>

            <div className="store-stats">
              <div className="stat">
                <strong>Real-time</strong>
                <span>Stock visibility</span>
              </div>

              <div className="stat">
                <strong>Secure</strong>
                <span>Staff access</span>
              </div>

              <div className="stat">
                <strong>One place</strong>
                <span>Sales and inventory</span>
              </div>
            </div>
          </div>

          <p className="brand-panel-footer">
            Built for better retail operations.
          </p>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="login-title">
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
            <p className="eyebrow">WELCOME BACK</p>
            <h2 id="login-title">Sign in to your workspace</h2>
            <p>Enter your staff credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
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
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="link-button forgot-pwd-link"
                  onClick={() => {
                    setResetEmail(email);
                    setShowResetModal(true);
                  }}
                >
                  Forgot password?
                </button>
              </div>

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
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button className="login-button" type="submit" disabled={loading}>
              <span>{loading ? 'Signing in...' : 'Sign in to CWG Retail'}</span>

              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          </form>

          <div className="security-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            <span>Secure access for authorised staff</span>
          </div>

          <footer className="login-footer">
            <span>© {new Date().getFullYear()} CWG Retail Suite</span>
            <span>POS &amp; Inventory Management</span>
            <button
              type="button"
              className="link-button"
              onClick={() => (window.location.href = '/register')}
            >
              Create account
            </button>
          </footer>
        </div>
      </section>

      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </main>
  );
}

export default Login;
