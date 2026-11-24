import { useRef, type ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import BenefitsSection from '../landing-page/components/BenefitsSection';
import DesignerSection from '../landing-page/components/DesignerSection';
import DigitalProfileSection from '../landing-page/components/DigitalProfileSection';
import ProductGallery from '../landing-page/components/ProductGallery';
import IndustriesSection from '../landing-page/components/IndustriesSection';
import FaqSection from '../landing-page/components/FaqSection';
import CTASection from '../landing-page/components/CTASection';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-product.css';
// Live builders reused from the homepage / wizard need the wizard preview styles.
import '../../../css/onelnk-wizard.css';
import '../../../css/onelnk-wizard-live.css';

const img = (name: string) => `/images/onelnk/${name}`;

/* Decorative inline icons for the steps section. Inline (not <img>) so their
   parts are individually animatable and so they inherit currentColor. */

// Landscape NFC card: frame + three signal arcs concentric on (9.6, 16) — which
// is also their CSS transform-origin, so they scale radially.
const IcoNfcCard = () => (
  <svg className="pstep__nfc" viewBox="0 0 32 32" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" focusable="false">
    <rect x="2" y="7" width="28" height="18" rx="3.5" />
    <path className="pstep__nfc-arc pstep__nfc-arc--1" d="M12.14 13.18a3.8 3.8 0 0 1 0 5.64" />
    <path className="pstep__nfc-arc pstep__nfc-arc--2" d="M14.79 11.16a7.1 7.1 0 0 1 0 9.68" />
    <path className="pstep__nfc-arc pstep__nfc-arc--3" d="M17.8 9.6a10.4 10.4 0 0 1 0 12.8" />
  </svg>
);

// Tick drawn on hover via stroke-dashoffset. Path length ≈ 20.2 → dash 21.
const IcoTick = () => (
  <svg className="pstep__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" focusable="false">
    <path d="M5 12.5 9.5 17 19 7" />
  </svg>
);

// p3-sync.svg redrawn inline: the rails run full height and the handles are
// filled with the tile colour so they occlude the rail they ride on — that is
// what lets a handle travel (the shipped asset carves a gap in the rail instead).
const IcoSliders = () => (
  <svg className="pstep__sliders" viewBox="0 0 40 40" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" focusable="false">
    <path d="M6.67 5V35" /><path d="M19.17 5V35" /><path d="M31.67 5V35" />
    <rect className="pstep__sliders-handle pstep__sliders-handle--1" x="3.33" y="13.33" width="6.67" height="5" rx="2.5" />
    <rect className="pstep__sliders-handle pstep__sliders-handle--2" x="15.83" y="21.67" width="6.67" height="5" rx="2.5" />
    <rect className="pstep__sliders-handle pstep__sliders-handle--3" x="28.33" y="16.67" width="6.67" height="5" rx="2.5" />
  </svg>
);

export default function Product() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const { settings, auth, galleryItems = [], plans = [] } = usePage<any>().props;
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  // Quick Benefit Bar
  const qbb = [
    { icon: 'p2-icon-1.svg', title: t('Instant Sharing'), text: t('Share your complete digital presence with one simple tap or QR code scan. No app required for the receiver.') },
    { icon: 'p2-icon-2.svg', title: t('Update Anytime'), text: t('Changed your job, number, or social handle? Update your digital profile instantly. No need to reprint your card.') },
    { icon: 'p2-icon-3.svg', title: t('Professional First Impression'), text: t('Modern, high-tech, and memorable. Leave an elegant, high-impact impression that ensures you get remembered.') },
    { icon: 'p2-icon-4.svg', title: t('Built For Everyone'), text: t('Tailored for freelancers, creators, executives, small businesses, and massive enterprise sales teams alike.') },
  ];

  // Card styles
  const styleCards = [
    {
      art: 'p4-classic.png', title: t('Classic Card'), desc: t('Pre-designed clean templates.'),
      tag: 'p4-tag.svg', tags: [t('Individuals'), t('Freelancers'), t('Consultants'), t('Quick Orders')],
      cta: t('Choose Classic'),
    },
    {
      featured: true, art: 'p4-custom.png', title: t('Custom Card'), desc: t('Greater control over card branding.'),
      tag: 's8-check-light.svg', tags: [t('Personal Brands'), t('Creatives'), t('Premium Users')],
      cta: t('Choose Custom'),
    },
    {
      art: 'p4-teams.png', title: t('Teams Card'), desc: t('Branded cards for your entire team.'),
      tag: 'p4-tag-b.svg', tags: [t('Sales Teams'), t('Corporate Dept.'), t('Business')],
      cta: t('Talk to Sales'),
    },
  ];

  // Sharing methods
  const share = [
    { icon: 'p7-share-1.svg', chip: t('Core Mode'), title: t('NFC Tap'), text: t('Hold your card near any smartphone. Profile opens instantly — zero friction.') },
    { icon: 'p7-share-2.svg', chip: t('Core Mode'), title: t('QR Code'), text: t('Every card includes a scannable QR code backup — perfect for print and events.') },
    { icon: 'p7-share-3.svg', chip: t('Core Mode'), title: t('Personal Link'), text: t('Your custom URL — share it anywhere via messages, email, or social media.') },
    { icon: 'p7-share-4.svg', soon: true, title: t('Apple Wallet'), text: t('Keep your digital business card in your Apple Wallet for instant widget access.') },
    { icon: 'p7-share-5.svg', soon: true, title: t('Google Wallet'), text: t('Add your custom QR code pass directly into your Google Wallet on Android.') },
    { icon: 'p7-share-6.svg', soon: true, title: t('Email Signature'), text: t('Beautiful interactive email footer layouts linked directly to your digital profile.') },
  ];

  // Pricing cards bind to the real enabled Plans (same rules as the homepage
  // PlansSection); the static OneLnk set is the fallback when none are configured.
  const formatCurrency = (amount: number | string) => {
    const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
    if (typeof window !== 'undefined' && (window as any).appSettings?.formatCurrency) {
      return (window as any).appSettings.formatCurrency(n, { showSymbol: true });
    }
    return '$' + n;
  };
  const enabledPlans = (plans as any[]).filter(
    (p) => p.is_plan_enable === 'on' && (p.duration === 'monthly' || p.duration === 'both'),
  );
  // With exactly three plans the middle card is highlighted; else the "popular" flag.
  const featuredIdx = enabledPlans.length === 3 ? 1 : -1;
  type PlanCard = { key: string; featured?: boolean; eyebrow: string; price: ReactNode; desc: string; tag?: string; check: string; features: string[]; cta: string; href: string };
  const planCards: PlanCard[] =
    enabledPlans.length > 0
      ? enabledPlans.map((p, idx) => {
          const free = Number(p.price) === 0;
          const featured = idx === featuredIdx || !!p.is_popular;
          return {
            key: String(p.id),
            featured,
            eyebrow: p.name,
            price: <><b>{free ? t('Free') : formatCurrency(p.price)}</b>{free ? '' : ` / ${t('month')}`}</>,
            desc: p.description,
            check: featured ? 's8-check-light.svg' : 's8-check-dark.svg',
            features: p.features || [],
            cta: free ? t('Start Free') : t('Get Started'),
            href: free ? route('register') : route('create-card.create'),
          };
        })
      : [
          {
            key: 'free', eyebrow: t('Free'), price: <><b>$0</b> / {t('forever')}</>, desc: t('Get started with your digital profile and basic sharing tools.'),
            check: 's8-check-dark.svg', features: [t('Digital profile'), t('Basic Link Sharing'), t('Limited Customization')],
            cta: t('Start Free'), href: route('register'),
          },
          {
            key: 'premium', featured: true, eyebrow: t('Premium NFC Card'), price: <><b>$49</b> {t('One-time')}</>, desc: t('The complete package — premium physical card with a powerful digital profile.'),
            tag: t('4 months FREE included'), check: 's8-check-light.svg',
            features: [t('Digital profile'), t('PVC NFC card'), t('Custom card design'), t('More profile sections'), t('Priority design options')],
            cta: t('Create My Card'), href: route('create-card.create'),
          },
          {
            key: 'teams', eyebrow: t('Teams'), price: <b>{t('Custom')}</b>, desc: t('Branded employee cards with centralized team management.'),
            check: 's8-check-dark.svg', features: [t('Multiple employee cards'), t('Company branding'), t('Team management'), t('Bulk order'), t('Centralized control')],
            cta: t('Request a Quote'), href: route('marketing.teams'),
          },
        ];

  // Corporate portal
  const corpPoints = [
    { b: t('Bulk Order'), s: t('Pre-formatted employee layouts') },
    { b: t('Company Branding'), s: t('Lock color swatches & logo files') },
    { b: t('Employee Profiles'), s: t('Rapid CSV upload and creation') },
    { b: t('Admin Control'), s: t('Instant lockout and profile wipe') },
  ];
  const directory = [
    { photo: 'p8-av-1.png', name: 'Sarah Jenkins', role: t('Creative Director'), taps: '412' },
    { photo: 'p8-av-2.png', name: 'Marcus Vance', role: t('Sales Partner'), taps: '389' },
    { photo: 'p8-av-3.png', name: 'Elena Rostova', role: t('Architect'), taps: '231' },
  ];

  return (
    <div ref={revealRef}>
      <Head title={`${t('Product')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-product">
        <header className="phead page-hero">
          <div className="phead__inner">
            <div className="phead__intro">
              <div className="phead__copy">
                <h1 className="phead__title">
                  {t('A custom NFC card that opens your')}<br />{t('complete digital profile')}
                </h1>
                <p className="phead__lede">
                  {t('Design your card, build your profile, and share your contact details, links, WhatsApp, and socials with one tap.')}
                </p>
              </div>
              <div className="btn-row phead__actions">
                <Link href={route('create-card.create')} className="btn btn--primary">{t('Create My Card')}</Link>
                <a href="#steps" className="btn btn--navy benefits__cta">{t('See How It Works')}</a>
              </div>
            </div>

            <div className="stage">
              <div className="stage__grid" aria-hidden="true"><img src={img('p1-grid.svg')} alt="" /></div>
              <div className="stage__stars" aria-hidden="true"><img src={img('p1-stars.svg')} alt="" /></div>
              <div className="stage__lights" aria-hidden="true">
                <div className="stage__lights-a"><img src={img('p1-lights.svg')} alt="" /></div>
                <div className="stage__lights-b"><img src={img('p1-lights-2.svg')} alt="" /></div>
              </div>
              <div className="stage__features featurecard">
                <div className="feature"><img src={img('icon-check.svg')} alt="" /><span>{t('No App Required')}</span></div>
                <div className="feature feature--fixed"><img src={img('icon-check.svg')} alt="" /><span>{t('Premium PVC NFC Card')}</span></div>
                <div className="feature"><img src={img('icon-check.svg')} alt="" /><span>{t('Instant Sharing')}</span></div>
              </div>
              <div className="stage__nfc" aria-hidden="true">
                <div className="stage__nfc-inner"><img src={img('hero-nfc-card.png')} alt="" /></div>
              </div>
              <div className="stage__phone" aria-hidden="true">
                <img className="stage__phone-frame" src={img('hero-phone.png')} alt="" />
                <div className="stage__phone-screen"><img src={img('hero-phone-screen.png')} alt="" /></div>
                <div className="stage__phone-island"></div>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Quick Benefit Bar */}
          <section className="qbb" aria-labelledby="qbb-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="qbb-title">{t('Everything You Need to Network Smarter')}</h2>
              <p className="phead-block__text">
                {t('Traditional paper business cards are static, easily lost, and instantly outdated.')}<br />
                {t('Here is why modern networking champions choose OneLnk.')}
              </p>
            </div>
            <div className="qbb__grid">
              {qbb.map((c) => (
                <article className="qbb__card" key={c.title}>
                  <img src={img(c.icon)} alt="" />
                  <div className="qbb__body">
                    <h3 className="qbb__title">{c.title}</h3>
                    <p className="qbb__text">{c.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section className="steps" id="steps" aria-labelledby="steps-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="steps-title">{t('From One Tap to a Lasting Connection')}</h2>
              <p className="phead-block__text">
                {t('We make networking effortless. No setups or app installations required for either you or your recipients.')}
              </p>
            </div>
            <ol className="steps__row">
              <li className="pstep">
                <div className="pstep__figure">
                  <div className="pstep__tile">
                    <div className="pstep__tile-inner">
                      <span className="pstep__orb pstep__orb--phone"><img src={img('p3-tap.svg')} alt="" /></span>
                      <img className="pstep__arrow" src={img('p3-arrow.svg')} alt="" />
                      <span className="pstep__orb pstep__orb--card"><IcoNfcCard /></span>
                    </div>
                  </div>
                  <div className="pstep__badge"><span>01</span></div>
                </div>
                <div className="pstep__caption">
                  <h3 className="pstep__title">{t('Tap Your NFC Card')}</h3>
                  <p className="pstep__text">{t('Tap your OneLnk card on any iPhone or Android device.')}</p>
                </div>
              </li>
              <li className="pstep">
                <div className="pstep__figure">
                  <div className="pstep__tile">
                    <div className="pstep__tile-inner pstep__tile-inner--col">
                      <span className="pstep__chip pstep__chip--url">onelnk.co/profile</span>
                      <p className="pstep__loading">
                        {t('Browser Loading')}
                        <span className="pstep__dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
                      </p>
                    </div>
                  </div>
                  <div className="pstep__badge"><span>02</span></div>
                </div>
                <div className="pstep__caption">
                  <h3 className="pstep__title">{t('Digital Profile Opens')}</h3>
                  <p className="pstep__text">{t('Your complete digital profile opens instantly in their browser.')}</p>
                </div>
              </li>
              <li className="pstep">
                <div className="pstep__figure">
                  <div className="pstep__tile">
                    <div className="pstep__tile-inner pstep__tile-inner--col">
                      <span className="pstep__chip pstep__chip--save">
                        <img src={img('p3-save.svg')} alt="" />{t('Save')}<IcoTick />
                      </span>
                      <span className="pstep__chip pstep__chip--call"><img src={img('p3-call.svg')} alt="" />{t('Call')}</span>
                      <span className="pstep__chip pstep__chip--wa"><img src={img('p3-whatsapp.svg')} alt="" />{t('WhatsApp')}</span>
                    </div>
                  </div>
                  <div className="pstep__badge"><span>03</span></div>
                </div>
                <div className="pstep__caption">
                  <h3 className="pstep__title">{t('Instant Connection')}</h3>
                  <p className="pstep__text">{t('Save their contact or explore your links with one click.')}</p>
                </div>
              </li>
              <li className="pstep">
                <div className="pstep__figure">
                  <div className="pstep__tile">
                    <div className="pstep__tile-inner pstep__tile-inner--col" style={{ gap: 8 }}>
                      <IcoSliders />
                      <p className="pstep__sync-label">{t('Real-Time Sync')}</p>
                    </div>
                  </div>
                  <div className="pstep__badge"><span>04</span></div>
                </div>
                <div className="pstep__caption">
                  <h3 className="pstep__title">{t('Update Anytime')}</h3>
                  <p className="pstep__text">{t('Manage your profile and links in real time from one dashboard.')}</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Choose Card Style */}
          <section className="styles" aria-labelledby="styles-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="styles-title">{t('From One Tap to a Lasting Connection')}</h2>
              <p className="phead-block__text">
                {t('We make networking effortless. No setups or app installations required for either you or your recipients.')}
              </p>
            </div>
            <div className="styles__row">
              {styleCards.map((s) => (
                <article className={s.featured ? 'scard scard--featured' : 'scard'} key={s.title}>
                  {s.featured && <span className="ribbon">{t('Recommended')}</span>}
                  <div className="scard__top">
                    <div className="scard__art"><img src={img(s.art)} alt={s.title} /></div>
                    <div className="scard__heading">
                      <h3 className="scard__title">{s.title}</h3>
                      <p className="scard__desc">{s.desc}</p>
                    </div>
                    <ul className="scard__tags">
                      {s.tags.map((tag) => (
                        <li className="scard__tag" key={tag}><img src={img(s.tag)} alt="" /><span>{tag}</span></li>
                      ))}
                    </ul>
                  </div>
                  <Link href={s.cta === t('Talk to Sales') ? route('marketing.teams') : route('create-card.create')} className={s.featured ? 'scard__cta scard__cta--accent' : 'scard__cta'}>{s.cta}</Link>
                </article>
              ))}
            </div>
          </section>

          {/* Configurator — live card builder (reused from the homepage) */}
          <DesignerSection variant="surface" stickyPreview />

          {/* Digital profile — live preview + theme picker (like create-card step 3) */}
          <DigitalProfileSection />

          {/* Sharing Methods */}
          <section className="share" aria-labelledby="share-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="share-title">{t('More Ways to Share')}</h2>
              <p className="phead-block__text">
                {t('An NFC tap is just the beginning. OneLnk adapts to any online or offline contact situation.')}
              </p>
            </div>
            <div className="share__grid">
              {share.map((s) => (
                <article className="share__card" key={s.title}>
                  <div className="share__head">
                    <span className="share__icon"><img src={img(s.icon)} alt="" /></span>
                    <span className={s.soon ? 'share__chip share__chip--soon' : 'share__chip'}>{s.soon ? t('Coming Soon') : s.chip}</span>
                  </div>
                  <div className="share__body">
                    <h3 className="share__title">{s.title}</h3>
                    <p className="share__text">{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Shared: Benefits compare */}
      <BenefitsSection />

      {/* Marketing plans (static 3-up) */}
      <div className="onelnk-landing onelnk-product">
        <section className="packages packages--light" aria-labelledby="plan-title">
          <div className="phead-block">
            <h2 className="phead-block__title" id="plan-title">{t('From One Tap to a Lasting Connection')}</h2>
            <p className="phead-block__text">
              {t('We make networking effortless. No setups or app installations required for either you or your recipients.')}
            </p>
          </div>
          <div className="packages__grid">
            {planCards.map((p) => (
              <article className={p.featured ? 'plan plan--featured' : 'plan'} key={p.key}>
                {p.featured && <span className="ribbon">{t('Recommended')}</span>}
                <div className="plan__top">
                  <div className="plan__intro">
                    <p className="plan__eyebrow">{p.eyebrow}</p>
                    <p className="plan__price">{p.price}</p>
                    <p className="plan__desc">{p.desc}</p>
                    {p.tag && <span className="plan__tag">{p.tag}</span>}
                  </div>
                  <ul className="plan__features">
                    {p.features.map((f, i) => (
                      <li className="plan__feature" key={i}><img src={img(p.check)} alt="" /><span>{f}</span></li>
                    ))}
                  </ul>
                </div>
                <Link href={p.href} className={p.featured ? 'plan__cta plan__cta--accent' : 'plan__cta'}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        {/* Corporate portal */}
        <section className="corp" aria-labelledby="corp-title">
          <div className="corp__left">
            <div className="corp__intro">
              <div className="corp__copy">
                <h2 className="corp__title" id="corp-title">{t('Networking for Your Entire Organization')}</h2>
                <p className="corp__lede">
                  {t('Unlock centralized control for marketing, sales and HR. Synchronize brand templates, enforce corporate logos, lock sub-fields, and analyze company-wide networking performance.')}
                </p>
              </div>
              <ul className="corp__grid">
                {corpPoints.map((c) => (
                  <li className="corp__point" key={c.b}>
                    <img src={img('p8-check.svg')} alt="" />
                    <div><b>{c.b}</b><span>{c.s}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={route('marketing.teams')} className="btn btn--primary benefits__cta">{t('Request Corporate Order')}</Link>
          </div>

          <div className="portal">
            <div className="portal__head">
              <div className="portal__brand">
                <img src={img('p8-portal.svg')} alt="" />
                <p>{t('OneLNK Team Portal')}</p>
              </div>
              <span className="portal__tag">{t('Future Admin Dashboard')}</span>
            </div>
            <div className="portal__stats">
              <div className="portal__stat"><span>{t('Active Cards')}</span><b>142</b></div>
              <div className="portal__stat"><span>{t('Weekly Taps')}</span><b>1894</b></div>
              <div className="portal__stat"><span>{t('Leads Saved')}</span><b>612</b></div>
            </div>
            <div className="portal__panel">
              <p className="portal__panel-label">{t('Employee Directory')}</p>
              <ul className="portal__list">
                {directory.map((d) => (
                  <li className="portal__row" key={d.name}>
                    <div className="portal__person">
                      <img src={img(d.photo)} alt="" />
                      <div><b>{d.name}</b><span>{d.role}</span></div>
                    </div>
                    <p className="portal__taps">{d.taps} {t('Taps')}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="portal__panel">
              <p className="portal__panel-label">{t('Lead Conversion Efficiency')}</p>
              <div className="portal__chart" aria-hidden="true">
                <i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Gallery (Swiper), Industries (rounded), FAQ, CTA, Footer */}
      <ProductGallery galleryItems={galleryItems} />
      <IndustriesSection rounded />
      <FaqSection settings={settings} />
      <CTASection sectionData={{}} />
      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </div>
  );
}
