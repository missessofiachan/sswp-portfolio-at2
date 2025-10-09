/**
 * About page for Sofia's Shop.
 *
 * Presents the brand mission, guiding values, milestones, and answers to
 * frequently asked questions about the business.
 */
import * as s from './about.css';

const STATS = [
  { label: 'Community makers featured', value: '25+' },
  { label: 'Customer satisfaction score', value: '4.9/5' },
  { label: 'Orders shipped plastic-free', value: '98%' },
];

const VALUES = [
  {
    title: 'Thoughtful Curation',
    copy: "Every item is hand-selected for its story, workmanship, and the joy it brings to a home—never just because it's on trend.",
  },
  {
    title: 'Community Roots',
    copy: 'We collaborate with local artisans across Australia, reinvesting a portion of every purchase back into the maker community.',
  },
  {
    title: 'Crafted Sustainability',
    copy: 'From responsibly sourced materials to minimal packaging, sustainability is designed into every product we stock.',
  },
];

const TIMELINE = [
  {
    year: '2019',
    headline: 'Idea on the market stall',
    detail:
      'Sofia sketched the first concept for the shop after weekend markets revealed how many small makers needed a permanent showcase.',
  },
  {
    year: '2021',
    headline: 'Online boutique launches',
    detail:
      'The curated collection went digital, pairing storytelling with an easy-to-use vintage-inspired shopping experience.',
  },
  {
    year: '2023',
    headline: 'Circular packaging initiative',
    detail:
      'Introduced a reusable packaging buy-back program that keeps materials in circulation and rewards repeat customers.',
  },
  {
    year: '2025',
    headline: 'Community studio opens',
    detail:
      'We opened a shared studio for makers to prototype, teach, and host gatherings that connect customers with the creative process.',
  },
];

const FAQS = [
  {
    question: "Who makes the products sold at Sofia's Shop?",
    answer:
      'We partner with independent makers from across Australia. Each creator is vetted for craftsmanship, fair labour practices, and responsible sourcing before joining the collection.',
  },
  {
    question: 'How do you ensure ethical sourcing?',
    answer:
      'We audit supplier materials annually, maintain transparent supply chains, and prioritise recycled or renewable inputs whenever possible. Our packaging is 98% plastic-free and on a path to 100%.',
  },
  {
    question: 'Can I visit a physical space?',
    answer:
      'Yes! Our community studio in Sydney is open for appointment-based browsing, workshops, and maker-led events. Subscribe to our newsletter for the latest schedule.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      "We currently ship within Australia and New Zealand. International expansion is on our roadmap—contact us if you'd like to be notified when it launches.",
  },
];

export default function About() {
  return (
    <article className={s.page}>
      <header className={s.hero}>
        <h1 className={s.missionHeadline}>About Sofia&apos;s Shop</h1>
        <p className={s.missionLead}>
          Sofia&apos;s Shop curates heirloom-quality homewares, stationery, and self-care pieces
          from the makers we admire most. We pair intentional design with mindful sourcing so you
          can support artisans, tread lightly, and surround yourself with stories worth telling.
        </p>
        <p className={s.highlight}>
          Our mission is to celebrate slow-made objects that make everyday rituals feel special.
        </p>
        <div className={s.stats}>
          {STATS.map((stat) => (
            <div key={stat.label} className={s.statCard}>
              <p className={s.statNumber}>{stat.value}</p>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      <section className={s.valuesSection}>
        <h2>Guiding values</h2>
        <div className={s.valueGrid}>
          {VALUES.map((value) => (
            <article key={value.title} className={s.valueCard}>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Milestones</h2>
        <ol className={s.timeline}>
          {TIMELINE.map((item) => (
            <li key={item.year} className={s.timelineItem}>
              <h3>
                {item.year}: {item.headline}
              </h3>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.faqSection}>
        <h2>Frequently asked questions</h2>
        <div className={s.faqList}>
          {FAQS.map((faq) => (
            <details key={faq.question} className={s.faqItem}>
              <summary className={s.faqSummary}>{faq.question}</summary>
              <div className={s.faqContent}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
