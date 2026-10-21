import { useMemo, useState } from 'react';
import { formatMoney } from '../../utils/dashboardStats';
import { niceMax, smoothPath, shortMoney } from '../../utils/chartMath';
import '../../styles/chart.css';

const W = 700;
const H = 240;
const PAD = { top: 12, right: 8, bottom: 8, left: 8 };
const TICKS = 4;

/**
 * SalesChart — smooth area chart of daily revenue with hover tooltip.
 * data: array of { day, fullDate, value, count }
 */
function SalesChart({ data = [] }) {
  const [hover, setHover] = useState(null);

  const { plotted, max } = useMemo(() => {
    const top = niceMax(Math.max(0, ...data.map(p => p.value)));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const pts = data.map((p, i) => ({
      ...p,
      x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
      y: PAD.top + innerH - (p.value / top) * innerH,
    }));
    return { plotted: pts, max: top };
  }, [data]);

  if (plotted.length === 0) return null;

  const line = smoothPath(plotted);
  const last = plotted[plotted.length - 1];
  const area = `${line} L ${last.x} ${H - PAD.bottom} L ${plotted[0].x} ${H - PAD.bottom} Z`;
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => (max / TICKS) * (TICKS - i));
  const labelEvery = plotted.length > 10 ? Math.ceil(plotted.length / 7) : 1;

  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (plotted.length - 1));
    setHover(Math.min(Math.max(index, 0), plotted.length - 1));
  }

  const active = hover === null ? null : plotted[hover];
  const pct = p => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` });

  return (
    <div className="chart">
      <div className="chart-y" aria-hidden="true">
        {ticks.map(t => <span key={t}>{shortMoney(t)}</span>)}
      </div>

      <div className="chart-body">
        <div
          className="chart-plot"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
            aria-label="Daily revenue trend">
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--green)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((t, i) => {
              const y = PAD.top + (i / TICKS) * (H - PAD.top - PAD.bottom);
              return <line key={t} x1="0" x2={W} y1={y} y2={y} className="chart-grid" />;
            })}
            <path d={area} fill="url(#chart-fill)" />
            <path d={line} className="chart-line" vectorEffect="non-scaling-stroke" />
            {active && (
              <line x1={active.x} x2={active.x} y1={PAD.top} y2={H - PAD.bottom}
                className="chart-cursor" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {active && (
            <>
              <span className="chart-dot" style={pct(active)} />
              <div
                className={`chart-tip${active.x > W * 0.7 ? ' chart-tip--left' : ''}`}
                style={pct(active)}
                role="status"
              >
                <small>{active.fullDate}</small>
                <strong>{formatMoney(active.value)}</strong>
                <span>
                  {active.count} {active.count === 1 ? 'sale' : 'sales'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="chart-x" aria-hidden="true">
          {plotted.map((p, i) => (
            <span key={p.day} style={{ left: `${(p.x / W) * 100}%` }}>
              {i % labelEvery === 0 || i === plotted.length - 1 ? p.day : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
