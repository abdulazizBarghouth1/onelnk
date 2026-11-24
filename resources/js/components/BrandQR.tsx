import { useMemo } from 'react';
import QRCode from 'qrcode';

interface BrandQRProps {
  /** URL/text the QR encodes. */
  value: string;
  /** Rendered square size in px. */
  size?: number;
  /** Module (dot) colour — kept dark for reliable scanning. */
  dark?: string;
  /** Colour of the finder-eye centre ring and quiet areas. Transparent by
   *  default so the surface behind shows through (no white tile). */
  light?: string;
  /** Brand accent used for the centre badge. */
  accent?: string;
  /** Wrap the code in a raised white tile. Default false (transparent). */
  embossed?: boolean;
  /** Show the OneLnk brand badge in the centre. Default true. */
  logo?: boolean;
  /** Fill the parent (width:100%, square) instead of using a fixed px size.
   *  Used inside responsive containers like the physical-card preview. */
  fluid?: boolean;
  /** Render just the rounded-dot code with no frame/background/padding — for
   *  slotting into a container that already provides the tile (e.g. the card). */
  bare?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * OneLnk brand QR — a minimal, rounded-dot QR with rounded finder eyes, a centre
 * brand badge (the OneLnk dot-mark), and an embossed frame. Self-contained inline
 * styles so it renders identically everywhere (cards, modals, dashboard, public
 * profile), regardless of the surrounding CSS scope. Uses error-correction level H
 * so the centre badge never breaks scanning.
 */
export default function BrandQR({
  value,
  size = 200,
  dark = '#0A0F16',
  light = 'transparent',
  accent = '#C25A14',
  embossed = false,
  logo = true,
  fluid = false,
  bare = false,
  className = '',
  style,
}: BrandQRProps) {
  if (bare) fluid = true;
  const qr = useMemo(() => {
    try {
      return QRCode.create(value && value.trim() ? value : 'https://onelnk.sa', {
        errorCorrectionLevel: 'H',
      });
    } catch {
      return null;
    }
  }, [value]);

  const svg = useMemo(() => {
    if (!qr) return null;
    const count: number = qr.modules.size;
    const data: Uint8Array | boolean[] = qr.modules.data;
    const on = (r: number, c: number) =>
      r >= 0 && c >= 0 && r < count && c < count && !!data[r * count + c];
    // The three 7×7 finder patterns (corners) are drawn as rounded eyes instead
    // of dots, so skip their modules in the dot loop.
    const inFinder = (r: number, c: number) => {
      const f = 7;
      return (r < f && c < f) || (r < f && c >= count - f) || (r >= count - f && c < f);
    };

    const dots: string[] = [];
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!on(r, c) || inFinder(r, c)) continue;
        dots.push(`<circle cx="${c + 0.5}" cy="${r + 0.5}" r="0.42"/>`);
      }
    }

    // Rounded concentric finder eye at (r0,c0).
    const eye = (r0: number, c0: number) =>
      `<rect x="${c0}" y="${r0}" width="7" height="7" rx="2.3" fill="${dark}"/>` +
      `<rect x="${c0 + 1}" y="${r0 + 1}" width="5" height="5" rx="1.6" fill="${light}"/>` +
      `<rect x="${c0 + 2}" y="${r0 + 2}" width="3" height="3" rx="1" fill="${dark}"/>`;
    const eyes = eye(0, 0) + eye(0, count - 7) + eye(count - 7, 0);

    const q = 4; // quiet-zone modules
    const vb = count + q * 2;
    return `<svg viewBox="${-q} ${-q} ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" style="display:block;width:100%;height:100%"><g fill="${dark}">${dots.join('')}</g>${eyes}</svg>`;
  }, [qr, dark, light]);

  if (!svg) return null;

  const pad = fluid ? '7%' : Math.round(size * 0.07);
  const radius = fluid ? '9%' : Math.round(size * 0.09);
  const frameStyle: React.CSSProperties = bare
    ? { background: 'transparent', padding: 0, borderRadius: 0 }
    : embossed
    ? {
        padding: pad,
        borderRadius: radius,
        background: '#ffffff',
        boxShadow:
          '0 1px 2px rgba(10,15,22,0.10), 0 10px 24px rgba(10,15,22,0.14), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(10,15,22,0.07)',
      }
    : {
        /* Default: no white tile — transparent so the surface shows through. */
        background: 'transparent',
        borderRadius: 0,
        padding: 0,
      };

  return (
    <div
      className={className}
      style={{
        display: fluid ? 'block' : 'inline-flex',
        width: fluid ? '100%' : undefined,
        boxSizing: 'border-box',
        ...frameStyle,
        ...style,
      }}
    >
      <div
        style={
          fluid
            ? { position: 'relative', width: '100%', aspectRatio: '1 / 1' }
            : { position: 'relative', width: size, height: size }
        }
      >
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svg }} />
        {logo && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '23%',
              height: '23%',
              borderRadius: '28%',
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(10,15,22,0.28)',
              border: '2px solid #ffffff',
            }}
          >
            <img
              src="/images/onelnk/s3-logo-icon.svg"
              alt=""
              style={{ width: '64%', height: '64%', display: 'block' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
