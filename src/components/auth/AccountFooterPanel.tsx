import { KeyRound } from 'lucide-react';
import SignOutButton from './SignOutButton';

type AccountFooterPanelProps = {
  email?: string | null;
  displayName?: string | null;
  onSignOut: () => void;
  onChangePassword?: () => void;
  hideChangePasswordIcon?: boolean;
  variant?: 'on-dark' | 'on-light';
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function AccountFooterPanel({
  email,
  displayName,
  onSignOut,
  onChangePassword,
  hideChangePasswordIcon = false,
  variant = 'on-light',
  className,
}: AccountFooterPanelProps) {
  const resolvedName = displayName?.trim() || email?.split('@')[0] || 'Member';
  const initials = getInitials(resolvedName);
  const trimmedName = displayName?.trim();
  const showName = Boolean(trimmedName);

  return (
    <div
      className={`account-footer-panel${variant === 'on-dark' ? ' is-on-dark' : ' is-on-light'}${className ? ` ${className}` : ''}`}
    >
      <div className="account-footer-user">
        <div className="account-footer-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="account-footer-copy">
          <span className="account-footer-eyebrow">Signed in as</span>
          {showName ? <strong>{trimmedName}</strong> : null}
          {email ? (
            <span className={`account-footer-email${showName ? '' : ' is-primary'}`}>{email}</span>
          ) : null}
        </div>
      </div>
      {onChangePassword ? (
        <button
          type="button"
          className={`change-password-button${variant === 'on-dark' ? ' is-on-dark' : ''}`}
          onClick={onChangePassword}
        >
          {hideChangePasswordIcon ? null : <KeyRound size={14} aria-hidden="true" />}
          Change password
        </button>
      ) : null}
      <SignOutButton variant={variant} onClick={onSignOut} />
    </div>
  );
}
