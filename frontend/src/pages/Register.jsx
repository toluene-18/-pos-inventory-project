import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, getStoreSettings } from '../services/api';
import { humanizeErrorMessage } from '../utils/errorMessage';
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
            <p className="eyebrow">NEW STAFF ACCOUNT</p>
            <h1>Request access to your store workspace.</h1>
            <p className="brand-description">
              Create your staff account and wait for the owner to approve your
              role before you can sign in.
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

      <section className="form-panel" aria-labelledby="register-title">
        <div className="login-container">
          <div className="mobile-brand">
            <span className="brand-icon" aria-hidden="true">
              C
            </span>
            <span className="brand-name">
              <strong>CWG</strong> Retail Suite
            </span>
          </div>

          <div className="form-header">
            <p className="eyebrow">STAFF ONBOARDING</p>
            <h2 id="register-title">Create your account</h2>
            <p className="form-subtitle">
              Enter your details to request access to this store.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="reg-name">Full name</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="e.g. Aisha Bello"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Staff email address</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="name@cwgretail.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
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
              <label htmlFor="reg-role">Requested Role</label>
              <div className="input-wrap">
                <select
                  id="reg-role"
                  value={role}
                  onChange={event => setRole(event.target.value)}
                  className="role-select"
                  style={{ background: 'transparent', border: 'none', color: '#f7f7f2', width: '100%' }}
                >
                  <option value="cashier" style={{ background: '#1c1d18', color: '#fff' }}>Cashier — Point of Sale</option>
                  <option value="manager" style={{ background: '#1c1d18', color: '#fff' }}>Manager — Inventory &amp; Reports</option>
                  <option value="owner" style={{ background: '#1c1d18', color: '#fff' }}>Owner — Full Administrative Access</option>
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
