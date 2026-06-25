import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getChangePasswordFieldError } from '../../lib/authErrors';
import '../../styles/admin.css';

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function getFieldErrors(currentPassword: string, newPassword: string, confirmPassword: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!currentPassword.trim()) {
    errors.currentPassword = 'Enter your current password.';
  }

  if (!newPassword) {
    errors.newPassword = 'Enter a new password.';
  } else if (newPassword.length < 6) {
    errors.newPassword = 'Password must be at least 6 characters.';
  } else if (newPassword === currentPassword) {
    errors.newPassword = 'New password must be different from your current password.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your new password.';
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  autoComplete: string;
  error?: string;
  onChange: (value: string) => void;
};

function PasswordField({ id, label, placeholder, value, autoComplete, error, onChange }: PasswordFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`admin-form-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        required
      />
      {error ? (
        <p id={errorId} className="admin-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFieldErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  const runValidation = (current: string, next: string, confirm: string) => getFieldErrors(current, next, confirm);

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    setFieldErrors((previous) => {
      const nextErrors = { ...previous, currentPassword: undefined };

      if (newPassword && newPassword === value) {
        nextErrors.newPassword = 'New password must be different from your current password.';
      } else if (previous.newPassword?.includes('different')) {
        nextErrors.newPassword = undefined;
      }

      return nextErrors;
    });
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setFieldErrors((previous) => {
      const nextErrors = { ...previous, newPassword: undefined };

      if (value && value === currentPassword) {
        nextErrors.newPassword = 'New password must be different from your current password.';
      }

      if (confirmPassword) {
        nextErrors.confirmPassword =
          confirmPassword !== value ? 'Passwords do not match.' : undefined;
      }

      return nextErrors;
    });
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setFieldErrors((previous) => ({
      ...previous,
      confirmPassword: value && value !== newPassword ? 'Passwords do not match.' : undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = runValidation(currentPassword, newPassword, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (submitError) {
      const fieldError = getChangePasswordFieldError(submitError);
      if (fieldError) {
        setFieldErrors({ [fieldError.field]: fieldError.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={handleClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Account Security</p>
            <h2 id="change-password-title">Change Password</h2>
          </div>
          <button type="button" className="admin-modal-close" onClick={handleClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {success ? (
          <div className="admin-modal-form">
            <p className="admin-success">Your password has been updated.</p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className="admin-modal-form" onSubmit={handleSubmit} noValidate>
            <PasswordField
              id="change-current-password"
              label="Current password"
              placeholder="Enter current password"
              value={currentPassword}
              autoComplete="current-password"
              error={fieldErrors.currentPassword}
              onChange={handleCurrentPasswordChange}
            />

            <PasswordField
              id="change-new-password"
              label="New password"
              placeholder="Enter new password"
              value={newPassword}
              autoComplete="new-password"
              error={fieldErrors.newPassword}
              onChange={handleNewPasswordChange}
            />

            <PasswordField
              id="change-confirm-password"
              label="Confirm new password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-outline" onClick={handleClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                {submitting ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
