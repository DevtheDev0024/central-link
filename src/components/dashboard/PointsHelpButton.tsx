import { Lightbulb } from 'lucide-react';

type PointsHelpButtonProps = {
  onClick: () => void;
  variant?: 'default' | 'performance-dashboard';
};

export default function PointsHelpButton({ onClick, variant = 'default' }: PointsHelpButtonProps) {
  if (variant === 'performance-dashboard') {
    return (
      <span className="performance-points-help-anchor">
        <button
          type="button"
          onClick={onClick}
          className="performance-points-help-button"
          aria-label="How are points calculated?"
        >
          <span>How are points calculated?</span>
          <Lightbulb size={19} strokeWidth={2.2} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-14 w-14 shrink-0 items-center justify-start overflow-hidden rounded-full border border-toastmasters-gold/40 bg-white/95 px-4 text-toastmasters-navy shadow-[0_14px_35px_rgba(15,29,56,0.1)] ring-1 ring-white/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[15.5rem] hover:border-toastmasters-gold hover:bg-[#fff8e1] hover:shadow-[0_18px_42px_rgba(197,160,71,0.2)] focus:w-[15.5rem] focus:border-toastmasters-gold focus:bg-[#fff8e1] focus:outline-none focus:ring-4 focus:ring-toastmasters-gold/20"
    >
      <Lightbulb
        size={22}
        strokeWidth={2.2}
        className="shrink-0 text-toastmasters-gold-dark transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-focus:scale-110"
      />
      <span className="ml-0 max-w-0 whitespace-nowrap text-sm font-bold text-toastmasters-navy opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-3 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus:ml-3 group-focus:max-w-[12rem] group-focus:opacity-100">
        How are points calculated?
      </span>
    </button>
  );
}
