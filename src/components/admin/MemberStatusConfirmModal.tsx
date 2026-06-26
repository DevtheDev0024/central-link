import { useEffect } from 'react';
import type { MemberAccount } from '../../types/memberAccount';

type MemberStatusConfirmModalProps = {
  member: MemberAccount | null;
  isOpen: boolean;
  submitting: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

function getMemberLabel(member: MemberAccount): string {
  return (member.displayName || member.email || 'this member').toUpperCase();
}

export default function MemberStatusConfirmModal({
  member,
  isOpen,
  submitting,
  error,
  onClose,
  onConfirm,
}: MemberStatusConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, submitting]);

  if (!isOpen || !member) return null;

  const isDeactivating = member.status === 'active';
  const memberLabel = getMemberLabel(member);

  return (
    <div className="admin-modal-backdrop" onClick={submitting ? undefined : onClose} role="presentation">
      <div
        className="admin-confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="member-status-confirm-title"
        aria-describedby="member-status-confirm-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-confirm-modal-body">
          <h2 id="member-status-confirm-title" className="admin-confirm-title">
            {isDeactivating ? `Deactivate ${memberLabel}?` : `Reactivate ${memberLabel}?`}
          </h2>

          <p id="member-status-confirm-description" className="admin-confirm-copy">
            {isDeactivating ? (
              <>
                Their status will be set to{' '}
                <strong className="admin-confirm-highlight is-inactive">Inactive</strong>. They lose portal access
                immediately, but their record, points, and history are kept. You can reactivate them at any time.
              </>
            ) : (
              <>
                Their status will be set to{' '}
                <strong className="admin-confirm-highlight is-active">Active</strong>. They regain portal access
                immediately and can sign in with their existing credentials.
              </>
            )}
          </p>

          {error ? <p className="admin-error">{error}</p> : null}
        </div>

        <div className="admin-confirm-modal-footer">
          <button type="button" className="admin-btn admin-btn-outline" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className={`admin-btn ${isDeactivating ? 'admin-btn-danger-solid' : 'admin-btn-success-solid'}`}
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting ? 'Updating…' : isDeactivating ? 'Set Inactive' : 'Set Active'}
          </button>
        </div>
      </div>
    </div>
  );
}
