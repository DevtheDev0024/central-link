import { useState } from 'react';
import {
  ChevronRight,
  Crown,
  ExternalLink,
  FileText,
  GraduationCap,
  History,
  Megaphone,
  Shield,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  EXCO_HANDBOOK,
  EXCO_LEADERSHIP_POINTS_SUMMARY,
  EXCO_ROLES_INTRO,
  excoRoles,
  type ExcoRole,
} from '../../data/excoRolesData';
import PointsModal from '../dashboard/PointsModal';
import type { PointsModalTab } from '../../types/badges';

const roleIcons: Record<string, LucideIcon> = {
  president: Crown,
  vpe: GraduationCap,
  vpm: UserPlus,
  vppr: Megaphone,
  secretary: FileText,
  treasurer: Wallet,
  saa: Shield,
  ipp: History,
};

function RolePointsBadge({ role }: { role: ExcoRole }) {
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

function ExcoRoleCard({ role }: { role: ExcoRole }) {
  const Icon = roleIcons[role.id] ?? Users;

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

export default function ExcoRolesPage() {
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState('leadership-contributor');

  const openPointsModal = () => {
    setPointsModalTab('scoring');
    setShowPointsModal(true);
  };

  return (
    <>
      <section className="performance-hero performance-meeting-roles-hero">
        <div className="performance-hero-copy">
          <span className="performance-welcome">Club Leadership</span>
          <div className="performance-hero-headline">
            <h2>
              <span>{EXCO_ROLES_INTRO.title}</span>
            </h2>
          </div>
        </div>

        <div className="performance-hero-score">
          <div>
            <strong>{excoRoles.length}</strong>
            <span>Exco Roles</span>
          </div>
          <div>
            <strong>30</strong>
            <span>Officer pts</span>
          </div>
        </div>
      </section>

      <section className="performance-card performance-meeting-roles-intro">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Reference</span>
            <h3>Before you serve</h3>
          </div>
        </div>
        <p>{EXCO_ROLES_INTRO.summary}</p>
        <a
          className="performance-meeting-roles-handbook-link"
          href={EXCO_HANDBOOK.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {EXCO_HANDBOOK.label}
          <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </section>

      <section className="performance-card performance-meeting-roles-points-card">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Club scoring</span>
            <h3>Leadership points</h3>
          </div>
        </div>
        <p>Exco and shadow team service earn club points toward badges like Leadership Contributor.</p>
        <div className="performance-exco-roles-points-grid">
          {EXCO_LEADERSHIP_POINTS_SUMMARY.map(({ role, points }) => (
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

      <section className="performance-meeting-roles-grid" aria-label="Exco role guides">
        <div className="performance-section-heading performance-meeting-roles-heading">
          <div>
            <span className="performance-eyebrow">Quick reference</span>
            <h3>Every exco role explained</h3>
          </div>
        </div>
        <div className="performance-meeting-roles-cards">
          {excoRoles.map((role) => (
            <ExcoRoleCard key={role.id} role={role} />
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
