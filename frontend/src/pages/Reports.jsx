import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import ReportsHeader, { RANGE_OPTIONS, REPORT_TABS } from '../components/reports/ReportsHeader';
import SalesReportTab from '../components/reports/SalesReportTab';
import InventoryReportTab from '../components/reports/InventoryReportTab';
import StockLevelReportTab from '../components/reports/StockLevelReportTab';
import ProductReportTab from '../components/reports/ProductReportTab';
import UserReportTab from '../components/reports/UserReportTab';
import { exportReportToPdf, handleTabExport } from '../components/reports/reportsExport';
import { buildReportChartData, toLocalYmd } from '../components/reports/reportsChartData';
import { getSalesReport, getSalesInRange, getProducts, getStaff, getStockAdjustments } from '../services/api';
import { getCategoryColor } from '../components/reports/reportsData';
import '../styles/reports.css';
import '../styles/reports-tabs.css';

export default function Reports({ user, onSessionExpired }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sales';
  const [activeRange, setActiveRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [rawSales, setRawSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const isManagement = ['owner', 'manager'].includes(user?.role);
  const selectedRangeObj = useMemo(
    () => RANGE_OPTIONS.find(r => r.id === activeRange) || RANGE_OPTIONS[0],
    [activeRange]
  );

  const fetchReportsData = useCallback(async () => {
    if (!isManagement) return;
    try {
      setLoading(true);
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - selectedRangeObj.days);

      const fromStr = toLocalYmd(fromDate);
      const toStr = toLocalYmd(toDate);

      const [summaryRes, salesRes, prodsRes, staffRes, adjRes] = await Promise.allSettled([
        getSalesReport({ from: fromStr, to: toStr }),
        getSalesInRange({ from: fromStr, to: toStr }),
        getProducts(),
        getStaff(),
        getStockAdjustments(),
      ]);

      if (summaryRes.status === 'fulfilled' && summaryRes.value?.summary) {
        setReportSummary(summaryRes.value.summary);
      }
      if (salesRes.status === 'fulfilled' && Array.isArray(salesRes.value?.sales)) {
        setRawSales(salesRes.value.sales);
      }
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value);
      }
      if (staffRes.status === 'fulfilled' && Array.isArray(staffRes.value)) {
        setStaff(staffRes.value);
      }
      if (adjRes.status === 'fulfilled' && Array.isArray(adjRes.value)) {
        setAdjustments(adjRes.value);
      }
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
    } finally {
      setLoading(false);
    }
  }, [isManagement, selectedRangeObj, onSessionExpired]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort();
    return ['all', ...list];
  }, [products]);

  const { chartData, periodTitle } = useMemo(
    () => buildReportChartData(rawSales, selectedRangeObj),
    [rawSales, selectedRangeObj]
  );

  const kpis = useMemo(() => {
    const totalRev = rawSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const transCount = rawSales.length;
    const avgBasket = transCount > 0 ? Math.round(totalRev / transCount) : 0;
    const unitsSold = rawSales.reduce(
      (sum, s) => sum + (s.items?.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0) || 0),
      0
    );

    return {
      revenue: reportSummary?.total_revenue && reportSummary.total_revenue > 0 ? reportSummary.total_revenue : totalRev,
      grossProfit: Math.round((reportSummary?.total_revenue || totalRev) * 0.32),
      transactions: reportSummary?.total_sales && reportSummary.total_sales > 0 ? reportSummary.total_sales : transCount,
      averageBasket: reportSummary?.average_sale_value && reportSummary.average_sale_value > 0 ? reportSummary.average_sale_value : avgBasket,
      unitsSold,
    };
  }, [rawSales, reportSummary]);

  const topProducts = useMemo(() => {
    const stats = {};
    rawSales.forEach(sale => {
      sale.items?.forEach(item => {
        const name = item.product?.name || `Product #${item.product_id}`;
        if (!stats[name]) stats[name] = { id: name, name, units: 0, revenue: 0 };
        stats[name].units += Number(item.quantity) || 1;
        stats[name].revenue += Number(item.line_total || item.total) || 0;
      });
    });
    return Object.values(stats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [rawSales]);

  const categoryBreakdown = useMemo(() => {
    const catMap = {};
    rawSales.forEach(sale => {
      sale.items?.forEach(item => {
        const cat = item.product?.category || 'General';
        const rev = Number(item.line_total || item.total) || 0;
        catMap[cat] = (catMap[cat] || 0) + rev;
      });
    });
    return Object.entries(catMap).map(([name, amount], idx) => ({
      name,
      amount,
      color: getCategoryColor(idx),
    }));
  }, [rawSales]);

  const paymentBreakdown = useMemo(() => {
    if (reportSummary?.payment_breakdown && reportSummary.payment_breakdown.length > 0) {
      return reportSummary.payment_breakdown;
    }
    const payMap = { cash: 0, card: 0, bank_transfer: 0 };
    rawSales.forEach(s => {
      const m = s.payment_method || 'cash';
      payMap[m] = (payMap[m] || 0) + (Number(s.total) || 0);
    });
    return Object.entries(payMap).map(([method, revenue]) => ({
      payment_method: method,
      revenue,
    }));
  }, [reportSummary, rawSales]);

  function handleTabChange(nextTab) {
    setSearchParams({ tab: nextTab });
    setSearchQuery('');
  }

  function handleExportCsv() {
    handleTabExport({ activeTab, activeRange, products, staff, kpis });
  }

  function handleExportPdf() {
    const currentTabObj = REPORT_TABS.find(t => t.id === activeTab) || REPORT_TABS[0];
    if (activeTab === 'inventory') {
      const headers = ['SKU', 'Product', 'Category', 'Stock Qty', 'Cost Price', 'Sell Price', 'Stock Value'];
      const rows = products.map(p => {
        const qty = p.inventory?.quantity ?? 0;
        const cost = Number(p.cost_price) || 0;
        return [p.sku, p.name, p.category, qty, cost ? `₦${cost.toLocaleString()}` : '—', `₦${Number(p.sell_price).toLocaleString()}`, `₦${(cost * qty).toLocaleString()}`];
      });
      exportReportToPdf(currentTabObj.title, `Inventory asset records filtered for ${selectedRangeObj.label}`, headers, rows);
    } else {
      window.print();
    }
  }

  if (!isManagement) {
    return (
      <div className="reports-page">
        <div className="reports-alert reports-alert--error">
          <Icon name="alert" size={20} />
          <span>Access Restricted: Reports are only accessible to Store Owners and Managers.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <ReportsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeRange={activeRange}
        onRangeChange={setActiveRange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
      />

      {loading ? (
        <div className="reports-loading-state">
          <div className="reports-spinner" />
          <p>Preparing your store reports...</p>
        </div>
      ) : (
        <>
          {activeTab === 'sales' && (
            <SalesReportTab
              sales={rawSales}
              kpis={kpis}
              dailySales={chartData}
              periodTitle={periodTitle}
              categories={categoryBreakdown}
              topProducts={topProducts}
              paymentBreakdown={paymentBreakdown}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryReportTab
              products={products}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          )}

          {activeTab === 'stock' && (
            <StockLevelReportTab
              products={products}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          )}

          {activeTab === 'products' && (
            <ProductReportTab
              products={products}
              sales={rawSales}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          )}

          {activeTab === 'users' && (
            <UserReportTab
              staff={staff}
              sales={rawSales}
              adjustments={adjustments}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </div>
  );
}
