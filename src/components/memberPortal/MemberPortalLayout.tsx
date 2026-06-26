import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, ChevronDown, ChevronRight, Menu, Search } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getMemberNotifications } from '../../data/memberNotifications';
import AccountFooterPanel from '../auth/AccountFooterPanel';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { DASHBOARD_SOURCES, type DashboardYearKey } from '../../config/dashboardYears';
import { useAuth } from '../../context/AuthContext';
import { useMemberProfile } from '../../hooks/useMemberProfile';
import { LOGIN_SIGNED_OUT_STATE } from '../../lib/authNavigation';
import { MEMBER_PORTAL_BASE, memberPortalNav } from './navItems';
import '../../styles/auth.css';
import '../../styles/performance-dashboard.css';

const programOptions = (Object.entries(DASHBOARD_SOURCES) as Array<
  [DashboardYearKey, (typeof DASHBOARD_SOURCES)[DashboardYearKey]]
>).map(([key, source]) => ({
  key,
  label: source.label.replace(' Dashboard', ''),
}));

export type MemberPortalOutletContext = {
  programKey: DashboardYearKey;
};

function useActiveLabel() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/+$/, '') || MEMBER_PORTAL_BASE;

  const match = memberPortalNav.find((item) =>
    item.end ? normalized === item.path : normalized === item.path || normalized.startsWith(`${item.path}/`),
  );

  return match?.label ?? memberPortalNav[0].label;
}

function ProfileAvatar() {
  return (
    <svg className="performance-profile-avatar" viewBox="0 0 42 42" aria-hidden="true">
      <defs>
        <clipPath id="performance-profile-clip">
          <circle cx="21" cy="21" r="21" />
        </clipPath>
      </defs>
      <g clipPath="url(#performance-profile-clip)">
        <rect width="42" height="42" fill="#b6bac3" />
        <circle cx="21" cy="16" r="7.5" fill="#fff" />
        <circle cx="21" cy="38" r="14" fill="#fff" />
      </g>
    </svg>
  );
}

export default function MemberPortalLayout() {
  const { isAdmin, signOut } = useAuth();
  const { displayName, email, roleLabel, initials } = useMemberProfile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedProgramKey, setSelectedProgramKey] = useState<DashboardYearKey>(programOptions[0].key);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setIsMenuOpen(false);
  const activeLabel = useActiveLabel();
  const notifications = useMemo(() => getMemberNotifications(email), [email]);
  const hasNotifications = notifications.length > 0;

  useEffect(() => {
    if (!isProfileMenuOpen && !isNotificationsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideProfileMenu = profileMenuRef.current?.contains(target);
      const isInsideNotificationMenu = notificationMenuRef.current?.contains(target);

      if (!isInsideProfileMenu && !isInsideNotificationMenu) {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isNotificationsOpen, isProfileMenuOpen]);

  const handleSignOut = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
    void signOut().then(() => {
      navigate('/login', { replace: true, state: LOGIN_SIGNED_OUT_STATE });
    });
  };

  const handleChangePassword = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsChangePasswordOpen(true);
  };

  return (
    <div className="performance-shell">
      <aside className={`performance-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="performance-brand">
          <img src="/toastmasters-logo-white.png" alt="Toastmasters International" />
          <div>
            <strong>Central Link</strong>
            <span>Division I • District 82</span>
          </div>
        </div>

        <div className="performance-member">
          <div className="performance-avatar performance-avatar-initials" aria-hidden="true">
            {initials}
          </div>
          <div>
            <strong>{displayName}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>

        <nav className="performance-nav" aria-label="Member portal">
          {memberPortalNav.map(({ label, icon: Icon, path, end }) => (
            <NavLink
              key={label}
              to={path}
              end={end}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={closeMenu}
            >
              <Icon size={21} strokeWidth={1.7} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <Link className="performance-dues-mini" to={`${MEMBER_PORTAL_BASE}/monthly-fee-portal`} onClick={closeMenu}>
          <div>
            <strong>Monthly Fee Dues</strong>
            <span>
              <i /> Paid • June 2026
            </span>
          </div>
          <ChevronRight size={24} />
        </Link>
      </aside>

      {isMenuOpen ? (
        <button type="button" className="performance-backdrop" onClick={closeMenu} aria-label="Close menu" />
      ) : null}

      <div className="performance-page">
        <header className="performance-topbar">
          <button
            type="button"
            className="performance-menu-button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>
          <div className="performance-title">
            <span>Member portal</span>
            <h1>{activeLabel}</h1>
          </div>

          <div className="performance-topbar-actions">
            <label className="performance-topbar-program">
              <select
                aria-label="Select programme year"
                value={selectedProgramKey}
                onChange={(event) => setSelectedProgramKey(event.target.value as DashboardYearKey)}
              >
                {programOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
            <label className="performance-search">
              <Search size={19} />
              <input type="search" placeholder="Search dashboard" aria-label="Search dashboard" />
            </label>
            <div className="performance-notification-menu-wrap" ref={notificationMenuRef}>
              <button
                type="button"
                className={`performance-icon-button${isNotificationsOpen ? ' is-open' : ''}`}
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setIsNotificationsOpen((open) => !open);
                }}
              >
                <Bell size={22} strokeWidth={2.4} />
                {hasNotifications ? <span aria-hidden="true" /> : null}
              </button>

              {isNotificationsOpen ? (
                <div className="performance-notification-menu" role="dialog" aria-label="Notifications">
                  <div className="performance-notification-menu-header">
                    <strong>Notifications</strong>
                  </div>
                  <div className="performance-notification-menu-body">
                    {hasNotifications ? (
                      <div className="performance-notification-list">
                        {notifications.map((notification) => (
                          <article key={notification.id} className="performance-notification-item">
                            <div>
                              <strong>{notification.title}</strong>
                              <p>{notification.message}</p>
                            </div>
                            <time dateTime={notification.createdAt}>{notification.createdAt}</time>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="performance-notification-menu-empty">No notifications</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="performance-profile-menu-wrap" ref={profileMenuRef}>
              <button
                type="button"
                className={`performance-profile-button${isProfileMenuOpen ? ' is-open' : ''}`}
                aria-label="Open account menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  setIsProfileMenuOpen((open) => !open);
                }}
              >
                <ProfileAvatar />
              </button>

              {isProfileMenuOpen ? (
                <div className="performance-profile-menu" role="menu">
                  <div className="performance-profile-menu-header">
                    <strong>{displayName}</strong>
                    <span className="performance-profile-menu-role">{roleLabel}</span>
                  </div>

                  {isAdmin ? (
                    <div className="performance-profile-menu-actions">
                      <Link
                        className="performance-profile-menu-admin"
                        to="/admin"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Admin Console
                      </Link>
                    </div>
                  ) : null}

                  <AccountFooterPanel
                    className="performance-profile-menu-account"
                    email={email}
                    displayName={displayName}
                    variant="on-light"
                    onChangePassword={handleChangePassword}
                    onSignOut={handleSignOut}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

        <main className="performance-content">
          <Outlet context={{ programKey: selectedProgramKey } satisfies MemberPortalOutletContext} />
        </main>
      </div>
    </div>
  );
}
