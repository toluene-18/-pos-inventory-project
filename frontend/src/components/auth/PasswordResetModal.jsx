import { useState } from 'react';
import { resetPasswordWithCode } from '../../services/api';

export default function PasswordResetModal({ isOpen, onClose }) {
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handlePasswordReset(e) {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordWithCode({
        email: resetEmail,
        code: resetCode,
        password: newPassword,
      });
      setResetMessage(res.message || 'Password updated successfully. You can now sign in.');
      setTimeout(() => {
        onClose();
        setResetMessage('');
        setResetCode('');
        setNewPassword('');
      }, 2000);
    } catch (err) {
      setResetError(err.message || 'Failed to reset password. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-modal-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal" style={{ maxWidth: '420px', padding: '24px' }}>
        <div className="product-modal-head" style={{ padding: '0 0 16px' }}>
          <h3>Reset Forgotten Password</h3>
          <button
            type="button"
            className="product-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
          Ask your store owner or manager for the admin reset code (default: <code>CWG-RESET-2026</code>).
        </p>

        {resetError && <div className="product-form-error">{resetError}</div>}
        {resetMessage && (
          <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>
            {resetMessage}
          </div>
        )}

        <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label>Staff Email</label>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="staff@cwgretail.com"
            />
          </div>

          <div className="form-group">
            <label>Admin Authorization Code</label>
            <input
              type="text"
              required
              value={resetCode}
              onChange={e => setResetCode(e.target.value)}
              placeholder="Enter code e.g. CWG-RESET-2026"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="product-modal-actions" style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-save" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
