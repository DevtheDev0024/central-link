export interface PathwayLevelCatalogEntry {
  level: number;
  title: string;
  requiredCount: number;
  electiveMin: number;
  requiredProjects: string[];
}

export const pathwayLevelsById: Record<string, PathwayLevelCatalogEntry[]> = {
  'dynamic-leadership': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Understanding Your Communication Style',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Negotiate the Best Outcome',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Manage Change',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Lead in Any Situation',
      'Reflect on Your Path',
    ] },
  ],
  'effective-coaching': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Understanding Your Communication Style',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Reaching Consensus',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Improvement Through Positive Coaching',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'High Performance Leadership',
      'Reflect on Your Path',
    ] },
  ],
  'engaging-humor': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Know Your Sense of Humor',
      'Connect with Your Audience',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Engage Your Audience with Humor',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'The Power of Humor In an Impromptu Speech',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Deliver Your Message with Humor',
      'Reflect on Your Path',
    ] },
  ],
  'innovative-planning': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Connect with Your Audience',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Present a Proposal',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Manage Projects Successfully',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'High Performance Leadership',
      'Reflect on Your Path',
    ] },
  ],
  'leadership-development': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Managing Time',
      'Understanding Your Leadership Style',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Planning and Implementing',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Leading Your Team',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Manage Successful Events',
      'Reflect on Your Path',
    ] },
  ],
  'motivational-strategies': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Communication Style',
      'Active Listening',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Understanding Emotional Intelligence',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Motivate Others',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Team Building',
      'Reflect on Your Path',
    ] },
  ],
  'persuasive-influence': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Active Listening',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Understanding Conflict Resolution',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Leading in Difficult Situations',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'High Performance Leadership',
      'Reflect on Your Path',
    ] },
  ],
  'presentation-mastery': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Communication Style',
      'Effective Body Language',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Persuasive Speaking',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Managing a Difficult Audience',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Prepare to Speak Professionally',
      'Reflect on Your Path',
    ] },
  ],
  'strategic-relationships': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Active Listening',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Make Connections Through Networking',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Public Relations Strategies',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Leading in Your Volunteer Organization',
      'Reflect on Your Path',
    ] },
  ],
  'team-collaboration': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Active Listening',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Successful Collaboration',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Motivate Others',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Lead in Any Situation',
      'Reflect on Your Path',
    ] },
  ],
  'visionary-communication': [
    { level: 1, title: 'Mastering Fundamentals', requiredCount: 4, electiveMin: 0, requiredProjects: [
      'Ice Breaker',
      'Writing a Speech with Purpose',
      'Introduction to Vocal Variety and Body Language',
      'Evaluation and Feedback',
    ] },
    { level: 2, title: 'Learning Your Style', requiredCount: 3, electiveMin: 0, requiredProjects: [
      'Understanding Your Leadership Style',
      'Understanding Your Communication Style',
      'Introduction to Toastmasters Mentoring',
    ] },
    { level: 3, title: 'Increasing Knowledge', requiredCount: 1, electiveMin: 2, requiredProjects: [
      'Develop a Communication Plan',
    ] },
    { level: 4, title: 'Building Skills', requiredCount: 1, electiveMin: 1, requiredProjects: [
      'Communicate Change',
    ] },
    { level: 5, title: 'Demonstrating Expertise', requiredCount: 2, electiveMin: 1, requiredProjects: [
      'Develop Your Vision',
      'Reflect on Your Path',
    ] },
  ],
};

export function getPathwayProjectCounts(levels: PathwayLevelCatalogEntry[]) {
  const required = levels.reduce((sum, level) => sum + level.requiredCount, 0);
  const electiveMin = levels.reduce((sum, level) => sum + level.electiveMin, 0);
  return { required, electiveMin, totalMin: required + electiveMin };
}
