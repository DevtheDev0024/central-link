import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../styles/auth.css';

type AuthLayoutProps = {
  title: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function AuthLayout({
  title,
  children,
  backHref = '/',
  backLabel = 'Back to Home',
}: AuthLayoutProps) {
  const titleParts = title.split(/\s+/).filter(Boolean);

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <div className="auth-nav-inner">
          <Link to="/" className="auth-wordmark">
            <img src="/toastmasters-logo.png" alt="Toastmasters International logo" />
            <span>Central Link Toastmasters Club</span>
          </Link>

          <Link to={backHref} className="auth-back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            {backLabel}
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-main-copy">
          <h1>
            {titleParts.map((part, index) => (
              <span key={`${part}-${index}`}>{part}</span>
            ))}
          </h1>
        </div>

        {children}
      </main>
    </div>
  );
}
