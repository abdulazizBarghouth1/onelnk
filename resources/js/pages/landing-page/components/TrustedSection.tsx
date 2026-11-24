import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

interface TrustedSectionProps {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/**
 * OneLnk "Trusted" section — ported 1:1 from the static design (scoped under
 * .onelnk-landing). No backend section maps to this, so the copy is static per
 * the OneLnk design.
 */
export default function TrustedSection() {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;
  // Fires once when the card scrolls into view; the CSS loop keeps playing.
  const { ref, isVisible } = useScrollAnimation(0.25);

  const audiences = [
    { num: '01', title: t('Freelancers'), text: t('Hand off a portfolio link before the coffee gets cold.') },
    { num: '02', title: t('Consultants'), text: t('Lead with credentials a client can verify instantly.') },
    { num: '03', title: t('Sales teams'), text: t('Turn a handshake into a tracked, qualified lead.') },
    { num: '04', title: t('Business Owners'), text: t('One card, every channel — booking, socials, storefront.') },
  ];

  const pillars = [
    { eyebrow: t('HARDWARE'), title: t('Custom NFC cards'), text: t('Printed to your brand, embedded chip inside. No app required to receive.') },
    { eyebrow: t('PROFILE'), title: t('Digital Profiles'), text: t('Edit your links, title, and details anytime — the card never needs reprinting.') },
    { eyebrow: t('EXCHANGE'), title: t('Fast Sharing'), text: t('One tap on any modern phone. Saved to their contacts in under two seconds.') },
  ];

  return (
    <div className="onelnk-landing">
      <section className="trusted" aria-labelledby="trusted-title">
        <div className="section-head">
          <h2 className="section-head__title" id="trusted-title">
            {t('Trusted by')}
            <br />
            {t('professionals worldwide')}
          </h2>
          <p className="section-head__lede">
            {t('Powering modern networking and digital identities for teams of all sizes, from solo creators to global enterprises.')}
          </p>
        </div>

        <div className="trusted__body">
          <div className="trusted__glow" aria-hidden="true">
            <div className="trusted__glow-inner">
              <img src={img('s2-glow.svg')} alt="" />
            </div>
          </div>

          <div className="trusted__photo" ref={ref as any}>
            <div className={`profile-anim${isVisible ? ' is-live' : ''}`} aria-hidden="true">
              <div className="bcard">
                <div className="bcard__cover"></div>

                <div className="bcard__avatar">
                  <img src={img('hero-avatar.jpg')} alt="" />
                </div>

                <div className="bcard__id">
                  <p className="bcard__name">Abdulrahman Al-Qahtani</p>
                  <p className="bcard__title">Product Design Lead</p>
                  <p className="bcard__org">Riyadh, Saudi Arabia</p>
                </div>

                <div className="bcard__list">
                  <div className="bcard__row">
                    <span className="bcard__ricon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg></span>
                    <span className="bcard__rtext">abdulrahman@onelnk.sa</span>
                  </div>
                  <div className="bcard__row">
                    <span className="bcard__ricon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></svg></span>
                    <span className="bcard__rtext">+966 50 123 4567</span>
                  </div>
                  <div className="bcard__row bcard__row--li">
                    <span className="bcard__ricon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 7.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zM5.6 9h2.7v9H5.6zm4.7 0h2.6v1.23c.36-.64 1.25-1.35 2.6-1.35 2.3 0 3 1.46 3 3.56V18h-2.7v-4.5c0-1.07-.4-1.8-1.36-1.8-.74 0-1.14.5-1.33 1-.07.17-.08.4-.08.64V18h-2.7z" /></svg></span>
                    <span className="bcard__rtext">Connect on LinkedIn</span>
                  </div>
                  <div className="bcard__row">
                    <span className="bcard__ricon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" /></svg></span>
                    <span className="bcard__rtext">onelnk.sa/abdulrahman</span>
                  </div>
                </div>

                <span className="bcard__tip bcard__tip--social">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add social media
                </span>
                <span className="bcard__tip bcard__tip--cover">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M4 17l5-4 4 3 3-2 4 3" /></svg>
                  Change cover
                </span>
              </div>
            </div>
          </div>

          <div className="trusted__grid">
            {audiences.map((a) => (
              <article className="audience-card" key={a.num}>
                <p className="audience-card__num">{a.num}</p>
                <div>
                  <h3 className="audience-card__title">{a.title}</h3>
                  <p className="audience-card__text">{a.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="trusted__bar">
            {pillars.map((p) => (
              <div className="pillar" key={p.eyebrow}>
                <p className="pillar__eyebrow">{p.eyebrow}</p>
                <div>
                  <h3 className="pillar__title">{p.title}</h3>
                  <p className="pillar__text">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
