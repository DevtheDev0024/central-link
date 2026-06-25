import { Check, ChevronRight } from 'lucide-react';

const metrics = [
  { label: 'Speeches Delivered', value: '8', note: '2 this term' },
  { label: 'Roles Taken', value: '14', note: '+5 this term' },
  { label: 'Meetings Attended', value: '10', note: '92% Attendance' },
  { label: 'Member Points', value: '312', note: 'Rank #2 in Club' },
];

const activities = [
  { title: 'Completed General Evaluator Role', detail: 'June 20 • ESU TMC', points: '+18 pts' },
  { title: 'Delivered “Guilty, Your Honor”', detail: 'June 13 • Central Link TMC', points: '+35 pts' },
  { title: 'Visit Another Club', detail: 'June 6 • Dowels TMC', points: '+10 pts' },
];

// Placeholder set — earned badges will be fetched/routed per member later.
const earnedBadges = [
  { name: 'Pathways Achiever', image: '/badges/Pathways-Achiever.png' },
  { name: 'Contest Supporter', image: '/badges/Contest-Supporter.png' },
  { name: 'Leadership Contributor', image: '/badges/Leadership-Contributor.png' },
  { name: 'Learning Enthusiast', image: '/badges/Learning-Enthusiast.png' },
  { name: 'Evaluation Champion', image: '/badges/Evaluation-Champion.png' },
  { name: 'Contest Star', image: '/badges/Contest-Star.png' },
  { name: 'Meeting Star', image: '/badges/Meeting-Star.png' },
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

function groupBadges<T>(badges: T[]) {
  const rowCount = Math.ceil(badges.length / 4);
  const minimumRowSize = Math.floor(badges.length / rowCount);
  const largerRowCount = badges.length % rowCount;
  const rows: T[][] = [];
  let offset = 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowSize = minimumRowSize + (rowIndex < largerRowCount ? 1 : 0);
    rows.push(badges.slice(offset, offset + rowSize));
    offset += rowSize;
  }

  return rows;
}

export default function PerformanceDashboardPage() {
  const badgeRows = groupBadges(earnedBadges);

  return (
    <>
      <section className="performance-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Welcome Back!</span>
          <div className="performance-hero-headline">
            <h2>Dulain Gunawardhana</h2>
            <div className="performance-hero-badges" aria-label="Earned badges">
              {earnedBadges.slice(0, 3).map((badge) => (
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

        <article className="performance-card performance-badges-card">
          <div className="performance-badges-heading">
            <div>
              <span>Dulain Gunawardhana</span>
              <h3>Earned Badges</h3>
            </div>
            <div className="performance-badges-count">
              <strong>7</strong>
              <span>of 12</span>
            </div>
          </div>
          <div className="performance-earned-badges" aria-label="Earned badges">
            {badgeRows.map((row, rowIndex) => (
              <div key={rowIndex} className="performance-earned-badges-row">
                {row.map((badge) => (
                  <img key={badge.name} src={badge.image} alt={`${badge.name} badge`} title={badge.name} />
                ))}
              </div>
            ))}
          </div>
          <div className="performance-badges-footer">
            <button type="button">View All <ChevronRight size={20} /></button>
          </div>
        </article>

        <article className="performance-card performance-activity-card">
          <div className="performance-activity-heading">
            <span className="performance-eyebrow">Latest Updates</span>
            <h3>Recent Activity</h3>
          </div>
          <div className="performance-activity-list">
            {activities.map(({ title, detail, points }) => (
              <div key={title} className="performance-activity-item">
                <div><strong>{title}</strong><span>{detail}</span></div>
                <b>{points}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
