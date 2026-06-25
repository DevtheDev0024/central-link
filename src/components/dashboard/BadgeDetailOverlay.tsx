import type { BadgeDefinition } from '../../types/badges';

type BadgeDetailOverlayProps = {
  badge: BadgeDefinition | null;
  isClosing: boolean;
  onClose: () => void;
};

export default function BadgeDetailOverlay({ badge, isClosing, onClose }: BadgeDetailOverlayProps) {
  if (!badge) return null;

  return (
    <div
      className={`badge-detail-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-5 py-8 text-center backdrop-blur-2xl ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={onClose}
    >
      <div className="badge-detail-content flex w-full max-w-3xl flex-col items-center animate-slide-up">
        <img
          src={badge.imageSrc}
          alt=""
          aria-hidden="true"
          className="h-44 w-44 object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.35)] sm:h-56 sm:w-56"
        />
        <h3 className="mt-6 font-['GothamCondensed-Bold',sans-serif] text-[3.5rem] uppercase italic leading-none tracking-[0.04em] text-toastmasters-navy drop-shadow-[0_2px_10px_rgba(255,255,255,0.72)] sm:text-[5rem]">
          {badge.name}
        </h3>
        <p className="mt-5 max-w-2xl font-['MyriadPro-Semibold',Arial,sans-serif] text-base font-semibold leading-7 text-black">
          {badge.description}
        </p>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-toastmasters-navy sm:text-lg">
          {badge.message}
        </p>
      </div>
    </div>
  );
}
