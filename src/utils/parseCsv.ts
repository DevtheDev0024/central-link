import type { Member } from '../types/member';

export function parseCSV(csvText: string): Member[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some((cell) => cell.trim())) {
    rows.push(currentRow);
  }

  const normalizeHeader = (value: string) => value.replace(/\s+/g, ' ').trim().toUpperCase();
  const headerRowIndex = rows.findIndex((row) => row.some((cell) => normalizeHeader(cell) === 'NAME OF THE MEMBER'));
  const headerRow = headerRowIndex >= 0 ? rows[headerRowIndex] : rows[2] || [];
  const dataRows = rows.slice((headerRowIndex >= 0 ? headerRowIndex : 2) + 1);
  const columnIndexByHeader = new Map<string, number>();

  headerRow.forEach((header, index) => {
    const normalizedHeader = normalizeHeader(header);
    if (normalizedHeader) {
      columnIndexByHeader.set(normalizedHeader, index);
    }
  });

  const getValue = (values: string[], ...headers: string[]) => {
    for (const header of headers) {
      const columnIndex = columnIndexByHeader.get(normalizeHeader(header));
      if (columnIndex !== undefined) return values[columnIndex] || '';
    }

    return '';
  };

  const getNumber = (values: string[], ...headers: string[]) => {
    const value = getValue(values, ...headers).replace(/,/g, '');
    return Number(value) || 0;
  };

  const members: Member[] = [];

  for (const values of dataRows) {
    const memberName = getValue(values, 'NAME OF THE MEMBER', 'MEMBER NAME', 'NAME');

    if (memberName) {
      const meetingRoles = headerRow
        .map((header, index) => ({ header: normalizeHeader(header), value: values[index] }))
        .filter(
          ({ header, value }) =>
            header.includes('MEETING ROLE') &&
            header !== 'MEETING ROLES POINTS' &&
            value &&
            value !== 'None'
        )
        .map(({ value }) => value);

      const meetingRolesPoints = getNumber(values, 'MEETING ROLES POINTS', 'MEETING ROLE POINTS', 'ROLES POINTS');
      const totalPoints = getNumber(values, 'TOTAL POINTS', 'TOTAL', 'SCORE');

      const member: Member = {
        name: memberName,
        membershipNumber: getValue(values, 'MEMBERSHIP NUMBER', 'MEMBER ID', 'MEMBERSHIP NO'),
        levelCompletion: getNumber(values, 'LEVEL COMPLETIONS', 'LEVEL COMPLETION'),
        projectCompletion: getNumber(values, 'PROJECT COMPLETIONS', 'PROJECT COMPLETION'),
        meetingAwards: getNumber(values, 'MEETING AWARDS'),
        contestExcellence: getNumber(values, 'CONTEST EXCELLENCE'),
        evaluationContribution: getNumber(values, 'EVALUATION CONTRIBUTION'),
        trainingPrograms: getNumber(values, 'ATTENDING TRAINING PROGRAMS', 'ATTENDING TRAINING PROGRAMMES'),
        educationalSessions: getNumber(
          values,
          'CONDUCTING EDUCATIONAL SESSIONS',
          'EDUCATIONAL SESSIONS'
        ),
        mentoringAssignments: getNumber(values, 'MENTORING ASSIGNMENTS', 'MENTORING ASSIGHNMENTS'),
        leadershipRoles: getNumber(values, 'LEADERSHIP ROLES', 'LEADERSHIP'),
        clubEvents: getNumber(values, 'CLUB EVENTS CONTRIBUTIONS', 'CLUB EVENTS CONTRIBUTION', 'CLUB EVENTS'),
        clubContestContribution: getNumber(
          values,
          'CLUB CONTEST CONTRIBUTIONS',
          'CLUB CONTEST CONTRIBUTION'
        ),
        visitingToastmaster: getNumber(values, 'VISITING TOASTMASTER'),
        meetingRolesPoints,
        totalPoints,
        aiScore: meetingRolesPoints,
        ajScore: totalPoints,
        meetingRoles,
      };

      members.push(member);
    }
  }

  return members;
}
