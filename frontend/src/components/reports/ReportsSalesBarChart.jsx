import { useState } from 'react';

export default function ReportsSalesBarChart({ dailyData = [], periodTitle = 'Daily revenue' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const count = dailyData.length;
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue || 0), 0);
  const roundedMax = maxRevenue > 0 ? Math.ceil(maxRevenue / 10000) * 10000 : 50000;

  const yTicks = [
    roundedMax,
    Math.round(roundedMax * 0.75),
    Math.round(roundedMax * 0.5),
    Math.round(roundedMax * 0.25),
    0,
  ];

  // For 30+ items, skip labels so they never collide or look disorganized
  const labelInterval = count > 60 ? 12 : count > 20 ? 5 : count > 10 ? 2 : 1;

  return (
    <div className="reports-chart-card">
      <div className="reports-chart-head">
        <div>
          <h3>{periodTitle}</h3>
        </div>
      </div>

      <div className="reports-bar-chart-container">
        <div className="chart-y-axis">
          {yTicks.map((tick, i) => (
            <div key={i} className="y-tick-label">
              ₦{tick === 0 ? '0' : tick >= 1000000 ? `${(tick / 1000000).toFixed(1)}M` : `${Math.round(tick / 1000)}k`}
            </div>
          ))}
        </div>

        <div className="chart-bars-viewport">
          <div className="chart-grid-lines">
            {yTicks.map((_, i) => (
              <div key={i} className="chart-grid-line" />
            ))}
          </div>

          <div className="chart-bars-track">
            {dailyData.map((item, idx) => {
              const rev = item.revenue || 0;
              const heightPercent = roundedMax > 0 ? (rev / roundedMax) * 100 : 0;
              const isHovered = hoveredIndex === idx;
              const isVisibleTick = idx % labelInterval === 0 || idx === count - 1;

              return (
                <div
                  key={item.key || item.date || idx}
                  className={`bar-column ${isHovered ? 'bar-column--active' : ''}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="bar-wrapper">
                    {isHovered && (
                      <div className="bar-tooltip">
                        <div className="tooltip-date">{item.fullDate || item.date}</div>
                        <div className="tooltip-val">₦{rev.toLocaleString()}</div>
                      </div>
                    )}
                    <div
                      className={`bar-fill ${isHovered ? 'bar-fill--hovered' : ''}`}
                      style={{
                        height: `${Math.max(rev > 0 ? 5 : 0, heightPercent)}%`,
                      }}
                    />
                  </div>
                  {isVisibleTick ? (
                    <span className="x-tick-label">{item.date}</span>
                  ) : (
                    <span className="x-tick-dot" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
