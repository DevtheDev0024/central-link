import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  Mic2,
  Sparkles,
  Trophy,
} from 'lucide-react';

const metrics = [
  { label: 'Speeches Delivered', value: '8', note: '2 this term' },
  { label: 'Roles Taken', value: '14', note: '+5 this term' },
  { label: 'Meetings Attended', value: '10', note: '92% Attendance' },
  { label: 'Member Points', value: '312', note: 'Rank #2 in Club' },
];

const activities = [
  { title: 'Completed General Evaluator role', date: 'June 20', points: '+18 pts', icon: Mic2 },
  { title: 'Delivered “The Power of Pause”', date: 'June 13', points: '+35 pts', icon: Sparkles },
  { title: 'Attended weekly club meeting', date: 'June 6', points: '+10 pts', icon: CalendarDays },
];

// Placeholder set — earned badges will be fetched/routed per member later.
const earnedBadges = [
  { name: 'Meeting Star', image: '/badges/Meeting-Star.png' },
  { name: 'Contest Supporter', image: '/badges/Contest-Supporter.png' },
  { name: 'Evaluation Champion', image: '/badges/Evaluation-Champion.png' },
];

const pathwayLevels = [
  { level: 'L1', status: 'complete' },
  { level: 'L2', status: 'complete' },
  { level: 'L3', status: 'current' },
  { level: 'L4', status: 'locked' },
  { level: 'L5', status: 'locked' },
];

const pathwayProjects = [
  { name: 'Understanding Your Communication Style', done: true },
  { name: 'Effective Body Language', done: true },
  { name: 'Persuasive Speaking', done: false },
  { name: 'Managing a Difficult Audience', done: false },
];

export default function PerformanceDashboardPage() {
  return (
    <>
      <section className="performance-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Welcome Back!</span>
          <div className="performance-hero-headline">
            <h2>Dulain Gunawardhana</h2>
            <div className="performance-hero-badges" aria-label="Earned badges">
              {earnedBadges.map((badge) => (
                <img key={badge.name} src={badge.image} alt={`${badge.name} badge`} title={badge.name} />
              ))}
            </div>
          </div>
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
            <span>Week Streak</span>
          </div>
        </div>
      </section>

      <section className="performance-metrics" aria-label="Performance summary">
        {metrics.map(({ label, value, note }) => (
          <article key={label} className="performance-metric">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="performance-grid">
        <article className="performance-card performance-progress-card">
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
            {pathwayLevels.map((item) => (
              <div key={item.level} className={`performance-level is-${item.status}`}>
                <span>{item.level}</span>
                <i />
              </div>
            ))}
          </div>

          <div className="performance-projects">
            <span className="performance-projects-title">Level 3 Projects</span>
            <ul className="performance-project-list">
              {pathwayProjects.map((project) => (
                <li key={project.name} className={project.done ? 'is-done' : 'is-pending'}>
                  <span className="performance-project-mark">
                    {project.done && <Check size={15} strokeWidth={3.5} />}
                  </span>
                  <span>{project.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="performance-card performance-fees-card">
          <span className="performance-eyebrow">Monthly Fee Dues</span>
          <p>Paid Through</p>
          <h3>June 2026</h3>
          <div className="performance-fees-details">
            <div><span>Next Billing</span><strong>Jul 1, 2026</strong></div>
            <div><span>Amount</span><strong>LKR 500</strong></div>
          </div>
          <button type="button">Open Payment Portal</button>
        </article>

        <article className="performance-card performance-activity-card">
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

        <article className="performance-card performance-achievements-card">
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
    </>
  );
}
