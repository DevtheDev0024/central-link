export interface MeetingRoleResource {
  label: string;
  url: string;
}

export interface MeetingRole {
  id: string;
  name: string;
  clubPoints?: number;
  pointsNote?: string;
  summary: string;
  resources: MeetingRoleResource[];
}

export const MEETING_ROLES_HANDBOOK = {
  label: 'A Toastmaster Wears Many Hats',
  url: 'https://www.toastmasters.org/resources/a-toastmaster-wears-many-hats',
  pdfUrl:
    'https://www.toastmasters.org/medias/files/pathways/toastmaster-wears-many-hats/1167d-a-toastmaster-wears-many-hats.pdf',
};

export const MEETING_ROLES_INTRO = {
  title: 'Club Meeting Roles',
  summary:
    'Every meeting runs on volunteer roles. Summaries below follow Toastmasters International’s A Toastmaster Wears Many Hats. Use the linked scripts and logs when you take a role.',
};

export const MEETING_ROLE_POINTS_SUMMARY = [
  { role: 'Toastmaster', points: 10 },
  { role: 'Table Topics Master', points: 8 },
  { role: 'General Evaluator', points: 6 },
  { role: 'Game Master', points: 5 },
  { role: 'TAG / RRM', points: 4 },
];

export const meetingRoles: MeetingRole[] = [
  {
    id: 'tmod',
    name: 'Toastmaster of the Day',
    clubPoints: 10,
    summary:
      'Host the meeting, introduce each segment, and keep the agenda moving. Set a welcoming tone and hand off to the General Evaluator at the close.',
    resources: [
      { label: 'A Toastmaster Wears Many Hats (PDF)', url: MEETING_ROLES_HANDBOOK.pdfUrl },
      { label: 'Toastmaster role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/toastmaster' },
    ],
  },
  {
    id: 'timer',
    name: 'Timer',
    clubPoints: 4,
    summary:
      'Track time for every speaker and signal with green, yellow, and red. Report each name and duration when the General Evaluator calls on you.',
    resources: [
      { label: 'Timer script & log', url: 'https://www.toastmasters.org/resources/timer-script-and-log' },
      { label: 'Timer role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/timer' },
    ],
  },
  {
    id: 'ah-counter',
    name: 'Ah Counter',
    clubPoints: 4,
    summary:
      'Listen for filler words and sounds such as um, ah, like, and you know. Tally usage and give a brief, tactful report during evaluations.',
    resources: [
      { label: 'Ah-Counter script & log', url: 'https://www.toastmasters.org/resources/ah-counter-script-and-log' },
      { label: 'Ah-Counter role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/ah-counter' },
    ],
  },
  {
    id: 'grammarian',
    name: 'Grammarian',
    clubPoints: 4,
    summary:
      'Introduce the Word of the Day and note creative language, grammar slips, and standout phrases. Report when called upon by the General Evaluator.',
    resources: [
      { label: 'Grammarian script & log', url: 'https://www.toastmasters.org/resources/grammarian-script-and-log' },
      { label: 'Grammarian role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/grammarian' },
    ],
  },
  {
    id: 'rrm',
    name: 'Round Robin Master',
    clubPoints: 4,
    summary:
      'Lead a quick impromptu round on one question or theme. Give each member a short, equal turn and return control to the Toastmaster on time.',
    resources: [{ label: 'A Toastmaster Wears Many Hats (PDF)', url: MEETING_ROLES_HANDBOOK.pdfUrl }],
  },
  {
    id: 'ttm',
    name: 'Table Topics Master',
    clubPoints: 8,
    summary:
      'Prepare creative Table Topics questions and call on members and guests to speak off the cuff. Keep introductions brief and the session within its time slot.',
    resources: [
      { label: 'Topicsmaster script & log', url: 'https://www.toastmasters.org/resources/topicsmaster-script-and-log' },
      { label: 'Table Topics Master role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/topicsmaster' },
    ],
  },
  {
    id: 'evaluator',
    name: 'Evaluator',
    pointsNote: '5 pts · evaluation',
    summary:
      'Evaluate one prepared speech with honest, supportive feedback. Lead with strengths, suggest one or two improvements, and stay within your time.',
    resources: [
      { label: 'A Toastmaster Wears Many Hats (PDF)', url: MEETING_ROLES_HANDBOOK.pdfUrl },
      { label: 'Evaluator role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/evaluator' },
      { label: 'Speaker introduction form', url: 'https://www.toastmasters.org/resources/speaker-introduction-form' },
    ],
  },
  {
    id: 'game-master',
    name: 'Game Master',
    clubPoints: 5,
    summary:
      'Run a short club activity or icebreaker that fits the meeting schedule. Explain the rules quickly, keep it inclusive, and finish on time.',
    resources: [{ label: 'A Toastmaster Wears Many Hats (PDF)', url: MEETING_ROLES_HANDBOOK.pdfUrl }],
  },
  {
    id: 'ge',
    name: 'General Evaluator',
    clubPoints: 6,
    summary:
      'Lead the evaluation team and assess the whole meeting. Introduce evaluators, listen throughout, and deliver concise feedback on meeting quality.',
    resources: [
      { label: 'General Evaluator checklist', url: 'https://www.toastmasters.org/resources/general-evaluator-checklist' },
      { label: 'General Evaluator role guide', url: 'https://www.toastmasters.org/membership/club-meeting-roles/general-evaluator' },
    ],
  },
];
