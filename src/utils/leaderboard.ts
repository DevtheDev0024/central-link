const LEADERBOARD_HEADROOM_RATIO = 0.94;

export function getLeaderboardDisplayMax(values: number[]) {
  const highestValue = Math.max(...values, 0);

  if (highestValue <= 0) {
    return 1;
  }

  const rawDisplayMax = highestValue / LEADERBOARD_HEADROOM_RATIO;
  const roundingStep = 10 ** Math.max(0, Math.floor(Math.log10(rawDisplayMax)) - 1);

  return Math.ceil(rawDisplayMax / roundingStep) * roundingStep;
}
