import { FormEvent, useEffect, useState } from 'react';
import { Copy, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createMemberAccount } from '../../lib/api';
import { CLUB_ROLES } from '../../types/memberAccount';

function generatePassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let password = '';

  for (let index = 0; index < length; index += 1) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

type CreateMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateMemberModal({ isOpen, onClose, onCreated }: CreateMemberModalProps) {
  const { getIdToken } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [clubRole, setClubRole] = useState<string>('Member');
  const [password, setPassword] = useState(generatePassword);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setDisplayName('');
    setEmail('');
    setMembershipNumber('');
    setEmergencyContactName('');
    setEmergencyContactNumber('');
    setClubRole('Member');
    setPassword(generatePassword());
    setCopied(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('You must be signed in as an admin to create members.');
      }

      await createMemberAccount(token, {
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        membershipNumber: membershipNumber.trim() || undefined,
        clubRole,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactNumber: emergencyContactNumber.trim() || undefined,
        programmeYear: '2025-2026',
      });

      onCreated?.();
      handleClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    } catch {
      setError('Unable to copy password. Please copy it manually.');
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={handleClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-member-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h2 id="create-member-title">Create User Account</h2>
          </div>
          <button type="button" className="admin-modal-close" onClick={handleClose} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-form-field">
            <label htmlFor="create-full-name">Full name</label>
            <input
              id="create-full-name"
              placeholder="e.g. Nadia Fernando"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="create-email">Email address</label>
            <input
              id="create-email"
              type="email"
              placeholder="member@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="create-membership-number">Membership number</label>
            <input
              id="create-membership-number"
              placeholder="e.g. PN-1024"
              value={membershipNumber}
              onChange={(event) => setMembershipNumber(event.target.value)}
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="create-emergency-name">Emergency contact name</label>
              <input
                id="create-emergency-name"
                placeholder="Contact name"
                value={emergencyContactName}
                onChange={(event) => setEmergencyContactName(event.target.value)}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="create-emergency-number">Emergency contact number</label>
              <input
                id="create-emergency-number"
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

          <div className="admin-password-panel">
            <div className="admin-password-panel-header">
              <span>Generated password</span>
              <button
                type="button"
                className="admin-password-regenerate"
                onClick={() => {
                  setPassword(generatePassword());
                  setCopied(false);
                }}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Regenerate
              </button>
            </div>
            <div className="admin-password-display-row">
              <input className="admin-password-display" value={password} readOnly aria-label="Generated password" />
              <button
                type="button"
                className={`admin-password-copy${copied ? ' is-copied' : ''}`}
                onClick={handleCopyPassword}
                aria-label={copied ? 'Password copied' : 'Copy password'}
              >
                <Copy size={15} aria-hidden="true" />
              </button>
            </div>
            <p>Share these credentials with the member for their first sign-in.</p>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn admin-btn-outline" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
