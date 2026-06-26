import { useMemo } from 'react';
import Confetti from 'react-confetti';
import type { Member } from '../../types/member';
import { getLeaderboardDisplayMax } from '../../utils/leaderboard';
import SimpleBarChart from './SimpleBarChart';

type TopPerformersSectionProps = {
  members: Member[];
  lastUpdated: string;
};

export default function TopPerformersSection({ members, lastUpdated }: TopPerformersSectionProps) {
  const stats = useMemo(() => {
    const topPerformer = members.length > 0 ? [...members].sort((a, b) => b.ajScore - a.ajScore)[0] : null;
    return { topPerformer };
  }, [members]);

  const topPerformers = useMemo(() => {
    return [...members].sort((a, b) => b.ajScore - a.ajScore).slice(0, 5);
  }, [members]);

  const topPerformerChartData = useMemo(() => {
    return topPerformers.map((m) => ({ name: m.name.split(' ')[0], value: m.ajScore }));
  }, [topPerformers]);
  const leaderboardDisplayMax = useMemo(
    () => getLeaderboardDisplayMax(topPerformers.map((member) => member.ajScore)),
    [topPerformers],
  );

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      {stats.topPerformer ? (
        <article className="relative overflow-hidden rounded-[1.75rem] border border-[#d8c38b]/70 bg-[radial-gradient(circle_at_top,#2d4a7c_0%,#193257_42%,#0f1d38_100%)] px-6 py-6 text-center text-white shadow-[0_24px_60px_rgba(15,29,56,0.18)] sm:px-8 sm:py-7">
          <Confetti
            key={`${stats.topPerformer.name}-${lastUpdated}`}
            width={980}
            height={360}
            numberOfPieces={70}
            recycle
            gravity={0.16}
            initialVelocityY={9}
            colors={['#dab961', '#c5a047', '#ffffff', '#2d4a7c', '#800020']}
            className="pointer-events-none !absolute !inset-0 opacity-80"
          />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white">Top Performer</p>
            <h2 className="mt-3 font-['GothamCondensed-Bold',sans-serif] text-[3rem] uppercase italic leading-[0.95] tracking-[0.04em] text-toastmasters-gold-light sm:text-[4rem]">
              {stats.topPerformer.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white sm:text-base">
              Highest scoring member across the selected programme year.
            </p>

            <div className="mt-5">
              <p className="mt-1 font-['GothamCondensed-Bold',sans-serif] text-[4.35rem] uppercase italic leading-none tracking-[0.02em] text-toastmasters-gold-light sm:text-[5.35rem]">
                {stats.topPerformer.ajScore}
              </p>
              <p className="mt-2 text-sm font-medium text-white">Points earned</p>
            </div>

            {stats.topPerformer.meetingRoles.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {stats.topPerformer.meetingRoles.slice(0, 5).map((role, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15"
                  >
                    {role}
                  </span>
                ))}
                {stats.topPerformer.meetingRoles.length > 5 && (
                  <span className="rounded-full bg-toastmasters-maroon px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    +{stats.topPerformer.meetingRoles.length - 5} more
                  </span>
                )}
              </div>
            )}

            <p className="mt-5 max-w-2xl text-base font-bold leading-6 text-white">
              Congratulations, you are the Central Link
              <span className="font-['MyriadPro-Semibold',Arial,sans-serif] text-base font-semibold text-toastmasters-gold-light">
                {' '}
                Toastmaster of the Year!
              </span>
            </p>
          </div>
        </article>
      ) : null}

      <SimpleBarChart
        data={topPerformerChartData}
        title="Top 5 Performers"
        color="bg-gradient-to-r from-toastmasters-navy to-toastmasters-navy-light"
        animationKey={lastUpdated}
        maxValue={leaderboardDisplayMax}
      />
    </section>
  );
}
