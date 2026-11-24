import { Head, Link, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-faq.css';

const img = (name: string) => `/images/onelnk/${name}`;

type Item = { q: string; a?: string; open?: boolean };
type Cat = { slug: string; icon: string; name: string; items: Item[] };

const CATEGORIES: Cat[] = [
  {
    slug: 'product-features', icon: 'fq-cat-1.svg', name: 'Product & Features',
    items: [
      { q: 'What is a OneLnk Digital Business Card?', a: 'A premium NFC card that instantly opens your digital profile with a tap or QR scan, making it easy to share contacts, links, and more.', open: true },
      { q: 'What comes with my purchase?' },
      { q: 'Do I need an app?' },
      { q: 'Can I update my details later?' },
      { q: 'Can I add social media and websites?' },
    ],
  },
  {
    slug: 'nfc-compatibility', icon: 'fq-cat-2.svg', name: 'NFC Compatibility',
    items: [
      { q: 'Does the NFC card work on all phones?' },
      { q: "What if a phone doesn't support NFC?" },
      { q: 'Do users need to enable NFC?' },
      { q: 'Is an internet connection required?' },
    ],
  },
  {
    slug: 'digital-profile', icon: 'fq-cat-3.svg', name: 'Digital Profile',
    items: [
      { q: 'What is a digital profile?' },
      { q: 'Can I change my profile anytime?' },
      { q: 'Can I add my company logo?' },
      { q: 'Can people save my contact?' },
      { q: 'Can I track profile views?' },
    ],
  },
  {
    slug: 'orders-shipping', icon: 'fq-cat-4.svg', name: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?' },
      { q: 'Do you ship internationally?' },
      { q: 'Can I track my order?' },
      { q: 'Can I cancel my order?' },
    ],
  },
  {
    slug: 'customization', icon: 'fq-cat-5.svg', name: 'Customization',
    items: [
      { q: 'Can I customise my NFC card?' },
      { q: 'Can I choose different designs?' },
      { q: 'Can every employee have a unique profile?' },
      { q: 'Can I update the design later?' },
    ],
  },
  {
    slug: 'payments', icon: 'fq-cat-6.svg', name: 'Payments',
    items: [
      { q: 'Which payment methods do you accept?' },
      { q: 'Is payment secure?' },
      { q: 'Do you offer refunds?' },
      { q: 'Will I receive an invoice?' },
    ],
  },
  {
    slug: 'corporate-orders', icon: 'fq-cat-7.svg', name: 'Corporate Orders',
    items: [
      { q: 'Do you offer bulk discounts?' },
      { q: 'Can we manage all employee cards?' },
      { q: 'Can cards match our company branding?' },
      { q: 'Can we add employees later?' },
      { q: 'Do you provide onboarding?' },
    ],
  },
];

export default function Faq() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const { settings, auth } = usePage<any>().props;
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  return (
    <>
      <Head title={`${t('Frequently Asked Questions')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-faq" ref={revealRef}>
        <header className="fhead page-hero">
          <div className="fhead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('Frequently Asked Questions')}</h1>
            </div>
            <div className="btn-row phead__actions fhead__actions">
              <Link href={route('marketing.teams')} className="btn btn--primary">{t('Request a Quote')}</Link>
              <a href="#" className="btn btn--navy">{t('Book a Demo')}</a>
            </div>
          </div>
        </header>

        <main>
          <div className="faqpage">
            <nav className="faqnav" aria-label={t('FAQ categories')}>
              <div className="faqnav__search">
                <img src={img('fq-search.svg')} alt="" />
                <label className="visually-hidden" htmlFor="faq-search">{t('Search questions')}</label>
                <input id="faq-search" type="search" placeholder={t('Search question')} />
              </div>
              <div className="faqnav__rule" role="presentation"></div>
              <ul className="faqnav__list">
                {CATEGORIES.map((c, i) => (
                  <li key={c.slug}>
                    <a className="faqnav__link" href={`#${c.slug}`} aria-current={i === 0 ? 'true' : undefined}>
                      <img src={img(c.icon)} alt="" />
                      <span>{t(c.name)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="faqgroups">
              {CATEGORIES.map((c) => (
                <section className="faqgroup" id={c.slug} key={c.slug} aria-labelledby={`${c.slug}-title`}>
                  <h2 className="faqgroup__title" id={`${c.slug}-title`}>{t(c.name)}</h2>
                  <div className="faqgroup__list">
                    {c.items.map((it, idx) => (
                      <details className="faq__item" key={idx} open={!!it.open}>
                        <summary className="faq__q">
                          <span>{t(it.q)}</span>
                          <span className="faq__toggle">
                            <img className="is-closed" src={img('s12-plus.svg')} alt="" />
                            <img className="is-open" src={img('s12-minus.svg')} alt="" />
                          </span>
                        </summary>
                        {it.a ? <p className="faq__a">{t(it.a)}</p> : null}
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
