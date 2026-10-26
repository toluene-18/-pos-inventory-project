function toLocalYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export { toLocalYmd };

/**
 * Builds aggregated revenue chart points for 7d, 30d, 90d (weekly), and 365d (monthly).
 */
export function buildReportChartData(rawSales = [], selectedRangeObj = { days: 7, label: '7 days' }) {
  const days = selectedRangeObj.days;
  const now = new Date();
  const result = [];

  if (days <= 30) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ymd = toLocalYmd(d);
      const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const dayRev = rawSales
        .filter(s => s.created_at && toLocalYmd(new Date(s.created_at)) === ymd)
        .reduce((sum, s) => sum + (Number(s.total) || 0), 0);

      result.push({ date: label, fullDate: `${label} ${d.getFullYear()}`, revenue: dayRev });
    }
    return { chartData: result, periodTitle: `Daily revenue (${selectedRangeObj.label})` };
  }

  if (days <= 90) {
    for (let w = 12; w >= 0; w--) {
      const start = new Date(now);
      start.setDate(start.getDate() - w * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const startYmd = toLocalYmd(start);
      const endYmd = toLocalYmd(end);
      const startLabel = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const endLabel = end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      const weekRev = rawSales
        .filter(s => {
          if (!s.created_at) return false;
          const ymd = toLocalYmd(new Date(s.created_at));
          return ymd >= startYmd && ymd <= endYmd;
        })
        .reduce((sum, s) => sum + (Number(s.total) || 0), 0);

      result.push({
        date: startLabel,
        fullDate: `${startLabel} – ${endLabel}`,
        revenue: weekRev,
      });
    }
    return { chartData: result, periodTitle: 'Weekly revenue (90 days)' };
  }

  for (let m = 11; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-GB', { month: 'short' });
    const full = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const monthRev = rawSales
      .filter(s => s.created_at && toLocalYmd(new Date(s.created_at)).startsWith(ym))
      .reduce((sum, s) => sum + (Number(s.total) || 0), 0);

    result.push({ date: label, fullDate: full, revenue: monthRev });
  }
  return { chartData: result, periodTitle: 'Monthly revenue (All time)' };
}
