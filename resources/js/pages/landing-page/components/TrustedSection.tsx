import { useTranslation } from 'react-i18next';

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

          <div className="trusted__photo">
            <img src={img('s2-hand-card.png')} alt={t('A hand holding a black OneLnk NFC card')} />
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
