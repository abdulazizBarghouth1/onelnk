import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface BenefitsSectionProps {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/**
 * OneLnk "Benefits" compare section — ported 1:1 from the static design
 * (scoped under .onelnk-landing). No backend section maps to this; copy is
 * static per the OneLnk design.
 */
export default function BenefitsSection({ sectionData = {} }: BenefitsSectionProps) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const cons = [
    t('Easy to lose or damage'),
    t('Static information only'),
    t('Limited space for details'),
    t('Requires expensive reprinting'),
    t('No performance analytics'),
  ];

  const pros = [
    t('Saved directly to phone'),
    t('Update your info anytime'),
    t('Unlimited links & content'),
    t('No reprinting ever needed'),
    t('Track views & interactions'),
  ];

  const ctaHref = sectionData.button_link || route('create-card.create');
  const ctaText = sectionData.button_text || t('Upgrade your Networking');

  return (
    <div className="onelnk-landing">
      <section className="benefits" aria-labelledby="benefits-title">
        <div className="benefits__inner">
          <h2 className="benefits__title" id="benefits-title">
            {t('Traditional Cards Get Lost.')}
            <br />
            {t('OneLnk Gets Saved.')}
          </h2>

          <div className="benefits__body">
            <div className="benefits__glow" aria-hidden="true">
              <img src={img('s3-glow.svg')} alt="" />
            </div>

            {/* Traditional cards */}
            <article className="compare compare--con">
              <div className="compare__head">
                <h3>{t('Traditional Cards')}</h3>
              </div>
              <div className="compare__body">
                <ul className="compare__list">
                  {cons.map((text, i) => (
                    <li className="compare__row" key={text}>
                      <span className="compare__icon">
                        <img src={img(`s3-con-${i + 1}.svg`)} alt="" />
                      </span>
                      <p>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Centre badge */}
            <div className="benefits__badge" aria-hidden="true">
              <img src={img('s3-badge-icon.svg')} alt="" />
            </div>

            {/* OneLnk */}
            <article className="compare compare--pro">
              <div className="compare__head">
                <img src={img('s3-logo-icon.svg')} alt="" />
                <h3>OneLnk</h3>
              </div>
              <div className="compare__body">
                <ul className="compare__list">
                  {pros.map((text, i) => (
                    <li className="compare__row" key={text}>
                      <span className="compare__icon">
                        <img src={img(`s3-pro-${i + 1}.svg`)} alt="" />
                      </span>
                      <p>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <Link href={ctaHref} className="btn btn--primary benefits__cta">
            {ctaText}
          </Link>
        </div>
      </section>
    </div>
  );
}
