import { useState } from 'react';
import Icon from '../ui/Icon';
import SalesChart from './SalesChart';

/**
 * SalesTrendPanel — the large left panel in the dashboard middle row.
 * Shows a period toggle, summary figures, and the SVG chart.
 */
function SalesTrendPanel() {
  const [period, setPeriod] = useState('7d');

  return (
    <article className="panel trend-panel">
      <div className="panel-head">
        <div>
          <h3>Sales trend</h3>
          <p>Last {period === '7d' ? '7 days' : '30 days'} performance</p>
        </div>

        <div className="period-switch" role="group" aria-label="Chart period">
          <button
            type="button"
            className={period === '7d' ? 'active' : ''}
            onClick={() => setPeriod('7d')}
          >
            7d
          </button>
          <button
            type="button"
            className={period === '30d' ? 'active' : ''}
            onClick={() => setPeriod('30d')}
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
          <strong>—</strong>
        </div>
        <div className="chart-figure">
          <span>DAILY AVERAGE</span>
          <strong>—</strong>
        </div>
      </div>

      <SalesChart period={period} />
    </article>
  );
}

export default SalesTrendPanel;
