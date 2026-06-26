import { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Crown,
  ExternalLink,
  Gamepad2,
  MessageSquareQuote,
  Mic2,
  Sparkles,
  Timer,
  Users,
  Volume2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  MEETING_ROLE_POINTS_SUMMARY,
  MEETING_ROLES_HANDBOOK,
  MEETING_ROLES_INTRO,
  meetingRoles,
  type MeetingRole,
} from '../../data/meetingRolesData';
import PointsModal from '../dashboard/PointsModal';
import type { PointsModalTab } from '../../types/badges';

const roleIcons: Record<string, LucideIcon> = {
  tmod: Crown,
  timer: Timer,
  'ah-counter': Volume2,
  grammarian: BookOpen,
  rrm: Users,
  ttm: Mic2,
  evaluator: MessageSquareQuote,
  'game-master': Gamepad2,
  ge: Sparkles,
};

function RolePointsBadge({ role }: { role: MeetingRole }) {
  if (role.clubPoints) {
    return (
      <div className="performance-meeting-role-points">
        <strong>{role.clubPoints}</strong>
        <span>pts</span>
      </div>
    );
  }

  if (role.pointsNote) {
    return (
      <div className="performance-meeting-role-points is-note">
        <span>{role.pointsNote}</span>
      </div>
    );
  }

  return null;
}

function RoleCard({ role }: { role: MeetingRole }) {
  const Icon = roleIcons[role.id] ?? Mic2;

  return (
    <article className="performance-card performance-meeting-role-card">
      <header className="performance-meeting-role-header">
        <div className="performance-meeting-role-icon" aria-hidden="true">
          <Icon size={24} strokeWidth={2} />
        </div>
        <h3>{role.name}</h3>
        <RolePointsBadge role={role} />
      </header>

      <div className="performance-meeting-role-content">
        <p className="performance-meeting-role-description">{role.summary}</p>

        {role.resources.length > 0 ? (
          <div className="performance-meeting-role-resources">
            <span className="performance-meeting-role-section-title">Resources</span>
            <ul>
              {role.resources.map((resource) => (
                <li key={resource.url}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.label}
                    <ExternalLink size={14} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function MeetingRolesPage() {
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState('role-champion');

  const openPointsModal = () => {
    setPointsModalTab('scoring');
    setShowPointsModal(true);
  };

  return (
    <>
      <section className="performance-hero performance-meeting-roles-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Role Player Guide</span>
          <div className="performance-hero-headline">
            <h2>
              <span>{MEETING_ROLES_INTRO.title}</span>
            </h2>
          </div>
        </div>

        <div className="performance-hero-score">
          <div>
            <strong>{meetingRoles.length}</strong>
            <span>Key Roles</span>
          </div>
          <div>
            <strong>10</strong>
            <span>Max pts</span>
          </div>
        </div>
      </section>

      <section className="performance-card performance-meeting-roles-intro">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Reference</span>
            <h3>Before you sign up</h3>
          </div>
        </div>
        <p>{MEETING_ROLES_INTRO.summary}</p>
        <a
          className="performance-meeting-roles-handbook-link"
          href={MEETING_ROLES_HANDBOOK.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {MEETING_ROLES_HANDBOOK.label}
          <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </section>

      <section className="performance-card performance-meeting-roles-points-card">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Club scoring</span>
            <h3>Role points</h3>
          </div>
        </div>
        <p>Meeting roles earn club points that count toward badges like Role Champion.</p>
        <div className="performance-meeting-roles-points-grid">
          {MEETING_ROLE_POINTS_SUMMARY.map(({ role, points }) => (
            <div key={role} className="performance-meeting-roles-points-item">
              <span>{role}</span>
              <div className="performance-meeting-role-points">
                <strong>{points}</strong>
                <span>pts</span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="performance-meeting-roles-points-button" onClick={openPointsModal}>
          How Points Work <ChevronRight size={18} />
        </button>
      </section>

      <section className="performance-meeting-roles-grid" aria-label="Meeting role guides">
        <div className="performance-section-heading performance-meeting-roles-heading">
          <div>
            <span className="performance-eyebrow">Quick reference</span>
            <h3>Every role explained</h3>
          </div>
        </div>
        <div className="performance-meeting-roles-cards">
          {meetingRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </section>

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
