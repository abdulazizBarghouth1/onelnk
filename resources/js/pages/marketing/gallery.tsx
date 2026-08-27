import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import HorizontalGallery, { GalleryItemData } from '../landing-page/components/HorizontalGallery';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-gallery.css';

// Placeholder designs shown until the admin uploads real gallery images.
const FALLBACK = Array.from({ length: 9 }, (_, i) => `/images/onelnk/gl-card-${i + 1}.png`);

export default function Gallery() {
  const { t } = useTranslation();
  const { settings, auth, galleryItems = [] } = usePage<any>().props;
  const items = galleryItems as GalleryItemData[];
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  return (
    <>
      <Head title={`${t('Gallery')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-gallery">
        <header className="glhead">
          <div className="glhead__inner">
            <div className="phead-block">
              <h1 className="phead-block__title">{t('Gallery')}</h1>
              <p className="phead-block__text">
                {t('Explore digital business cards created by professionals, businesses, and teams across a range of industries.')}
                <br />
                {t('Discover designs, branding styles, and layouts to inspire your own digital identity.')}
              </p>
            </div>
            <div className="phead__actions glhead__actions">
              <Link href={route('create-card.create')} className="btn btn--primary">{t('Create My Card')}</Link>
              <Link href={route('marketing.packages')} className="btn btn--outline">{t('View Pricing')}</Link>
            </div>
          </div>
        </header>

        <main>
          <section className="glscroll" aria-label={t('Card designs')}>
            <HorizontalGallery items={items} fallback={FALLBACK} />
          </section>
        </main>
      </div>

      <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
    </>
  );
}
