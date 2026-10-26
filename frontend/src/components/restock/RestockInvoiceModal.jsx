import { useState } from 'react';
import { toast } from 'react-toastify';
import Icon from '../ui/Icon';
import '../../styles/restock-invoice-modal.css';

export default function RestockInvoiceModal({
  isOpen,
  products = [],
  onClose,
  onApplyInvoice,
}) {
  const [invoiceText, setInvoiceText] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      setInvoiceText(String(ev.target?.result || ''));
    };
    reader.readAsText(file);
  }

  function parseInvoice(raw) {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const matched = [];
    const unmatched = [];

    lines.forEach((line, index) => {
      // skip header if present
      if (index === 0 && (line.toLowerCase().includes('sku') || line.toLowerCase().includes('product'))) {
        return;
      }

      // split by comma, tab, or semicolon
      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) return;

      const identifier = parts[0];
      const qty = parseInt(parts[1], 10);
      if (isNaN(qty) || qty <= 0) return;

      const prod = products.find(
        p =>
          p.sku?.toLowerCase() === identifier.toLowerCase() ||
          p.name?.toLowerCase() === identifier.toLowerCase()
      );

      if (prod) {
        matched.push({ product: prod, quantity: qty });
      } else {
        unmatched.push({ identifier, quantity: qty });
      }
    });

    return { matched, unmatched };
  }

  const { matched, unmatched } = parseInvoice(invoiceText);

  function handleApply() {
    if (matched.length === 0) {
      toast.error('No valid products recognized in invoice. Ensure format is SKU,Quantity');
      return;
    }

    onApplyInvoice(matched);
    toast.success(`Loaded ${matched.length} items from invoice into restock list!`);
    onClose();
  }

  function handleLoadSample() {
    const sample = products.slice(0, 3).map((p, i) => `${p.sku},${(i + 1) * 20}`).join('\n');
    setInvoiceText(sample || 'CWG-BEV-001,50\nCWG-SNK-002,30');
    setFileName('sample_delivery_invoice.csv');
  }

  return (
    <div className="restock-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="restock-modal-card invoice-modal-card" onClick={e => e.stopPropagation()}>
        <div className="restock-modal-head">
          <div className="restock-modal-icon-badge">
            <Icon name="receipt" size={17} />
          </div>
          <div className="restock-modal-titles">
            <h3>Import Delivery Invoice</h3>
            <p>Upload a supplier invoice CSV or paste text to auto-populate restock</p>
          </div>
          <button type="button" className="restock-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="invoice-upload-area">
          <label className="invoice-file-dropzone">
            <Icon name="download" size={20} />
            <span>{fileName ? `File: ${fileName}` : 'Upload CSV / Text Invoice'}</span>
            <small>Supports SKU,Quantity or Name,Quantity</small>
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <div className="invoice-or-divider">
            <span>OR PASTE TEXT</span>
            <button type="button" className="btn-load-sample" onClick={handleLoadSample}>
              Load sample
            </button>
          </div>

          <textarea
            className="invoice-textarea"
            rows={5}
            placeholder={"SKU,Quantity\nCWG-BEV-001,50\nCWG-SNK-002,25"}
            value={invoiceText}
            onChange={e => setInvoiceText(e.target.value)}
          />
        </div>

        {invoiceText.trim() && (
          <div className="invoice-parse-preview">
            <div className="invoice-preview-head">
              <strong>Recognized Items ({matched.length})</strong>
              {unmatched.length > 0 && (
                <span className="unmatched-warning">{unmatched.length} unrecognized</span>
              )}
            </div>
            <div className="invoice-preview-list">
              {matched.map((item, idx) => (
                <div key={idx} className="invoice-preview-row">
                  <div className="preview-prod-info">
                    <strong>{item.product.name}</strong>
                    <small>{item.product.sku} &bull; current: {item.product.inventory?.quantity ?? 0}</small>
                  </div>
                  <span className="preview-qty-badge">+{item.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="restock-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-confirm"
            disabled={matched.length === 0}
            onClick={handleApply}
          >
            <Icon name="check" size={15} />
            <span>Apply to Restock ({matched.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
