import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ExcoRolesPage from './components/memberPortal/ExcoRolesPage';
import InDevelopmentPage from './components/memberPortal/InDevelopmentPage';
import MeetingRolesPage from './components/memberPortal/MeetingRolesPage';
import MemberPortalLayout from './components/memberPortal/MemberPortalLayout';
import PathwaysPage from './components/memberPortal/PathwaysPage';
import PerformanceDashboardPage from './components/memberPortal/PerformanceDashboardPage';
import { memberPortalNav } from './components/memberPortal/navItems';
import { DASHBOARD_SOURCES, type DashboardYearKey } from './config/dashboardYears';
import AdminPanelPage from './pages/AdminPanelPage';
import ClubDashboardPage from './pages/ClubDashboardPage';
import LoginPage from './pages/LoginPage';

const dashboardOptions = Object.entries(DASHBOARD_SOURCES) as Array<
  [DashboardYearKey, (typeof DASHBOARD_SOURCES)[DashboardYearKey]]
>;

function LegacyMemberPortalRedirect() {
  const { pathname } = useLocation();
  const rest = pathname.replace(/^\/member-portal\/?/, '');

  return <Navigate to={rest ? `/member/${rest}` : '/member'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage dashboardOptions={dashboardOptions} />} />
        <Route path="/contact" element={<Navigate to={{ pathname: '/', hash: '#contact' }} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/club/:yearKey" element={<ClubDashboardPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member"
          element={
            <ProtectedRoute>
              <MemberPortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PerformanceDashboardPage />} />
          <Route path="pathways" element={<PathwaysPage />} />
          <Route path="meeting-roles" element={<MeetingRolesPage />} />
          <Route path="exco-roles-duties" element={<ExcoRolesPage />} />
          {memberPortalNav
            .filter(
              (item) =>
                item.slug &&
                item.slug !== 'pathways' &&
                item.slug !== 'meeting-roles' &&
                item.slug !== 'exco-roles-duties',
            )
            .map((item) => (
              <Route
                key={item.slug}
                path={item.slug}
                element={<InDevelopmentPage title={item.label} icon={item.icon} />}
              />
            ))}
        </Route>
        <Route path="/member-portal/*" element={<LegacyMemberPortalRedirect />} />
        <Route path="/performance-dashboard" element={<Navigate to="/member" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
