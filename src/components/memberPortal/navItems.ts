import {
  Award,
  Gauge,
  HandCoins,
  Mic,
  Network,
  Route,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface MemberPortalNavItem {
  label: string;
  icon: LucideIcon;
  /** Absolute route path used for navigation. */
  path: string;
  /** Path segment relative to /member-portal ('' for the index route). */
  slug: string;
  /** True for the index route so its NavLink only matches exactly. */
  end?: boolean;
}

export const MEMBER_PORTAL_BASE = '/member-portal';

export const memberPortalNav: MemberPortalNavItem[] = [
  { label: 'Performance Dashboard', icon: Gauge, path: MEMBER_PORTAL_BASE, slug: '', end: true },
  { label: 'Meeting Roles', icon: Mic, path: `${MEMBER_PORTAL_BASE}/meeting-roles`, slug: 'meeting-roles' },
  { label: 'Pathways', icon: Route, path: `${MEMBER_PORTAL_BASE}/pathways`, slug: 'pathways' },
  {
    label: 'Educational Achievements',
    icon: Award,
    path: `${MEMBER_PORTAL_BASE}/educational-achievements`,
    slug: 'educational-achievements',
  },
  {
    label: 'Toastmasters Hierarchy',
    icon: Network,
    path: `${MEMBER_PORTAL_BASE}/toastmasters-hierarchy`,
    slug: 'toastmasters-hierarchy',
  },
  { label: 'D82 Awards', icon: Trophy, path: `${MEMBER_PORTAL_BASE}/d82-awards`, slug: 'd82-awards' },
  {
    label: 'Exco Roles & Duties',
    icon: Users,
    path: `${MEMBER_PORTAL_BASE}/exco-roles-duties`,
    slug: 'exco-roles-duties',
  },
  {
    label: 'Monthly Fee Portal',
    icon: HandCoins,
    path: `${MEMBER_PORTAL_BASE}/monthly-fee-portal`,
    slug: 'monthly-fee-portal',
  },
];
