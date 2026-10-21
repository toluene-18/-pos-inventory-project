import { useState } from 'react';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import MetricGrid from '../components/dashboard/MetricGrid';
import SalesTrendPanel from '../components/dashboard/SalesTrendPanel';
import LiveActivityPanel from '../components/dashboard/LiveActivityPanel';
import TopProductsPanel from '../components/dashboard/TopProductsPanel';
import LowStockPanel from '../components/dashboard/LowStockPanel';
import useDashboardData from '../hooks/useDashboardData';
import '../styles/dashboard-home.css';
import '../styles/dashboard-panels.css';

function DashboardHome({ user, onNavigate, onSessionExpired }) {
  const isOwner = user?.role === 'owner';
  const [period, setPeriod] = useState('7d');
  const d = useDashboardData({ isOwner, period, onSessionExpired });

  return (
    <div className="dash-home">
      <WelcomeSection
        user={user}
        isOwner={isOwner}
        error={d.error}
        truncated={d.trend.truncated}
        onNavigate={onNavigate}
      />

      <MetricGrid
        loading={d.loading}
        isOwner={isOwner}
        todayMetrics={d.todayMetrics}
        lowStock={d.lowStock}
        productsError={d.productsError}
      />

      <section className="dash-middle" aria-label="Sales trend and activity">
        <SalesTrendPanel
          period={period}
          onPeriodChange={setPeriod}
          loading={d.loading}
          error={d.salesError}
          points={d.trend.points}
          totalRevenue={d.trend.totalRevenue}
          dailyAverage={d.trend.dailyAverage}
        />
        <LiveActivityPanel
          loading={d.loading}
          error={d.salesError && d.productsError ? d.error : ''}
          items={d.activity}
        />
      </section>

      <section className="dash-bottom" aria-label="Products and inventory">
        <TopProductsPanel
          items={d.topProducts}
          loading={d.loading}
          error={d.salesError}
          isOwner={isOwner}
          onNavigate={onNavigate}
        />
        <LowStockPanel
          items={d.lowStock}
          loading={d.loading}
          error={d.productsError}
          canManage={isOwner}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
}

export default DashboardHome;
