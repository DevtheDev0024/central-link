import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import {
  PATHWAYS_CATALOG_INTRO,
  PATHWAYS_POINTS_SUMMARY,
  pathwayCatalog,
  type PathwayCatalogEntry,
} from '../../data/pathwaysCatalogData';
import {
  getPathwayProjectCounts,
  pathwayLevelsById,
  type PathwayLevelCatalogEntry,
} from '../../data/pathwayLevelsCatalogData';
import PointsModal from '../dashboard/PointsModal';
import type { PointsModalTab } from '../../types/badges';

function PathwayAvailabilityBadge({ availability }: { availability: PathwayCatalogEntry['availability'] }) {
  return (
    <span className={`performance-pathway-availability is-${availability}`}>
      {availability === 'current' ? 'Current' : 'Legacy'}
    </span>
  );
}

function formatLevelProjectCount(level: PathwayLevelCatalogEntry): string {
  const total = level.requiredCount + level.electiveMin;
  if (level.electiveMin === 0) {
    return `${total} project${total === 1 ? '' : 's'}`;
  }

  return `${total} min (${level.requiredCount} required + ${level.electiveMin} elective${level.electiveMin === 1 ? '' : 's'})`;
}

function PathwayLevelRow({ level }: { level: PathwayLevelCatalogEntry }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`performance-pathway-level-row${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="performance-pathway-level-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="performance-pathway-level-badge">L{level.level}</span>
        <span className="performance-pathway-level-copy">
          <strong>{level.title}</strong>
          <span>{formatLevelProjectCount(level)}</span>
        </span>
        <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" className="performance-pathway-level-chevron" />
      </button>

      {isOpen ? (
        <div className="performance-pathway-level-projects">
          <span className="performance-meeting-role-section-title">Required projects</span>
          <ul>
            {level.requiredProjects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>
          {level.electiveMin > 0 ? (
            <p className="performance-pathway-level-elective-note">
              Plus at least {level.electiveMin} elective project{level.electiveMin === 1 ? '' : 's'} from the Level{' '}
              {level.level} elective list in Base Camp.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PathwayCatalogCard({ pathway }: { pathway: PathwayCatalogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const levels = pathwayLevelsById[pathway.id] ?? [];
  const { totalMin } = getPathwayProjectCounts(levels);

  return (
    <article className={`performance-card performance-pathway-catalog-card${isExpanded ? ' is-expanded' : ''}`}>
      <button
        type="button"
        className="performance-pathway-catalog-header performance-pathway-catalog-toggle"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((open) => !open)}
      >
        <div className="performance-pathway-logo-wrap">
          <img src={pathway.logoSrc} alt={pathway.name} className="performance-pathway-logo" />
        </div>
        <div className="performance-pathway-catalog-heading-copy">
          <h3>{pathway.name}</h3>
          <p className="performance-pathway-catalog-stats">
            5 levels · {totalMin} projects
          </p>
        </div>
        <PathwayAvailabilityBadge availability={pathway.availability} />
        <ChevronDown
          size={20}
          strokeWidth={2.2}
          aria-hidden="true"
          className="performance-pathway-catalog-chevron"
        />
      </button>

      <div className="performance-pathway-catalog-content">
        <p className="performance-pathway-catalog-summary">{pathway.summary}</p>

        <div className="performance-pathway-catalog-meta">
          <span className="performance-meeting-role-section-title">Core focus</span>
          <ul className="performance-pathway-competencies">
            {pathway.competencies.map((competency) => (
              <li key={competency}>{competency}</li>
            ))}
          </ul>
          <a href={pathway.resourceUrl} target="_blank" rel="noopener noreferrer">
            View path details
            <ExternalLink size={14} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </div>

      {isExpanded ? (
        <div className="performance-pathway-catalog-levels">
          <span className="performance-meeting-role-section-title">Levels and projects</span>
          <div className="performance-pathway-level-list">
            {levels.map((level) => (
              <PathwayLevelRow key={level.level} level={level} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function PathwaysPage() {
  const currentPathways = pathwayCatalog.filter((pathway) => pathway.availability === 'current').length;

  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsModalTab, setPointsModalTab] = useState<PointsModalTab>('scoring');
  const [selectedCalculatorBadgeId, setSelectedCalculatorBadgeId] = useState('pathways-achiever');

  const openPointsModal = () => {
    setPointsModalTab('scoring');
    setShowPointsModal(true);
  };

  return (
    <>
      <section className="performance-card performance-pathways-intro">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Education program</span>
            <h3>Choose your path</h3>
          </div>
        </div>
        <p>{PATHWAYS_CATALOG_INTRO.summary}</p>
        <div className="performance-pathways-intro-links">
          <a href={PATHWAYS_CATALOG_INTRO.pathsAndProjectsUrl} target="_blank" rel="noopener noreferrer">
            Paths and Projects
            <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <a href={PATHWAYS_CATALOG_INTRO.choosePathUrl} target="_blank" rel="noopener noreferrer">
            Choose a path in Base Camp
            <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="performance-card performance-pathways-scoring-card">
        <div className="performance-card-heading">
          <div>
            <span className="performance-eyebrow">Club scoring</span>
            <h3>Pathways points</h3>
          </div>
        </div>
        <p>Pathways progress earns club points toward badges like Pathways Achiever and Learning Enthusiast.</p>
        <div className="performance-meeting-roles-points-grid performance-pathways-points-grid">
          {PATHWAYS_POINTS_SUMMARY.map(({ label, points }) => (
            <div key={label} className="performance-meeting-roles-points-item">
              <span>{label}</span>
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

      <section className="performance-pathways-catalog" aria-label="All Toastmasters paths">
        <div className="performance-section-heading performance-pathways-catalog-heading">
          <span className="performance-eyebrow">Quick reference</span>
          <div className="performance-pathways-catalog-heading-row">
            <h3>All {pathwayCatalog.length} paths</h3>
            <ul className="performance-pathways-catalog-stats">
              <li>
                <strong>{currentPathways}</strong>
                <span>current paths</span>
              </li>
              <li>
                <strong>5</strong>
                <span>levels each</span>
              </li>
              <li>
                <strong>15</strong>
                <span>projects each</span>
              </li>
            </ul>
          </div>
          <p className="performance-pathways-catalog-note">
            New members choose from the 6 current paths only. Legacy paths are not available for new enrollments but
            remain open if you were already on one. Click a path to see its levels and projects.
          </p>
        </div>
        <div className="performance-pathways-catalog-cards">
          {pathwayCatalog.map((pathway) => (
            <PathwayCatalogCard key={pathway.id} pathway={pathway} />
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
