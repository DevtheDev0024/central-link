import { FormEvent, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { submitContactForm } from '../lib/web3forms';

const SUBJECT_OPTIONS = [
  'General inquiry',
  'Membership',
  'Visit as a guest',
  'Partnership or sponsorship',
  'Other',
] as const;

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim(),
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject(SUBJECT_OPTIONS[0]);
      setMessage('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send your message.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="contact-form-success" role="status">
        <strong>Message sent</strong>
        <p>Thank you for reaching out. A club officer will get back to you soon.</p>
        <button type="button" className="contact-form-submit" onClick={() => setSuccess(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {error ? (
        <p className="contact-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="contact-form-field">
        <label htmlFor="contact-name">Full name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div className="contact-form-grid">
        <div className="contact-form-field">
          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="contact-form-field">
          <label htmlFor="contact-phone">Phone number</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="+94 77 123 4567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-subject">Subject</label>
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="contact-form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Tell us how we can help..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <button type="submit" className="contact-form-submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className="contact-form-spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
