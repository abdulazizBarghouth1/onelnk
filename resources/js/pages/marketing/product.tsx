import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import BenefitsSection from '../landing-page/components/BenefitsSection';
import GallerySection from '../landing-page/components/GallerySection';
import IndustriesSection from '../landing-page/components/IndustriesSection';
import FaqSection from '../landing-page/components/FaqSection';
import CTASection from '../landing-page/components/CTASection';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-product.css';

const img = (name: string) => `/images/onelnk/${name}`;

export default function Product() {
  const { t } = useTranslation();
  const { settings, auth } = usePage<any>().props;
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';
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
      tag: 'p4-tag.svg', tags: [t('Personal Brands'), t('Creatives'), t('Premium Users')],
      cta: t('Choose Custom'),
    },
    {
      art: 'p4-teams.png', title: t('Teams Card'), desc: t('Branded cards for your entire team.'),
      tag: 'p4-tag-b.svg', tags: [t('Sales Teams'), t('Corporate Dept.'), t('Business')],
      cta: t('Talk to Sales'),
    },
  ];

  // Configurator layout options + colours
  const layouts = [t('Modern Accent'), t('Ultra Minimal'), t('Bold Typography'), t('Classic Corporate')];
  const swatches = ['#050e22', '#96ddea', '#c396ea', '#ea9697', '#eac796', '#96caea'];

  // Designer2 presets
  const presets = [t('Professional'), t('Minimal'), t('Corporate'), t('Dark'), t('Creative'), t('Luxury')];
  const phoneRows = [
    { icon: 'p6-phone.svg', label: t('Phone'), value: '(704) 555-0127' },
    { icon: 'p6-wa.svg', label: t('WhatsApp'), value: '(704) 555-0127' },
    { icon: 'p6-mail.svg', label: t('Email'), value: 'alex.rahman@example.com' },
    { icon: 'p6-pin.svg', label: t('Address'), value: '1901 Thornridge Cir. Shiloh, Hawaii 81063' },
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

  // Static marketing plans (3-up). Real plan selection happens in the wizard.
  const plans = [
    {
      eyebrow: t('Free'), price: <><b>$0</b> / {t('forever')}</>, desc: t('Get started with your digital profile and basic sharing tools.'),
      check: 's8-check-dark.svg', features: [t('Digital profile'), t('Basic Link Sharing'), t('Limited Customization')],
      cta: t('Start Free'),
    },
    {
      featured: true, eyebrow: t('Premium NFC Card'), price: <><b>$49</b> {t('One-time')}</>, desc: t('The complete package — premium physical card with a powerful digital profile.'),
      tag: t('4 months FREE included'), check: 's8-check-light.svg',
      features: [t('Digital profile'), t('PVC NFC card'), t('Custom card design'), t('More profile sections'), t('Priority design options')],
      cta: t('Create My Card'),
    },
    {
      eyebrow: t('Teams'), price: <b>{t('Custom')}</b>, desc: t('Branded employee cards with centralized team management.'),
      check: 's8-check-dark.svg', features: [t('Multiple employee cards'), t('Company branding'), t('Team management'), t('Bulk order'), t('Centralized control')],
      cta: t('Request a Quote'),
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
    <>
      <Head title={`${t('Product')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-product">
        <header className="phead">
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
              <div className="phead__actions">
                <Link href={route('create-card.create')} className="btn btn--primary">{t('Create My Card')}</Link>
                <a href="#steps" className="btn btn--outline">{t('See How It Works')}</a>
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
                      <span className="pstep__orb"><img src={img('p3-tap.svg')} alt="" /></span>
                      <img className="pstep__arrow" src={img('p3-arrow.svg')} alt="" />
                      <span className="pstep__orb"><img src={img('p3-phone.svg')} alt="" /></span>
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
                      <p className="pstep__loading">{t('Browser Loading...')}</p>
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
                      <span className="pstep__chip"><img src={img('p3-call.svg')} alt="" />{t('Call')}</span>
                      <span className="pstep__chip"><img src={img('p3-whatsapp.svg')} alt="" />{t('WhatsApp')}</span>
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
                      <img className="pstep__sync-icon" src={img('p3-sync.svg')} alt="" />
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

          {/* Configurator */}
          <section className="configurator" aria-labelledby="cfg-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="cfg-title">{t('See Your Card Before You Buy')}</h2>
              <p className="phead-block__text">
                {t('Customize every physical and digital asset. Choose premium finishes, tweak details, and see an absolute real-time 3D style preview.')}
              </p>
            </div>
            <div className="configurator__row">
              <div className="cfg">
                <div className="cfg__head">
                  <h3 className="cfg__title">{t('Customize Configuration')}</h3>
                  <div className="cfg__fields">
                    <div className="cfg__group">
                      <div className="cfg__pair">
                        <div className="cfg__field"><label className="cfg__label">{t('Full Name')}</label><div className="cfg__input">{t('e.g. Alex Rahman')}</div></div>
                        <div className="cfg__field"><label className="cfg__label">{t('Job Title')}</label><div className="cfg__input">{t('e.g. Senior Product Designer')}</div></div>
                      </div>
                      <div className="cfg__pair">
                        <div className="cfg__field"><label className="cfg__label">{t('Phone')}</label><div className="cfg__input">{t('e.g. (704) 555-0127')}</div></div>
                        <div className="cfg__field"><label className="cfg__label">{t('Email')}</label><div className="cfg__input">{t('e.g. alex.rahman@example.com')}</div></div>
                      </div>
                      <div className="cfg__field"><label className="cfg__label">{t('Website')}</label><div className="cfg__input">{t('e.g. www.novotechsolution.com')}</div></div>
                      <div className="cfg__field">
                        <p className="cfg__label" id="cfg-layout">{t('Layout')}</p>
                        <div className="cfg__options" role="group" aria-labelledby="cfg-layout">
                          {layouts.map((l, i) => (
                            <button className="cfg__option" type="button" aria-selected={i === 0} key={l}>
                              <span>{l}</span>
                              <img src={img(i === 0 ? 'p5-radio-on.svg' : 'p5-radio-off.svg')} alt="" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="cfg__field">
                      <p className="cfg__label">{t('Logo Upload')}</p>
                      <button className="cfg__upload" type="button">
                        <img src={img('p5-upload.svg')} alt="" />
                        <p>{t('Upload your logo')} <b>{t('image')}</b></p>
                      </button>
                    </div>
                    <div className="cfg__colors">
                      <div className="cfg__field">
                        <p className="cfg__label" id="cfg-card-colors">{t('Card Colors')}</p>
                        <div className="cfg__swatches" role="group" aria-labelledby="cfg-card-colors">
                          {swatches.map((c, i) => (
                            <button className="cfg__swatch" type="button" aria-selected={i === 0} aria-label={`${t('Colour')} ${i + 1}`} style={{ background: c }} key={`c${i}`}></button>
                          ))}
                        </div>
                      </div>
                      <div className="cfg__field">
                        <p className="cfg__label" id="cfg-text-colors">{t('Text Colors')}</p>
                        <div className="cfg__swatches" role="group" aria-labelledby="cfg-text-colors">
                          {swatches.map((c, i) => (
                            <button className="cfg__swatch" type="button" aria-selected={i === 0} aria-label={`${t('Colour')} ${i + 1}`} style={{ background: c }} key={`x${i}`}></button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={route('create-card.create')} className="cfg__cta">{t('Continue Designing')}</Link>
              </div>
              <div className="configurator__preview">
                <img src={img('p5-preview.png')} alt={t('Live preview of the card front')} />
              </div>
            </div>
          </section>

          {/* Designer2 — profile preview */}
          <section className="designer2" aria-labelledby="designer2-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="designer2-title">{t('A Smart Digital Profile Behind Every Card')}</h2>
              <p className="phead-block__text">
                {t('Your physical card triggers a highly customized digital page. Update your socials, files,')}<br />
                {t('background theme, or booking forms anytime without reprinting your card.')}
              </p>
            </div>
            <div className="designer2__row">
              <div className="preview2">
                <span className="preview2__chip">{t('Preview')}</span>
                <div className="phone">
                  <img className="phone__cover" src={img('p6-cover.png')} alt="" />
                  <div className="phone__body">
                    <div className="phone__card">
                      <div className="phone__avatar">
                        <img src={img('p6-avatar.png')} alt="Alex Rahman" />
                        <span className="phone__avatar-badge"><img src={img('p6-badge.svg')} alt="" /></span>
                      </div>
                      <div className="phone__identity">
                        <h3 className="phone__name">Alex Rahman</h3>
                        <div className="phone__meta">
                          <p>{t('Product Designer')}</p>
                          <img src={img('p6-dot.svg')} alt="" />
                          <p>Novotech Solution</p>
                        </div>
                        <p className="phone__bio">{t('Creating intuitive and user-focused digital experiences.')}</p>
                      </div>
                      <a href="#" className="phone__save"><img src={img('p6-save.svg')} alt="" />{t('Save Contact to Phone')}</a>
                    </div>
                    <div className="phone__panel">
                      <h4>{t('Basic Info')}</h4>
                      <ul className="phone__rows">
                        {phoneRows.map((r) => (
                          <li className="phone__row" key={r.label}>
                            <span className="phone__row-icon"><img src={img(r.icon)} alt="" /></span>
                            <div><span>{r.label}</span><b>{r.value}</b></div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="presets">
                <div className="presets__head">
                  <h3 className="presets__title">{t('Choose a Preset Dynamic Style')}</h3>
                  <div className="presets__grid" role="group" aria-label={t('Preset styles')}>
                    {presets.map((p, i) => (
                      <button className="preset" type="button" aria-selected={i === 0} key={p}>
                        <span>{p}</span>
                        <img src={img(i === 0 ? 'p6-radio-on.svg' : 'p6-radio-off.svg')} alt="" />
                      </button>
                    ))}
                  </div>
                </div>
                <Link href={route('create-card.create')} className="presets__cta">{t('Continue Designing')}</Link>
              </div>
            </div>
          </section>

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
            {plans.map((p) => (
              <article className={p.featured ? 'plan plan--featured' : 'plan'} key={p.eyebrow as string}>
                {p.featured && <span className="ribbon">{t('Recommended')}</span>}
                <div className="plan__top">
                  <div className="plan__intro">
                    <p className="plan__eyebrow">{p.eyebrow}</p>
                    <p className="plan__price">{p.price}</p>
                    <p className="plan__desc">{p.desc}</p>
                    {p.tag && <span className="plan__tag">{p.tag}</span>}
                  </div>
                  <ul className="plan__features">
                    {p.features.map((f) => (
                      <li className="plan__feature" key={f}><img src={img(p.check)} alt="" /><span>{f}</span></li>
                    ))}
                  </ul>
                </div>
                <Link href={p.cta === t('Request a Quote') ? route('marketing.teams') : p.cta === t('Start Free') ? route('register') : route('create-card.create')} className={p.featured ? 'plan__cta plan__cta--accent' : 'plan__cta'}>{p.cta}</Link>
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

      {/* Shared: Gallery, Industries (rounded), FAQ, CTA, Footer */}
      <GallerySection />
      <IndustriesSection rounded />
      <FaqSection settings={settings} />
      <CTASection sectionData={{}} />
      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
