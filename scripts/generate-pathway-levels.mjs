import fs from 'fs';

const text = fs.readFileSync(
  'C:/Users/devi0/.cursor/projects/c-Users-devi0-CLTC-Central-Link-TMC-Member-Dashboard/agent-tools/4ee3d381-94e7-45c7-8737-3823ccdd6bbd.txt',
  'utf8',
);
const lines = text.split(/\r?\n/);
const paths = {};
let currentPath = null;
let currentLevel = null;

const levelTitles = {
  1: 'Mastering Fundamentals',
  2: 'Learning Your Style',
  3: 'Increasing Knowledge',
  4: 'Building Skills',
  5: 'Demonstrating Expertise',
};

const wordToNum = { one: 1, two: 2, three: 3, four: 4, five: 5 };

function parseCount(str) {
  if (!str) return 0;
  const n = Number(str);
  if (!Number.isNaN(n)) return n;
  return wordToNum[str.toLowerCase()] ?? 0;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const levelMatch = line.match(/^### Level (\d) Projects for (.+)$/);
  if (levelMatch) {
    currentPath = levelMatch[2].trim();
    currentLevel = Number(levelMatch[1]);
    if (!paths[currentPath]) paths[currentPath] = { levels: {} };
    const descLine = (lines[i + 1] === '' ? lines[i + 2] : lines[i + 1]) || '';
    const reqMatch = descLine.match(/(\w+) required projects?/);
    const elecMatch = descLine.match(/minimum of (\w+) elective/);
    paths[currentPath].levels[currentLevel] = {
      title: levelTitles[currentLevel],
      requiredCount: parseCount(reqMatch?.[1]),
      electiveMin: descLine.includes('no electives') ? 0 : parseCount(elecMatch?.[1]),
      requiredProjects: [],
    };
    continue;
  }

  const projMatch = line.match(/^#### (.+)$/);
  if (projMatch && currentPath && currentLevel) {
    paths[currentPath].levels[currentLevel].requiredProjects.push(projMatch[1].trim());
  }

  if (line.match(/^## [^#]/) && !line.startsWith('###')) {
    currentPath = null;
    currentLevel = null;
  }
}

const idMap = {
  'Dynamic Leadership': 'dynamic-leadership',
  'Engaging Humor': 'engaging-humor',
  'Motivational Strategies': 'motivational-strategies',
  'Persuasive Influence': 'persuasive-influence',
  'Presentation Mastery': 'presentation-mastery',
  'Visionary Communication': 'visionary-communication',
  'Effective Coaching': 'effective-coaching',
  'Innovative Planning': 'innovative-planning',
  'Leadership Development': 'leadership-development',
  'Strategic Relationships': 'strategic-relationships',
  'Team Collaboration': 'team-collaboration',
};

const fileLines = [
  'export interface PathwayLevelCatalogEntry {',
  '  level: number;',
  '  title: string;',
  '  requiredCount: number;',
  '  electiveMin: number;',
  '  requiredProjects: string[];',
  '}',
  '',
  'export const pathwayLevelsById: Record<string, PathwayLevelCatalogEntry[]> = {',
];

for (const [name, data] of Object.entries(paths)) {
  const id = idMap[name];
  if (!id) continue;
  fileLines.push(`  '${id}': [`);
  for (const levelNum of [1, 2, 3, 4, 5]) {
    const level = data.levels[levelNum];
    const projects = level.requiredProjects.map((p) => `      '${p.replace(/'/g, "\\'")}',`).join('\n');
    fileLines.push(
      `    { level: ${levelNum}, title: '${level.title}', requiredCount: ${level.requiredCount}, electiveMin: ${level.electiveMin}, requiredProjects: [`,
    );
    fileLines.push(projects);
    fileLines.push('    ] },');
  }
  fileLines.push('  ],');
}

fileLines.push('};', '', 'export function getPathwayProjectCounts(levels: PathwayLevelCatalogEntry[]) {');
fileLines.push('  const required = levels.reduce((sum, level) => sum + level.requiredCount, 0);');
fileLines.push('  const electiveMin = levels.reduce((sum, level) => sum + level.electiveMin, 0);');
fileLines.push('  return { required, electiveMin, totalMin: required + electiveMin };');
fileLines.push('}', '');

fs.writeFileSync(
  new URL('../src/data/pathwayLevelsCatalogData.ts', import.meta.url),
  fileLines.join('\n'),
);

for (const [name, data] of Object.entries(paths)) {
  const levels = [1, 2, 3, 4, 5].map((n) => data.levels[n]);
  const total = levels.reduce((sum, level) => sum + level.requiredCount + level.electiveMin, 0);
  console.log(name, total);
}
