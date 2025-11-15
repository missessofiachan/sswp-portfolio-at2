import { MdEmail, MdPrivacyTip } from 'react-icons/md';
import * as legal from './legal.css';

const lastUpdated = new Date().toLocaleDateString();

export default function PrivacyPolicy() {
  return (
    <article className={legal.page}>
      <header className={legal.header}>
        <span className={legal.iconWrap} aria-hidden="true">
          <MdPrivacyTip size={36} />
        </span>
        <h1>Privacy Policy</h1>
        <p className={legal.subtitle}>Last updated: {lastUpdated}</p>
        <p className={legal.helperText}>
          Sofia&apos;s Shop respects your privacy. This statement explains what information we
          collect, how we use it, and the choices you can make.
        </p>
      </header>

      <div className={legal.panel}>
        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Information We Collect</h2>
          <ul className={legal.bulletList}>
            <li>Account details you share with us, such as name, email and password.</li>
            <li>Order history, saved carts and product preferences.</li>
            <li>Support conversations or feedback you send to our team.</li>
            <li>
              Technical data captured automatically, including device type, browser version and
              anonymised usage analytics.
            </li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>How We Use Your Information</h2>
          <ul className={legal.bulletList}>
            <li>Fulfil orders, manage deliveries and provide customer support.</li>
            <li>Personalise product recommendations and store experiences.</li>
            <li>Monitor platform reliability, performance and security.</li>
            <li>
              Send transactional updates you request, such as order confirmations or password
              resets.
            </li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Data Retention & Security</h2>
          <p>
            We keep personal data only as long as needed for the purposes above or to meet legal
            obligations. Passwords are hashed, payment details are handled by PCI-compliant
            providers, and access is restricted to authorised team members.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Third-Party Services</h2>
          <p>
            Sofia&apos;s Shop partners with trusted services for payments, analytics and
            infrastructure. We share only the minimum data required, and each partner is bound by
            strict privacy and security agreements.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Your Choices</h2>
          <ul className={legal.bulletList}>
            <li>Update your profile or marketing preferences from your account dashboard.</li>
            <li>Request a copy or deletion of your data by contacting support.</li>
            <li>
              Opt out of non-essential communications using the unsubscribe link in any email.
            </li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Contact Us</h2>
          <p>
            Questions about privacy or data use? Reach out at{' '}
            <a href="mailto:privacy@sofiasshop.com">privacy@sofiasshop.com</a>. We aim to respond
            within five business days.
          </p>
          <p className={legal.helperText}>
            <MdEmail aria-hidden="true" /> Our team is here to help you exercise your privacy
            rights.
          </p>
        </section>
      </div>
    </article>
  );
}
