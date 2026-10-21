import SalesChart from './SalesChart';
import PanelStatus from './PanelStatus';
import { formatMoney } from '../../utils/dashboardStats';

function SalesTrendPanel({
  period,
  onPeriodChange,
  loading,
  error,
  points,
  totalRevenue,
  dailyAverage,
}) {
  const empty = !loading && !error && (!points || points.every(point => point.value === 0));

  return (
    <article className="panel trend-panel">
      <div className="panel-head">
        <div>
          <h3>Sales trend</h3>
          <p>Last {period === '7d' ? '7 days' : '30 days'} from recorded sales</p>
        </div>

        <div className="period-switch" role="group" aria-label="Chart period">
          <button
            type="button"
            className={period === '7d' ? 'active' : ''}
            onClick={() => onPeriodChange('7d')}
          >
            7d
          </button>
          <button
            type="button"
            className={period === '30d' ? 'active' : ''}
            onClick={() => onPeriodChange('30d')}
          >
            30d
          </button>
        </div>
      </div>

      <div className="chart-legend">
        <span className="legend-dot" aria-hidden="true" />
        <span>Revenue</span>
      </div>

      <div className="chart-summary-row">
        <div className="chart-figure">
          <span>TOTAL REVENUE</span>
          <strong>{loading ? '—' : formatMoney(totalRevenue)}</strong>
        </div>
        <div className="chart-figure">
          <span>DAILY AVERAGE</span>
          <strong>{loading ? '—' : formatMoney(dailyAverage)}</strong>
        </div>
      </div>

      <PanelStatus
        loading={loading}
        error={error}
        empty={empty}
        emptyMessage="No sales were recorded in this period."
      >
        <SalesChart period={period} data={points} />
      </PanelStatus>
    </article>
  );
}

export default SalesTrendPanel;
