export type PathwayAvailability = 'current' | 'legacy';

export interface PathwayCatalogEntry {
  id: string;
  name: string;
  availability: PathwayAvailability;
  logoSrc: string;
  summary: string;
  competencies: string[];
  resourceUrl: string;
}

export const PATHWAYS_CATALOG_INTRO = {
  summary:
    'Pathways is Toastmasters International’s education program. Each path has five levels and 15 projects (11 required and 4 electives) that build public speaking and leadership skills. New members choose from six current paths in Base Camp.',
  pathsAndProjectsUrl: 'https://www.toastmasters.org/education/pathways/pathways-paths-and-projects',
  choosePathUrl: 'https://www.toastmasters.org/start-pathways/select-your-preference',
};

export const PATHWAYS_POINTS_SUMMARY = [
  { label: 'Level completion', points: 20 },
  { label: 'Project completion', points: 5 },
];

export const pathwayCatalog: PathwayCatalogEntry[] = [
  {
    id: 'dynamic-leadership',
    name: 'Dynamic Leadership',
    availability: 'current',
    logoSrc: '/pathways/dynamic-leadership.svg',
    summary:
      'Build strategic leadership skills. Learn communication and leadership styles, manage conflict, and lead change in a group or organization.',
    competencies: ['Strategic Leadership', 'Interpersonal Communication', 'Public Speaking'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-dynamic-leadership-path',
  },
  {
    id: 'engaging-humor',
    name: 'Engaging Humor',
    availability: 'current',
    logoSrc: '/pathways/engaging-humor.svg',
    summary:
      'Build skills as a humorous, engaging speaker. Learn how audiences respond to different types of humor and deliver messages with confidence.',
    competencies: ['Interpersonal Communication', 'Public Speaking', 'Confidence'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-engaging-humor-path',
  },
  {
    id: 'motivational-strategies',
    name: 'Motivational Strategies',
    availability: 'current',
    logoSrc: '/pathways/motivational-strategies.svg',
    summary:
      'Build motivational leadership and communication. Strengthen public speaking and speech writing that inspires and moves an audience.',
    competencies: ['Public Speaking', 'Strategic Leadership', 'Confidence'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-motivational-strategies-path',
  },
  {
    id: 'persuasive-influence',
    name: 'Persuasive Influence',
    availability: 'current',
    logoSrc: '/pathways/persuasive-influence.svg',
    summary:
      'Build skills to influence and lead in complex situations. Combine strong communication with creative project management.',
    competencies: ['Management', 'Interpersonal Communication', 'Public Speaking'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-persuasive-influence-path',
  },
  {
    id: 'presentation-mastery',
    name: 'Presentation Mastery',
    availability: 'current',
    logoSrc: '/pathways/presentation-mastery.svg',
    summary:
      'Build public speaking skills. Improve how you connect with an audience through speech writing, delivery, and presentation technique.',
    competencies: ['Public Speaking', 'Interpersonal Communication', 'Confidence'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-presentation-mastery-path',
  },
  {
    id: 'visionary-communication',
    name: 'Visionary Communication',
    availability: 'current',
    logoSrc: '/pathways/visionary-communication.svg',
    summary:
      'Build innovative communication and leadership. Learn to share ideas, plan with a group, and speak as a strategic communicator.',
    competencies: ['Strategic Leadership', 'Public Speaking', 'Interpersonal Communication'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-visionary-communication-path',
  },
  {
    id: 'effective-coaching',
    name: 'Effective Coaching',
    availability: 'legacy',
    logoSrc: '/pathways/effective-coaching.svg',
    summary:
      'Build coaching and interpersonal skills. Focus on mentoring others and helping members grow through feedback and support.',
    competencies: ['Interpersonal Communication', 'Management', 'Confidence'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-effective-coaching-path',
  },
  {
    id: 'innovative-planning',
    name: 'Innovative Planning',
    availability: 'legacy',
    logoSrc: '/pathways/innovative-planning.svg',
    summary:
      'Build planning and strategic thinking skills. Learn to develop ideas, organize projects, and lead initiatives with clarity.',
    competencies: ['Management', 'Strategic Leadership', 'Public Speaking'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-innovative-planning-path',
  },
  {
    id: 'leadership-development',
    name: 'Leadership Development',
    availability: 'legacy',
    logoSrc: '/pathways/leadership-development.svg',
    summary:
      'Build leadership fundamentals. Develop skills to guide teams, communicate vision, and grow as a club or community leader.',
    competencies: ['Strategic Leadership', 'Interpersonal Communication', 'Management'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-leadership-development-path',
  },
  {
    id: 'strategic-relationships',
    name: 'Strategic Relationships',
    availability: 'legacy',
    logoSrc: '/pathways/strategic-relationships.svg',
    summary:
      'Build networking and relationship skills. Learn to connect with others, collaborate effectively, and strengthen partnerships.',
    competencies: ['Interpersonal Communication', 'Strategic Leadership', 'Confidence'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-strategic-relationships-path',
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    availability: 'legacy',
    logoSrc: '/pathways/team-collaboration.svg',
    summary:
      'Build teamwork and collaborative leadership. Focus on working with groups, facilitating discussion, and achieving shared goals.',
    competencies: ['Management', 'Interpersonal Communication', 'Strategic Leadership'],
    resourceUrl: 'https://www.toastmasters.org/pathways-overview/pathways-team-collaboration-path',
  },
];
