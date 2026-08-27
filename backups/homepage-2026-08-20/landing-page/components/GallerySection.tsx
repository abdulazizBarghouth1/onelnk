import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props { settings?: any; sectionData?: any; brandColor?: string }

/** OneLnk "Card Gallery" — ported 1:1 from the static design (scoped). */
export default function GallerySection(_props: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;
  const filters = [t('All'), t('Minimal'), t('Luxury'), t('Corporate'), t('Creative'), t('Personal Brand')];

  return (
    <div className="onelnk-landing">
      <section className="gallery" aria-labelledby="gallery-title">
        <div className="gallery__head">
          <h2 className="gallery__title" id="gallery-title">{t('Explore Real Card Designs')}</h2>
          <div className="gallery__filters" role="tablist" aria-label={t('Filter card designs')}>
            {filters.map((f, i) => (
              <button key={f} className="gallery__filter" type="button" role="tab" aria-selected={i === 0}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery__rows">
          <div className="gallery__row">
            <img src={img('s9-row-1.png')} alt={t('A row of OneLnk card designs')} />
            <img src={img('s9-row-1.png')} alt="" />
          </div>
          <div className="gallery__row gallery__row--offset">
            <img src={img('s9-row-2.png')} alt={t('A second row of OneLnk card designs')} />
            <img src={img('s9-row-2.png')} alt="" />
          </div>
        </div>

        <Link href={route('marketing.gallery')} className="btn btn--primary benefits__cta">{t('View Full Gallery')}</Link>
      </section>
    </div>
  );
}
