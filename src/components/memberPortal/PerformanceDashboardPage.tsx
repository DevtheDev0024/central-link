import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { BADGE_CALCULATOR_RULES } from '../../data/badgeCalculatorRules';
import { BADGE_DEFINITIONS } from '../../data/badgeDefinitions';
import type { BadgeDefinition } from '../../types/badges';
import type { PointsModalTab } from '../../types/badges';
import type { Member } from '../../types/member';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useMemberProfile } from '../../hooks/useMemberProfile';
import { getMemberBadges } from '../../utils/badgeLogic';
import { getLeaderboardDisplayMax } from '../../utils/leaderboard';
import { getMemberPaymentSummary } from '../../data/memberPayments';
import type { MemberPortalOutletContext } from './MemberPortalLayout';
import { MEMBER_PORTAL_BASE } from './navItems';
import BadgeDetailOverlay from '../dashboard/BadgeDetailOverlay';
import BadgeGridSection from '../dashboard/BadgeGridSection';
import MemberPerformanceSection from '../dashboard/MemberPerformanceSection';
import PointsModal from '../dashboard/PointsModal';

type MemberActivity = {
  title: string;
  // Date and club, e.g. "June 20 • ESU TMC".
  detail: string;
  // Points gained from the activity, e.g. "+18 pts".
  points: string;
};

// No activity data source exists yet (no admin/entry point to record them).
// The future activity system will populate this per member; kept typed so the
// card below renders real items and their points as soon as data is available.
const recentActivities: MemberActivity[] = [];

// Membership number is the shared key between Firestore accounts and the
// spreadsheet. Normalise both sides (strip whitespace, upper-case) so formats
// like "PN-67632735" / "pn-67632735" compare equal.
function normalizeMembershipNumber(value: string | undefined | null): string {
  return (value ?? '').replace(/\s+/g, '').toUpperCase();
}

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
  const { programKey } = useOutletContext<MemberPortalOutletContext>();
  const { members: clubMembers } = useDashboardData(programKey);
  const { displayName, email, membershipNumber } = useMemberProfile();

  // The signed-in member's row in the selected programme sheet. Membership
  // number is the canonical key: match on it first, then fall back to a name
  // match so members without a membership number on either side still resolve
  // (the spreadsheet ID columns are being populated incrementally).
  const currentMember = useMemo(() => {
    const targetId = normalizeMembershipNumber(membershipNumber);
    if (targetId) {
      const byId = clubMembers.find(
        (member) => normalizeMembershipNumber(member.membershipNumber) === targetId,
      );
      if (byId) return byId;
    }

    const targetName = displayName.trim().toLowerCase();
    if (!targetName) return null;
    return clubMembers.find((member) => member.name.trim().toLowerCase() === targetName) ?? null;
  }, [clubMembers, membershipNumber, displayName]);

  // Per-member cards fall back to the UI-development placeholders until a
  // matching member exists in the sheet. Fields without a sheet column
  // (speeches, meetings attended, week streak, pathway, level) stay as stubs.
  const heroName = displayName.trim() || 'Member';
  const heroPoints = currentMember ? currentMember.totalPoints.toLocaleString() : '312';
  const metrics = [
    { label: 'Speeches Delivered', value: '-', note: '-' },
    { label: 'Roles Taken', value: '-', note: '-' },
    { label: 'Meetings Attended', value: '-', note: '-' },
    { label: 'Member Points', value: '-', note: '-' },
  ];

  // Earned badges are derived from the member's points via the same benchmark
  // rules the old dashboard uses (getMemberBadges -> getScore >= benchmark).
  const earnedBadges = useMemo(
    () =>
      (currentMember ? getMemberBadges(currentMember).earned : []).map((badge) => ({
        name: badge.name,
        image: badge.imageSrc,
      })),
    [currentMember],
  );
  const badgeRows = groupBadges(earnedBadges);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [isBadgeDetailClosing, setIsBadgeDetailClosing] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberSortField, setMemberSortField] = useState<keyof Member>('ajScore');
  const [memberSortDirection, setMemberSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState(BADGE_CALCULATOR_RULES[0].id);
  const [leaderboardAnimationProgress, setLeaderboardAnimationProgress] = useState(0);
  const [hasAnimatedLeaderboard, setHasAnimatedLeaderboard] = useState(false);
  const badgeCloseTimeoutRef = useRef<number | null>(null);
  const leaderboardCardRef = useRef<HTMLElement | null>(null);
  const paymentSummary = useMemo(() => getMemberPaymentSummary(email), [email]);
  const topPerformers = useMemo(() => {
    return [...clubMembers].sort((first, second) => second.ajScore - first.ajScore).slice(0, 5);
  }, [clubMembers]);
  const leaderboardDisplayMax = useMemo(
    () => getLeaderboardDisplayMax(topPerformers.map((member) => member.ajScore)),
    [topPerformers],
  );

  const visibleMembers = clubMembers
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

  useEffect(() => {
    const leaderboardCard = leaderboardCardRef.current;
    if (!leaderboardCard || hasAnimatedLeaderboard) return;

    let animationFrame = 0;
    let observer: IntersectionObserver | null = null;

    const animateLeaderboard = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        setLeaderboardAnimationProgress(1);
        setHasAnimatedLeaderboard(true);
        return;
      }

      const duration = 950;
      const startTime = performance.now();

      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setLeaderboardAnimationProgress(easedProgress);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
          return;
        }

        setHasAnimatedLeaderboard(true);
      };

      setLeaderboardAnimationProgress(0);
      animationFrame = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      animateLeaderboard();
      return () => cancelAnimationFrame(animationFrame);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        observer?.disconnect();
        observer = null;
        animateLeaderboard();
      },
      { threshold: 0.35 },
    );

    observer.observe(leaderboardCard);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [hasAnimatedLeaderboard]);

  return (
    <>
      <section className="performance-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Welcome Back!</span>
          <div className="performance-hero-headline">
            <h2>
              {heroName.split(/\s+/).map((part, index) => (
                <span key={`${part}-${index}`}>{part}</span>
              ))}
            </h2>
            {earnedBadges.length > 0 ? (
              <div className="performance-hero-badges" aria-label="Earned badges">
                {earnedBadges.slice(0, 3).map((badge) => (
                  <img key={badge.name} src={badge.image} alt={`${badge.name} badge`} title={badge.name} />
                ))}
              </div>
            ) : null}
          </div>
          <div className="performance-pathway-meta">
            <span>Pathway: <strong>Presentation Mastery</strong></span>
            <span>Level: <strong>3 of 5</strong></span>
          </div>
        </div>

        <div className="performance-hero-score">
          <div>
            <strong>{heroPoints}</strong>
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
        <article className="performance-card performance-activity-card">
          <div className="performance-activity-heading">
            <span className="performance-eyebrow">Latest Updates</span>
            <h3>Recent Activity</h3>
          </div>
          <div className="performance-activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map(({ title, detail, points }) => (
                <div key={title} className="performance-activity-item">
                  <div><strong>{title}</strong><span>{detail}</span></div>
                  <b>{points}</b>
                </div>
              ))
            ) : (
              <p className="performance-activity-empty">No recent activity</p>
            )}
          </div>
        </article>

        <article className="performance-card performance-fees-card">
          <span className="performance-eyebrow">Monthly Fee Dues</span>
          <p>Paid Through</p>
          {paymentSummary ? (
            <h3>{paymentSummary.paidThrough}</h3>
          ) : (
            <span className="performance-fees-unavailable performance-fees-paid-through-empty">
              Payment data not availble
            </span>
          )}
          <div className="performance-fees-details">
            <div>
              <span>Next Billing</span>
              {paymentSummary ? (
                <strong>{paymentSummary.nextBilling}</strong>
              ) : (
                <strong className="performance-fees-unavailable performance-fees-detail-empty">
                  Payment data not availble
                </strong>
              )}
            </div>
            <div><span>Amount</span><strong>{paymentSummary?.amountLabel ?? 'LKR 500'}</strong></div>
          </div>
          <Link to={`${MEMBER_PORTAL_BASE}/monthly-fee-portal`} className="performance-fees-action">
            Open Payment Portal
          </Link>
        </article>

        <article className="performance-card performance-badges-card">
          <div className="performance-badges-heading">
            <div>
              <span>{heroName}</span>
              <h3>Earned Badges</h3>
            </div>
            <div className="performance-badges-count">
              <strong>{earnedBadges.length}</strong>
              <span>of {BADGE_DEFINITIONS.length}</span>
            </div>
          </div>
          <div className="performance-earned-badges" aria-label="Earned badges">
            {earnedBadges.length > 0 ? (
              badgeRows.map((row, rowIndex) => (
                <div key={rowIndex} className="performance-earned-badges-row">
                  {row.map((badge) => (
                    <img key={badge.name} src={badge.image} alt={`${badge.name} badge`} title={badge.name} />
                  ))}
                </div>
              ))
            ) : (
              <p className="performance-earned-badges-empty">No badges earned</p>
            )}
          </div>
          <div className="performance-badges-footer">
            <button type="button">View All <ChevronRight size={20} /></button>
          </div>
        </article>

        <article ref={leaderboardCardRef} className="performance-card performance-leaderboard-card">
          <div className="performance-leaderboard-heading">
            <span className="performance-eyebrow">Leaderboard</span>
            <h3>Top 5 Performers</h3>
          </div>
          <div className="performance-leaderboard-list">
            {topPerformers.map((member, index) => (
              <div key={member.name} className="performance-leaderboard-item">
                <span className="performance-leaderboard-rank">{index + 1}</span>
                <div className="performance-leaderboard-member">
                  <strong>{member.name}</strong>
                  <div className="performance-leaderboard-track">
                    <span
                      style={{
                        '--leaderboard-width': `${(member.ajScore / leaderboardDisplayMax) * 100 * leaderboardAnimationProgress}%`,
                      } as CSSProperties}
                    >
                      {Math.round(member.ajScore * leaderboardAnimationProgress).toLocaleString()}
                    </span>
                  </div>
                </div>
                <b>{member.ajScore}</b>
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
          rankingMembers={clubMembers}
          searchTerm={memberSearchTerm}
          onSearchChange={setMemberSearchTerm}
          sortField={memberSortField}
          sortDirection={memberSortDirection}
          onSort={handleMemberSort}
          onMemberSelect={() => undefined}
          onOpenPointsModal={openPointsModal}
          variant="performance-dashboard"
          totalMemberCount={clubMembers.length}
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
