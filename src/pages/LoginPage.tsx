import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput } from '../components/auth/AuthInput';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../lib/authErrors';
import { getPostLoginRedirect, type LoginRedirectState } from '../lib/authNavigation';

function getLoginErrorMessage(error: unknown): string {
  return getAuthErrorMessage(error, 'Unable to sign in. Please check your credentials and try again.');
}

export default function LoginPage() {
  const { user, loading, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = getPostLoginRedirect(location.state as LoginRedirectState | null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!loading && user) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setResetMessage(null);

    try {
      await signIn(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      setError(getLoginErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email address first, then choose forgot password.');
      return;
    }

    setError(null);
    setResetMessage(null);

    try {
      await resetPassword(email.trim());
      setResetMessage('Password reset email sent. Check your inbox.');
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError));
    }
  };

  return (
    <AuthLayout
      title="Member Portal"
      backLabel="Back to Home"
    >
      <form className="auth-card auth-signin-card" onSubmit={handleSubmit}>
        <div className="auth-card-header">
          <span className="auth-card-eyebrow">Member access</span>
          <h2 className="auth-card-title">Sign In</h2>
          <p className="auth-card-intro">
            Use your member email and password to access the member portal for 2025/2026.
          </p>
        </div>

        {error ? <p className="auth-error">{error}</p> : null}
        {resetMessage ? <p className="auth-success">{resetMessage}</p> : null}

        <AuthInput
          icon={<Mail size={18} />}
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="Enter member email"
          aria-label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <AuthInput
          icon={<Lock size={18} />}
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          aria-label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? <Lock size={16} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
          {submitting ? 'Signing in…' : 'Continue'}
        </button>

        <button type="button" className="auth-secondary-action" onClick={handleResetPassword}>
          Forgot password?
        </button>

        <div className="auth-card-footnotes">
          <p>© 2026 Central Link Toastmasters. Member access only.</p>
        </div>
      </form>
    </AuthLayout>
  );
}
