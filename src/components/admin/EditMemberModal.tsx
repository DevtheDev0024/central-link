import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateMemberAccount } from '../../lib/api';
import { CLUB_ROLES, type MemberAccount } from '../../types/memberAccount';

type EditMemberModalProps = {
  member: MemberAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

function getInitialClubRole(member: MemberAccount): string {
  if (member.clubRole && CLUB_ROLES.includes(member.clubRole as (typeof CLUB_ROLES)[number])) {
    return member.clubRole;
  }

  return 'Member';
}

export default function EditMemberModal({ member, isOpen, onClose, onUpdated }: EditMemberModalProps) {
  const { getIdToken } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [clubRole, setClubRole] = useState<string>('Member');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!member || !isOpen) return;

    setDisplayName(member.displayName);
    setEmail(member.email);
    setMembershipNumber(member.membershipNumber ?? '');
    setEmergencyContactName(member.emergencyContactName ?? '');
    setEmergencyContactNumber(member.emergencyContactNumber ?? '');
    setClubRole(getInitialClubRole(member));
    setError(null);
  }, [member, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('You must be signed in as an admin to update members.');
      }

      await updateMemberAccount(token, member.uid, {
        displayName: displayName.trim(),
        email: email.trim(),
        membershipNumber: membershipNumber.trim() || undefined,
        clubRole,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactNumber: emergencyContactNumber.trim() || undefined,
        programmeYear: member.programmeYear,
      });

      onUpdated?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-member-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Edit Member</p>
            <h2 id="edit-member-title">Update User Account</h2>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-form-field">
            <label htmlFor="edit-full-name">Full name</label>
            <input
              id="edit-full-name"
              placeholder="e.g. Nadia Fernando"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="edit-email">Email address</label>
            <input
              id="edit-email"
              type="email"
              placeholder="member@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="edit-membership-number">Membership number</label>
            <input
              id="edit-membership-number"
              placeholder="e.g. PN-1024"
              value={membershipNumber}
              onChange={(event) => setMembershipNumber(event.target.value)}
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="edit-emergency-name">Emergency contact name</label>
              <input
                id="edit-emergency-name"
                placeholder="Contact name"
                value={emergencyContactName}
                onChange={(event) => setEmergencyContactName(event.target.value)}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="edit-emergency-number">Emergency contact number</label>
              <input
                id="edit-emergency-number"
                type="tel"
                placeholder="+94 77 123 4567"
                value={emergencyContactNumber}
                onChange={(event) => setEmergencyContactNumber(event.target.value)}
              />
            </div>
          </div>

          <fieldset className="admin-role-fieldset">
            <legend>Assign role</legend>
            <div className="admin-role-chips">
              {CLUB_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={clubRole === role ? 'is-selected' : undefined}
                  onClick={() => setClubRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
