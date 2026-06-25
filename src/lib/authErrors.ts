export function getAuthErrorMessage(error: unknown, fallback: string): string {  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('invalid-credential') || message.includes('wrong-password')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (message.includes('user-not-found')) {
      return 'No account found for that email.';
    }
    if (message.includes('too-many-requests')) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    if (message.includes('weak-password')) {
      return 'Password must be at least 6 characters.';
    }
    if (message.includes('requires-recent-login')) {
      return 'Please sign in again, then try changing your password.';
    }
  }

  return fallback;
}

type ChangePasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

export function getChangePasswordFieldError(
  error: unknown,
): { field: ChangePasswordField; message: string } | null {
  if (!(error instanceof Error)) return null;

  const message = error.message;

  if (message.includes('invalid-credential') || message.includes('wrong-password')) {
    return { field: 'currentPassword', message: 'Current password is incorrect.' };
  }
  if (message.includes('weak-password')) {
    return { field: 'newPassword', message: 'Password must be at least 6 characters.' };
  }
  if (message.includes('too-many-requests')) {
    return {
      field: 'currentPassword',
      message: 'Too many attempts. Please wait a moment and try again.',
    };
  }
  if (message.includes('requires-recent-login')) {
    return {
      field: 'currentPassword',
      message: 'Please sign in again, then try changing your password.',
    };
  }

  return { field: 'currentPassword', message: 'Unable to change password. Please try again.' };
}