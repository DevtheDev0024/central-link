import { useState } from 'react';
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Home,
  Menu,
  Mic2,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserCircle,
  UsersRound,
  X,
} from 'lucide-react';
import '../styles/performance-dashboard.css';

const navigationItems = [
  { label: 'Performance Dashboard', icon: Gauge, href: '#overview', active: true },
  { label: 'Meeting Roles', icon: Mic2, href: '#activity' },
  { label: 'Pathways', icon: Network, href: '#pathways' },
  { label: 'Educational Achievements', icon: Award, href: '#achievements' },
  { label: 'Club Leadership', icon: UsersRound, href: '#leadership' },
  { label: 'D82 Awards', icon: Trophy, href: '#awards' },
  { label: 'Exco Roles & Duties', icon: ShieldCheck, href: '#leadership' },
  { label: 'Monthly Fee Portal', icon: CircleDollarSign, href: '#fees' },
];

const metrics = [
  { label: 'Speeches Delivered', value: '8', note: '2 this term', icon: Mic2 },
  { label: 'Roles Taken', value: '14', note: '+5 this term', icon: UsersRound },
  { label: 'Meetings Attended', value: '10', note: '92% attendance', icon: CalendarDays },
  { label: 'Member Points', value: '312', note: 'Rank #2 in club', icon: Trophy },
];

const activities = [
  { title: 'Completed General Evaluator role', date: 'June 20', points: '+18 pts', icon: Mic2 },
  { title: 'Delivered “The Power of Pause”', date: 'June 13', points: '+35 pts', icon: Sparkles },
  { title: 'Attended weekly club meeting', date: 'June 6', points: '+10 pts', icon: CalendarDays },
];

export default function PerformanceDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="performance-shell">
      <aside className={`performance-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="performance-brand">
          <img src="/toastmasters-logo-white.png" alt="Toastmasters International" />
          <div>
            <strong>Central Link</strong>
            <span>Division I · District 82</span>
          </div>
          <button type="button" className="performance-menu-close" onClick={closeMenu} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="performance-member">
          <div className="performance-avatar" aria-hidden="true">
            DG
          </div>
          <div>
            <strong>Dulain Gunawardhana</strong>
            <span>Member · President</span>
          </div>
        </div>

        <nav className="performance-nav" aria-label="Member portal">
          {navigationItems.map(({ label, icon: Icon, href, active }) => (
            <a key={label} href={href} className={active ? 'is-active' : ''} onClick={closeMenu}>
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a className="performance-dues-mini" href="#fees" onClick={closeMenu}>
          <div>
            <strong>Monthly Fee Dues</strong>
            <span><i /> Paid · June 2026</span>
          </div>
          <ChevronRight size={24} />
        </a>

        <a className="performance-home-link" href="/">
          <Home size={17} />
          Back to member portal
        </a>
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
            <h1>Performance Dashboard</h1>
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
              <UserCircle className="performance-profile-avatar" size={26} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="performance-content">
          <section id="overview" className="performance-hero">
            <div className="performance-hero-copy">
              <span className="performance-welcome">Welcome back!</span>
              <h2>Dulain Gunawardhana</h2>
              <div className="performance-pathway-meta">
                <span>Pathway: <strong>Presentation Mastery</strong></span>
                <span>Level: <strong>3 of 5</strong></span>
              </div>
            </div>

            <div className="performance-hero-score">
              <div>
                <strong>312</strong>
                <span>Points</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Week streak</span>
              </div>
            </div>
          </section>

          <section className="performance-metrics" aria-label="Performance summary">
            {metrics.map(({ label, value, note, icon: Icon }) => (
              <article key={label} className="performance-metric">
                <div className="performance-metric-icon"><Icon size={19} /></div>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{note}</small>
              </article>
            ))}
          </section>

          <section className="performance-grid">
            <article id="pathways" className="performance-card performance-progress-card">
              <div className="performance-card-heading">
                <div>
                  <span className="performance-eyebrow">Pathways progress</span>
                  <h3>Presentation Mastery</h3>
                </div>
                <div className="performance-percent">
                  <strong>69%</strong>
                  <span>Overall</span>
                </div>
              </div>

              <div className="performance-levels">
                {[
                  { level: 'L1', label: 'Mastering Fundamentals', status: 'complete' },
                  { level: 'L2', label: 'Learning Your Style', status: 'complete' },
                  { level: 'L3', label: 'Increasing Knowledge', status: 'current' },
                  { level: 'L4', label: 'Building Skills', status: 'locked' },
                  { level: 'L5', label: 'Demonstrating Expertise', status: 'locked' },
                ].map((item) => (
                  <div key={item.level} className={`performance-level is-${item.status}`}>
                    <div><span>{item.level}</span><i /></div>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>

              <div className="performance-next-project">
                <div className="performance-next-icon"><Target size={22} /></div>
                <div>
                  <span>Next project</span>
                  <strong>Connect With Your Audience</strong>
                </div>
                <button type="button">View pathway <ChevronRight size={17} /></button>
              </div>
            </article>

            <article id="fees" className="performance-card performance-fees-card">
              <div className="performance-fees-icon"><CircleDollarSign size={24} /></div>
              <span className="performance-eyebrow">Monthly fee dues</span>
              <p>Paid through</p>
              <h3>June 2026</h3>
              <div className="performance-fees-details">
                <div><span>Next billing</span><strong>Jul 1, 2026</strong></div>
                <div><span>Amount</span><strong>LKR 500</strong></div>
              </div>
              <button type="button">Open payment portal <ChevronRight size={18} /></button>
            </article>

            <article id="activity" className="performance-card performance-activity-card">
              <div className="performance-section-heading">
                <div>
                  <span className="performance-eyebrow">Latest updates</span>
                  <h3>Recent Activity</h3>
                </div>
                <button type="button">View all</button>
              </div>
              <div className="performance-activity-list">
                {activities.map(({ title, date, points, icon: Icon }) => (
                  <div key={title} className="performance-activity-item">
                    <span className="performance-activity-icon"><Icon size={18} /></span>
                    <div><strong>{title}</strong><span>{date}</span></div>
                    <b>{points}</b>
                  </div>
                ))}
              </div>
            </article>

            <article id="achievements" className="performance-card performance-achievements-card">
              <div className="performance-section-heading">
                <div>
                  <span className="performance-eyebrow">Milestones</span>
                  <h3>Achievements</h3>
                </div>
                <Award size={22} />
              </div>
              <div className="performance-achievement-row">
                <div className="is-gold"><Trophy size={25} /><span>Top 3<br />Member</span></div>
                <div className="is-blue"><BookOpen size={25} /><span>Level 2<br />Complete</span></div>
                <div className="is-maroon"><Mic2 size={25} /><span>10 Roles<br />Taken</span></div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
