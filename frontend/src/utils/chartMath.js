/** Round a max value up to a clean axis number (e.g. 3 412 → 4 000). */
export function niceMax(value) {
  if (value <= 0) return 1000;
  const padded = value * 1.15;
  const magnitude = 10 ** Math.floor(Math.log10(padded));
  const step = [1, 2, 2.5, 5, 10].find(s => s * magnitude >= padded) || 10;
  return step * magnitude;
}

/** Compact naira label for axis ticks: 0, 900, 4.5k, 1.2M. */
export function shortMoney(value) {
  if (value >= 1_000_000) return `₦${+(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `₦${+(value / 1000).toFixed(1)}k`;
  return `₦${Math.round(value)}`;
}

/**
 * Monotone cubic path through points — smooth like the reference
 * design but never overshoots below zero or above peaks.
 */
export function smoothPath(points) {
  if (points.length < 2) {
    return points.length ? `M ${points[0].x} ${points[0].y}` : '';
  }

  const n = points.length;
  const slopes = [];
  for (let i = 0; i < n - 1; i++) {
    slopes.push((points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x));
  }

  const tangents = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    tangents.push(slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2);
  }
  tangents.push(slopes[n - 2]);

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = (p1.x - p0.x) / 3;
    d += ` C ${p0.x + dx} ${p0.y + tangents[i] * dx}, ${p1.x - dx} ${p1.y - tangents[i + 1] * dx}, ${p1.x} ${p1.y}`;
  }
  return d;
}
