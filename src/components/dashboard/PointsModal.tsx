import { ChevronDown, X } from 'lucide-react';
import { SCORING_RULES } from '../../data/scoringRules';
import { BADGE_CALCULATOR_RULES } from '../../data/badgeCalculatorRules';
import { getBadgeToneClasses } from '../../utils/badgeLogic';
import type { PointsModalTab } from '../../types/badges';

function renderPerformancePoint(point: string) {
  const compactPoint = point
    .replace(/Judges Training Programmes/g, 'JTP')
    .replace(/New Member Orientations/g, 'NMO')
    .replace(/\bpoints?\b/gi, 'pts')
    .replace(/\.$/, '');
  const emphasisPattern = /(Club level|Area level|Division level|District level|\d+ pts)/g;
  const exactEmphasisPattern = /^(Club level|Area level|Division level|District level|\d+ pts)$/;

  return compactPoint.split(emphasisPattern).map((part, index) =>
    exactEmphasisPattern.test(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function getPerformancePoints(rule: (typeof SCORING_RULES)[number]) {
  if (rule.title === 'Contest Excellence') {
    return [
      ['Club level', 'Winner: 10, 1st Runner-up: 5, 2nd Runner-up: 5'],
      ['Area level', 'Winner: 15, 1st Runner-up: 10, 2nd Runner-up: 5'],
      ['Division level', 'Winner: 20, 1st Runner-up: 15, 2nd Runner-up: 10'],
      ['District level', 'Winner: 30, 1st Runner-up: 25, 2nd Runner-up: 20'],
    ].map(([level, values]) => (
      <p key={level}><strong>{level}:</strong> {values}</p>
    ));
  }

  if (rule.title === 'Meeting Roles') {
    return [
      <>TMOD: <strong>10 pts</strong> · Table Topics Master: <strong>8 pts</strong></>,
      <>General Evaluator: <strong>6 pts</strong></>,
      <>Game Master: <strong>5 pts</strong> · TAG/RRM: <strong>4 pts</strong></>,
    ].map((line, index) => <p key={index}>{line}</p>);
  }

  return rule.points.map((point) => <p key={point}>{renderPerformancePoint(point)}</p>);
}

function PerformanceScoringCard({ rule }: { rule: (typeof SCORING_RULES)[number] }) {
  return (
    <section className="performance-scoring-card">
      <h4>{rule.title}</h4>
      <div className="performance-scoring-points">{getPerformancePoints(rule)}</div>
    </section>
  );
}

type PointsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pointsModalTab: PointsModalTab;
  onTabChange: (tab: PointsModalTab) => void;
  selectedCalculatorBadgeId: string;
  onCalculatorBadgeChange: (id: string) => void;
  variant?: 'default' | 'performance-dashboard';
};

export default function PointsModal({
  isOpen,
  onClose,
  pointsModalTab,
  onTabChange,
  selectedCalculatorBadgeId,
  onCalculatorBadgeChange,
  variant = 'default',
}: PointsModalProps) {
  if (!isOpen) return null;

  const isPerformanceDashboard = variant === 'performance-dashboard';
  const selectedCalculatorBadge =
    BADGE_CALCULATOR_RULES.find((badge) => badge.id === selectedCalculatorBadgeId) ||
    BADGE_CALCULATOR_RULES[0];
  const performanceLeftRules = [
    SCORING_RULES[0],
    SCORING_RULES[1],
    SCORING_RULES[8],
    SCORING_RULES[9],
    SCORING_RULES[10],
    SCORING_RULES[11],
    SCORING_RULES[6],
    SCORING_RULES[7],
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-0 py-0 backdrop-blur-sm animate-fade-in sm:items-center sm:px-4 sm:py-6 ${
        variant === 'performance-dashboard' ? 'performance-points-overlay' : ''
      }`}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-slate-200/80 bg-[#f7f9fb] shadow-[0_30px_90px_rgba(15,29,56,0.35)] animate-slide-up sm:max-w-5xl sm:rounded-[2rem] ${
          variant === 'performance-dashboard' ? 'performance-points-modal' : ''
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="points-modal-header relative border-b border-slate-200/70 bg-[linear-gradient(135deg,#112242_0%,#17335c_55%,#224273_100%)] px-5 py-6 text-white sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/20 transition hover:bg-white/20"
            aria-label="Close points guide"
          >
            <X size={20} />
          </button>
          <div className="pr-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-toastmasters-gold-light">
              Member Performance Guide
            </p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">How Points Are Calculated</h3>
            {!isPerformanceDashboard && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-200">
                Explore how each activity earns points, then use the badge calculator to see what actions help unlock
                each milestone.
              </p>
            )}
          </div>
        </div>

        <div className="points-modal-tabs border-b border-slate-200/70 bg-[#f7f9fb] p-4 sm:px-7">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 ring-1 ring-slate-200/80">
            {[
              { id: 'scoring' as PointsModalTab, label: 'Scoring Guide' },
              { id: 'calculator' as PointsModalTab, label: 'Badge Calculator' },
            ].map((tab) => {
              const isActive = pointsModalTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`points-modal-tab rounded-xl px-3 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-toastmasters-gold/20 ${
                    isActive ? 'is-active ' : ''
                  }${
                    isActive ? 'bg-toastmasters-navy text-white shadow-sm' : 'text-toastmasters-navy hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="points-modal-content overflow-y-auto p-4 sm:p-7">
          {pointsModalTab === 'scoring' ? (
            isPerformanceDashboard ? (
              <div className="performance-scoring-bento">
                <div className="performance-scoring-left">
                  {performanceLeftRules.map((rule) => (
                    <PerformanceScoringCard key={rule.title} rule={rule} />
                  ))}
                  <div className="performance-scoring-meeting-awards">
                    <PerformanceScoringCard rule={SCORING_RULES[2]} />
                  </div>
                </div>

                <div className="performance-scoring-right">
                  <PerformanceScoringCard rule={SCORING_RULES[3]} />
                  <div className="performance-scoring-right-pair">
                    <PerformanceScoringCard rule={SCORING_RULES[4]} />
                    <PerformanceScoringCard rule={SCORING_RULES[5]} />
                  </div>
                  <PerformanceScoringCard rule={SCORING_RULES[12]} />
                  <p className="performance-scoring-quote">
                    “Every point reflects your effort, participation, and growth as a Toastmaster.”
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {SCORING_RULES.map((rule) => {
                  const Icon = rule.icon;
                  const toneClasses = getBadgeToneClasses(rule.tone);

                  return (
                    <section key={rule.title} className={`rounded-[1.25rem] border p-4 shadow-sm ${toneClasses.card}`}>
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneClasses.icon}`}
                        >
                          <Icon size={22} />
                        </div>
                        <h4 className="text-base font-bold text-toastmasters-navy">{rule.title}</h4>
                      </div>
                      <div className="space-y-2">
                        {rule.points.map((point) => (
                          <p
                            key={point}
                            className="rounded-xl bg-white/70 px-3 py-2 text-sm font-medium leading-6 text-slate-700"
                          >
                            {point}
                          </p>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )
          ) : isPerformanceDashboard ? (
            <div className="performance-calculator-stack">
              <section>
                <div className="performance-calculator-heading">
                  <span>Badge Calculator</span>
                  <label>
                    <select
                      value={selectedCalculatorBadgeId}
                      onChange={(event) => onCalculatorBadgeChange(event.target.value)}
                      aria-label="Select a badge"
                    >
                      {BADGE_CALCULATOR_RULES.map((badge) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} />
                  </label>
                </div>
                <dl>
                  <div><dt>Required Points</dt><dd>{selectedCalculatorBadge.requiredPoints}</dd></div>
                  <div><dt>Points per action</dt><dd>{selectedCalculatorBadge.pointsPerAction}</dd></div>
                  <div><dt>Estimated actions needed</dt><dd>{selectedCalculatorBadge.estimatedActions}</dd></div>
                  <div><dt>Example pathway</dt><dd>{selectedCalculatorBadge.examplePathway}</dd></div>
                </dl>
                <p>{selectedCalculatorBadge.message}</p>
              </section>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <section className="rounded-[1.25rem] border border-slate-200/80 bg-white p-4 shadow-sm">
                <label
                  htmlFor="badge-calculator-select"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500"
                >
                  Select a badge
                </label>
                <select
                  id="badge-calculator-select"
                  value={selectedCalculatorBadgeId}
                  onChange={(event) => onCalculatorBadgeChange(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-toastmasters-navy outline-none transition focus:border-toastmasters-gold focus:ring-4 focus:ring-toastmasters-gold/20"
                >
                  {BADGE_CALCULATOR_RULES.map((badge) => (
                    <option key={badge.id} value={badge.id}>
                      {badge.name}
                    </option>
                  ))}
                </select>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Choose a badge to see the required points, the activity that earns those points, and a simple example
                  path to reach it.
                </p>
              </section>

              <section className="rounded-[1.25rem] border border-toastmasters-gold/30 bg-[#fff8e1] p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                      getBadgeToneClasses(selectedCalculatorBadge.tone).icon
                    }`}
                  >
                    <selectedCalculatorBadge.icon size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-toastmasters-gold-dark">
                      Badge Calculator
                    </p>
                    <h4 className="mt-1 text-xl font-bold text-toastmasters-navy">{selectedCalculatorBadge.name}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/85 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Required Points</p>
                    <p className="mt-2 text-sm font-bold text-toastmasters-navy">
                      {selectedCalculatorBadge.requiredPoints}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Points per action</p>
                    <p className="mt-2 text-sm font-bold text-toastmasters-navy">
                      {selectedCalculatorBadge.pointsPerAction}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Estimated actions needed
                    </p>
                    <p className="mt-2 text-sm font-bold text-toastmasters-navy">
                      {selectedCalculatorBadge.estimatedActions}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Example pathway</p>
                    <p className="mt-2 text-sm font-bold text-toastmasters-navy">
                      {selectedCalculatorBadge.examplePathway}
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-2xl border border-toastmasters-gold/30 bg-white p-4 text-sm font-semibold leading-6 text-toastmasters-maroon">
                  {selectedCalculatorBadge.message}
                </p>
              </section>
            </div>
          )}

          {(!isPerformanceDashboard || pointsModalTab === 'calculator') && (
            <p className="points-modal-footer mt-6 rounded-[1.25rem] bg-toastmasters-navy px-4 py-4 text-center text-sm font-semibold leading-6 text-white">
              “Every point reflects your effort, participation, and growth as a Toastmaster.”
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
