import { Head, Link, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageReveal } from '@/hooks/usePageReveal';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import { GalleryItemData } from '../landing-page/components/HorizontalGallery';
import GalleryGrid from '../landing-page/components/GalleryGrid';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-gallery.css';

// Placeholder designs shown until the admin uploads real gallery images.
const FALLBACK = Array.from({ length: 9 }, (_, i) => `/images/onelnk/gl-card-${i + 1}.png`);

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const revealRef = useRef<HTMLDivElement>(null);
  usePageReveal(revealRef, i18n.language);
  const { settings, auth, galleryItems = [] } = usePage<any>().props;
  const items = galleryItems as GalleryItemData[];
  const primaryColor = '#F3801E';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  return (
    <>
      <Head title={`${t('Gallery')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-gallery" ref={revealRef}>
        <header className="glhead page-hero">
          <div className="glhead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('Gallery')}</h1>
              <p className="phead-block__text">
                {t('Explore digital business cards created by professionals, businesses, and teams across a range of industries.')}
                <br />
                {t('Discover designs, branding styles, and layouts to inspire your own digital identity.')}
              </p>
            </div>
            <div className="btn-row glhead__actions">
              <Link href={route('create-card.create')} className="btn btn--primary">{t('Create My Card')}</Link>
              <Link href={route('marketing.packages')} className="btn btn--navy">{t('View Pricing')}</Link>
            </div>
          </div>
        </header>

        <main>
          <section className="glgrid" aria-label={t('Card designs')}>
            <GalleryGrid items={items} fallback={FALLBACK} />
          </section>
        </main>
      </div>

      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
