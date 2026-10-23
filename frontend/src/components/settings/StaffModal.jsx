import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

export default function StaffModal({ member, isOpen, onClose, onSave }) {
  const isEditing = Boolean(member);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier',
    status: 'active',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: member?.id,
        name: member?.name || '',
        email: member?.email || '',
        role: member?.role || 'cashier',
        status: member?.status || 'active',
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...formData,
      id: member?.id || formData.id || Date.now(),
    });
    onClose();
  }

  return (
    <div className="settings-modal-backdrop" role="dialog" aria-modal="true">
      <div className="settings-modal">
        <div className="settings-modal-head">
          <div className="settings-modal-title">
            <Icon name="user" size={18} />
            <h3>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
          </div>
          <button type="button" className="settings-modal-close" onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-modal-form">
          <div className="form-group">
            <label htmlFor="staff-name">Full Name *</label>
            <input
              id="staff-name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Amina Bello"
            />
          </div>

          <div className="form-group">
            <label htmlFor="staff-email">Email Address *</label>
            <input
              id="staff-email"
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. amina@cwgretail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="staff-role">Role *</label>
            <select
              id="staff-role"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="owner">Owner / Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="staff-status">Account Status *</label>
            <select
              id="staff-status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="settings-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
