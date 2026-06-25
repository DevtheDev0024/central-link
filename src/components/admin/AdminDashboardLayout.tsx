import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  Gauge,
  Mail,
  Settings,
  Users,
} from 'lucide-react';
import AccountFooterPanel from '../auth/AccountFooterPanel';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { useAuth } from '../../context/AuthContext';
import { LOGIN_SIGNED_OUT_STATE } from '../../lib/authNavigation';
import '../../styles/auth.css';
import '../../styles/admin.css';

const NAV_ITEMS = [
  { label: 'User Management', href: '/admin', icon: Users, enabled: true },
  { label: 'Approvals', href: '#', icon: CheckCircle, enabled: false },
  { label: 'Award Points', href: '#', icon: Award, enabled: false },
  { label: 'Reports & Analytics', href: '#', icon: BarChart3, enabled: false },
  { label: 'Meeting Scheduler', href: '#', icon: Calendar, enabled: false },
  { label: 'Communications', href: '#', icon: Mail, enabled: false },
  { label: 'Settings', href: '#', icon: Settings, enabled: false },
] as const;

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
};

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSignOut = () => {
    void signOut().then(() => {
      navigate('/login', { replace: true, state: LOGIN_SIGNED_OUT_STATE });
    });
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/toastmasters-logo.png" alt="Toastmasters International logo" />
          <div>
            <strong>Admin Console</strong>
            <span>Central Link Toastmasters</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.enabled && pathname === item.href;

            if (!item.enabled) {
              return (
                <span key={item.label} className="admin-sidebar-link is-disabled" aria-disabled="true">
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`admin-sidebar-link${isActive ? ' is-active' : ''}`}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/member" className="admin-sidebar-member-link">
          <Gauge size={18} aria-hidden="true" />
          Member Dashboard
        </Link>

        <AccountFooterPanel
          className="admin-sidebar-footer"
          email={user?.email}
          displayName={user?.displayName}
          variant="on-dark"
          onChangePassword={() => setIsChangePasswordOpen(true)}
          onSignOut={handleSignOut}
        />
      </aside>

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

      <main className="admin-main">{children}</main>
    </div>
  );
}
