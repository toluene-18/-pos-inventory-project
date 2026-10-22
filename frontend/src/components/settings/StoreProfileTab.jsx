import { useState } from 'react';
import Icon from '../ui/Icon';

const STORAGE_KEY = 'cwg_store_profile';

const DEFAULT_PROFILE = {
  name: 'CWG Retail Suite',
  branch: 'Main Flagship Store, Lagos',
  phone: '+234 800 294 7676',
  address: 'Plot 12 Commercial Way, Victoria Island, Lagos',
  currency: '₦ (NGN)',
  receiptHeader: 'Thank you for shopping at CWG Retail!',
  receiptFooter: 'Goods sold in good condition are not returnable.',
};

export default function StoreProfileTab({ isOwner }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [savedMsg, setSavedMsg] = useState('');

  function handleSave(e) {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedMsg('Store profile and receipt settings updated successfully.');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="settings-section">
      <div className="settings-section-head">
        <div>
          <h3>Store Profile & Receipt Branding</h3>
          <p>Configure store details and default headers printed on POS thermal receipts.</p>
        </div>
      </div>

      {savedMsg && (
        <div className="settings-alert settings-alert--success">
          <Icon name="check" size={16} /> {savedMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="store-profile-form">
        <div className="settings-form-grid">
          <div className="form-group">
            <label htmlFor="store-name">Store Name</label>
            <input
              id="store-name"
              type="text"
              disabled={!isOwner}
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="store-branch">Branch / Location</label>
            <input
              id="store-branch"
              type="text"
              disabled={!isOwner}
              value={profile.branch}
              onChange={e => setProfile({ ...profile, branch: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="store-phone">Customer Support Phone</label>
            <input
              id="store-phone"
              type="text"
              disabled={!isOwner}
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="store-currency">Currency</label>
            <input
              id="store-currency"
              type="text"
              disabled
              value={profile.currency}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="store-address">Store Address</label>
            <input
              id="store-address"
              type="text"
              disabled={!isOwner}
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="receipt-header">Receipt Header Message</label>
            <input
              id="receipt-header"
              type="text"
              disabled={!isOwner}
              value={profile.receiptHeader}
              onChange={e => setProfile({ ...profile, receiptHeader: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="receipt-footer">Receipt Footer Message</label>
            <input
              id="receipt-footer"
              type="text"
              disabled={!isOwner}
              value={profile.receiptFooter}
              onChange={e => setProfile({ ...profile, receiptFooter: e.target.value })}
            />
          </div>
        </div>

        {isOwner && (
          <div className="settings-form-actions">
            <button type="submit" className="btn btn-primary">
              <Icon name="check" size={16} /> Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
