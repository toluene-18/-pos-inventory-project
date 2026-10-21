import Icon from '../components/ui/Icon';
import MetricCard from '../components/dashboard/MetricCard';
import SalesTrendPanel from '../components/dashboard/SalesTrendPanel';
import LiveActivityPanel from '../components/dashboard/LiveActivityPanel';
import TopProductsPanel from '../components/dashboard/TopProductsPanel';
import LowStockPanel from '../components/dashboard/LowStockPanel';
import '../styles/dashboard-home.css';

/**
 * DashboardHome — the main dashboard view.
 * Orchestrates all dashboard widgets; contains NO business logic of its own.
 *
 * Props:
 *   user       object — { name, role }
 *   onNavigate fn     — navigate to another page by name
 */
function DashboardHome({ user, onNavigate }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const firstName = user?.name?.split(' ')[0] || user?.email || 'there';
  const isOwner   = user?.role === 'owner';

  return (
    <div className="dash-home">
      {/* ── Welcome header ─────────────────────────────────────── */}
      <section className="dash-welcome">
        <div className="dash-welcome-copy">
          <p className="dash-eyebrow">GOOD DAY, CWG</p>
          <h2>Here is how the store is doing today</h2>
          <p>
            Track today's takings, watch for low stock, and jump straight into
            checkout when a customer is waiting.
          </p>
        </div>

        <div className="dash-welcome-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('Point of Sale')}
          >
            <Icon name="basket" size={16} />
            New sale
          </button>

          {isOwner && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('Products')}
            >
              <Icon name="plus" size={16} />
              Add product
            </button>
          )}
        </div>
      </section>

      {/* ── 4 KPI metric cards ──────────────────────────────────── */}
      <section className="dash-metrics" aria-label="Store KPIs">
        <MetricCard
          label="Today's Sales"
          value="—"
          change={null}
          sub="Connect sales data to see revenue"
          icon="money"
          tone="green"
        />
        <MetricCard
          label="Transactions"
          value="—"
          change={null}
          sub="Completed sales today"
          icon="basket"
          tone="amber"
        />
        <MetricCard
          label="Avg. Basket"
          value="—"
          change={null}
          sub="Per completed sale"
          icon="sales"
          tone="violet"
        />
        <MetricCard
          label="Low Stock Alerts"
          value="4"
          change={null}
          sub="1 out of stock"
          icon="alert"
          tone="rose"
        />
      </section>

      {/* ── Middle row: chart + live activity ───────────────────── */}
      <section className="dash-middle" aria-label="Sales trend and activity">
        <SalesTrendPanel />
        <LiveActivityPanel />
      </section>

      {/* ── Bottom row: top products + low stock ────────────────── */}
      <section className="dash-bottom" aria-label="Products and inventory">
        <TopProductsPanel onNavigate={onNavigate} />
        <LowStockPanel    onNavigate={onNavigate} />
      </section>
    </div>
  );
}

export default DashboardHome;
