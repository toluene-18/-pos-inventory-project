import Icon from '../ui/Icon';
import { formatCategory } from '../../utils/categories';
import '../../styles/reports.css';

export const REPORT_TABS = [
  { id: 'sales', label: 'Sales Report', icon: 'sales', title: 'Financial & Sales Analysis', desc: 'Comprehensive breakdown of sales performance, revenue and payment methods.' },
  { id: 'inventory', label: 'Inventory Report', icon: 'inventory', title: 'Inventory Valuation & Margins', desc: 'Detailed stock asset valuation, cost vs sell prices, and profit margins.' },
  { id: 'stock', label: 'Stock Level Report', icon: 'alert', title: 'Stock Health & Reorder Deficits', desc: 'Monitors low stock alerts, stockout warnings, and reorder urgency.' },
  { id: 'products', label: 'Product Report', icon: 'products', title: 'Product Velocity & Performance', desc: 'Sales velocity, units sold per product, and catalog contribution.' },
  { id: 'users', label: 'User Report', icon: 'users', title: 'Staff & Cashier Audit', desc: 'Cashier checkout statistics, revenue generated, and payment collections.' },
];

export const RANGE_OPTIONS = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: 'all', label: 'All time', days: 365 },
];

export default function ReportsHeader({
  activeTab,
  onTabChange,
  activeRange,
  onRangeChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onExportCsv,
  onExportPdf,
}) {
  const currentTabInfo = REPORT_TABS.find(t => t.id === activeTab) || REPORT_TABS[0];

  return (
    <div className="reports-header-container">
      <header className="reports-header-readdy">
        <div className="reports-title-area">
          <span className="reports-badge-icon">
            <Icon name={currentTabInfo.icon} size={18} />
          </span>
          <div>
            <h2>{currentTabInfo.title}</h2>
            <p>{currentTabInfo.desc}</p>
          </div>
        </div>

        <div className="reports-actions-btns">
          <button type="button" className="btn-reports-action" onClick={onExportCsv}>
            <Icon name="download" size={13} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-reports-action" onClick={onExportPdf}>
            <Icon name="printer" size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Push-down Top Nav Tabs */}
      <div className="reports-tabs-bar">
        {REPORT_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`reports-sub-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon name={tab.icon} size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Universal Filter Toolbar */}
      <div className="reports-filter-toolbar">
        <div className="reports-search-box">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder={`Search in ${currentTabInfo.label}...`}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search report"
          />
        </div>

        <div className="reports-filter-right">
          {activeTab !== 'users' && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={e => onCategoryChange(e.target.value)}
              className="reports-select-filter"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>
                  {formatCategory(c)}
                </option>
              ))}
            </select>
          )}

          <div className="reports-range-pills">
            {RANGE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`range-pill-btn ${activeRange === opt.id ? 'range-pill-btn--active' : ''}`}
                onClick={() => onRangeChange(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
