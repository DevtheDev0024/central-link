import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AccountFooterPanel from '../auth/AccountFooterPanel';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { useAuth } from '../../context/AuthContext';
import { LOGIN_SIGNED_OUT_STATE } from '../../lib/authNavigation';
import { adminNavItems } from './navItems';
import '../../styles/auth.css';
import '../../styles/admin.css';

type AdminDashboardLayoutProps = {
  children?: React.ReactNode;
};

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
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
          <img src="/toastmasters-logo-white.png" alt="Toastmasters International logo" />
          <div>
            <strong>Admin Console</strong>
          </div>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `admin-sidebar-link${isActive ? ' is-active' : ''}`}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <Link to="/member" className="admin-sidebar-member-link">
          <ArrowLeft size={18} aria-hidden="true" />
          Member Portal
        </Link>

        <AccountFooterPanel
          className="admin-sidebar-footer"
          email={user?.email}
          displayName={user?.displayName}
          variant="on-dark"
          hideChangePasswordIcon
          onChangePassword={() => setIsChangePasswordOpen(true)}
          onSignOut={handleSignOut}
        />
      </aside>

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

      <main className="admin-main">{children ?? <Outlet />}</main>
    </div>
  );
}
