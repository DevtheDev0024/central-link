import { Link, useLocation } from 'react-router-dom';
import { SITE_NAV_LINKS } from '../config/siteNav';
import '../styles/landing.css';

type PublicSiteNavProps = {
  activeLabel?: string;
};

function getNavHref(to: string, pathname: string): string {
  if (to.startsWith('/#')) {
    return pathname === '/' ? to.slice(1) : to;
  }

  return to;
}

export default function PublicSiteNav({ activeLabel }: PublicSiteNavProps) {
  const { pathname } = useLocation();

  return (
    <header className="landing-nav animate-fade-rise">
      <div className="landing-nav-inner">
        <div className="landing-nav-leading">
          <Link to="/" className="landing-wordmark">
            <img src="/toastmasters-logo.png" alt="Toastmasters International logo" />
            <span>Central Link Toastmasters Club</span>
          </Link>

          <nav className="landing-nav-links" aria-label="Primary navigation">
            {SITE_NAV_LINKS.map((link) => {
              const isActive = link.label === activeLabel;
              const href = getNavHref(link.to, pathname);

              if (link.to.startsWith('/#')) {
                return (
                  <a key={link.label} href={href} className={isActive ? 'is-active' : undefined}>
                    {link.label}
                  </a>
                );
              }

              return (
                <Link key={link.label} to={link.to} className={isActive ? 'is-active' : undefined}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link className="landing-nav-signin" to="/login">
          Sign In
        </Link>
      </div>
    </header>
  );
}
