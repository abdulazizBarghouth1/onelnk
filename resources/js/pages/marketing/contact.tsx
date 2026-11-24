import { useRef, type CSSProperties } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import CTASection from '../landing-page/components/CTASection';
import { useMagneticFill } from '@/hooks/useMagneticFill';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-contact.css';
import '../../../css/onelnk-contact-fx.css';

const img = (name: string) => `/images/onelnk/${name}`;

export default function Contact() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const socialsRef = useRef<HTMLDivElement>(null);
  useMagneticFill(socialsRef);
  const { settings, auth } = usePage<any>().props;
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  const rail = [
    { cls: 'crail__card crail__card--whatsapp', href: 'https://wa.me/442079460915', icon: 'ct-whatsapp.svg', label: t('Chat on WhatsApp Now'), value: <>{t('Average reply time:')} <b>{t('45 seconds')}</b></> },
    { cls: 'crail__card', href: 'tel:+442079460915', icon: 'ct-phone.svg', label: t('Phone Number'), value: '+44 (0) 20 7946 0915' },
    { cls: 'crail__card', href: 'mailto:enquiries@onelnk.co.uk', icon: 'ct-mail.svg', label: t('Email Address'), value: 'enquiries@onelnk.co.uk' },
  ];

  const socials = [
    { cls: 'crail__soc crail__soc--ig', icon: 'ct-soc-ig.svg', label: 'Instagram' },
    { cls: 'crail__soc crail__soc--fb crail__soc--solid', icon: 'ct-soc-fb.svg', label: 'Facebook' },
    { cls: 'crail__soc crail__soc--x', icon: 'ct-soc-x.svg', label: 'X' },
    { cls: 'crail__soc crail__soc--yt', icon: 'ct-soc-yt.svg', label: 'YouTube' },
  ];

  const corp = [
    { icon: 'ct-corp-1.svg', title: t('Bulk Pricing'), text: t('Save up to 50% on large orders. One-off purchase, no ongoing subscription fees for digital profiles.') },
    { icon: 'ab-why-2.svg', title: t('Custom Branding'), text: t('Full-bleed CMYK printing or deep laser engraving matching your company brand book and guidelines.') },
    { icon: 'ct-corp-3.svg', title: t('Team Dashboard'), text: t('Central administrator panel to deploy, update, lock, or transfer employee profiles in 10 seconds.') },
    { icon: 'ab-why-4.svg', title: t('Dedicated Onboarding'), text: t('Our design studio formats card mockups, assists with CSV lists, and syncs directly with Entra ID.') },
  ];

  return (
    <>
      <Head title={`${t('Contact Us')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-contact" ref={revealRef}>
        <header className="cthead page-hero">
          <div className="cthead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('Contact Us')}</h1>
              <p className="phead-block__text">
                {t('Whether you have a question, need support, or want a solution for your business, our UK-based team is ready to help you switch to smart networking.')}
              </p>
            </div>
            <div className="btn-row phead__actions">
              <Link href={route('register')} className="btn btn--primary">{t('Create My Card')}</Link>
              <a href="#contact-form" className="btn btn--navy">{t('Contact Us')}</a>
            </div>
          </div>
        </header>

        <main>
          <section className="contact" id="contact-form" aria-labelledby="ct-form-title">
            <div className="cform__head">
              <h2 className="cform__title" id="ct-form-title">{t('Send Us a Message')}</h2>
              <p className="cform__lede">
                {t("Complete the form below and we'll get back to you as soon as possible. Our average response time is under 2 hours.")}
              </p>
            </div>

            <div className="ccard">
            <div className="cform">
              <form className="cform__card" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="cform__fields">
                  <div className="cform__row">
                    <div className="field">
                      <label className="field__label" htmlFor="ct-name">{t('Full Name*')}</label>
                      <input className="field__control" id="ct-name" name="name" type="text" placeholder={t('e.g. Sara Williams')} required />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="ct-company">{t('Company Name')}<span> {t('(Optional)')}</span></label>
                      <input className="field__control" id="ct-company" name="company" type="text" placeholder={t('e.g. Acme Solution LTD')} />
                    </div>
                  </div>

                  <div className="cform__row">
                    <div className="field">
                      <label className="field__label" htmlFor="ct-email">{t('Work Email*')}</label>
                      <input className="field__control" id="ct-email" name="email" type="email" placeholder={t('e.g. sarah@acme.co.uk')} required />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="ct-phone">{t('Phone Number*')}</label>
                      <input className="field__control" id="ct-phone" name="phone" type="tel" placeholder="+44 7700 900000" required />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="ct-subject">{t('Subject*')}</label>
                    <select className="field__control" id="ct-subject" name="subject" required defaultValue="">
                      <option value="" disabled>{t('Select number of cards')}</option>
                      <option>{t('1 – 10 cards')}</option>
                      <option>{t('11 – 50 cards')}</option>
                      <option>{t('51 – 200 cards')}</option>
                      <option>{t('200+ cards')}</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="ct-message">{t('Your Message*')}</label>
                    <textarea className="field__control" id="ct-message" name="message" placeholder={t('How can we help?')} required></textarea>
                  </div>
                </div>

                <button type="submit" className="btn btn--primary benefits__cta cform__submit">{t('Send Message')}</button>
              </form>
            </div>

            <div className="crail">
              {rail.map((c) => (
                <a className={c.cls} href={c.href} key={c.label}>
                  <span className="crail__main">
                    <span className="ct-ic" style={{ '--ic': `url(${img(c.icon)})` } as CSSProperties} aria-hidden="true" />
                    <span className="crail__label">{c.label}</span>
                  </span>
                  <span className="crail__value">{c.value}</span>
                </a>
              ))}

              <div className="crail__socials" ref={socialsRef}>
                {socials.map((s) => (
                  <a className={`${s.cls} mfx mfx--invert`} href="#" aria-label={s.label} key={s.label}>
                    <span className="mfx__fill" aria-hidden="true" />
                    <img className="mfx__icon" src={img(s.icon)} alt="" />
                  </a>
                ))}
              </div>

              <p className="crail__hours">
                <img src={img('ct-clock.svg')} alt="" />
                <span>{t('Business Hour Mon - Fri: 09:00 - 18:00 GMT')}</span>
              </p>
            </div>
            </div>
          </section>

          <section className="corp" aria-labelledby="ct-corp-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="ct-corp-title">{t('Planning a Team Rollout?')}</h2>
              <p className="phead-block__text">
                {t('Talk to our corporate specialists about bulk orders, bespoke custom branded NFC cards, employee directory management, and enterprise-grade networking solutions.')}
              </p>
            </div>
            <div className="share__grid corp__grid">
              {corp.map((c) => (
                <article className="share__card share__card--dark" key={c.title}>
                  <div className="share__head">
                    <span className="share__icon"><span className="corp__ic" style={{ '--ic': `url(${img(c.icon)})` } as CSSProperties} aria-hidden="true" /></span>
                  </div>
                  <div className="share__body">
                    <h3 className="share__title">{c.title}</h3>
                    <p className="share__text">{c.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="visit" aria-labelledby="ct-visit-title">
            <div className="phead-block">
              <h2 className="phead-block__title" id="ct-visit-title">{t('Visit Us')}</h2>
              <p className="phead-block__text">
                {t('Stop by our Shoreditch office for a live product demonstration or to consult directly with our enterprise team.')}
              </p>
            </div>
            <div className="visit__map">
              <img src={img('ct-map.png')} alt={t('Map showing the OneLnk office in Shoreditch, London')} />
              <div className="visit__controls">
                <div className="visit__zoom">
                  <button type="button" aria-label={t('Zoom in')}><img src={img('ct-zoom-in.svg')} alt="" /></button>
                  <button type="button" aria-label={t('Zoom out')}><img src={img('ct-zoom-out.svg')} alt="" /></button>
                </div>
                <div className="visit__locate">
                  <button type="button" aria-label={t('Recentre map')}><img src={img('ct-locate.svg')} alt="" /></button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <CTASection sectionData={{}} />
      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
