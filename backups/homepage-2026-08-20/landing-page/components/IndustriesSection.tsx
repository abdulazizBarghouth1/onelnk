import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props { settings?: any; sectionData?: any; brandColor?: string; rounded?: boolean }

/** OneLnk "Industries" grid — ported 1:1 from the static design (scoped).
 *  `rounded` renders the product-page "industries--rounded" variant. */
export default function IndustriesSection({ rounded = false }: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const industries = [
    { icon: 's11-pen.svg', title: t('Freelancers'), text: t('Look professional and share your details in seconds.') },
    { icon: 's11-work.svg', title: t('Consultants'), text: t('Present your services and booking links effortlessly.') },
    { icon: 's11-chart.svg', title: t('Sales Teams'), text: t('Give every rep a branded, easy-to-share digital card.') },
    { icon: 's11-building03.svg', title: t('Real Estate Agents'), text: t('Share listings, WhatsApp, and contact info instantly.') },
    { icon: 's11-tie.svg', title: t('Business Owners'), text: t('Bridge offline networking with your online presence.') },
    { icon: 's11-building.svg', title: t('Companies'), text: t('Maintain brand consistency across every employee.') },
  ];

  return (
    <div className="onelnk-landing">
      <section className={rounded ? 'industries industries--rounded' : 'industries'} aria-labelledby="industries-title">
        <h2 className="industries__title" id="industries-title">{t('Designed for Every Industry')}</h2>

        <div className="industries__grid">
          {industries.map((it) => (
            <article className="industry" key={it.title}>
              <span className="industry__icon">
                <img src={img(it.icon)} alt="" />
              </span>
              <div className="industry__body">
                <h3 className="industry__title">{it.title}</h3>
                <p className="industry__text">{it.text}</p>
              </div>
            </article>
          ))}
        </div>

        <Link href={route('create-card.create')} className="btn btn--primary benefits__cta">{t('Upgrade your Networking')}</Link>
      </section>
    </div>
  );
}
