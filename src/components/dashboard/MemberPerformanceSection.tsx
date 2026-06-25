import { ChevronDown, ChevronUp, Lightbulb, Search } from 'lucide-react';
import { getMetricValueClass, MEMBER_METRICS, TABLE_METRICS } from '../../config/memberMetrics';
import type { Member } from '../../types/member';
import MemberGrowthProgress from './MemberGrowthProgress';

type MemberPerformanceSectionProps = {
  members: Member[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: keyof Member;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Member) => void;
  onMemberSelect: (member: Member) => void;
  onOpenPointsModal: () => void;
};

const cellClass =
  "font-['MyriadPro-Semibold',Arial,sans-serif] text-base font-semibold text-slate-800";

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: keyof Member;
  sortField: keyof Member;
  sortDirection: 'asc' | 'desc';
}) {
  if (sortField !== field) return null;
  return sortDirection === 'desc' ? (
    <ChevronDown size={16} className="inline ml-1" />
  ) : (
    <ChevronUp size={16} className="inline ml-1" />
  );
}

function MeetingRoleTags({ roles, variant }: { roles: string[]; variant: 'mobile' | 'desktop' }) {
  if (roles.length === 0) return null;

  const mobile = variant === 'mobile';

  return (
    <div className={mobile ? 'mt-4 flex flex-wrap gap-2' : 'mt-2 flex flex-wrap gap-1 text-xs text-slate-500'}>
      {roles.slice(0, 3).map((role, index) => (
        <span
          key={index}
          className={
            mobile
              ? 'rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/15'
              : 'rounded-full bg-toastmasters-navy/10 px-2 py-0.5 text-[0.68rem] font-medium text-toastmasters-navy'
          }
        >
          {role}
        </span>
      ))}
      {roles.length > 3 && (
        <span
          className={
            mobile
              ? 'rounded-full bg-toastmasters-maroon px-2.5 py-1 text-xs font-semibold text-white'
              : 'rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] font-medium text-slate-600'
          }
        >
          {mobile ? `+${roles.length - 3} more` : `+${roles.length - 3}`}
        </span>
      )}
    </div>
  );
}

export default function MemberPerformanceSection({
  members,
  searchTerm,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
  onMemberSelect,
  onOpenPointsModal,
}: MemberPerformanceSectionProps) {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-['GothamCondensed-Bold',sans-serif] text-[2.8rem] uppercase italic leading-none tracking-[0.04em] text-toastmasters-navy sm:text-[3.4rem]">
          Member Performance
        </h2>
        <p className="mx-auto mt-4 max-w-4xl text-base font-medium leading-7 text-black sm:text-lg">
          Review individual progress across education, roles, visits, contests, and total points.
          <br />
          Select a member to open the detailed profile.
        </p>

        <div className="mx-auto mt-7 flex w-full max-w-5xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onOpenPointsModal}
            className="group flex h-14 w-14 shrink-0 items-center justify-start overflow-hidden rounded-full border border-toastmasters-gold/40 bg-white/95 px-4 text-toastmasters-navy shadow-[0_14px_35px_rgba(15,29,56,0.1)] ring-1 ring-white/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[15.5rem] hover:border-toastmasters-gold hover:bg-[#fff8e1] hover:shadow-[0_18px_42px_rgba(197,160,71,0.2)] focus:w-[15.5rem] focus:border-toastmasters-gold focus:bg-[#fff8e1] focus:outline-none focus:ring-4 focus:ring-toastmasters-gold/20"
          >
            <Lightbulb
              size={22}
              strokeWidth={2.2}
              className="shrink-0 text-toastmasters-gold-dark transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-focus:scale-110"
            />
            <span className="ml-0 max-w-0 whitespace-nowrap text-sm font-bold text-toastmasters-navy opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-3 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus:ml-3 group-focus:max-w-[12rem] group-focus:opacity-100">
              How are points calculated?
            </span>
          </button>

          <div className="relative w-full sm:max-w-[31rem]">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={22}
              strokeWidth={2.1}
            />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-14 w-full rounded-full border border-slate-300/80 bg-white/95 pl-14 pr-6 text-base font-medium text-slate-900 shadow-[0_14px_35px_rgba(15,29,56,0.08)] outline-none ring-1 ring-white/70 transition duration-300 placeholder:text-slate-400 focus:border-toastmasters-gold focus:shadow-[0_18px_42px_rgba(26,47,90,0.12)] focus:ring-4 focus:ring-toastmasters-gold/20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:justify-start">
            <span>{members.length} visible</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span>Click row for details</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-[#eef2f6] p-4 sm:hidden">
        {members.map((member, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/90 shadow-[0_16px_36px_rgba(15,29,56,0.08)] backdrop-blur-sm"
          >
            <button type="button" className="w-full text-left" onClick={() => onMemberSelect(member)}>
              <div className="border-b border-white/10 bg-[linear-gradient(135deg,#153159_0%,#21416f_58%,#2d4a7c_100%)] p-4 text-white">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-toastmasters-gold text-sm font-bold text-toastmasters-navy shadow-md">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-lg font-bold leading-snug">{member.name}</h3>
                    <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-toastmasters-gold-light">
                      Member Progress
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-toastmasters-gold ring-1 ring-white/15">
                    {member.ajScore}
                  </span>
                </div>
                <MeetingRoleTags roles={member.meetingRoles} variant="mobile" />
              </div>

              <div className="border-b border-slate-200 bg-white px-4 py-4">
                <MemberGrowthProgress totalPoints={member.ajScore} />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-4">
                {MEMBER_METRICS.map((metric) => (
                  <div
                    key={metric.field}
                    className={`rounded-xl border p-3 ${
                      metric.tone === 'score'
                        ? 'border-toastmasters-gold/50 bg-[#fff8e1]'
                        : 'border-slate-200/70 bg-slate-50/90'
                    }`}
                  >
                    <p className="min-h-[2.25rem] text-[0.68rem] font-bold uppercase leading-4 tracking-[0.08em] text-slate-500">
                      {metric.label}
                    </p>
                    <span
                      className={`mt-2 inline-flex min-w-9 items-center justify-center rounded-full px-3 py-1 text-sm font-bold ${getMetricValueClass(
                        metric.tone
                      )}`}
                    >
                      {member[metric.field] as number}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          </article>
        ))}
      </div>

      <div className="relative left-1/2 mt-6 hidden w-screen -translate-x-1/2 px-4 sm:block sm:px-6 lg:px-10">
        <div className="member-table-scroll max-h-[62rem] overflow-x-hidden overflow-y-auto rounded-[1.25rem]">
          <table className="w-full table-fixed">
            <thead className="bg-slate-900">
              <tr>
                <th
                  className="sticky left-0 top-0 z-40 w-[18%] cursor-pointer bg-slate-900 px-4 py-3.5 text-left text-[0.68rem] font-bold uppercase leading-tight tracking-[0.1em] text-slate-200 shadow-[8px_0_18px_rgba(15,29,56,0.18)]"
                  onClick={() => onSort('name')}
                >
                  Name <SortIcon field="name" sortField={sortField} sortDirection={sortDirection} />
                </th>
                {TABLE_METRICS.filter((metric) => metric.field !== 'ajScore').map((metric) => (
                  <th
                    key={metric.field}
                    className="sticky top-0 z-30 cursor-pointer bg-slate-900 px-3 py-3.5 text-center text-[0.66rem] font-bold uppercase leading-tight tracking-[0.09em] text-slate-200"
                    onClick={() => onSort(metric.field)}
                  >
                    {metric.shortLabel}{' '}
                    <SortIcon field={metric.field} sortField={sortField} sortDirection={sortDirection} />
                  </th>
                ))}
                <th className="sticky top-0 z-30 w-[16%] bg-slate-900 px-3 py-3.5 text-left text-[0.66rem] font-bold uppercase leading-tight tracking-[0.09em] text-slate-200">
                  Growth Progress
                </th>
                <th
                  className="sticky right-0 top-0 z-40 w-[7%] cursor-pointer bg-slate-900 px-3 py-3.5 text-center text-[0.66rem] font-bold uppercase leading-tight tracking-[0.09em] text-slate-200 shadow-[-8px_0_18px_rgba(15,29,56,0.18)]"
                  onClick={() => onSort('ajScore')}
                >
                  Total <SortIcon field="ajScore" sortField={sortField} sortDirection={sortDirection} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {members.map((member, index) => (
                <tr
                  key={index}
                  className="group cursor-pointer transition-colors hover:bg-[#f8fafc]"
                  tabIndex={0}
                  onClick={() => onMemberSelect(member)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onMemberSelect(member);
                    }
                  }}
                >
                  <td className="sticky left-0 z-20 bg-white px-4 py-3 shadow-[8px_0_18px_rgba(15,29,56,0.05)] transition-colors group-hover:bg-[#f8fafc]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-toastmasters-navy text-xs font-bold text-white shadow-sm">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        className="min-w-0 text-left text-[0.95rem] font-semibold leading-snug text-slate-900 transition hover:text-toastmasters-maroon focus:outline-none focus:ring-2 focus:ring-toastmasters-gold/40"
                        onClick={(event) => {
                          event.stopPropagation();
                          onMemberSelect(member);
                        }}
                      >
                        {member.name}
                      </button>
                    </div>
                    <MeetingRoleTags roles={member.meetingRoles} variant="desktop" />
                  </td>
                  {TABLE_METRICS.filter((metric) => metric.field !== 'ajScore').map((metric) => (
                    <td key={metric.field} className="px-3 py-3 text-center">
                      <span className={cellClass}>{member[metric.field] as number}</span>
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <MemberGrowthProgress totalPoints={member.ajScore} compact />
                  </td>
                  <td className="sticky right-0 z-20 bg-white px-3 py-3 text-center shadow-[-8px_0_18px_rgba(15,29,56,0.05)] transition-colors group-hover:bg-[#f8fafc]">
                    <span className="font-['MyriadPro-Semibold',Arial,sans-serif] text-base font-semibold text-[#781327]">
                      {member.ajScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {members.length === 0 && (
        <div className="p-10 text-center text-slate-500">No members found matching "{searchTerm}"</div>
      )}
    </section>
  );
}
