import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { GalleryItemData } from './HorizontalGallery';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
  galleryItems?: GalleryItemData[];
}

// Placeholder designs shown until the admin uploads real gallery images.
const FALLBACK = Array.from({ length: 9 }, (_, i) => `/images/onelnk/gl-card-${i + 1}.png`);

/**
 * Product-page card gallery — a Swiper spin on the homepage's GSAP strip.
 * Auto-loops continuously, free-mode + grab cursor so it's draggable, and
 * touch-enabled so it scrolls by swipe on phones.
 */
export default function ProductGallery({ galleryItems = [] }: Props) {
  const { t } = useTranslation();
  const cards = galleryItems.length > 0 ? galleryItems : FALLBACK.map((image, i) => ({ id: `fb-${i}`, image }));

  return (
    <div className="onelnk-landing onelnk-product">
      <section className="gallery pgallery" aria-labelledby="pgallery-title">
        <div className="gallery__head">
          <h2 className="gallery__title" id="pgallery-title">{t('Explore Real Card Designs')}</h2>
        </div>

        <Swiper
          className="pgallery__swiper"
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={24}
          loop
          grabCursor
          freeMode={{ enabled: true, momentum: false }}
          /* Continuous "marquee" auto-scroll: delay:0 + long linear speed. Keeps
             looping, pauses on hover, and stays draggable/swipeable (touch). */
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={5000}
        >
          {cards.map((c) => (
            <SwiperSlide className="pgallery__slide" key={c.id}>
              <img src={c.image} alt="" loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>

        <Link href={route('marketing.gallery')} className="btn btn--line benefits__cta">{t('View Full Gallery')}</Link>
      </section>
    </div>
  );
}
