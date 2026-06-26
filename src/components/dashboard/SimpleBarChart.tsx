import { useState, useEffect } from 'react';

type SimpleBarChartProps = {
  data: { name: string; value: number }[];
  title: string;
  color: string;
  animationKey: string;
  maxValue?: number;
};

export default function SimpleBarChart({ data, title, color, animationKey, maxValue: maxValueProp }: SimpleBarChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const maxValue = Math.max(maxValueProp ?? 0, ...data.map((d) => d.value), 1);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setAnimationProgress(1);
      return;
    }

    let animationFrame = 0;
    const duration = 950;
    const startTime = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    setAnimationProgress(0);
    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [animationKey]);

  return (
    <div className="rounded-[1.5rem] border border-white bg-white p-5 shadow-[0_24px_55px_rgba(15,29,56,0.12)] sm:p-6">
      <div className="mb-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-black">Leaderboard</p>
        <h3 className="mt-2 font-['GothamCondensed-Bold',sans-serif] text-[2rem] uppercase italic leading-none tracking-[0.04em] text-toastmasters-navy sm:text-[2.35rem]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => {
          const animatedValue = Math.round(item.value * animationProgress);
          const animatedWidth = Math.max((item.value / maxValue) * 100 * animationProgress, 0);

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-toastmasters-navy text-xs font-bold text-white shadow-sm">
                {index + 1}
              </div>
              <div className="w-24 truncate text-[0.95rem] font-semibold text-slate-800 sm:w-32 sm:text-base" title={item.name}>
                {item.name}
              </div>
              <div className="h-7 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/70">
                <div
                  className={`flex h-full items-center justify-end rounded-full pr-3 ${color}`}
                  style={{ width: `${animatedWidth}%` }}
                >
                  <span className="text-xs font-bold text-white">{animatedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
