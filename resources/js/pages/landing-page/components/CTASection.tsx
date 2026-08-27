import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface CTASectionProps {
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    description?: string;
    cta_text?: string;
    cta_link?: string;
    [key: string]: any;
  };
  brandColor?: string;
}

/** OneLnk closing CTA — ported 1:1 from the static design (scoped). Copy is
 *  admin-driven via sectionData with the OneLnk defaults. */
export default function CTASection({ sectionData = {} }: CTASectionProps) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const titleMain = sectionData.title || t('Ready to create');
  const titleLine2 = sectionData.subtitle || t('your smart business card?');
  const lede =
    sectionData.description ||
    t("Join thousands of professionals who've gone digital with OneLnk. Start making better connections today.");
  const primaryText = sectionData.cta_text || t('Create My Card');
  const primaryHref = sectionData.cta_link || route('create-card.create');

  return (
    <div className="onelnk-landing">
      <section className="cta" aria-labelledby="cta-title">
        <div className="cta__band">
          <div className="cta__content">
            <div className="cta__copy">
              <h2 className="cta__title" id="cta-title">
                {titleMain}
                <br />
                {titleLine2}
              </h2>
              <p className="cta__lede">{lede}</p>
            </div>

            <div className="cta__row">
              <Link href={primaryHref} className="btn btn--primary benefits__cta">
                {primaryText}
              </Link>
              <a href="#" className="btn btn--ghost benefits__cta">
                {t('Talk to Us on WhatsApp')}
              </a>
            </div>
          </div>

          <div className="cta__glow" aria-hidden="true">
            <img src={img('s13-glow.svg')} alt="" />
          </div>
          <div className="cta__art" aria-hidden="true">
            <img src={img('s13-cta.png')} alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
