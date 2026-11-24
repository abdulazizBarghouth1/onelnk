import { Head, Link, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import CTASection from '../landing-page/components/CTASection';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-packages.css';

const img = (name: string) => `/images/onelnk/${name}`;

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  yearly_price?: number;
  duration?: string;
  features?: string[];
  is_plan_enable: string;
}

// Plan.features can arrive as an array, a JSON string, or null depending on the
// serializer — normalize to a string[] defensively.
const toFeatureArray = (f: unknown): string[] => {
  if (Array.isArray(f)) return f as string[];
  if (typeof f === 'string') {
    try {
      const parsed = JSON.parse(f);
      return Array.isArray(parsed) ? parsed : f ? [f] : [];
    } catch {
      return f ? [f] : [];
    }
  }
  return [];
};

const formatCurrency = (amount: number | string) => {
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (typeof window !== 'undefined' && (window as any).appSettings?.formatCurrency) {
    return (window as any).appSettings.formatCurrency(n, { showSymbol: true });
  }
  return '$' + n;
};

// Feature comparison matrix (static marketing content — mirrors the Figma table).
const COMPARE_ROWS: Array<{ feature: string; free: boolean; premium: boolean; teams: boolean }> = [
  { feature: 'Digital Profile', free: true, premium: true, teams: true },
  { feature: 'Basic Link Sharing', free: true, premium: true, teams: true },
  { feature: 'Limited Customization', free: true, premium: true, teams: true },
  { feature: 'PVC NFC Card', free: false, premium: true, teams: true },
  { feature: 'Custom Card Design', free: false, premium: true, teams: true },
  { feature: 'More Profile Sections', free: false, premium: true, teams: true },
  { feature: 'Priority Design Options', free: false, premium: true, teams: true },
  { feature: 'Multiple Employee Cards', free: false, premium: false, teams: true },
  { feature: 'Company Branding', free: false, premium: false, teams: true },
  { feature: 'Team Management', free: false, premium: false, teams: true },
  { feature: 'Bulk Order', free: false, premium: false, teams: true },
  { feature: 'Centralized Control', free: false, premium: false, teams: true },
];

// "Everything included" grid (static — every account gets these).
const INCLUDES: Array<{ icon: string; title: string; text: string }> = [
  { icon: 'pk-inc-1.svg', title: 'Secure Digital Profile', text: 'Your profile is served over HTTPS with enterprise-grade security and GDPR compliance.' },
  { icon: 'pk-inc-2.svg', title: 'Instant Updates', text: 'Update contact details, links, or profile photo — changes go live instantly.' },
  { icon: 'pk-inc-3.svg', title: 'Mobile Friendly', text: 'Your digital card looks perfect on every screen — iPhone, Android, tablet, or desktop browser.' },
  { icon: 'pk-inc-4.svg', title: 'Unlimited Profile Views', text: 'No caps on how many times your profile can be viewed or shared. Network without limits.' },
  { icon: 'pk-inc-5.svg', title: 'QR Code Sharing', text: 'Every card includes a printable QR code that opens your profile on any smartphone camera.' },
  { icon: 'pk-inc-6.svg', title: 'Contact Saving', text: 'Anyone can save your full contact details to their phone in one tap.' },
  { icon: 'pk-inc-7.svg', title: 'Fast Loading', text: 'Profiles load in under a second globally. No waiting, no friction — the ideal first impression.' },
  { icon: 'pk-inc-8.svg', title: 'Cloud Hosting', text: 'Your profile is hosted on resilient cloud infrastructure with 99.9% uptime guaranteed.' },
];

const Mark = ({ yes }: { yes: boolean }) => (
  <span
    className={yes ? 'cmp__mark cmp__mark--yes' : 'cmp__mark cmp__mark--no'}
    role="img"
    aria-label={yes ? 'Included' : 'Not included'}
  >
    <img src={img(yes ? 'pk-yes-a.svg' : 'pk-no-a.svg')} alt="" />
    <img src={img(yes ? 'pk-yes-b.svg' : 'pk-no-b.svg')} alt="" />
  </span>
);

export default function Packages() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const { settings, auth, plans = [] } = usePage<any>().props as { settings: any; auth: any; plans: Plan[] };
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  const createCardUrl = route('create-card.create');
  const teamsUrl = route('marketing.teams');

  // Card view-model bound to the real enabled Plans (fallback = OneLnk static set).
  type Card = { key: string; eyebrow: string; priceBig: string; priceSuffix: string; desc: string; tag?: string; features: string[]; cta: string; href: string; featured: boolean };

  const featuredIdx = plans.length === 3 ? 1 : -1;

  const cards: Card[] =
    plans.length > 0
      ? plans.map((p, idx) => {
          const free = Number(p.price) === 0;
          const isTeam = /team/i.test(p.name);
          return {
            key: String(p.id),
            eyebrow: t(p.name),
            priceBig: free ? '$0' : formatCurrency(p.price),
            priceSuffix: free ? ` / ${t('forever')}` : ` / ${t('month')}`,
            desc: t(p.description || ''),
            features: toFeatureArray(p.features).map((f) => t(f)),
            cta: isTeam ? t('Request a Quote') : free ? t('Start Free') : t('Create My Card'),
            href: isTeam ? teamsUrl : createCardUrl,
            featured: idx === featuredIdx,
          };
        })
      : [
          {
            key: 'free', eyebrow: t('Free'), priceBig: '$0', priceSuffix: ` / ${t('forever')}`,
            desc: t('Get started with your digital profile and basic sharing tools.'),
            features: [t('Digital profile'), t('Basic Link Sharing'), t('Limited Customization')],
            cta: t('Start Free'), href: createCardUrl, featured: false,
          },
          {
            key: 'premium', eyebrow: t('Premium NFC Card'), priceBig: '$49', priceSuffix: ` ${t('One-time')}`,
            desc: t('The complete package — premium physical card with a powerful digital profile.'),
            tag: t('4 months FREE included'),
            features: [t('Digital profile'), t('PVC NFC card'), t('Custom card design'), t('More profile sections'), t('Priority design options')],
            cta: t('Create My Card'), href: createCardUrl, featured: true,
          },
          {
            key: 'teams', eyebrow: t('Teams'), priceBig: t('Custom'), priceSuffix: '',
            desc: t('Branded employee cards with centralized team management.'),
            features: [t('Multiple employee cards'), t('Company branding'), t('Team management'), t('Bulk order'), t('Centralized control')],
            cta: t('Request a Quote'), href: teamsUrl, featured: false,
          },
        ];

  return (
    <>
      <Head title={`${t('Packages')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-packages" ref={revealRef}>
        <header className="pkhead page-hero">
          <div className="pkhead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('Packages')}</h1>
              <p className="phead-block__text">
                {t("Whether you're creating a personal digital business card or managing cards for an entire team, choose the package")}<br />
                {t('that fits your needs. Upgrade anytime as your business grows.')}
              </p>
            </div>
            <div className="btn-row pkhead__actions">
              <Link href={createCardUrl} className="btn btn--primary">{t('Create My Card')}</Link>
              <a href="#compare" className="btn btn--navy">{t('Compare Plan')}</a>
            </div>
          </div>
        </header>

        <main>
          {/* Pricing cards — bound to real Plans */}
          <section className="packages packages--light packages--pk" aria-label={t('Pricing plans')}>
            <div className="packages__grid">
              {cards.map((card) => (
                <article className={card.featured ? 'plan plan--featured' : 'plan'} key={card.key}>
                  {card.featured && <span className="ribbon">{t('Recommended')}</span>}
                  <div className="plan__top">
                    <div className="plan__intro">
                      <p className="plan__eyebrow">{card.eyebrow}</p>
                      <p className="plan__price"><b>{card.priceBig}</b>{card.priceSuffix}</p>
                      <p className="plan__desc">{card.desc}</p>
                      {card.tag && <span className="plan__tag">{card.tag}</span>}
                    </div>
                    <ul className="plan__features">
                      {card.features.map((f, i) => (
                        <li className="plan__feature" key={i}>
                          <img src={img(card.featured ? 's8-check-light.svg' : 's8-check-dark.svg')} alt="" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={card.href} className={card.featured ? 'plan__cta plan__cta--accent' : 'plan__cta'}>
                    {card.cta}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Compare table — static marketing matrix */}
          <section className="compare-plans" id="compare" aria-labelledby="compare-title">
            <div className="compare-plans__glow" aria-hidden="true"><img src={img('pk-glow.svg')} alt="" /></div>
            <div className="phead-block">
              <h2 className="phead-block__title" id="compare-title">{t('Compare Every Plan')}</h2>
              <p className="phead-block__text">{t("See exactly what's included in each plan to make the right choice for your needs.")}</p>
            </div>
            <div className="cmp">
              <div className="cmp__row cmp__row--head">
                <div className="cmp__cell cmp__cell--feature">{t('Feature')}</div>
                <div className="cmp__cell">{t('Free')}</div>
                <div className="cmp__cell cmp__cell--hi">{t('Premium')}</div>
                <div className="cmp__cell">{t('Teams')}</div>
              </div>
              {COMPARE_ROWS.map((row) => (
                <div className="cmp__row" key={row.feature}>
                  <div className="cmp__cell cmp__cell--feature">{t(row.feature)}</div>
                  <div className="cmp__cell"><Mark yes={row.free} /></div>
                  <div className="cmp__cell cmp__cell--hi"><Mark yes={row.premium} /></div>
                  <div className="cmp__cell"><Mark yes={row.teams} /></div>
                </div>
              ))}
            </div>
          </section>

          {/* Everything included — static feature grid */}
          <section className="share include" aria-labelledby="include-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="include-title">{t('Everything You Need to Network Smarter')}</h2>
              <p className="phead-block__text">{t('Every OneLnk account — including the free plan — comes with these core features as standard')}</p>
            </div>
            <div className="share__grid share__grid--3">
              {INCLUDES.map((c) => (
                <article className="share__card" key={c.title}>
                  <div className="share__head">
                    <span className="share__icon"><img src={img(c.icon)} alt="" /></span>
                  </div>
                  <div className="share__body">
                    <h3 className="share__title">{t(c.title)}</h3>
                    <p className="share__text">{t(c.text)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="faq faq--pk" aria-labelledby="pkfaq-title">
            <div className="faq__intro">
              <h2 className="faq__title" id="pkfaq-title">{t('Frequently Asked')}<br />{t('Questions')}</h2>
              <Link href={route('marketing.contact')} className="btn btn--primary benefits__cta">{t('Contact Us')}</Link>
            </div>
            <div className="faq__list">
              {[
                { q: t('Do people need an app to open my card?') },
                { q: t('Can I update my information later?') },
                { q: t('Can I customize the physical card?') },
                { q: t('Does it work with iPhone and Android?') },
                { q: t('Can I order for my team?'), a: t('Yes, our Teams plan is built exactly for this. You can manage all employee profiles from one dashboard, apply consistent branding, and place bulk orders with discounted pricing. Contact us for a custom quote.') },
                { q: t('How long does delivery take?') },
              ].map((f) => (
                <details className="faq__item" key={f.q}>
                  <summary className="faq__q">
                    <span>{f.q}</span>
                    <span className="faq__toggle">
                      <img className="is-closed" src={img('s12-plus.svg')} alt="" />
                      <img className="is-open" src={img('s12-minus.svg')} alt="" />
                    </span>
                  </summary>
                  {f.a && <p className="faq__a">{f.a}</p>}
                </details>
              ))}
            </div>
          </section>

          <CTASection sectionData={{}} />
        </main>

        <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
      </div>
    </>
  );
}
