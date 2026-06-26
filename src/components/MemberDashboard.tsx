import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BADGE_CALCULATOR_RULES } from '../data/badgeCalculatorRules';
import type { BadgeDefinition, PointsModalTab } from '../types/badges';
import type { DashboardSource } from '../types/dashboard';
import type { Member } from '../types/member';
import AnimatedMetricCard from './dashboard/AnimatedMetricCard';
import BadgeDetailOverlay from './dashboard/BadgeDetailOverlay';
import BadgeGridSection from './dashboard/BadgeGridSection';
import DashboardFooter from './dashboard/DashboardFooter';
import DashboardHeader from './dashboard/DashboardHeader';
import MemberDetailModal from './dashboard/MemberDetailModal';
import MemberPerformanceSection from './dashboard/MemberPerformanceSection';
import PointsModal from './dashboard/PointsModal';
import TopPerformersSection from './dashboard/TopPerformersSection';

export type { Member } from '../types/member';

type MemberDashboardProps = {
  dashboardSource: DashboardSource;
  members: Member[];
  refreshing: boolean;
  lastUpdated: string;
  onRefresh: () => void;
  onChangeDashboardYear: () => void;
};

export default function MemberDashboard({
  dashboardSource,
  members,
  refreshing,
  lastUpdated,
  onRefresh,
  onChangeDashboardYear,
}: MemberDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Member>('ajScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [isBadgeDetailClosing, setIsBadgeDetailClosing] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState(BADGE_CALCULATOR_RULES[0].id);
  const badgeCloseTimeoutRef = useRef<number | null>(null);

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
        setSelectedMember(null);
        closeSelectedBadge();
        setShowPointsModal(false);
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

  const stats = useMemo(() => {
    const totalMembers = members.length;
    const totalPoints = members.reduce((acc, m) => acc + m.totalPoints, 0);
    const averagePoints = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0;
    const totalRoles = members.reduce((acc, m) => acc + m.meetingRoles.length, 0);

    return { totalMembers, totalPoints, averagePoints, totalRoles };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const modifier = sortDirection === 'desc' ? -1 : 1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * modifier;
        }
        return 0;
      });
  }, [members, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Member) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const openPointsModal = () => {
    setPointsModalTab('scoring');
    setShowPointsModal(true);
  };

  return (
    <div className="min-h-screen animate-fade-in bg-[linear-gradient(180deg,#eef2f6_0%,#e8edf3_38%,#f4f7fa_100%)] text-slate-900">
      <DashboardHeader
        dashboardSource={dashboardSource}
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onChangeDashboardYear={onChangeDashboardYear}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-x-0 gap-y-6 xl:grid-cols-4 xl:gap-x-1 xl:gap-y-0">
          <AnimatedMetricCard label="Total Members" value={stats.totalMembers} animationKey={lastUpdated} tone="navy" />
          <AnimatedMetricCard label="Total Points" value={stats.totalPoints} animationKey={lastUpdated} tone="gold" />
          <AnimatedMetricCard
            label="Average Points"
            value={stats.averagePoints}
            animationKey={lastUpdated}
            tone="maroon"
          />
          <AnimatedMetricCard label="Meeting Roles" value={stats.totalRoles} animationKey={lastUpdated} tone="blue" />
        </section>

        <TopPerformersSection members={members} lastUpdated={lastUpdated} />

        <BadgeGridSection onBadgeClick={openSelectedBadge} />

        <MemberPerformanceSection
          members={filteredMembers}
          rankingMembers={members}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onMemberSelect={setSelectedMember}
          onOpenPointsModal={openPointsModal}
        />

        <DashboardFooter />
      </main>

      <PointsModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        pointsModalTab={pointsModalTab}
        onTabChange={setPointsModalTab}
        selectedCalculatorBadgeId={selectedCalculatorBadgeId}
        onCalculatorBadgeChange={setSelectedCalculatorBadgeId}
      />

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onBadgeClick={openSelectedBadge}
      />

      <BadgeDetailOverlay badge={selectedBadge} isClosing={isBadgeDetailClosing} onClose={closeSelectedBadge} />
    </div>
  );
}
