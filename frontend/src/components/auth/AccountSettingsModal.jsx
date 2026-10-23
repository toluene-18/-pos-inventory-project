import { useState } from 'react';
import { updateUserProfile, changePassword } from '../../services/api';
import Icon from '../ui/Icon';

export default function AccountSettingsModal({ user, isOpen, onClose, onUserUpdated }) {
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  if (!isOpen) return null;

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setProfileSaving(true);
    try {
      const res = await updateUserProfile({ name });
      setProfileMsg('Name updated successfully.');
      onUserUpdated?.(res.user);
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileErr(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    if (newPassword.length < 6) {
      setPasswordErr('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordErr(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="product-modal-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal" style={{ maxWidth: '440px', padding: '24px' }}>
        <div className="product-modal-head" style={{ padding: '0 0 16px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Account Settings</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Manage your personal staff profile and security.
            </p>
          </div>
          <button type="button" className="product-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Profile Details
              </span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>

            {profileMsg && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.12)', color: '#10b981', borderRadius: '6px', fontSize: '12.5px' }}>
                {profileMsg}
              </div>
            )}
            {profileErr && (
              <div style={{ padding: '8px 12px', background: 'rgba(244,63,94,0.12)', color: '#fb7185', borderRadius: '6px', fontSize: '12.5px' }}>
                {profileErr}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address (Read only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <button
              type="submit"
              className="btn-modal-save"
              style={{ alignSelf: 'flex-start', padding: '7px 16px', fontSize: '12.5px' }}
              disabled={profileSaving}
            >
              {profileSaving ? 'Saving...' : 'Update Name'}
            </button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

          {/* Password Form */}
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Change Password
            </span>

            {passwordMsg && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.12)', color: '#10b981', borderRadius: '6px', fontSize: '12.5px' }}>
                {passwordMsg}
              </div>
            )}
            {passwordErr && (
              <div style={{ padding: '8px 12px', background: 'rgba(244,63,94,0.12)', color: '#fb7185', borderRadius: '6px', fontSize: '12.5px' }}>
                {passwordErr}
              </div>
            )}

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-modal-save"
              style={{ alignSelf: 'flex-start', padding: '7px 16px', fontSize: '12.5px' }}
              disabled={passwordSaving}
            >
              {passwordSaving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
