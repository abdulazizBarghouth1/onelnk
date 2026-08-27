import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

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
  name, title, phone, cardColor = '#050e22', textColor = '#ffffff', logoUrl, qrUrl, initialSide = 'front',
}: PhysicalCardProps) {
  const { t } = useTranslation();
  const [side, setSide] = useState<'front' | 'back'>(initialSide);
  const [qrData, setQrData] = useState<string>('');

  // Generate a real, scannable QR (reuses the project's `qrcode` dep — same
  // pattern as dashboard.tsx / QRCodeModal.tsx). Encodes the profile URL; a
  // placeholder before the card is created, the real /v/{slug} after.
  useEffect(() => {
    let active = true;
    const url = qrUrl && qrUrl.trim() ? qrUrl : 'https://onelnk.sa';
    QRCode.toDataURL(url, { margin: 1, width: 200, color: { dark: '#0b1220', light: '#ffffff' } })
      .then((d) => { if (active) setQrData(d); })
      .catch(() => { /* ignore */ });
    return () => { active = false; };
  }, [qrUrl]);

  const cssVars = { '--pcard-bg': cardColor, '--pcard-fg': textColor } as React.CSSProperties;

  return (
    <div className="pcard-wrap">
      <div className="pcard" style={cssVars}>
        <div className={`pcard__flip${side === 'back' ? ' pcard__flip--back' : ''}`}>
          {/* FRONT — logo, name, title, phone */}
          <div className="pcard__face pcard__face--front" aria-hidden={side !== 'front'}>
            <div className="pcard__top">
              <span className="pcard__logo">
                {logoUrl ? <img src={logoUrl} alt="" /> : <DotMark />}
              </span>
            </div>
            <div className="pcard__id">
              <span className="pcard__name">{name || t('Your Name')}</span>
              {(title || !name) && <span className="pcard__title">{title || t('Your Title')}</span>}
              {phone && <span className="pcard__line"><i><IconPhone /></i>{phone}</span>}
            </div>
          </div>

          {/* BACK — QR + company logo, two columns in one row */}
          <div className="pcard__face pcard__face--back" aria-hidden={side !== 'back'}>
            <div className="pcard__backgrid">
              <span className="pcard__qr">
                {qrData ? <img src={qrData} alt={t('Card QR code')} /> : null}
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
