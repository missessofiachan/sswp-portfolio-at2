import {
  MdAccessibility,
  MdOutlineContrast,
  MdOutlineKeyboard,
  MdOutlineTouchApp,
  MdOutlineVisibility,
} from 'react-icons/md';
import * as legal from './legal.css';

export default function Accessibility() {
  return (
    <article className={legal.page}>
      <header className={legal.header}>
        <span className={legal.iconWrap} aria-hidden="true">
          <MdAccessibility size={34} />
        </span>
        <h1>Accessibility Statement</h1>
        <p className={legal.subtitle}>Creating an inclusive shopping experience for everyone</p>
        <p className={legal.helperText}>
          Sofia&apos;s Shop is designed with accessibility in mind. We follow WCAG 2.1 AA guidance
          and continue to invest in improvements based on customer feedback.
        </p>
      </header>

      <div className={legal.panel}>
        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Key Features</h2>
          <ul className={legal.bulletList}>
            <li>
              <MdOutlineKeyboard aria-hidden="true" /> Keyboard-friendly navigation across
              navigation, cart and checkout.
            </li>
            <li>
              <MdOutlineContrast aria-hidden="true" /> A persistent theme toggle lets you switch
              between light and dark modes.
            </li>
            <li>
              <MdOutlineVisibility aria-hidden="true" /> Clear focus states, skip-to-content links
              and readable typography for low-vision customers.
            </li>
            <li>
              <MdOutlineTouchApp aria-hidden="true" /> Touch targets sized for mobile accessibility
              and screen reader friendly form labels.
            </li>
          </ul>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Assistive Technology Support</h2>
          <p>
            Our store uses semantic HTML, aria-labels and live regions where appropriate. We
            routinely test the shopping flow with screen readers such as NVDA and VoiceOver to
            ensure key tasks remain accessible.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Ongoing Improvements</h2>
          <p>
            Accessibility is an ongoing effort. We review new features for keyboard and screen
            reader support, track contrast ratios, and maintain documented workflows for addressing
            reported issues within 30 days.
          </p>
        </section>

        <section className={legal.section}>
          <h2 className={legal.sectionTitle}>Request Support or Give Feedback</h2>
          <p>
            If you encounter a barrier, let us know at{' '}
            <a href="mailto:accessibility@sofiasshop.com">accessibility@sofiasshop.com</a> or call
            1300 555 123 (Monday–Friday, 9am–5pm AEST). We aim to acknowledge requests within two
            business days.
          </p>
        </section>
      </div>
    </article>
  );
}
