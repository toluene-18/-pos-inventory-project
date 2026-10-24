import { useEffect, useState } from 'react';
import { ApiError, getProducts, getSalesInRange, getSalesReport } from '../services/api';
import {
  buildActivity,
  buildChartPoints,
  buildLowStock,
  buildTopProducts,
  formatDateYmd,
  shiftDateYmd,
  summarizeSales,
} from '../utils/dashboardStats';

const EMPTY_STATE = {
  todayMetrics: { revenue: 0, count: 0, average: 0 },
  trend: { totalRevenue: 0, dailyAverage: 0, points: [], truncated: false },
  activity: [],
  topProducts: [],
  lowStock: [],
  error: '',
  salesError: '',
  productsError: '',
};

const valueOf = (result, fallback) =>
  result?.status === 'fulfilled' ? result.value : fallback;

function reportSummary(result) {
  if (result?.status !== 'fulfilled') return null;
  const s = result.value.summary;
  return { count: s.total_sales, revenue: s.total_revenue, average: s.average_sale_value };
}

/**
 * useDashboardData — loads products + sales for the dashboard and
 * shapes them into widget-ready data. Owners also get server report totals.
 */
export default function useDashboardData({ isOwner, period, onSessionExpired }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(EMPTY_STATE);

  useEffect(() => {
    let cancelled = false;

    async function load(isSilent = false) {
      if (!isSilent) setLoading(true);

      const today = formatDateYmd(new Date());
      const dayCount = period === '7d' ? 7 : 30;
      const from = shiftDateYmd(today, -(dayCount - 1));

      const tasks = [
        getProducts(),
        getSalesInRange({ from: today, to: today }),
        getSalesInRange({ from, to: today }),
      ];
      if (isOwner) {
        tasks.push(getSalesReport({ from: today, to: today }));
        tasks.push(getSalesReport({ from, to: today }));
      }

      const results = await Promise.allSettled(tasks);
      if (cancelled) return;

      const expired = results.some(
        r => r.status === 'rejected' && r.reason instanceof ApiError && r.reason.status === 401
      );
      if (expired) {
        onSessionExpired?.();
        return;
      }

      const [productsRes, todayRes, rangeRes, todayReport, rangeReport] = results;
      const products = valueOf(productsRes, []);
      const todaySales = valueOf(todayRes, { sales: [] }).sales;
      const range = valueOf(rangeRes, { sales: [], truncated: false });

      const serverToday = isOwner ? reportSummary(todayReport) : null;
      const todayMetrics = (serverToday && serverToday.count > 0)
        ? serverToday
        : summarizeSales(todaySales);

      const serverRange = isOwner ? reportSummary(rangeReport) : null;
      const rangeSummary = (serverRange && serverRange.count > 0)
        ? serverRange
        : summarizeSales(range.sales);

      const lowStock = buildLowStock(products);
      const allFailed = [productsRes, todayRes, rangeRes].every(r => r.status === 'rejected');

      setData({
        todayMetrics,
        trend: {
          totalRevenue: rangeSummary.revenue,
          dailyAverage: Math.round((Number(rangeSummary.revenue) / dayCount) * 100) / 100,
          points: buildChartPoints(range.sales, from, today),
          truncated: range.truncated,
        },
        activity: buildActivity({ sales: range.sales, lowStock }),
        topProducts: buildTopProducts(range.sales),
        lowStock,
        error: allFailed ? 'Could not load dashboard data. Check that Laravel is running.' : '',
        salesError:
          todayRes.status === 'rejected' && rangeRes.status === 'rejected'
            ? todayRes.reason?.message || 'Could not load sales.'
            : '',
        productsError:
          productsRes.status === 'rejected'
            ? productsRes.reason?.message || 'Could not load products.'
            : '',
      });
      setLoading(false);
    }

    load().catch(err => {
      if (cancelled) return;
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired?.();
        return;
      }
      setData(prev => ({ ...prev, error: err.message || 'Could not load dashboard data.' }));
      setLoading(false);
    });

    const intervalId = setInterval(() => {
      load(true).catch(() => {});
    }, 12000);

    function handleWindowFocus() {
      load(true).catch(() => {});
    }
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isOwner, onSessionExpired, period]);

  return { loading, ...data };
}
