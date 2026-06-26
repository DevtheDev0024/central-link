import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BADGE_CALCULATOR_RULES } from '../../data/badgeCalculatorRules';
import { getCurrentLevel, getOverallPercent, PATHWAY_NAME, pathwayLevels } from '../../data/pathwayMockData';
import type { BadgeDefinition } from '../../types/badges';
import type { PointsModalTab } from '../../types/badges';
import type { Member } from '../../types/member';
import BadgeDetailOverlay from '../dashboard/BadgeDetailOverlay';
import BadgeGridSection from '../dashboard/BadgeGridSection';
import MemberPerformanceSection from '../dashboard/MemberPerformanceSection';
import PointsModal from '../dashboard/PointsModal';

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

const pathwayProjects = getCurrentLevel(pathwayLevels).projects;
const pathwayLevelStepper = pathwayLevels.map(({ label, status }) => ({ level: label, status }));

const performanceMembers: Member[] = [
  ['Thebuk Rabathialke', 40, 25, 30, 65, 15, 0, 0, 123],
  ['Dulain Gunawardhana', 35, 30, 25, 50, 20, 10, 5, 118],
  ['Sachini Perera', 30, 28, 20, 45, 15, 10, 10, 112],
  ['Nimesh Fernando', 25, 24, 28, 40, 20, 5, 10, 108],
  ['Amaya Jayasinghe', 30, 20, 25, 35, 15, 10, 5, 104],
  ['Kavindu Silva', 20, 25, 20, 35, 10, 15, 10, 98],
  ['Tharushi Wickramasinghe', 25, 20, 18, 30, 15, 10, 5, 94],
  ['Ravindu Senanayake', 20, 18, 20, 25, 15, 10, 5, 88],
  ['Sanduni Wijesinghe', 18, 20, 15, 25, 10, 8, 5, 84],
  ['Dinuka Amarasinghe', 20, 16, 18, 20, 10, 10, 5, 81],
  ['Hasini de Silva', 16, 18, 14, 22, 10, 8, 6, 78],
  ['Pasindu Jayawardena', 15, 16, 15, 20, 8, 10, 5, 74],
  ['Shenali Fernando', 18, 15, 12, 18, 10, 6, 4, 71],
  ['Akila Perera', 14, 15, 14, 16, 8, 7, 5, 68],
  ['Mihiri Gunasekara', 15, 12, 13, 15, 8, 6, 5, 64],
  ['Janith Bandara', 12, 14, 10, 14, 7, 5, 4, 59],
].map(([name, levels, projects, awards, contests, training, education, mentoring, total]) => ({
  name: name as string,
  levelCompletion: levels as number,
  projectCompletion: projects as number,
  meetingAwards: awards as number,
  contestExcellence: contests as number,
  evaluationContribution: 0,
  trainingPrograms: training as number,
  educationalSessions: education as number,
  mentoringAssignments: mentoring as number,
  leadershipRoles: 0,
  clubEvents: 0,
  clubContestContribution: 0,
  visitingToastmaster: 0,
  meetingRolesPoints: 0,
  totalPoints: total as number,
  aiScore: 0,
  ajScore: total as number,
  meetingRoles: [],
}));

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
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [isBadgeDetailClosing, setIsBadgeDetailClosing] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberSortField, setMemberSortField] = useState<keyof Member>('ajScore');
  const [memberSortDirection, setMemberSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState(BADGE_CALCULATOR_RULES[0].id);
  const badgeCloseTimeoutRef = useRef<number | null>(null);

  const visibleMembers = performanceMembers
    .filter((member) => member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()))
    .sort((first, second) => {
      const firstValue = first[memberSortField];
      const secondValue = second[memberSortField];
      const direction = memberSortDirection === 'asc' ? 1 : -1;

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return (firstValue - secondValue) * direction;
      }

      return String(firstValue).localeCompare(String(secondValue)) * direction;
    });

  const handleMemberSort = (field: keyof Member) => {
    if (memberSortField === field) {
      setMemberSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setMemberSortField(field);
    setMemberSortDirection('desc');
  };

  const openPointsModal = () => {
    setPointsModalTab('scoring');
    setShowPointsModal(true);
  };

  const openSelectedBadge = (badge: BadgeDefinition) => {
    if (badgeCloseTimeoutRef.current) {
      window.clearTimeout(badgeCloseTimeoutRef.current);
      badgeCloseTimeoutRef.current = null;
    }

    setIsBadgeDetailClosing(false);
    setSelectedBadge(badge);
  };

  const closeSelectedBadge = useCallback(() => {
    if (!selectedBadge || isBadgeDetailClosing) return;

    setIsBadgeDetailClosing(true);

    if (badgeCloseTimeoutRef.current) {
      window.clearTimeout(badgeCloseTimeoutRef.current);
    }

    badgeCloseTimeoutRef.current = window.setTimeout(() => {
      setSelectedBadge(null);
      setIsBadgeDetailClosing(false);
      badgeCloseTimeoutRef.current = null;
    }, 220);
  }, [isBadgeDetailClosing, selectedBadge]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSelectedBadge();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeSelectedBadge]);

  useEffect(() => {
    return () => {
      if (badgeCloseTimeoutRef.current) {
        window.clearTimeout(badgeCloseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <section className="performance-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Welcome Back!</span>
          <div className="performance-hero-headline">
            <h2>
              <span>Dulain</span>
              <span>Gunawardhana</span>
            </h2>
            <div className="performance-hero-badges" aria-label="Earned badges">
              {earnedBadges.slice(0, 3).map((badge) => (
                <img key={badge.name} src={badge.image} alt={`${badge.name} badge`} title={badge.name} />
              ))}
            </div>
          </div>
          <div className="performance-pathway-meta">
            <span>Pathway: <strong>{PATHWAY_NAME}</strong></span>
            <span>Level: <strong>{getCurrentLevel(pathwayLevels).level} of 5</strong></span>
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
              <h3>{PATHWAY_NAME}</h3>
            </div>
            <div className="performance-percent">
              <strong>{getOverallPercent(pathwayLevels)}%</strong>
              <span>Overall</span>
            </div>
          </div>

          <div className="performance-levels">
            {pathwayLevelStepper.map((item) => (
              <div key={item.level} className={`performance-level is-${item.status}`}>
                <span>{item.level}</span>
                <i />
              </div>
            ))}
          </div>

          <div className="performance-projects">
            <span className="performance-projects-title">Level {getCurrentLevel(pathwayLevels).level} Projects</span>
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
          <div className="performance-badges-footer">
            <Link to="/member/pathways">View Pathways <ChevronRight size={20} /></Link>
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

      <div className="performance-achievement-badges">
        <BadgeGridSection onBadgeClick={openSelectedBadge} />
      </div>

      <div className="performance-member-performance">
        <MemberPerformanceSection
          members={visibleMembers}
          searchTerm={memberSearchTerm}
          onSearchChange={setMemberSearchTerm}
          sortField={memberSortField}
          sortDirection={memberSortDirection}
          onSort={handleMemberSort}
          onMemberSelect={() => undefined}
          onOpenPointsModal={openPointsModal}
          variant="performance-dashboard"
          totalMemberCount={32}
        />
      </div>

      <BadgeDetailOverlay badge={selectedBadge} isClosing={isBadgeDetailClosing} onClose={closeSelectedBadge} />
      <PointsModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        pointsModalTab={pointsModalTab}
        onTabChange={setPointsModalTab}
        selectedCalculatorBadgeId={selectedCalculatorBadgeId}
        onCalculatorBadgeChange={setSelectedCalculatorBadgeId}
        variant="performance-dashboard"
      />
    </>
  );
}
