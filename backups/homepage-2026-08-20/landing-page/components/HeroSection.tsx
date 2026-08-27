import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  brandColor?: string;
  settings?: any;
  sectionData?: {
    title?: string;
    title_accent?: string;
    subtitle?: string;
    primary_button_text?: string;
    primary_button_link?: string;
    secondary_button_text?: string;
    secondary_button_link?: string;
    [key: string]: any;
  };
}

/**
 * OneLnk hero — ported 1:1 from the static design (scoped under .onelnk-landing,
 * see resources/css/onelnk-landing.css). The dark canvas is pulled up under the
 * sticky Header pill so the pill floats over it, as in the static build. Copy
 * (title / subtitle / CTAs) stays admin-driven via sectionData.
 */
export default function HeroSection({ sectionData = {} }: HeroSectionProps) {
  const { t } = useTranslation();

  const titleParts = (sectionData.title || '').split('\n');
  const titleMain = titleParts[0] || t('Your Smart Business Card');
  const titleAccent = sectionData.title_accent || titleParts[1] || t('Designed Your Way');
  const subtitle =
    sectionData.subtitle ||
    t('Create a digital profile, customize your NFC card, and share your contact details instantly with one tap.');

  const primaryText = sectionData.primary_button_text || t('Create My Card');
  const primaryHref = sectionData.primary_button_link || route('create-card.create');
  const secondaryText = sectionData.secondary_button_text || t('Contact Us');
  const secondaryHref = sectionData.secondary_button_link || '#contact';

  const features = [
    { text: t('No App Required'), fixed: false },
    { text: t('Premium PVC NFC Card'), fixed: true },
    { text: t('Instant Sharing'), fixed: false },
  ];

  const img = (name: string) => `/images/onelnk/${name}`;

  return (
    // -82px pulls the dark canvas up under the sticky Header pill (82px tall).
    <div className="onelnk-landing" style={{ marginTop: '-82px' }}>
      <header className="hero">
        {/* Decorative background layers */}
        <div className="hero__grid" aria-hidden="true">
          <img src={img('hero-grid.svg')} alt="" />
        </div>
        <div className="hero__stars" aria-hidden="true">
          <img src={img('hero-stars.svg')} alt="" />
        </div>
        <div className="hero__lights" aria-hidden="true">
          <div className="hero__lights-a">
            <img src={img('hero-lights.svg')} alt="" />
          </div>
          <div className="hero__lights-b">
            <img src={img('hero-lights-2.svg')} alt="" />
          </div>
        </div>

        {/* Centred 1440 stage */}
        <div className="hero__stage">
          <div className="hero__content">
            <div className="hero__heading">
              <h1 className="hero__title">
                {titleMain} <span className="hero__title-accent">{titleAccent}</span>
              </h1>
              <p className="hero__subtitle">{subtitle}</p>
            </div>

            <div className="hero__actions">
              <Link href={primaryHref} className="btn btn--primary">
                {primaryText}
              </Link>
              <a href={secondaryHref} className="btn btn--light">
                {secondaryText}
              </a>
            </div>
          </div>

          {/* NFC card render */}
          <div className="hero__nfc" aria-hidden="true">
            <div className="hero__nfc-inner">
              <img src={img('hero-nfc-card.png')} alt="" />
            </div>
          </div>

          {/* iPhone mockup */}
          <div className="hero__phone" aria-hidden="true">
            <img className="hero__phone-frame" src={img('hero-phone.png')} alt="" />
            <div className="hero__phone-screen">
              <img src={img('hero-phone-screen.png')} alt="" />
            </div>
            <div className="hero__phone-island"></div>
          </div>

          {/* Feature card */}
          <div className="hero__features featurecard">
            {features.map((f) => (
              <div key={f.text} className={f.fixed ? 'feature feature--fixed' : 'feature'}>
                <img src={img('icon-check.svg')} alt="" />
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}
