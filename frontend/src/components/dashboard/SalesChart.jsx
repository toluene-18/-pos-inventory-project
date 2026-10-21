import { useMemo } from 'react';

/**
 * SalesChart — SVG area/line chart of real daily revenue.
 * Props:
 *   data  array of { day, value }
 */
function SalesChart({ data = [] }) {
  const points = data;

  const plotted = useMemo(() => {
    const W = 700;
    const H = 200;
    const highest = Math.max(0, ...points.map(p => p.value));
    const max = highest > 0 ? highest * 1.15 : 1;

    return points.map((p, i) => ({
      ...p,
      x: 8 + (i / Math.max(points.length - 1, 1)) * (W - 16),
      y: H - (p.value / max) * (H - 24) - 8,
    }));
  }, [points]);

  const linePath = plotted
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${plotted[plotted.length - 1].x} 200 L 8 200 Z`;

  return (
    <div className="chart-wrap">
      <svg
        className="sales-chart-svg"
        viewBox="0 0 700 200"
        preserveAspectRatio="none"
        role="img"
        aria-label="Sales trend chart"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c77b" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#22c77b" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[40, 80, 120, 160, 195].map(y => (
          <line
            key={y}
            x1="0" y1={y} x2="700" y2={y}
            className="chart-grid"
          />
        ))}

        <path d={areaPath} fill="url(#chart-fill)" />
        <path d={linePath}  className="chart-line" />

        {plotted.map(p => (
          <circle
            key={p.day}
            cx={p.x}
            cy={p.y}
            r="3.5"
            className="chart-dot"
          />
        ))}
      </svg>

      <div className="chart-labels" aria-hidden="true">
        {plotted.map(p => <span key={p.day}>{p.day}</span>)}
      </div>
    </div>
  );
}

export default SalesChart;
