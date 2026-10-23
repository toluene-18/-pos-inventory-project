import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

export default function ReceiptBasicsTab({ receiptConfig, profile, onChange }) {
  const [draft, setDraft] = useState(receiptConfig);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setDraft(receiptConfig);
    setHasChanges(false);
  }, [receiptConfig]);

  function handleToggle(field) {
    setDraft(prev => {
      const next = { ...prev, [field]: !prev[field] };
      setHasChanges(true);
      return next;
    });
  }

  function handleField(field, val) {
    setDraft(prev => {
      const next = { ...prev, [field]: val };
      setHasChanges(true);
      return next;
    });
  }

  function handleSave() {
    onChange(draft);
    setHasChanges(false);
  }

  const monogram = (profile?.name || 'CW')
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
          <Icon name="receipt" size={18} />
        </span>
        <div>
          <h3>Receipt basics</h3>
          <p>What prints on every customer receipt.</p>
        </div>
      </div>

      <div className="receipt-basics-layout">
        <div className="receipt-controls-col">
          <div className="settings-form-grid">
            <div className="form-group">
              <label htmlFor="rcp-currency">CURRENCY</label>
              <select
                id="rcp-currency"
                value={draft.currency}
                onChange={e => handleField('currency', e.target.value)}
              >
                <option value="₦ NGN — Nigerian Naira">₦ NGN — Nigerian Naira</option>
                <option value="$ USD — US Dollar">$ USD — US Dollar</option>
                <option value="£ GBP — British Pound">£ GBP — British Pound</option>
                <option value="€ EUR — Euro">€ EUR — Euro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rcp-tz">TIMEZONE</label>
              <select
                id="rcp-tz"
                value={draft.timezone}
                onChange={e => handleField('timezone', e.target.value)}
              >
                <option value="West Africa Time — Lagos (GMT+1)">West Africa Time — Lagos (GMT+1)</option>
                <option value="UTC (GMT+0)">UTC (GMT+0)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="rcp-header">RECEIPT HEADER</label>
              <input
                id="rcp-header"
                type="text"
                value={draft.headerText}
                onChange={e => handleField('headerText', e.target.value)}
                placeholder="Thank you for shopping with us!"
              />
              <span className="field-hint">Printed under the store details.</span>
            </div>

            <div className="form-group full-width">
              <label htmlFor="rcp-footer">RECEIPT FOOTER</label>
              <input
                id="rcp-footer"
                type="text"
                value={draft.footerText}
                onChange={e => handleField('footerText', e.target.value)}
                placeholder="Goods sold in good condition are not returnable. God bless you."
              />
              <span className="field-hint">Printed at the very bottom.</span>
            </div>
          </div>

          <div className="receipt-toggles-list">
            <div className="receipt-toggle-row">
              <div className="toggle-text">
                <Icon name="store" size={16} />
                <div>
                  <strong>Show store logo</strong>
                  <small>Print your store initials at the top.</small>
                </div>
              </div>
              <button
                type="button"
                className={`switch-toggle ${draft.showLogo ? 'switch-toggle--on' : ''}`}
                onClick={() => handleToggle('showLogo')}
                aria-label="Toggle logo"
              >
                <span className="switch-toggle-thumb" />
              </button>
            </div>

            <div className="receipt-toggle-row">
              <div className="toggle-text">
                <Icon name="barcode" size={16} />
                <div>
                  <strong>Show item codes</strong>
                  <small>Include each product's SKU on the line.</small>
                </div>
              </div>
              <button
                type="button"
                className={`switch-toggle ${draft.showSku ? 'switch-toggle--on' : ''}`}
                onClick={() => handleToggle('showSku')}
                aria-label="Toggle item codes"
              >
                <span className="switch-toggle-thumb" />
              </button>
            </div>

            <div className="receipt-toggle-row">
              <div className="toggle-text">
                <Icon name="money" size={16} />
                <div>
                  <strong>Show VAT line</strong>
                  <small>Add a tax breakdown above the total.</small>
                </div>
              </div>
              <button
                type="button"
                className={`switch-toggle ${draft.showVat ? 'switch-toggle--on' : ''}`}
                onClick={() => handleToggle('showVat')}
                aria-label="Toggle VAT line"
              >
                <span className="switch-toggle-thumb" />
              </button>
            </div>
          </div>

          <div className="settings-form-actions" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="btn-save-settings"
              onClick={handleSave}
            >
              <Icon name="check" size={16} />
              <span>Save receipt settings</span>
            </button>
            {hasChanges && <span className="unsaved-changes-hint">You have unsaved changes</span>}
          </div>
        </div>

        <div className="receipt-preview-col">
          <div className="receipt-preview-title">
            <Icon name="printer" size={15} />
            <span>Live preview</span>
            <small>How a printed receipt will look.</small>
          </div>

          <div className="receipt-thermal-paper">
            {draft.showLogo && (
              <div className="rcp-paper-logo">{monogram}</div>
            )}
            <h4 className="rcp-paper-name">{profile?.name?.toUpperCase() || 'CWG PROVISIONS STORE'}</h4>
            <p className="rcp-paper-addr">{profile?.address}, {profile?.city}, {profile?.state}</p>
            <p className="rcp-paper-tel">Tel: {profile?.phone}</p>

            {draft.headerText && (
              <p className="rcp-paper-custom-header">{draft.headerText}</p>
            )}

            <div className="rcp-paper-meta-row">
              <span>Receipt #CWG-10251</span>
              <span>15 Sep 2026, 2:14pm</span>
            </div>
            <div className="rcp-paper-meta-row">
              <span>Cashier: Amina Bello</span>
              <span>Till: 01</span>
            </div>

            <div className="rcp-paper-divider" />

            <div className="rcp-paper-items">
              <div className="rcp-paper-item">
                <div className="rcp-item-left">
                  <strong>Nestlé Milo 500g Tin</strong>
                  {draft.showSku && <small className="rcp-sku">NES-MILO-500</small>}
                  <small>1 × ₦4,500</small>
                </div>
                <div className="rcp-item-right">₦4,500</div>
              </div>
              <div className="rcp-paper-item">
                <div className="rcp-item-left">
                  <strong>Coca-Cola 50cl PET</strong>
                  {draft.showSku && <small className="rcp-sku">COK-50-PET</small>}
                  <small>2 × ₦450</small>
                </div>
                <div className="rcp-item-right">₦900</div>
              </div>
            </div>

            <div className="rcp-paper-divider" />

            <div className="rcp-paper-totals">
              <div className="rcp-tot-row">
                <span>Subtotal</span>
                <span>₦5,400</span>
              </div>
              {draft.showVat && (
                <div className="rcp-tot-row">
                  <span>VAT (7.5%)</span>
                  <span>₦405</span>
                </div>
              )}
              <div className="rcp-tot-row rcp-tot-final">
                <strong>TOTAL</strong>
                <strong>₦{draft.showVat ? '5,805' : '5,400'}</strong>
              </div>
            </div>

            {draft.footerText && (
              <p className="rcp-paper-custom-footer">{draft.footerText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
