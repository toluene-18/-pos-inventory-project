import { useState } from 'react';

export default function ReportsSalesBarChart({ dailyData = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...dailyData.map(d => d.revenue), 100000);
  const roundedMax = Math.ceil(maxVal / 50000) * 50000;
  const yTicks = [
    roundedMax,
    Math.round(roundedMax * 0.75),
    Math.round(roundedMax * 0.5),
    Math.round(roundedMax * 0.25),
    0,
  ];

  return (
    <div className="reports-chart-card">
      <div className="reports-chart-head">
        <div>
          <h3>Daily revenue</h3>
        </div>
      </div>

      <div className="reports-bar-chart-container">
        <div className="chart-y-axis">
          {yTicks.map(tick => (
            <div key={tick} className="y-tick-label">
              ₦{tick === 0 ? '0' : `${Math.round(tick / 1000)}k`}
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
              const heightPercent = roundedMax > 0 ? (item.revenue / roundedMax) * 100 : 0;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.date}
                  className={`bar-column ${isHovered ? 'bar-column--active' : ''}`}
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
                        height: `${Math.max(item.revenue > 0 ? 6 : 0, heightPercent)}%`,
                      }}
                    />
                  </div>
                  <span className="x-tick-label">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
