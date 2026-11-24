import { useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import CTASection from '../landing-page/components/CTASection';
import { useMagneticFill } from '@/hooks/useMagneticFill';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-about.css';

const img = (name: string) => `/images/onelnk/${name}`;

export default function About() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const teamRef = useRef<HTMLElement>(null);
  useMagneticFill(teamRef);
  const { settings, auth } = usePage<any>().props;
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  const badges = [t('Moorgate, London HQ'), t('Carbon Neutral Shipping'), t('Zero App Setup Needed'), t('GDPR & ISO/IEC Certified')];

  const valuesB = [
    { icon: 'ab-val-1.svg', title: t('Radical Sustainability'), text: t('Replace thousands of paper business cards with one reusable NFC card, reducing waste and supporting a more sustainable future.') },
    { icon: 'ab-val-2.svg', title: t('Strict Data Security'), text: t('Built with enterprise-grade security to keep your data protected and every connection secure.') },
  ];
  const valuesC = [
    { icon: 'ab-val-3.svg', title: t('Global Contactless Standard'), text: t('Establishing one connected network where a single digital card unifies your business identity.') },
    { icon: 'ab-val-4.svg', title: t('Enterprise CRM Unification'), text: t('Powering team contact pipelines. Seamlessly sync scanned prospects to Salesforce, HubSpot, or Dynamics with zero manual entry.') },
  ];

  const why = [
    { icon: 'ab-why-1.svg', title: t('Instant Sharing'), text: t('Share your contact details, social links, websites, and digital profile instantly with a simple tap or QR scan.') },
    { icon: 'ab-why-2.svg', title: t('Always Up to Date'), text: t('Update your profile anytime, and every change appears instantly without replacing your physical NFC card.') },
    { icon: 'ab-why-3.svg', title: t('Professional Branding'), text: t('Showcase a consistent brand identity with a professionally designed digital profile and custom NFC business card.') },
    { icon: 'ab-why-4.svg', title: t('Secure & Reliable'), text: t('Keep your information protected with enterprise-grade security, encrypted data, and reliable cloud hosting.') },
    { icon: 'ab-why-5.svg', title: t('Eco-Friendly Option'), text: t('Replace paper business cards with a reusable digital solution that reduces waste and supports sustainability.') },
    { icon: 'ab-why-6.svg', title: t('Built for Teams'), text: t('Manage employee profiles, NFC cards, and brand consistency from one powerful centralised dashboard.') },
  ];

  const team = [1, 2, 3, 4].map((n) => ({ photo: `ab-team-${n}.png`, name: 'Marcus Sterling', role: t('CEO & Co-Founder') }));

  return (
    <>
      <Head title={`${t('About Us')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-about" ref={revealRef}>
        <header className="abhead page-hero">
          <div className="abhead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('About Us')}</h1>
              <p className="phead-block__text">
                {t("We're redefining how professionals and businesses share their information with digital business cards and NFC technology, making every connection faster, smarter, and more sustainable.")}
              </p>
            </div>
            <div className="btn-row phead__actions">
              <Link href={route('register')} className="btn btn--primary">{t('Create My Card')}</Link>
              <Link href={route('marketing.contact')} className="btn btn--navy">{t('Contact Us')}</Link>
            </div>
          </div>
        </header>

        <main>
          {/* Split 1 */}
          <section className="split split--a split--reverse">
            <div className="split__body">
              <div className="split__inner">
                <div className="split__copy">
                  <h2 className="split__title">{t('Built for Modern Professionals')}</h2>
                  <p className="split__lede">
                    {t('OneLnk was created to help professionals and businesses replace traditional paper business cards with smart NFC technology and dynamic digital profiles.')}
                    <br />
                    {t('Our platform makes networking faster, more professional, and always up to date through a simple tap or QR scan.')}
                    <br />
                    {t("We're committed to delivering a modern, sustainable networking solution that helps people build stronger business connections.")}
                  </p>
                </div>
                <ul className="split__badges">
                  {badges.map((b) => (
                    <li className="split__badge" key={b}>
                      <span className="split__dot" aria-hidden="true"></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={route('register')} className="btn btn--primary benefits__cta">{t('Request a Quote')}</Link>
            </div>
            <div className="split__media">
              <img src={img('placeholder.svg')} alt="" />
            </div>
          </section>

          {/* Split 2 */}
          <section className="split split--b">
            <div className="split__body">
              <div className="split__inner">
                <div className="split__copy">
                  <h2 className="split__title">{t('Making Every Connection Effortless')}</h2>
                  <p className="split__lede">
                    {t('Simplifying professional networking through secure, sustainable, and intelligent digital business cards that work instantly on any mobile device.')}
                  </p>
                </div>
                <ul className="split__values">
                  {valuesB.map((v) => (
                    <li className="split__value" key={v.title}>
                      <span className="split__value-icon"><img src={img(v.icon)} alt="" /></span>
                      <div><b>{v.title}</b><span>{v.text}</span></div>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={route('register')} className="btn btn--primary benefits__cta">{t('Request a Quote')}</Link>
            </div>
            <div className="split__media">
              <img src={img('placeholder.svg')} alt="" />
            </div>
          </section>

          {/* Split 3 */}
          <section className="split split--c split--reverse">
            <div className="split__body">
              <div className="split__inner">
                <div className="split__copy">
                  <h2 className="split__title">{t('The Future of Business Networking')}</h2>
                  <p className="split__lede">
                    {t('Our vision is to make digital business cards the global standard for smarter, sustainable networking.')}
                  </p>
                </div>
                <ul className="split__values">
                  {valuesC.map((v) => (
                    <li className="split__value" key={v.title}>
                      <span className="split__value-icon"><img src={img(v.icon)} alt="" /></span>
                      <div><b>{v.title}</b><span>{v.text}</span></div>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={route('register')} className="btn btn--primary benefits__cta">{t('Request a Quote')}</Link>
            </div>
            <div className="split__media">
              <img src={img('placeholder.svg')} alt="" />
            </div>
          </section>

          {/* Why choose */}
          <section className="why-choose">
            <div className="phead-block">
              <h2 className="phead-block__title">{t('Why Businesses Choose OneLnk')}</h2>
              <p className="phead-block__text">
                {t('We provide a world-class combination of high-performance contactless hardware, modular team software, and uncompromising security.')}
              </p>
            </div>
            <div className="share__grid">
              {why.map((w) => (
                <article className="share__card" key={w.title}>
                  <div className="share__head">
                    <span className="share__icon"><img src={img(w.icon)} alt="" /></span>
                  </div>
                  <div className="share__body">
                    <h3 className="share__title">{w.title}</h3>
                    <p className="share__text">{w.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="milestones">
            <div className="phead-block">
              <h2 className="phead-block__title">{t('Milestones That Shaped OneLnk')}</h2>
              <p className="phead-block__text">
                {t('Click on our milestones below to explore how we scaled from a small Moorgate concept to a major sustainable tech supplier.')}
              </p>
            </div>
            <div className="milestones__body">
              <ol className="mstrip">
                <li className="mstep"><span className="mstep__dot"><img src={img('ab-ms-icon.svg')} alt="" /></span><span>2024</span></li>
                <li className="mstep" aria-current="true"><span className="mstep__dot"></span><span>{t('Early 2025')}</span></li>
                <li className="mstep"><span className="mstep__dot"><img src={img('ab-ms-icon.svg')} alt="" /></span><span>{t('Late 2025')}</span></li>
              </ol>
              <article className="mcard">
                <span className="mcard__icon"><img src={img('ab-ms-big.svg')} alt="" /></span>
                <div className="mcard__body">
                  <div className="mcard__head">
                    <h3>{t('Digital Business Card Platform Shipped')}</h3>
                    <span className="mcard__tag">{t('Early 2025')}</span>
                  </div>
                  <p className="mcard__lead">
                    {t('Our primary cloud profile editor and recycled card collection hit the market, welcoming our first 10,000 customers.')}
                  </p>
                  <p className="mcard__text">
                    {t('Launched our self-service digital profile dashboard. Achieved native browser loading speed of 180ms without requiring customers or their recipients to install any external apps, maintaining a perfect 100% security rating.')}
                  </p>
                </div>
              </article>
            </div>
          </section>

          {/* Team */}
          <section className="team" ref={teamRef}>
            <div className="phead-block">
              <h2 className="phead-block__title">{t('The People Behind OneLnk')}</h2>
              <p className="phead-block__text">
                {t('Meet our team based in London Moorgate, combining sustainable materials and engineering to build the future of UK networking.')}
              </p>
            </div>
            <div className="team__grid">
              {team.map((p, i) => (
                <article className="person" key={i}>
                  <img className="person__photo" src={img(p.photo)} alt={p.name} />
                  <div className="person__body">
                    <div className="person__id"><b>{p.name}</b><span>{p.role}</span></div>
                    <div className="person__socials">
                      <a className="mfx mfx--invert" href="#" aria-label={t('Profile')}><span className="mfx__fill" aria-hidden="true" /><img className="mfx__icon" src={img('ab-soc-1.svg')} alt="" /></a>
                      <a className="mfx mfx--invert" href="#" aria-label={t('Profile')}><span className="mfx__fill" aria-hidden="true" /><img className="mfx__icon" src={img('ab-soc-2.svg')} alt="" /></a>
                      <a className="mfx mfx--invert" href="#" aria-label={t('Profile')}><span className="mfx__fill" aria-hidden="true" /><img className="mfx__icon" src={img('ab-soc-3.svg')} alt="" /></a>
                    </div>
                  </div>
                </article>
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
