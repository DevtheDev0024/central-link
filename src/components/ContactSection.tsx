import ContactForm from './ContactForm';
import '../styles/contact.css';

type ContactSectionProps = {
  className?: string;
};

export default function ContactSection({ className }: ContactSectionProps) {
  return (
    <footer
      id="contact"
      className={`contact-section landing-reveal${className ? ` ${className}` : ''}`}
      data-landing-reveal
      aria-labelledby="contact-section-title"
    >
      <div className="contact-shell">
        <div className="contact-shell-intro">
          <p className="landing-story-kicker">Get in touch</p>

          <h2 id="contact-section-title" className="contact-title">
            Contact Us
          </h2>

          <p className="contact-lead">
            Questions about membership, visiting a meeting, or club activities? Send us a message
            and a club officer will reply to the email address you provide.
          </p>

          <div className="contact-meta">
            <div>
              <span>Location</span>
              <strong>Kandy, Sri Lanka</strong>
            </div>
            <div>
              <span>Club</span>
              <strong>Central Link Toastmasters</strong>
            </div>
            <div>
              <span>Division</span>
              <strong>Division I • District 82</strong>
            </div>
          </div>
        </div>

        <div className="contact-shell-form" aria-label="Contact form">
          <ContactForm />
        </div>
      </div>

      <div className="contact-footer-bottom" aria-label="Site status">
        <span>© 2026 Central Link Toastmasters</span>
        <span>All systems operational</span>
      </div>
    </footer>
  );
}
