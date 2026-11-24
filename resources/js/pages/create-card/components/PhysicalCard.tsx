import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BrandQR from '@/components/BrandQR';
import { getCardPreset } from './cardPresets';

/**
 * Live, data-bound preview of the physical NFC card the user designs in step 2.
 * Front = logo + name + job title + phone. Back = a real (scannable) QR to the
 * card's public page + the company logo, side by side. A CSS 3D flip driven by
 * the Front/Back tabs. Background accepts a solid colour OR a linear-gradient
 * string (computed by the wizard). Everything scales with the card width via
 * container-query units so it fits small screens (<425px). Reused read-only in
 * the step-6 review.
 */
interface PhysicalCardProps {
  name?: string;
  title?: string;
  phone?: string;
  /** Solid hex OR a `linear-gradient(...)` string. */
  cardColor?: string;
  textColor?: string;
  logoUrl?: string | null;
  /** URL the back QR encodes (the profile page; a placeholder before the card exists). */
  qrUrl?: string;
  initialSide?: 'front' | 'back';
  /** Predesigned face id (see cardPresets). Overrides cardColor/textColor when set. */
  preset?: string | null;
}

// Inline phone icon inherits the card's text colour via `currentColor`.
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// The OneLnk dot-mark fallback (used when the user hasn't uploaded a logo).
const DotMark = () => (
  <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
    {[
      [6, 6], [14, 6], [6, 14], [22, 10], [30, 6], [14, 18], [10, 26], [22, 22],
      [30, 18], [18, 30], [26, 30], [34, 26],
    ].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3.2 : 2.4} />)}
  </svg>
);

export default function PhysicalCard({
  name, title, phone, cardColor = '#050e22', textColor = '#ffffff', logoUrl, qrUrl, initialSide = 'front', preset,
}: PhysicalCardProps) {
  const { t } = useTranslation();
  const [side, setSide] = useState<'front' | 'back'>(initialSide);
  // The profile URL the back QR encodes (placeholder before the card exists).
  const qrValue = qrUrl && qrUrl.trim() ? qrUrl : 'https://onelnk.sa';

  // A predesigned preset overrides the plain colour/gradient controls.
  const p = getCardPreset(preset);
  const effectiveBg = p ? p.bg : cardColor;
  const effectiveFg = p ? p.fg : textColor;
  const cssVars = { '--pcard-bg': effectiveBg, '--pcard-fg': effectiveFg } as React.CSSProperties;

  return (
    <div className="pcard-wrap">
      <div className="pcard" style={cssVars}>
        <div className={`pcard__flip${side === 'back' ? ' pcard__flip--back' : ''}`}>
          {/* FRONT — logo, name, title, phone */}
          <div className="pcard__face pcard__face--front" aria-hidden={side !== 'front'}>
            {p?.overlay && <span className={`pcard__overlay pcard__overlay--${p.overlay}`} aria-hidden="true" />}
            <div className="pcard__top">
              <span className="pcard__logo">
                {logoUrl ? <img src={logoUrl} alt="" /> : <DotMark />}
              </span>
            </div>
            <div className="pcard__id">
              <span className="pcard__name">{name || t('Your Name')}</span>
              {(title || !name) && <span className="pcard__title" style={p?.titleColor ? { color: p.titleColor } : undefined}>{title || t('Your Title')}</span>}
              {phone && <span className="pcard__line"><i><IconPhone /></i>{phone}</span>}
            </div>
          </div>

          {/* BACK — QR + company logo, two columns in one row */}
          <div className="pcard__face pcard__face--back" aria-hidden={side !== 'back'}>
            <div className="pcard__backgrid">
              <span className="pcard__qr">
                <BrandQR value={qrValue} bare logo={false} dark={effectiveFg} />
              </span>
              <span className="pcard__brandmark">
                {logoUrl ? <img src={logoUrl} alt="" /> : <DotMark />}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pcard__tabs" role="tablist" aria-label={t('Card side')}>
        <button type="button" role="tab" aria-selected={side === 'front'} className={side === 'front' ? 'is-active' : ''} onClick={() => setSide('front')}>{t('Front')}</button>
        <button type="button" role="tab" aria-selected={side === 'back'} className={side === 'back' ? 'is-active' : ''} onClick={() => setSide('back')}>{t('Back')}</button>
      </div>
    </div>
  );
}
