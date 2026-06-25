import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MemberDashboard from './components/MemberDashboard';
import InDevelopmentPage from './components/memberPortal/InDevelopmentPage';
import MemberPortalLayout from './components/memberPortal/MemberPortalLayout';
import PerformanceDashboardPage from './components/memberPortal/PerformanceDashboardPage';
import { memberPortalNav } from './components/memberPortal/navItems';
import ErrorScreen from './components/ui/ErrorScreen';
import LoadingScreen from './components/ui/LoadingScreen';
import { DASHBOARD_SOURCES, type DashboardYearKey } from './config/dashboardYears';
import { useDashboardData } from './hooks/useDashboardData';

function DashboardApp() {
  const [selectedDashboardKey, setSelectedDashboardKey] = useState<DashboardYearKey | null>(null);

  const {
    members,
    loading,
    refreshing,
    error,
    lastUpdated,
    selectedDashboardSource,
    fetchData,
    resetDashboardData,
  } = useDashboardData(selectedDashboardKey);

  const handleSelectDashboard = (dashboardKey: DashboardYearKey) => {
    resetDashboardData();
    setSelectedDashboardKey(dashboardKey);
  };

  const handleChangeDashboardYear = () => {
    setSelectedDashboardKey(null);
    resetDashboardData();
  };

  if (!selectedDashboardKey || !selectedDashboardSource) {
    const dashboardOptions = Object.entries(DASHBOARD_SOURCES) as Array<
      [DashboardYearKey, (typeof DASHBOARD_SOURCES)[DashboardYearKey]]
    >;

    return (
      <LandingPage dashboardOptions={dashboardOptions} onSelectDashboard={handleSelectDashboard} />
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={() => fetchData({ showFullLoader: true })}
        onChangeDashboardYear={handleChangeDashboardYear}
      />
    );
  }

  return (
    <MemberDashboard
      dashboardSource={selectedDashboardSource}
      members={members}
      refreshing={refreshing}
      lastUpdated={lastUpdated}
      onRefresh={() => {
        void fetchData();
      }}
      onChangeDashboardYear={handleChangeDashboardYear}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/member-portal" element={<MemberPortalLayout />}>
          <Route index element={<PerformanceDashboardPage />} />
          {memberPortalNav
            .filter((item) => item.slug)
            .map((item) => (
              <Route
                key={item.slug}
                path={item.slug}
                element={<InDevelopmentPage title={item.label} icon={item.icon} />}
              />
            ))}
        </Route>
        <Route path="/performance-dashboard" element={<Navigate to="/member-portal" replace />} />
        <Route path="*" element={<DashboardApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
