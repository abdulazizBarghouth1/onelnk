import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrambleTextPlugin);

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
 * OneLnk hero — heading + CTAs on the brand bone surface, pulled up under the
 * sticky Header pill so the surface fills the strip behind it. The hero sizes to
 * its content; the scroll story (HeroScrollStory) continues the same bone ground
 * directly below, so the two read as one block. Copy stays admin-driven via
 * sectionData; the accent phrase scrambles in unless reduced motion is on.
 */
export default function HeroSection({ sectionData = {} }: HeroSectionProps) {
  const { t } = useTranslation();
  const accentRef = useRef<HTMLSpanElement>(null);
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

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

  // Scramble the accent phrase in on load (the effect the user liked). The final
  // text is the real accent string, so the heading stays readable/selectable.
  useGSAP(() => {
    const el = accentRef.current;
    if (!el) return;
    if (reduceMotion) return;
    gsap.to(el, {
      duration: 1.4,
      ease: 'none',
      scrambleText: { text: titleAccent, chars: 'upperAndLowerCase', speed: 0.7, revealDelay: 0.3 },
    });
  }, { dependencies: [titleAccent] });

  return (
    // -82px pulls the dark canvas up under the sticky Header pill (82px tall).
    <div className="onelnk-landing" style={{ marginTop: '-82px' }}>
      <header className="hero">
        {/* Centred 1440 stage */}
        <div className="hero__stage">
          <div className="hero__content">
            <div className="hero__heading">
              <h1 className="hero__title">
                {titleMain} <span className="hero__title-accent" ref={accentRef}>{titleAccent}</span>
              </h1>
              <p className="hero__subtitle">{subtitle}</p>
            </div>

            <div className="hero__actions">
              <Link href={primaryHref} className="btn btn--primary">
                {primaryText}
              </Link>
              <a href={secondaryHref} className="btn btn--navy">
                {secondaryText}
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
