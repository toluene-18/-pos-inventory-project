import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../styles/dashboard.css';

const navigationPages = [
  'Dashboard',
  'Point of Sale',
  'Inventory',
  'Products',
  'Sales',
  'Reports',
  'Settings',
];

const chartData = {
  '7d': [
    { day: 'Thu', value: 180 },
    { day: 'Fri', value: 275 },
    { day: 'Sat', value: 340 },
    { day: 'Sun', value: 220 },
    { day: 'Mon', value: 155 },
    { day: 'Tue', value: 230 },
    { day: 'Wed', value: 95 },
  ],
  '30d': [
    { day: 'Week 1', value: 140 },
    { day: 'Week 2', value: 260 },
    { day: 'Week 3', value: 205 },
    { day: 'Week 4', value: 330 },
  ],
};

const activities = [
  {
    type: 'sale',
    title: 'Sales activity will appear here',
    detail: 'Connect your sales endpoint to see transactions',
    time: 'Awaiting data',
  },
  {
    type: 'stock',
    title: 'Stock alerts will appear here',
    detail: 'Inventory levels will be checked against reorder thresholds',
    time: 'Awaiting data',
  },
  {
    type: 'restock',
    title: 'Restock activity will appear here',
    detail: 'Receive updates when inventory changes',
    time: 'Awaiting data',
  },
];

const topProducts = [
  {
    rank: '01',
    name: 'Top-selling products',
    sku: 'Product ranking',
    amount: '—',
  },
  {
    rank: '02',
    name: 'Will appear after integration',
    sku: 'Sales data required',
    amount: '—',
  },
  {
    rank: '03',
    name: 'Will appear after integration',
    sku: 'Sales data required',
    amount: '—',
  },
  {
    rank: '04',
    name: 'Will appear after integration',
    sku: 'Sales data required',
    amount: '—',
  },
];

const restockItems = [
  {
    name: 'Inventory levels',
    detail: 'Stock quantity and reorder threshold',
    level: 70,
    type: 'low',
  },
  {
    name: 'Out-of-stock products',
    detail: 'Products with zero available quantity',
    level: 20,
    type: 'out',
  },
  {
    name: 'Restock recommendations',
    detail: 'Based on current inventory records',
    level: 45,
    type: 'low',
  },
];

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>
    ),
    pos: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M7 21h10M12 17v4M7 9h4M7 13h8" />
      </>
    ),
    inventory: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    products: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 5 8-5M12 12.5V21" />
      </>
    ),
    sales: (
      <>
        <path d="M4 19V5M4 19h17" />
        <path d="m7 15 4-4 3 2 5-6" />
      </>
    ),
    reports: (
      <>
        <path d="M5 3h14a2 2 0 0 1 2 2v16H3V5a2 2 0 0 1 2-2Z" />
        <path d="M7 15v-3M12 15V7M17 15v-5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"
          transform="translate(-1 -1) scale(1.08)"
        />
      </>
    ),
    money: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5c-.7-.7-1.6-1-3-1-1.7 0-3 .8-3 2s1 2 3 2.5 3 1.2 3 2.5-1.3 2-3 2c-1.2 0-2.4-.4-3.2-1.2M12 5.5v13" />
      </>
    ),
    basket: (
      <>
        <path d="m3 4 2 2 2 11h10l3-8H6" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="17" cy="21" r="1" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 22 20H2L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4ZM7 6H4v3a4 4 0 0 0 4 4M17 6h3v3a4 4 0 0 1-4 4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

function MetricCard({ label, value, note, icon, tone }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      <p className="metric-value">{value}</p>
      <p className="metric-note">{note}</p>
    </article>
  );
}

function SalesChart({ period }) {
  const points = chartData[period];

  const plotted = useMemo(() => {
    const width = 700;
    const height = 190;
    const max = Math.max(...points.map(point => point.value)) * 1.12;

    return points.map((point, index) => ({
      ...point,
      x: 8 + (index / Math.max(points.length - 1, 1)) * (width - 16),
      y: height - (point.value / max) * (height - 20) - 5,
    }));
  }, [points]);

  const line = plotted
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const area = `${line} L 692 190 L 8 190 Z`;

  return (
    <div className="chart-visual">
      <div className="chart-axis-labels" aria-hidden="true">
        <span>Revenue</span>
        <span>Higher</span>
      </div>
      <svg
        className="sales-chart"
        viewBox="0 0 700 190"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Illustrative ${period === '7d' ? 'seven-day' : '30-day'} sales trend. Connect sales data for actual figures.`}
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#179967" stopOpacity=".22" />
            <stop offset="100%" stopColor="#179967" stopOpacity=".015" />
          </linearGradient>
        </defs>
        {[25, 65, 105, 145, 185].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="700"
            y2={y}
            className="chart-grid-line"
          />
        ))}
        <path d={area} fill="url(#revenue-fill)" />
        <path d={line} className="chart-line" />
        {plotted.map(point => (
          <circle
            key={point.day}
            cx={point.x}
            cy={point.y}
            r="3.5"
            className="chart-point"
          />
        ))}
      </svg>
      <div className="chart-day-labels">
        {plotted.map(point => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
      <p className="chart-disclaimer">
        Illustrative chart preview · real sales figures will appear after API
        integration.
      </p>
    </div>
  );
}

function DashboardHome({ user, onNavigate }) {
  const [period, setPeriod] = useState('7d');
  const [query, setQuery] = useState('');

  const filteredActivity = activities.filter(item =>
    `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="dashboard-home">
      <section className="dashboard-welcome">
        <div className="welcome-copy">
          <p className="dashboard-eyebrow">STORE OVERVIEW</p>
          <h2>Good day, {user?.name?.split(' ')[0] || 'there'}.</h2>
          <p>
            Here’s your store at a glance. Keep sales moving and inventory in
            check.
          </p>
        </div>
        <div className="welcome-actions">
          <button
            className="button button-secondary"
            onClick={() => onNavigate('Products')}
          >
            <Icon name="plus" size={17} /> Add product
          </button>
          <button
            className="button button-primary"
            onClick={() => onNavigate('Point of Sale')}
          >
            <Icon name="basket" size={17} /> New sale
          </button>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Store summary">
        <MetricCard
          label="Today's sales"
          value="—"
          note="Connect sales data to see revenue"
          icon="money"
          tone="green"
        />
        <MetricCard
          label="Transactions"
          value="—"
          note="Completed sales today"
          icon="basket"
          tone="amber"
        />
        <MetricCard
          label="Average basket"
          value="—"
          note="Average value per sale"
          icon="sales"
          tone="violet"
        />
        <MetricCard
          label="Low-stock alerts"
          value="—"
          note="Products requiring attention"
          icon="alert"
          tone="rose"
        />
      </section>

      <section className="dashboard-middle-grid">
        <article className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h3>Sales trend</h3>
              <p>Revenue performance</p>
            </div>
            <div className="period-switch" aria-label="Chart period">
              <button
                type="button"
                className={period === '7d' ? 'selected' : ''}
                onClick={() => setPeriod('7d')}
              >
                7 days
              </button>
              <button
                type="button"
                className={period === '30d' ? 'selected' : ''}
                onClick={() => setPeriod('30d')}
              >
                30 days
              </button>
            </div>
          </div>
          <div className="chart-summary">
            <div>
              <span>Total revenue</span>
              <strong>—</strong>
            </div>
            <div>
              <span>Daily average</span>
              <strong>—</strong>
            </div>
          </div>
          <SalesChart period={period} />
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h3>Live activity</h3>
              <p>Recent store updates</p>
            </div>
            <span className="live-indicator">
              <span /> Live
            </span>
          </div>
          <label className="activity-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search activity"
              aria-label="Search activity"
            />
          </label>
          <div className="activity-list">
            {filteredActivity.length ? (
              filteredActivity.map((item, index) => (
                <div className="activity-item" key={item.type}>
                  <span className={`activity-icon activity-${item.type}`}>
                    <Icon
                      name={
                        item.type === 'sale'
                          ? 'basket'
                          : item.type === 'stock'
                            ? 'alert'
                            : 'inventory'
                      }
                      size={17}
                    />
                  </span>
                  <div className="activity-copy">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </div>
                  {index === 0 && <span className="activity-dot" />}
                </div>
              ))
            ) : (
              <p className="empty-state">No activity matches your search.</p>
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="panel products-panel">
          <div className="panel-heading">
            <div>
              <h3>Top-selling products</h3>
              <p>Best performers by sales</p>
            </div>
            <button
              className="text-action"
              onClick={() => onNavigate('Reports')}
            >
              View report <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="product-list">
            {topProducts.map(product => (
              <div className="product-row" key={product.rank}>
                <span className="product-rank">{product.rank}</span>
                <div className="product-name">
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>
                <strong className="product-amount">{product.amount}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel restock-panel">
          <div className="panel-heading">
            <div>
              <h3>Needs restocking</h3>
              <p>Keep essential items available</p>
            </div>
            <button
              className="text-action"
              onClick={() => onNavigate('Inventory')}
            >
              Open inventory <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="restock-list">
            {restockItems.map(item => (
              <div className="restock-item" key={item.name}>
                <div className="restock-top">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className={`stock-badge ${item.type}`}>
                    {item.type === 'out' ? 'Out of stock' : 'Needs review'}
                  </span>
                </div>
                <div className="stock-progress">
                  <span
                    className={item.type}
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="panel-footnote">
            Inventory figures will be populated from your stock records.
          </p>
        </article>
      </section>
    </div>
  );
}

function Dashboard({ user = {}, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard');

  function renderPage() {
    if (activePage === 'Dashboard') {
      return <DashboardHome user={user} onNavigate={setActivePage} />;
    }

    const pageDescriptions = {
      'Point of Sale':
        'Select products, build a cart and complete customer transactions.',
      Inventory:
        'Monitor stock levels, review low-stock items and manage restocking.',
      Products: 'Browse your catalogue and manage product information.',
      Sales: 'Review recorded transactions and sale details.',
      Reports: 'Explore store performance using verified sales data.',
      Settings: 'Manage your store preferences and account settings.',
    };

    return (
      <section className="page-placeholder panel">
        <span className="placeholder-icon">
          <Icon name="dashboard" size={25} />
        </span>
        <p className="dashboard-eyebrow">CWG RETAIL SUITE</p>
        <h2>{activePage}</h2>
        <p>
          {pageDescriptions[activePage] ||
            'This section is ready for implementation.'}
        </p>
        <button
          className="button button-primary"
          onClick={() => setActivePage('Dashboard')}
        >
          Back to dashboard
        </button>
      </section>
    );
  }

  return (
    <main className="dashboard-layout">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />
      <section className="dashboard-main">
        <Topbar activePage={activePage} />
        <div className="dashboard-content">{renderPage()}</div>
      </section>
    </main>
  );
}

export default Dashboard;
