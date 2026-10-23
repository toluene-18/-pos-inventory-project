import { useState } from 'react';

export default function ReportsSalesBarChart({ dailyData = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...dailyData.map(d => d.revenue), 60000);
  const totalRevenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);

  let bestDay = { date: '16 Sept', revenue: 60250 };
  dailyData.forEach(d => {
    if (d.revenue > bestDay.revenue) {
      bestDay = d;
    }
  });

  const yTicks = [60000, 50000, 40000, 30000, 20000, 10000, 0];

  return (
    <div className="reports-chart-card">
      <div className="reports-chart-head">
        <div>
          <h3>Sales over time</h3>
          <p>Revenue by day</p>
        </div>
        <div className="reports-chart-badges">
          <div className="stat-pill">
            <span className="stat-pill-label">TOTAL REVENUE:</span>
            <span className="stat-pill-val">₦{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="stat-pill stat-pill--best">
            <span className="stat-pill-label">BEST DAY:</span>
            <span className="stat-pill-val">
              ₦{bestDay.revenue.toLocaleString()} <small>{bestDay.date}</small>
            </span>
          </div>
        </div>
      </div>

      <div className="reports-bar-chart-container">
        <div className="chart-y-axis">
          {yTicks.map(tick => (
            <div key={tick} className="y-tick-label">
              ₦{tick === 0 ? '0' : `${tick / 1000}k`}
            </div>
          ))}
        </div>

        <div className="chart-bars-viewport">
          <div className="chart-grid-lines">
            {yTicks.map(tick => (
              <div key={tick} className="chart-grid-line" />
            ))}
          </div>

          <div className="chart-bars-track">
            {dailyData.map((item, idx) => {
              const heightPercent = maxVal > 0 ? (item.revenue / maxVal) * 100 : 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.date}
                  className="bar-column"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="bar-wrapper">
                    {isHovered && item.revenue > 0 && (
                      <div className="bar-tooltip">
                        <div className="tooltip-date">{item.date}</div>
                        <div className="tooltip-val">₦{item.revenue.toLocaleString()}</div>
                      </div>
                    )}
                    <div
                      className={`bar-fill ${isHovered ? 'bar-fill--hovered' : ''}`}
                      style={{
                        height: `${Math.max(item.revenue > 0 ? 4 : 0, heightPercent)}%`,
                      }}
                    />
                  </div>
                  <span className="x-tick-label">
                    {idx % 2 === 0 ? item.date.replace('Sept', 'Sep').replace('Aug', 'Aug') : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
