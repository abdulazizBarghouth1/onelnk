import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import CTASection from '../landing-page/components/CTASection';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-teams.css';

const img = (name: string) => `/images/onelnk/${name}`;

// Team dashboard mock — rendered in the hero stage and again in the
// "Team Management" section.
function TeamDashboard({ t }: { t: (s: string) => string }) {
  const rows = [
    { photo: 'p8-av-1.png', name: 'Sarah Jenkins', role: t('Creative Director'), status: 'active' },
    { photo: 'p8-av-2.png', name: 'Marcus Vance', role: t('Sales Partner'), status: 'active' },
    { photo: 'p8-av-3.png', name: 'Elena Rostova', role: t('Architect'), status: 'pending' },
    { photo: 'tm-av-4.png', name: 'Bob Rostova', role: t('Architect'), status: 'active' },
  ];
  return (
    <div className="tdash">
      <div className="tdash__head">
        <p>{t('Team Members (24)')}</p>
        <button className="tdash__add" type="button"><img src={img('tm-add.svg')} alt="" />{t('Add Employee')}</button>
      </div>
      <div className="tdash__filters">
        <div className="tdash__search"><img src={img('tm-search.svg')} alt="" /><span>{t('Search employees...')}</span></div>
        <div className="tdash__select"><span>{t('All Dept.')}</span><img src={img('tm-caret.svg')} alt="" /></div>
      </div>
      <div className="tdash__stats">
        <div className="tdash__stat"><span>{t('Active')}</span><b>24</b></div>
        <div className="tdash__stat"><span>{t('Total Taps')}</span><b>1847</b></div>
        <div className="tdash__stat"><span>{t('Leads')}</span><b>42</b></div>
      </div>
      <div className="tdash__panel">
        <p>{t('Employee Directory')}</p>
        <ul className="tdash__list">
          {rows.map((r) => (
            <li className="tdash__row" key={r.name}>
              <div className="tdash__person">
                <img src={img(r.photo)} alt="" />
                <div><b>{r.name}</b><span>{r.role}</span></div>
              </div>
              <span className={r.status === 'pending' ? 'tdash__status tdash__status--pending' : 'tdash__status tdash__status--active'}>
                {r.status === 'pending' ? t('Pending') : t('Active')}
              </span>
              <img src={img('tm-edit.svg')} alt="" />
              <img src={img('tm-more.svg')} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Teams() {
  const { t } = useTranslation();
  const { settings, auth } = usePage<any>().props;
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  const inc = [
    { icon: 'tm-inc-1.svg', title: t('Company-Wide Branding'), text: t('Keep every employee card consistent with your logo, colours, fonts, and branding across your entire organisation.'), pill: t('100% Consistent Layouts') },
    { icon: 'tm-inc-2.svg', title: t('Centralised Management'), text: t('Create, manage, and update employee cards from one secure dashboard with complete administrative control.'), pill: t('Instant HR Integration') },
    { icon: 'tm-inc-3.svg', title: t('Instant Updates'), text: t('Update employee details anytime—changes appear instantly across every digital card without reprinting.'), pill: t('0 Seconds Delay') },
    { icon: 'tm-inc-4.svg', title: t('Scalable for Any Team'), text: t('Manage teams of any size, from small businesses to global enterprises with complete confidence.'), pill: t('Unlimited Members Support') },
  ];

  const brandItems = [
    { icon: 'tm-bp-1.svg', b: t('Professional Appearance'), s: t('Deliver a polished, professional brand experience everywhere.') },
    { icon: 'tm-bp-2.svg', b: t('Stronger Brand Recognition'), s: t('Build trust with consistent branding across every interaction.') },
    { icon: 'tm-bp-3.svg', b: t('Easy Company-Wide Updates'), s: t('Update every employee card from one dashboard.') },
    { icon: 'tm-bp-4.svg', b: t('Consistent Customer Experience'), s: t('Give every customer the same professional experience.') },
  ];
  const brandSwatches = [
    { c: '#96ddea' }, { c: '#0b1729' }, { c: '#e2c2ff', on: true }, { c: '#ea9697' }, { c: '#eac796' }, { c: '#96caea' },
  ];

  const steps = [
    { side: 'l', b: t('Tell Us About Your Business'), s: t('Tell us about your team, industry, and business requirements.'), icon: 'tm-step-1.svg', n: '01' },
    { side: 'r', b: t('Select Branding'), s: t('Choose your branding, colours, logo, and preferred card design.'), icon: 'tm-step-2.svg', n: '02' },
    { side: 'l', b: t('We Set Up Your Team'), s: t('We create employee profiles, NFC cards, and your admin dashboard.'), icon: 'tm-step-3.svg', n: '03' },
    { side: 'r', b: t('Receive & Share'), s: t('Receive your NFC cards and start networking with your team.'), icon: 'tm-step-4.svg', n: '04' },
  ];

  const faqs = [
    { q: t('Do you offer volume discounts?'), a: t('Yes. We offer volume discounts for teams, with larger orders receiving greater savings and setup fees waived on qualifying orders.'), open: true },
    { q: t('Can we manage all employee cards from one account?') },
    { q: t('Can we customise the card design?') },
    { q: t('What happens when an employee changes roles or leaves?') },
    { q: t('Can new employees be added later?') },
    { q: t('How long does implementation take?') },
  ];

  return (
    <>
      <Head title={`${t('Teams')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-teams">
        <header className="thead">
          <div className="thead__inner">
            <div className="thead__intro">
              <div className="phead-block">
                <h1 className="phead-block__title">{t('Digital Business Cards for Teams')}</h1>
                <p className="phead-block__text">
                  {t('Equip every employee with a branded digital business card and premium NFC card. Manage profiles, maintain brand consistency,')}<br />
                  {t('and simplify networking from one central dashboard.')}
                </p>
              </div>
              <div className="phead__actions">
                <a href="#quote" className="btn btn--primary">{t('Request a Quote')}</a>
                <a href="#" className="btn btn--outline">{t('Book a Demo')}</a>
              </div>
            </div>

            <div className="stage">
              <div className="stage__lights" aria-hidden="true">
                <div className="stage__lights-a"><img src={img('tm-lights.svg')} alt="" /></div>
                <div className="stage__lights-b"><img src={img('tm-lights-2.svg')} alt="" /></div>
              </div>
              <div className="stage__grid" aria-hidden="true"><img src={img('tm-grid.svg')} alt="" /></div>
              <div className="stage__stars" aria-hidden="true"><img src={img('tm-stars.svg')} alt="" /></div>
              <div className="stage__nfc stage__nfc--teams" aria-hidden="true">
                <div className="stage__nfc-inner"><img src={img('hero-nfc-card.png')} alt="" /></div>
              </div>
              <TeamDashboard t={t} />
              <div className="stage__features stage__features--teams featurecard">
                <div className="feature"><img src={img('icon-check.svg')} alt="" /><span>{t('No App Required')}</span></div>
                <div className="feature feature--fixed"><img src={img('icon-check.svg')} alt="" /><span>{t('Premium PVC NFC Card')}</span></div>
                <div className="feature"><img src={img('icon-check.svg')} alt="" /><span>{t('Instant Sharing')}</span></div>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Built for Modern Businesses */}
          <section className="share tinc" aria-labelledby="tinc-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="tinc-title">{t('Built for Modern Businesses')}</h2>
              <p className="phead-block__text">
                {t('Replace wasteful, outdated paper cards with secure, high-end digital business cards that drive enterprise')}<br />
                {t('networking, tracking, and centralised brand consistency.')}
              </p>
            </div>
            <div className="share__grid share__grid--2">
              {inc.map((c) => (
                <article className="share__card" key={c.title}>
                  <div className="share__head">
                    <span className="share__icon"><img src={img(c.icon)} alt="" /></span>
                  </div>
                  <div className="share__body share__body--stacked">
                    <div className="share__copy">
                      <h3 className="share__title">{c.title}</h3>
                      <p className="share__text">{c.text}</p>
                    </div>
                    <div className="share__rule"></div>
                    <div className="share__meta">
                      <span>{t('Key Standard')}</span>
                      <span className="share__pill">{c.pill}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Team Management dashboard */}
          <section className="tmanage" aria-label={t('Team management dashboard')}>
            <TeamDashboard t={t} />
          </section>

          {/* Keep Every Card On Brand */}
          <section className="brand" aria-labelledby="brand-title">
            <div className="brand__copy">
              <div className="brand__head">
                <div className="brand__intro">
                  <h2 className="brand__title" id="brand-title">{t('Keep Every Card On Brand')}</h2>
                  <p className="brand__lede">
                    {t('Every employee card follows the same company identity — your logo, your colours, your layout. No rogue designs, no off-brand cards.')}
                  </p>
                </div>
                <ul className="brand__list">
                  {brandItems.map((it) => (
                    <li className="brand__item" key={it.b}>
                      <span className="brand__icon"><img src={img(it.icon)} alt="" /></span>
                      <div><b>{it.b}</b><span>{it.s}</span></div>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#quote" className="btn btn--primary benefits__cta">{t('Request a Quote')}</a>
            </div>

            <div className="brand__panel">
              <div className="preview__tabs" role="tablist" aria-label={t('Card side')}>
                <button className="preview__tab" type="button" role="tab" aria-selected="true">{t('Front')}</button>
                <button className="preview__tab" type="button" role="tab" aria-selected="false">{t('Back')}</button>
              </div>
              <div className="brand__card">
                <img src={img('tm-card-back.png')} alt={t('A branded OneLnk team card')} />
              </div>
              <div className="brand__swatches" role="group" aria-label={t('Card colour')}>
                {brandSwatches.map((s, i) => (
                  <button className="brand__swatch" type="button" aria-selected={!!s.on} aria-label={`${t('Colour')} ${i + 1}`} style={{ background: s.c }} key={i}></button>
                ))}
              </div>
            </div>
          </section>

          {/* Simple Bulk Ordering */}
          <section className="bulk" aria-labelledby="bulk-title">
            <div className="bulk__head">
              <h2 className="bulk__title" id="bulk-title">{t('Simple Bulk Ordering')}</h2>
              <p className="bulk__lede">
                {t('From enquiry to fully deployed team cards — our streamlined process gets your whole')}<br />
                {t('organisation set up quickly and without hassle.')}
              </p>
            </div>
            <ol className="bulk__timeline">
              {steps.map((s) => (
                <li className={`bulk__row bulk__row--${s.side}`} key={s.n}>
                  <div className="bulk__text"><b>{s.b}</b><span>{s.s}</span></div>
                  <div className="bulk__pill"><span>{t('Step')} {s.n}</span></div>
                  <span className="bulk__orb"><img src={img(s.icon)} alt="" /></span>
                </li>
              ))}
            </ol>
          </section>

          {/* Request Your Team Quote */}
          <section className="quote" id="quote" aria-labelledby="quote-title">
            <div className="quote__head">
              <h2 className="quote__title" id="quote-title">{t('Request Your Team Quote')}</h2>
              <p className="quote__lede">
                {t("Tell us about your organisation and we'll put together a tailored quote with pricing, branding")}<br />
                {t('options, and an onboarding plan.')}
              </p>
            </div>
            <div className="quote__body">
              <div className="quote__media">
                <img src={img('s5-classic.png')} alt={t('A OneLnk team card')} />
              </div>
              <form className="qform" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="qform__head">
                  <h3>{t('Request a Corporate Quote')}</h3>
                  <p>{t('Fill in the form below and our team will get back to you within one business day.')}</p>
                </div>
                <div className="qform__fields">
                  <div className="qform__row">
                    <div className="qform__field">
                      <label htmlFor="company-name">{t('Company Name*')}</label>
                      <input id="company-name" name="company-name" type="text" placeholder={t('e.g. Acme Solution LTD')} required />
                    </div>
                    <div className="qform__field">
                      <label htmlFor="contact-name">{t('Contact Name*')}</label>
                      <input id="contact-name" name="contact-name" type="text" placeholder={t('e.g. Sara Williams')} required />
                    </div>
                  </div>
                  <div className="qform__row">
                    <div className="qform__field">
                      <label htmlFor="work-email">{t('Work Email*')}</label>
                      <input id="work-email" name="work-email" type="email" placeholder={t('e.g. sarah@acme.co.uk')} required />
                    </div>
                    <div className="qform__field">
                      <label htmlFor="phone-number">{t('Phone Number')}</label>
                      <input id="phone-number" name="phone-number" type="tel" placeholder="+44 7700 900000" />
                    </div>
                  </div>
                  <div className="qform__row">
                    <div className="qform__field">
                      <label htmlFor="company-size">{t('Company Size*')}</label>
                      <select id="company-size" name="company-size" required defaultValue="">
                        <option value="" disabled>{t('Select company size')}</option>
                        <option>1 – 10</option><option>11 – 50</option><option>51 – 200</option><option>200+</option>
                      </select>
                    </div>
                    <div className="qform__field">
                      <label htmlFor="industry">{t('Industry*')}</label>
                      <select id="industry" name="industry" required defaultValue="">
                        <option value="" disabled>{t('Select industry')}</option>
                        <option>{t('Technology')}</option><option>{t('Finance')}</option><option>{t('Healthcare')}</option>
                        <option>{t('Retail')}</option><option>{t('Real Estate')}</option><option>{t('Other')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="qform__field">
                    <label htmlFor="cards-required">{t('Number of NFC Cards Required*')}</label>
                    <select id="cards-required" name="cards-required" required defaultValue="">
                      <option value="" disabled>{t('Select number of cards')}</option>
                      <option>1 – 10</option><option>11 – 50</option><option>51 – 200</option><option>200+</option>
                    </select>
                  </div>
                  <div className="qform__field">
                    <label htmlFor="requirements">{t('Tell Us About Your Requirements')}</label>
                    <textarea id="requirements" name="requirements" placeholder={t('Tell us about your team, any specific branding requirements, or questions you have about the process…')}></textarea>
                  </div>
                </div>
                <button className="qform__submit" type="submit">{t('Request a Quote')}</button>
              </form>
            </div>
          </section>

          {/* Corporate FAQ */}
          <section className="faq faq--pk" aria-labelledby="tfaq-title">
            <div className="faq__intro">
              <h2 className="faq__title" id="tfaq-title">{t('Corporate Frequently')}<br />{t('Asked Questions')}</h2>
              <Link href={route('marketing.contact')} className="btn btn--primary benefits__cta">{t('Contact Us')}</Link>
            </div>
            <div className="faq__list">
              {faqs.map((f, i) => (
                <details className="faq__item" key={i} open={!!f.open}>
                  <summary className="faq__q">
                    <span>{f.q}</span>
                    <span className="faq__toggle">
                      <img className="is-closed" src={img('s12-plus.svg')} alt="" />
                      <img className="is-open" src={img('s12-minus.svg')} alt="" />
                    </span>
                  </summary>
                  {f.a ? <p className="faq__a">{f.a}</p> : null}
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>

      <CTASection sectionData={{}} />
      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
