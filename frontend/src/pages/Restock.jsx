import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import StockChangeForm from '../components/restock/StockChangeForm';
import RestockKpis from '../components/restock/RestockKpis';
import AdjustmentHistoryTable from '../components/restock/AdjustmentHistoryTable';
import { getProducts, adjustStock, getStockAdjustments } from '../services/api';
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
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
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Failed to load stock data.');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setError('');

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
        staffName: user?.name || 'Chinedu Okafor',
        createdAt: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        timestamp: Date.now(),
      };

      setAdjustments(prev => {
        const updated = [newEntry, ...prev];
        localStorage.setItem('cwg_adjustments_history', JSON.stringify(updated));
        return updated;
      });

      setStatusMessage(
        `Successfully logged ${mode} for ${product.name}: stock updated from ${currentStock} to ${projectedStock}.`
      );
      setTimeout(() => setStatusMessage(''), 5000);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to record stock adjustment.');
    } finally {
      setSubmitting(false);
    }
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
          <p>
            Log deliveries, correct miscounts and record damages against any product — every change is
            captured in the history below.
          </p>
        </div>

        <div className="restock-header-actions">
          <Link to="/inventory" className="restock-nav-btn">
            <Icon name="inventory" size={15} />
            <span>View inventory</span>
          </Link>
          <Link to="/products" className="restock-nav-btn">
            <Icon name="pos" size={15} />
            <span>Products</span>
          </Link>
        </div>
      </header>

      {statusMessage && (
        <div className="restock-alert restock-alert--success" role="status">
          <Icon name="check" size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="restock-alert restock-alert--error" role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </div>
      )}

      <StockChangeForm
        products={products}
        onSubmit={handleStockChange}
        submitting={submitting}
        loading={loading}
      />

      <RestockKpis adjustments={adjustments} />

      <AdjustmentHistoryTable adjustments={adjustments} />
    </div>
  );
}
