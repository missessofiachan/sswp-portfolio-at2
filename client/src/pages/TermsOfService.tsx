import { MdGavel } from 'react-icons/md';
import * as legal from './legal.css';

const lastReviewed = new Date().toLocaleDateString();

export default function TermsOfService() {
  return (
    <article className={legal.page}>
      <header className={legal.header}>
        <span className={legal.iconWrap} aria-hidden="true">
          <MdGavel size={32} />
        </span>
        <h1>Terms of Service</h1>
        <p className={legal.subtitle}>Last reviewed: {lastReviewed}</p>
        <p className={legal.helperText}>
          These terms describe how Sofia&apos;s Shop operates, what you can expect from us, and the
          responsibilities that come with using our store.
        </p>
      </header>

      <div className={legal.panel}>
        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>1. Agreement to Terms</h2>
          <p>
            By creating an account or placing an order, you agree to these Terms of Service and our
            Privacy Policy. If you do not accept the terms, please do not use the store.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>2. Account Responsibilities</h2>
          <ul className={legal.bulletList}>
            <li>
              Keep your login credentials secure and notify us if you suspect unauthorised access.
            </li>
            <li>Ensure your account information is accurate and up to date.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>3. Orders & Availability</h2>
          <p>
            All orders are subject to availability. We may cancel or refund an order if inventory is
            limited, pricing is incorrect, or fraud is suspected. If an issue arises, we will
            contact you promptly with next steps or alternatives.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>4. Pricing & Payment</h2>
          <ul className={legal.bulletList}>
            <li>Prices are listed in AUD and include GST unless noted otherwise.</li>
            <li>We process payments securely through trusted PCI-compliant partners.</li>
            <li>Discounts, promotions and gift cards cannot be combined unless clearly stated.</li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>5. Shipping & Returns</h2>
          <p>
            Estimated delivery windows are provided at checkout. If you are unsatisfied with a
            purchase, you can request a return within 30 days of delivery, provided items are unused
            and in original condition. Some products, like perishables or personalised goods, may be
            exempt from returns.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>6. Liability</h2>
          <p>
            Sofia&apos;s Shop is not liable for indirect or consequential damages arising from
            product use. Our total liability is limited to the amount you paid for the affected
            order, to the extent permitted by law.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>7. Changes to These Terms</h2>
          <p>
            We may update these terms to reflect new features or regulatory requirements. When we
            make changes, we&apos;ll post the revised version here with an updated review date.
            Continued use of the store after updates constitutes acceptance of the new terms.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Need Help?</h2>
          <p>
            Contact our team at <a href="mailto:support@sofiasshop.com">support@sofiasshop.com</a>{' '}
            if you have questions about these terms or require a copy in an accessible format.
          </p>
        </section>
      </div>
    </article>
  );
}
