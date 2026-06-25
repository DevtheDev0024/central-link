import { useState } from 'react';
import { Bell, ChevronRight, Menu, Search } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { MEMBER_PORTAL_BASE, memberPortalNav } from './navItems';
import '../../styles/performance-dashboard.css';

function useActiveLabel() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/+$/, '') || MEMBER_PORTAL_BASE;

  const match = memberPortalNav.find((item) =>
    item.end ? normalized === item.path : normalized === item.path || normalized.startsWith(`${item.path}/`),
  );

  return match?.label ?? memberPortalNav[0].label;
}

export default function MemberPortalLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const activeLabel = useActiveLabel();

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
          <div className="performance-avatar" aria-hidden="true">
            <svg viewBox="0 0 42 42">
              <defs>
                <clipPath id="performance-member-clip">
                  <circle cx="21" cy="21" r="21" />
                </clipPath>
              </defs>
              <g clipPath="url(#performance-member-clip)">
                <rect width="42" height="42" fill="#d9d9d9" />
                <circle cx="21" cy="16" r="7.5" fill="#9aa0a8" />
                <circle cx="21" cy="38" r="14" fill="#9aa0a8" />
              </g>
            </svg>
          </div>
          <div>
            <strong>Dulain Gunawardhana</strong>
            <span>Member • President</span>
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
            <span><i /> Paid • June 2026</span>
          </div>
          <ChevronRight size={24} />
        </Link>
      </aside>

      {isMenuOpen && <button type="button" className="performance-backdrop" onClick={closeMenu} aria-label="Close menu" />}

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
            <label className="performance-search">
              <Search size={19} />
              <input type="search" placeholder="Search dashboard" aria-label="Search dashboard" />
            </label>
            <button type="button" className="performance-icon-button" aria-label="Notifications">
              <Bell size={22} strokeWidth={2.4} />
              <span />
            </button>
            <button type="button" className="performance-profile-button" aria-label="Open profile">
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
            </button>
          </div>
        </header>

        <main className="performance-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
