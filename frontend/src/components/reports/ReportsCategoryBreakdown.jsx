import { useMemo } from 'react';

export default function ReportsCategoryBreakdown({ categories = [] }) {
  const size = 150;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalPercent = categories.reduce((sum, c) => sum + (c.percent || 0), 0) || 100;

  const segments = useMemo(() => {
    let accumulated = 0;
    return categories.map(cat => {
      const segPercent = (cat.percent / totalPercent) * 100;
      const strokeDasharray = `${(segPercent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulated / 100) * circumference);
      accumulated += segPercent;

      return {
        ...cat,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categories, circumference, totalPercent]);

  return (
    <div className="reports-section-card reports-donut-card">
      <div className="reports-section-head">
        <div>
          <h3>Revenue by category</h3>
        </div>
      </div>

      <div className="category-donut-container">
        <div className="donut-chart-wrap">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--surface-2)"
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
        </div>

        <div className="donut-legend-list">
          {categories.map(cat => (
            <div key={cat.name} className="donut-legend-item">
              <div className="donut-legend-name-wrap">
                <span className="donut-legend-dot" style={{ backgroundColor: cat.color }} />
                <span className="donut-legend-name">{cat.name}</span>
              </div>
              <span className="donut-legend-percent">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
