import { useMemo } from 'react';

const PLACEHOLDER_DATA = {
  '7d': [
    { day: '26 Sep', value: 42000 },
    { day: '27 Sep', value: 89000 },
    { day: '28 Sep', value: 136000 },
    { day: '29 Sep', value: 108000 },
    { day: '30 Sep', value: 180000 },
    { day: '1 Oct',  value: 222000 },
    { day: '2 Oct',  value: 195000 },
  ],
  '30d': [
    { day: 'Week 1', value: 340000 },
    { day: 'Week 2', value: 520000 },
    { day: 'Week 3', value: 480000 },
    { day: 'Week 4', value: 710000 },
  ],
};

/**
 * SalesChart — SVG area/line chart.
 * Props:
 *   period   '7d' | '30d'
 *   data     array of { day, value } (optional — falls back to placeholder)
 */
function SalesChart({ period, data }) {
  const points = data || PLACEHOLDER_DATA[period];

  const plotted = useMemo(() => {
    const W = 700;
    const H = 200;
    const max = Math.max(...points.map(p => p.value)) * 1.15;

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
