import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

export default function StoreProfileTab({ profile, onChange }) {
  const [draft, setDraft] = useState(profile);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setDraft(profile);
    setHasChanges(false);
  }, [profile]);

  function handleChange(field, value) {
    setDraft(prev => {
      const next = { ...prev, [field]: value };
      setHasChanges(true);
      return next;
    });
  }

  function handleSave(e) {
    e?.preventDefault();
    onChange(draft);
    setHasChanges(false);
  }

  const monogram = (draft.name || 'CW')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="settings-panel">
      <div className="settings-panel-head">
        <span className="settings-panel-icon">
          <Icon name="store" size={18} />
        </span>
        <div>
          <h3>Store profile</h3>
          <p>These details appear on receipts and across the app header.</p>
        </div>
      </div>

      <div className="store-preview-card">
        <div className="store-preview-avatar">{monogram}</div>
        <div className="store-preview-info">
          <h4>{draft.name || 'Store Name'}</h4>
          <p>{draft.tagline || 'Everyday groceries, drinks and household essentials for the neighbourhood.'}</p>
          <small>{draft.address}{draft.city ? `, ${draft.city}` : ''}{draft.state ? `, ${draft.state}` : ''}</small>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form-grid">
        <div className="form-group full-width">
          <label htmlFor="cfg-store-name">STORE NAME</label>
          <input
            id="cfg-store-name"
            type="text"
            value={draft.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="CWG Provisions Store"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="cfg-tagline">TAGLINE</label>
          <input
            id="cfg-tagline"
            type="text"
            value={draft.tagline}
            onChange={e => handleChange('tagline', e.target.value)}
            placeholder="Everyday groceries, drinks and household essentials for the neighbourhood."
          />
          <span className="field-hint">A short line shown on the receipt and profile.</span>
        </div>

        <div className="form-group full-width">
          <label htmlFor="cfg-address">ADDRESS</label>
          <input
            id="cfg-address"
            type="text"
            value={draft.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="12 Ogui Road, by Amaechi Junction"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cfg-city">CITY</label>
          <input
            id="cfg-city"
            type="text"
            value={draft.city}
            onChange={e => handleChange('city', e.target.value)}
            placeholder="Enugu"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cfg-state">STATE / REGION</label>
          <input
            id="cfg-state"
            type="text"
            value={draft.state}
            onChange={e => handleChange('state', e.target.value)}
            placeholder="Ogun State"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cfg-phone">PHONE</label>
          <input
            id="cfg-phone"
            type="text"
            value={draft.phone}
            onChange={e => handleChange('phone', e.target.value)}
            placeholder="+234 803 456 7788"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cfg-email">EMAIL</label>
          <input
            id="cfg-email"
            type="email"
            value={draft.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="hello@cwgretail.com"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="cfg-hours">OPENING HOURS</label>
          <input
            id="cfg-hours"
            type="text"
            value={draft.openingHours}
            onChange={e => handleChange('openingHours', e.target.value)}
            placeholder="Mon – Sat, 7:00am – 9:00pm"
          />
          <span className="field-hint">Shown to customers on the receipt footer if you use it.</span>
        </div>

        <div className="settings-form-actions full-width">
          <button
            type="submit"
            className="btn-save-settings"
          >
            <Icon name="check" size={16} />
            <span>Save store profile</span>
          </button>
          {hasChanges && <span className="unsaved-changes-hint">You have unsaved changes</span>}
        </div>
      </form>
    </div>
  );
}
