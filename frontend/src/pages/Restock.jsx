import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Icon from '../components/ui/Icon';
import StockChangeForm from '../components/restock/StockChangeForm';
import MultiProductRestock from '../components/restock/MultiProductRestock';
import RestockInvoiceModal from '../components/restock/RestockInvoiceModal';
import RestockKpis from '../components/restock/RestockKpis';
import AdjustmentHistoryTable from '../components/restock/AdjustmentHistoryTable';
import { getProducts, adjustStock, adjustStockBulk, getStockAdjustments } from '../services/api';
import { INITIAL_ADJUSTMENTS } from '../components/restock/restockData';
import '../styles/restock.css';
import '../styles/restock-form.css';
import '../styles/restock-history.css';

export default function Restock({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState(() => {
    try {
      const saved = localStorage.getItem('cwg_adjustments_history');
      return saved ? JSON.parse(saved) : INITIAL_ADJUSTMENTS;
    } catch {
      return INITIAL_ADJUSTMENTS;
    }
  });

  const [activeTab, setActiveTab] = useState('batch'); // 'batch' | 'single'
  const [batchItems, setBatchItems] = useState([]);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodsData, adjData] = await Promise.allSettled([
        getProducts(),
        getStockAdjustments(),
      ]);

      if (prodsData.status === 'fulfilled' && Array.isArray(prodsData.value)) {
        setProducts(prodsData.value);
      }
      if (adjData.status === 'fulfilled' && Array.isArray(adjData.value) && adjData.value.length > 0) {
        setAdjustments(adjData.value);
      }
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else toast.error(err.message || 'Failed to load stock data.');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStockChange({
    productId,
    product,
    mode,
    quantity,
    reason,
    currentStock,
    projectedStock,
  }) {
    setSubmitting(true);
    try {
      const backendType = mode === 'damage' ? 'decrease' : 'increase';
      const changeAmount = mode === 'correction' ? projectedStock - currentStock : quantity;
      const actualType = changeAmount >= 0 ? 'increase' : 'decrease';

      await adjustStock(productId, {
        type: mode === 'correction' ? actualType : backendType,
        quantity: Math.abs(changeAmount) || 1,
        reason: `${mode.toUpperCase()}: ${reason}`,
      });

      const newEntry = {
        id: `adj-${Date.now()}`,
        productName: product.name,
        sku: product.sku,
        unit: product.unit || 'units',
        type: mode,
        typeLabel: mode.charAt(0).toUpperCase() + mode.slice(1),
        quantityChange: mode === 'damage' ? -quantity : changeAmount,
        previousStock: currentStock,
        newStock: projectedStock,
        reason,
        staffName: user?.name || 'Staff',
        createdAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        timestamp: Date.now(),
      };

      setAdjustments(prev => {
        const updated = [newEntry, ...prev];
        localStorage.setItem('cwg_adjustments_history', JSON.stringify(updated));
        return updated;
      });

      toast.success(`Updated stock for ${product.name}: ${currentStock} ➔ ${projectedStock}.`);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to record stock adjustment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBulkSubmit({ items, totalUnits, batchItems: targetBatches }) {
    setSubmitting(true);
    try {
      await adjustStockBulk(items);
      const newEntries = targetBatches.map(b => {
        const cur = b.product.inventory?.quantity ?? 0;
        return {
          id: `adj-${Date.now()}-${b.product.id}`,
          productName: b.product.name,
          sku: b.product.sku,
          unit: b.product.unit || 'units',
          type: 'restock',
          typeLabel: 'Restock',
          quantityChange: b.quantity,
          previousStock: cur,
          newStock: cur + b.quantity,
          reason: 'Bulk shipment restock',
          staffName: user?.name || 'Staff',
          createdAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          timestamp: Date.now(),
        };
      });

      setAdjustments(prev => {
        const updated = [...newEntries, ...prev];
        localStorage.setItem('cwg_adjustments_history', JSON.stringify(updated));
        return updated;
      });

      toast.success(`Successfully restocked ${items.length} products (+${totalUnits} units added)!`);
      setBatchItems([]);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Bulk restock failed.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleApplyInvoice(matchedItems) {
    setActiveTab('batch');
    setBatchItems(prev => {
      const map = new Map(prev.map(i => [i.product.id, i]));
      matchedItems.forEach(m => {
        map.set(m.product.id, m);
      });
      return Array.from(map.values());
    });
  }

  if (!isManagement) {
    return (
      <div className="restock-restricted">
        <Icon name="alert" size={32} />
        <h3>Access Restricted</h3>
        <p>Only store owners and managers are permitted to access Restock & Adjustments.</p>
      </div>
    );
  }

  return (
    <div className="restock-page">
      <header className="restock-header">
        <div>
          <h2>Restock & Adjustments</h2>
          <p>Import invoices, restock multiple items, and manage shelf levels.</p>
        </div>

        <div className="restock-header-actions">
          <button
            type="button"
            className="restock-nav-btn"
            style={{ background: 'var(--green-soft)', color: 'var(--green)', borderColor: 'rgba(16,185,129,0.3)' }}
            onClick={() => setIsInvoiceOpen(true)}
          >
            <Icon name="receipt" size={15} />
            <span>Import Invoice</span>
          </button>
          <Link to="/inventory" className="restock-nav-btn">
            <Icon name="inventory" size={15} />
            <span>View inventory</span>
          </Link>
        </div>
      </header>

      {/* Mode Switch Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <button
          type="button"
          className={`inv-tab ${activeTab === 'batch' ? 'inv-tab--active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          Multi-Product Restock Batch ({batchItems.length})
        </button>
        <button
          type="button"
          className={`inv-tab ${activeTab === 'single' ? 'inv-tab--active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          Single Item / Damage / Correction
        </button>
      </div>

      {activeTab === 'batch' ? (
        <MultiProductRestock
          products={products}
          batchItems={batchItems}
          onUpdateBatch={setBatchItems}
          onSubmitBulk={handleBulkSubmit}
          submitting={submitting}
        />
      ) : (
        <StockChangeForm
          products={products}
          onSubmit={handleStockChange}
          submitting={submitting}
          loading={loading}
        />
      )}

      <RestockKpis adjustments={adjustments} />
      <AdjustmentHistoryTable adjustments={adjustments} />

      <RestockInvoiceModal
        isOpen={isInvoiceOpen}
        products={products}
        onClose={() => setIsInvoiceOpen(false)}
        onApplyInvoice={handleApplyInvoice}
      />
    </div>
  );
}
