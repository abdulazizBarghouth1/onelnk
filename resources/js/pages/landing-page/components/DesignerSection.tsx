import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PhysicalCard from '../../create-card/components/PhysicalCard';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

// Shared palette with the wizard (create-card step 2) so the homepage teaser
// and the full wizard feel like one tool.
const CARD_SWATCHES = ['#050e22', '#96ddea', '#c396ea', '#ea9697', '#eac796', '#96caea'];
const TEXT_SWATCHES = ['#ffffff', '#96ddea', '#c396ea', '#ea9697', '#eac796', '#96caea'];
const GRADIENT_ANGLES = [
  { icon: '↖', deg: 315 }, { icon: '↑', deg: 0 }, { icon: '↗', deg: 45 }, { icon: '→', deg: 90 },
  { icon: '↘', deg: 135 }, { icon: '↓', deg: 180 }, { icon: '↙', deg: 225 }, { icon: '←', deg: 270 },
];
const GRADIENT_PRESETS: [string, string][] = [
  ['#050e22', '#1e3a8a'], ['#0f172a', '#334155'], ['#4f46e5', '#06b6d4'],
  ['#7c3aed', '#ec4899'], ['#0ea5e9', '#22d3ee'], ['#f59e0b', '#ef4444'],
];

const STORAGE_KEY = 'onelnk_wizard_v1';

/**
 * OneLnk homepage "Card Designer" — a minimal, LIVE teaser of the wizard's
 * step 1/2 card. Reuses the wizard's <PhysicalCard> for the preview and the
 * same gradient/colour controls, then seeds the wizard (localStorage) so
 * "Continue Designing" picks up the name + colours the visitor chose.
 */
export default function DesignerSection(_props: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [cardColor, setCardColor] = useState(CARD_SWATCHES[0]);
  const [textColor, setTextColor] = useState(TEXT_SWATCHES[0]);
  const [gradient, setGradient] = useState(false);
  const [cardColor2, setCardColor2] = useState('#1e3a8a');
  const [angle, setAngle] = useState(135);
  const [logo, setLogo] = useState<File | null>(null);

  const logoUrl = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo]);
  const cardBackground = gradient
    ? `linear-gradient(${angle}deg, ${cardColor}, ${cardColor2})`
    : cardColor;

  // Seed the wizard so it opens pre-filled. Logo is a File (not persistable) →
  // re-uploaded in the wizard.
  const continueDesigning = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...existing,
        full_name: name,
        card_color: cardColor,
        text_color: textColor,
        card_gradient: gradient,
        card_color_2: cardColor2,
        card_gradient_angle: angle,
        __step: 1,
      }));
    } catch { /* ignore */ }
    router.visit(route('create-card.create'));
  };

  return (
    <div className="onelnk-landing">
      <section className="designer" aria-labelledby="designer-title">
        <div className="section-head">
          <h2 className="section-head__title" id="designer-title">{t('Digital Profile Preview')}</h2>
        </div>

        <div className="designer__body">
          {/* Controls */}
          <div className="panel">
            <div className="designer__intro">
              <span className="pill">{t('Card Designer')}</span>
              <h3 className="designer__title">{t('See Your Card Before You Buy')}</h3>
            </div>

            <div className="designer__controls">
              <div className="field">
                <label className="field__label" htmlFor="designer-name">{t('Enter Name')}</label>
                <div className="field__box">
                  <input
                    className="field__input"
                    id="designer-name"
                    type="text"
                    placeholder={t('e.g. Alex Rahman')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Logo upload — replaces the old static "Layout Style" control */}
              <div className="field">
                <span className="field__label">{t('Upload Your Logo')}</span>
                <label className="dzdrop">
                  <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                  <span>{logo ? logo.name : t('Upload your logo image')}</span>
                </label>
              </div>

              <div className="designer__colors">
                <div className="field">
                  <p className="field__label" id="card-colors-label">{t('Card Colors')}</p>
                  <div className="swatches" role="listbox" aria-labelledby="card-colors-label">
                    {CARD_SWATCHES.slice(0, -1).map((c) => (
                      <button
                        key={c}
                        className="swatch"
                        type="button"
                        role="option"
                        aria-selected={!gradient && cardColor === c}
                        aria-label={c}
                        style={{ background: c }}
                        onClick={() => { setCardColor(c); setGradient(false); }}
                      />
                    ))}
                    <label className="swatch swatch--pick" title={t('Custom colour')}>
                      <input type="color" value={cardColor} onChange={(e) => { setCardColor(e.target.value); setGradient(false); }} />
                    </label>
                  </div>
                </div>
                <div className="field">
                  <p className="field__label" id="text-colors-label">{t('Text Colors')}</p>
                  <div className="swatches" role="listbox" aria-labelledby="text-colors-label">
                    {TEXT_SWATCHES.slice(0, -1).map((c) => (
                      <button
                        key={c}
                        className="swatch"
                        type="button"
                        role="option"
                        aria-selected={textColor === c}
                        aria-label={c}
                        style={{ background: c }}
                        onClick={() => setTextColor(c)}
                      />
                    ))}
                    <label className="swatch swatch--pick" title={t('Custom colour')}>
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gradient builder — same UX as wizard step 2 */}
              <div className="field">
                <span className="field__label">{t('Background')}</span>
                <div className="dzgradient">
                  <div className="dzgradient__toggle" role="tablist" aria-label={t('Background type')}>
                    <button type="button" role="tab" aria-selected={!gradient} className={!gradient ? 'is-active' : ''} onClick={() => setGradient(false)}>{t('Solid')}</button>
                    <button type="button" role="tab" aria-selected={gradient} className={gradient ? 'is-active' : ''} onClick={() => setGradient(true)}>{t('Gradient')}</button>
                  </div>
                  {gradient && (
                    <>
                      <div className="dzgradient__row">
                        <label className="dzgradient__stop">{t('Start')}<input type="color" value={cardColor} onChange={(e) => setCardColor(e.target.value)} /></label>
                        <label className="dzgradient__stop">{t('End')}<input type="color" value={cardColor2} onChange={(e) => setCardColor2(e.target.value)} /></label>
                        <div className="dzgradient__angles" role="group" aria-label={t('Direction')}>
                          {GRADIENT_ANGLES.map((a) => (
                            <button key={a.deg} type="button" className={angle === a.deg ? 'dzgradient__angle is-active' : 'dzgradient__angle'} onClick={() => setAngle(a.deg)} aria-label={`${a.deg}°`}>{a.icon}</button>
                          ))}
                        </div>
                      </div>
                      <div className="dzgradient__presets">
                        {GRADIENT_PRESETS.map(([a, b]) => (
                          <button key={a + b} type="button" className="dzgradient__preset" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-label={t('Preset gradient')} onClick={() => { setCardColor(a); setCardColor2(b); }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button type="button" onClick={continueDesigning} className="btn btn--primary benefits__cta">
              {t('Continue Designing')}
            </button>
          </div>

          {/* Preview — reuses the wizard's PhysicalCard (needs the .onelnk-wizard
              scope for its `.pcard*` styles). */}
          <div className="panel panel--preview">
            <span className="pill pill--plain">{t('Preview')}</span>
            <div className="onelnk-wizard dzpreview">
              <PhysicalCard
                name={name}
                cardColor={cardBackground}
                textColor={textColor}
                logoUrl={logoUrl}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
