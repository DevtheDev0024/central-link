export interface ExcoRoleResource {
  label: string;
  url: string;
}

export interface ExcoRole {
  id: string;
  name: string;
  clubPoints?: number;
  pointsNote?: string;
  summary: string;
  resources: ExcoRoleResource[];
}

export const EXCO_HANDBOOK = {
  label: 'Club Leadership Handbook',
  url: 'https://www.toastmasters.org/resources/club-leadership-handbook',
  pdfUrl: 'https://content.toastmasters.org/image/upload/1310-club-leadership-handbook.pdf',
};

export const EXCO_ROLES_INTRO = {
  title: 'Exco Roles & Duties',
  summary:
    'The club executive committee (Exco) is the elected officer team that runs Central Link TMC. Summaries below follow Toastmasters International’s Club Leadership Handbook. Use the linked handbook and officer tutorials when you serve or shadow a role.',
};

export const EXCO_LEADERSHIP_POINTS_SUMMARY = [
  { role: 'Exco officer', points: 30 },
  { role: 'Shadow team', points: 10 },
];

export const excoRoles: ExcoRole[] = [
  {
    id: 'president',
    name: 'Club President',
    clubPoints: 30,
    summary:
      'Chief executive officer of the club. Presides at meetings and Exco sessions, sets direction with the team, and drives Distinguished Club Program goals with area and district leaders.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'vpe',
    name: 'Vice President Education',
    clubPoints: 30,
    summary:
      'Runs the education program. Schedules speeches and meeting roles, approves Pathways progress in Base Camp, supports mentors, and helps members stay on track toward their goals.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'vpm',
    name: 'Vice President Membership',
    clubPoints: 30,
    summary:
      'Builds and retains membership. Welcomes guests, follows up after meetings, plans outreach, and keeps the club at a healthy, growing member count.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'vppr',
    name: 'Vice President Public Relations',
    clubPoints: 30,
    summary:
      'Promotes the club. Manages publicity and social media, attracts guests through outreach, and shares club news and success stories with the wider community.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'secretary',
    name: 'Club Secretary',
    clubPoints: 30,
    summary:
      'Keeps club records. Takes Exco and business meeting minutes, maintains the membership roster, handles correspondence, and keeps officer lists current with Toastmasters International.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'treasurer',
    name: 'Club Treasurer',
    clubPoints: 30,
    summary:
      'Manages club finances. Collects dues, pays bills, maintains the bank account, files required tax forms, and reports the club’s financial status to Exco and members.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'saa',
    name: 'Sergeant at Arms',
    clubPoints: 30,
    summary:
      'Prepares the meeting space. Sets up and closes down the venue, greets members and guests, manages meeting materials, and keeps logistics running smoothly.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
  {
    id: 'ipp',
    name: 'Immediate Past President',
    pointsNote: 'Advisory role',
    summary:
      'Advises the new Exco team. Uses recent presidential experience to mentor the president and support continuity when the team asks for guidance.',
    resources: [
      { label: 'Club Leadership Handbook (PDF)', url: EXCO_HANDBOOK.pdfUrl },
      { label: 'Club officer tutorials', url: 'https://www.toastmasters.org/club-officer-tutorials' },
    ],
  },
];
