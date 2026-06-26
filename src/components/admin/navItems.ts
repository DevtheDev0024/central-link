import {
  BadgeCheck,
  CalendarDays,
  LineChart,
  Mic,
  Settings,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  slug: string;
  end?: boolean;
}

export const ADMIN_BASE = '/admin';

export const adminNavItems: AdminNavItem[] = [
  { label: 'User Management', icon: Users, path: ADMIN_BASE, slug: '', end: true },
  { label: 'Approvals', icon: BadgeCheck, path: `${ADMIN_BASE}/approvals`, slug: 'approvals' },
  { label: 'Award Points', icon: Star, path: `${ADMIN_BASE}/award-points`, slug: 'award-points' },
  {
    label: 'Reports & Analytics',
    icon: LineChart,
    path: `${ADMIN_BASE}/reports-analytics`,
    slug: 'reports-analytics',
  },
  { label: 'Meeting Scheduler', icon: Mic, path: `${ADMIN_BASE}/meeting-scheduler`, slug: 'meeting-scheduler' },
  { label: 'Communications', icon: CalendarDays, path: `${ADMIN_BASE}/communications`, slug: 'communications' },
  { label: 'Settings', icon: Settings, path: `${ADMIN_BASE}/settings`, slug: 'settings' },
];
