import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import HorizontalGallery, { GalleryItemData } from './HorizontalGallery';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
  galleryItems?: GalleryItemData[];
}

// Placeholder designs shown until the admin uploads real gallery images.
const FALLBACK = Array.from({ length: 9 }, (_, i) => `/images/onelnk/gl-card-${i + 1}.png`);

/** OneLnk "Card Gallery" — GSAP horizontal-scrolling strip of real card designs. */
export default function GallerySection({ galleryItems = [] }: Props) {
  const { t } = useTranslation();

  return (
    <div className="onelnk-landing">
      <section className="gallery" aria-labelledby="gallery-title">
        <div className="gallery__head">
          <h2 className="gallery__title" id="gallery-title">{t('Explore Real Card Designs')}</h2>
        </div>

        <HorizontalGallery items={galleryItems} fallback={FALLBACK} />

        <Link href={route('marketing.gallery')} className="btn btn--primary benefits__cta">{t('View Full Gallery')}</Link>
      </section>
    </div>
  );
}
