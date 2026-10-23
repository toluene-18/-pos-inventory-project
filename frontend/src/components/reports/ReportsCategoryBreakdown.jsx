import { useMemo } from 'react';
import Icon from '../ui/Icon';

export default function ReportsCategoryBreakdown({ categories = [], totalRevenue = 222550 }) {
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    return categories.map((cat, idx) => {
      const priorSum = categories.slice(0, idx).reduce((acc, c) => acc + c.percent, 0);
      return {
        ...cat,
        strokeDasharray: `${(cat.percent / 100) * circumference} ${circumference}`,
        strokeDashoffset: -((priorSum / 100) * circumference),
      };
    });
  }, [categories, circumference]);

  return (
    <div className="reports-section-card">
      <div className="reports-section-head">
        <span className="reports-section-icon">
          <Icon name="reports" size={16} />
        </span>
        <div>
          <h3>Sales by category</h3>
          <p>Where the revenue comes from</p>
        </div>
      </div>

      <div className="category-breakdown-body">
        <div className="donut-chart-side">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1e242c"
              strokeWidth={strokeWidth}
            />
            {segments.map(cat => (
              <circle
                key={cat.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={cat.strokeDasharray}
                strokeDashoffset={cat.strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="donut-segment"
              />
            ))}
          </svg>
          <div className="donut-center-label">
            <span className="donut-center-sub">TOTAL</span>
            <span className="donut-center-val">₦{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="category-bars-list">
          {categories.map(cat => (
            <div key={cat.name} className="cat-row">
              <div className="cat-row-header">
                <div className="cat-name-badge">
                  <span className="cat-dot" style={{ backgroundColor: cat.color }} />
                  <span className="cat-name">{cat.name}</span>
                </div>
                <div className="cat-numbers">
                  <span className="cat-amount">₦{cat.amount.toLocaleString()}</span>
                  <span className="cat-percent">{cat.percent}%</span>
                </div>
              </div>
              <div className="cat-progress-track">
                <div
                  className="cat-progress-fill"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
