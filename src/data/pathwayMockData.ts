export type LevelStatus = 'complete' | 'current' | 'locked';

export interface PathwayProject {
  name: string;
  done: boolean;
}

export interface PathwayLevel {
  level: number;
  label: string;
  status: LevelStatus;
  projects: PathwayProject[];
}

export const PATHWAY_NAME = 'Presentation Mastery';

export const pathwayLevels: PathwayLevel[] = [
  {
    level: 1,
    label: 'L1',
    status: 'complete',
    projects: [
      { name: 'Ice Breaker', done: true },
      { name: 'Writing a Speech with Purpose', done: true },
      { name: 'Introduction to Toastmasters Mentoring', done: true },
      { name: 'Evaluation and Feedback', done: true },
      { name: 'Researching and Presenting', done: true },
    ],
  },
  {
    level: 2,
    label: 'L2',
    status: 'complete',
    projects: [
      { name: 'Understanding Your Communication Style', done: true },
      { name: 'Effective Body Language', done: true },
      { name: 'Introduction to Toastmasters Mentoring', done: true },
      { name: 'Active Listening', done: true },
    ],
  },
  {
    level: 3,
    label: 'L3',
    status: 'current',
    projects: [
      { name: 'Understanding Your Communication Style', done: true },
      { name: 'Effective Body Language', done: true },
      { name: 'Persuasive Speaking', done: false },
      { name: 'Managing a Difficult Audience', done: false },
    ],
  },
  {
    level: 4,
    label: 'L4',
    status: 'locked',
    projects: [
      { name: 'Building a Social Media Presence', done: false },
      { name: 'Manage Online Meetings', done: false },
      { name: 'Create a Podcast', done: false },
    ],
  },
  {
    level: 5,
    label: 'L5',
    status: 'locked',
    projects: [
      { name: 'Reflect on Your Path', done: false },
      { name: 'Moderate a Panel Discussion', done: false },
      { name: 'Prepare to Speak Professionally', done: false },
      { name: 'High Performance Leadership', done: false },
    ],
  },
];

export const pathwayMetrics = [
  { label: 'Levels Completed', value: '2', note: 'of 5 levels' },
  { label: 'Projects Done', value: '11', note: '6 remaining' },
  { label: 'Pathways Points', value: '95', note: '40 level + 55 project' },
  { label: 'Overall Progress', value: '69%', note: 'On track' },
];

export const pathwayActivities = [
  { title: 'Completed "Effective Body Language"', detail: 'June 20 • Central Link TMC', points: '+5 pts' },
  { title: 'Completed Level 2', detail: 'June 6 • Pathways', points: '+20 pts' },
  { title: 'Completed "Understanding Your Communication Style"', detail: 'May 23 • Central Link TMC', points: '+5 pts' },
  { title: 'Completed "Active Listening"', detail: 'May 9 • Central Link TMC', points: '+5 pts' },
];

export function getOverallPercent(levels: PathwayLevel[]): number {
  const allProjects = levels.flatMap((l) => l.projects);
  const done = allProjects.filter((p) => p.done).length;
  return Math.round((done / allProjects.length) * 100);
}

export function getCurrentLevel(levels: PathwayLevel[]): PathwayLevel {
  return levels.find((l) => l.status === 'current') ?? levels[levels.length - 1];
}
