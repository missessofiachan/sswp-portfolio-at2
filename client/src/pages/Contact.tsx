import type { FormEvent } from 'react';
import * as s from './contact.css';
import { input as inputClass, btnPrimary } from '@client/app/ui.css';

const CHANNELS = [
  {
    title: 'Customer support',
    description:
      'Questions about an order, delivery status, or product care? Our support team is here to help.',
    email: 'hello@sofias.shop',
    response: 'Replies within 1 business day',
  },
  {
    title: 'Wholesale & collaborations',
    description:
      "Interested in stocking Sofia's Shop pieces or collaborating on a limited collection?",
    email: 'partners@sofias.shop',
    response: 'Introductions reviewed each Wednesday',
  },
  {
    title: 'Workshops & studio hire',
    description:
      'Host an intimate workshop or book the community studio for your next maker meetup.',
    email: 'studio@sofias.shop',
    response: 'Site visits available by appointment',
  },
];

const STUDIO_DETAILS = [
  { label: 'Address', value: 'Level 2, 48 Market Lane, Sydney NSW 2000' },
  { label: 'Studio hours', value: 'Thu–Sat, 10:00am – 5:00pm (by appointment)' },
  { label: 'Phone', value: '+61 2 5550 1212' },
];

function handleEnquirySubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get('name')?.toString().trim() ?? '';
  const email = data.get('email')?.toString().trim() ?? '';
  const topic = data.get('topic')?.toString().trim() ?? 'General enquiry';
  const message = data.get('message')?.toString().trim() ?? '';

  const subject = encodeURIComponent(`${topic} — ${name || 'New message'}`);
  const bodyLines = [
    name && `Name: ${name}`,
    email && `Email: ${email}`,
    '',
    message || "Hi Sofia's Shop team,",
  ].filter(Boolean);
  const body = encodeURIComponent(bodyLines.join('\n'));

  window.location.href = `mailto:hello@sofias.shop?subject=${subject}&body=${body}`;
  event.currentTarget.reset();
}

export default function Contact() {
  return (
    <article className={s.page}>
      <header className={s.header}>
        <h1>Contact</h1>
        <p className={s.intro}>
          We love hearing from the community. Reach out for order support, creative collaborations,
          or to plan your next visit to the Sofia&apos;s Shop studio.
        </p>
      </header>

      <section>
        <h2>Reach the team</h2>
        <div className={s.grid}>
          {CHANNELS.map((channel) => (
            <article key={channel.title} className={s.card}>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
              <a className={s.emphasis} href={`mailto:${channel.email}`}>
                {channel.email}
              </a>
              <p className={s.subtle}>{channel.response}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Visit the studio</h2>
        <div className={s.grid}>
          <article className={s.card}>
            <h3>Where to find us</h3>
            <ul className={s.list}>
              {STUDIO_DETAILS.map((detail) => (
                <li key={detail.label}>
                  <span className={s.emphasis}>{detail.label}</span>
                  <p className={s.subtle}>{detail.value}</p>
                </li>
              ))}
            </ul>
          </article>
          <article className={s.card}>
            <h3>Plan your visit</h3>
            <p className={s.subtle}>
              The community studio is appointment-based so every visit feels relaxed and personal.
              Book ahead and let us know if you&apos;d like to preview specific collections.
            </p>
            <a className={s.emphasis} href="mailto:studio@sofias.shop?subject=Studio%20visit">
              Schedule a studio visit
            </a>
          </article>
        </div>
      </section>

      <section>
        <h2>Send a note</h2>
        <form className={s.form} onSubmit={handleEnquirySubmit}>
          <div className={s.field}>
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className={inputClass}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </div>
          <div className={s.field}>
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className={s.field}>
            <label htmlFor="contact-topic">Topic</label>
            <input
              id="contact-topic"
              name="topic"
              type="text"
              className={inputClass}
              placeholder="What would you like to chat about?"
            />
          </div>
          <div className={s.field}>
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              className={inputClass}
              rows={6}
              placeholder="Share the details and we\'ll get back to you shortly."
              required
            />
            <p className={s.note}>
              Submitting opens your email client so you can keep a copy of the conversation.
            </p>
          </div>
          <div>
            <button type="submit" className={btnPrimary}>
              Compose email
            </button>
          </div>
        </form>
      </section>
    </article>
  );
}
