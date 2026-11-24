import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PhysicalCard from '../../create-card/components/PhysicalCard';
import { CARD_PRESETS, getCardPreset } from '../../create-card/components/cardPresets';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
  /** Input styling on the black card. 'dark' is the original design (kept for the
   *  product page); 'surface' puts the fields on the bone surface colour. */
  variant?: 'dark' | 'surface';
  /** Pin the business card so the input card scrolls up from behind it, keeping
   *  the live card in view while the visitor fills the form. */
  stickyPreview?: boolean;
  /** Render only the builder card (no section wrapper, heading, or sticky) so it
   *  can be embedded in another page's layout, e.g. the teams page panel. */
  bare?: boolean;
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
export default function DesignerSection({ variant = 'dark', stickyPreview = false, bare = false }: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  // Vibrant default so the card reads on the navy preview panel (not the old dark blue).
  const [cardColor, setCardColor] = useState('#4f46e5');
  const [textColor, setTextColor] = useState(TEXT_SWATCHES[0]);
  // Background mode is tri-state: neither Solid nor Gradient is chosen until the
  // visitor clicks one (the colour pickers stay hidden until then). A predesigned
  // face is selected by default, so the preview is never blank.
  const [bgMode, setBgMode] = useState<'solid' | 'gradient' | null>(null);
  const gradient = bgMode === 'gradient';
  const [cardColor2, setCardColor2] = useState('#06b6d4');
  const [angle, setAngle] = useState(135);
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(CARD_PRESETS[0]?.id ?? null);

  const logoUrl = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo]);
  const cardBackground = gradient
    ? `linear-gradient(${angle}deg, ${cardColor}, ${cardColor2})`
    : cardColor;

  // Picking a predesigned face wins over the colour controls; touching a colour
  // control clears the preset (mutually exclusive, like the wizard).
  const pickPreset = (id: string) => setSelectedPreset((cur) => (cur === id ? null : id));
  const clearPreset = () => setSelectedPreset(null);

  // Seed the wizard so it opens pre-filled. Logo is a File (not persistable) →
  // re-uploaded in the wizard.
  const continueDesigning = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const p = getCardPreset(selectedPreset);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...existing,
        full_name: name,
        job_title: title,
        // When a preset is chosen, seed its resolved colours too. Store the SHORT
        // hex in card_color (the ≤32-char order column); the design itself rides
        // on card_preset so the wizard shows the same look.
        card_color: p ? p.solid : cardColor,
        text_color: p ? p.fg : textColor,
        card_gradient: p ? false : gradient,
        card_color_2: cardColor2,
        card_gradient_angle: angle,
        card_preset: selectedPreset,
        __step: 1,
      }));
    } catch { /* ignore */ }
    router.visit(route('create-card.create'));
  };

  // Reusable colour-swatch control (card or text), shown under the Solid/Gradient
  // toggle per the single-dark-card builder design.
  const SwatchField = ({
    labelId, label, swatches, value, selected, onPick,
  }: {
    labelId: string; label: string; swatches: string[]; value: string;
    selected: (c: string) => boolean; onPick: (c: string) => void;
  }) => (
    <div className="field">
      <p className="field__label" id={labelId}>{label}</p>
      <div className="swatches" role="listbox" aria-labelledby={labelId}>
        {swatches.slice(0, -1).map((c) => (
          <button
            key={c}
            className="swatch"
            type="button"
            role="option"
            aria-selected={selected(c)}
            aria-label={c}
            style={{ background: c }}
            onClick={() => onPick(c)}
          />
        ))}
        <label className="swatch swatch--pick" title={t('Custom colour')}>
          <input type="color" value={value} onChange={(e) => onPick(e.target.value)} />
        </label>
      </div>
    </div>
  );

  {/* Single dark builder card — live preview as the header, controls stacked
      below (same single column on mobile and desktop, per the mockup).
      `stickyPreview` pins the card so the input card scrolls behind it; `bare`
      drops the section + heading so the card can drop into another layout (e.g.
      the teams page panel). */}
  const builderCard = (
    <div
      className={[
        'designer__card',
        variant === 'surface' ? 'designer__card--surface' : '',
        stickyPreview && !bare ? 'designer__card--sticky' : '',
      ].filter(Boolean).join(' ')}
    >
          {/* Preview header — reuses the wizard's PhysicalCard (needs the
              .onelnk-wizard scope for its `.pcard*` styles). */}
          <div className="dzhead onelnk-wizard">
            <PhysicalCard
              name={name}
              title={title}
              cardColor={cardBackground}
              textColor={textColor}
              logoUrl={logoUrl}
              preset={selectedPreset}
            />
          </div>

          {/* Controls */}
          <div className="dzbody">
            <p className="dzbody__eyebrow">{t('Live Card Designer')}</p>

            <div className="designer__controls">
              {/* 1 — Predesigned faces */}
              <div className="field">
                <span className="field__label">{t('Choose a Design')}</span>
                <div className="dzpresets" role="listbox" aria-label={t('Card designs')}>
                  {CARD_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="option"
                      aria-selected={selectedPreset === p.id}
                      className={selectedPreset === p.id ? 'dzpreset is-active' : 'dzpreset'}
                      style={{ background: p.bg }}
                      title={t(p.label)}
                      aria-label={t(p.label)}
                      onClick={() => pickPreset(p.id)}
                    />
                  ))}
                </div>
              </div>

              {/* 2 — Name */}
              <div className="field">
                <label className="field__label" htmlFor="designer-name">{t('Enter Name')}</label>
                <div className="field__box">
                  <input
                    className="field__input onelnk-dark-field"
                    id="designer-name"
                    type="text"
                    placeholder={t('e.g. Alex Rahman')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* 3 — Title */}
              <div className="field">
                <label className="field__label" htmlFor="designer-title-input">{t('Enter Title')}</label>
                <div className="field__box">
                  <input
                    className="field__input onelnk-dark-field"
                    id="designer-title-input"
                    type="text"
                    placeholder={t('e.g. Senior Product Designer')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* 4 — Logo */}
              <div className="field">
                <span className="field__label">{t('Upload Your Logo')}</span>
                <label className="dzdrop">
                  <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                  <span>{logo ? logo.name : t('Upload your logo image')}</span>
                </label>
              </div>

              {/* 5 — Background: Solid/Gradient toggle reveals the colour pickers.
                  Neither is active until the visitor clicks one. */}
              <div className="field">
                <span className="field__label">{t('Background')}</span>
                <div className="dzgradient">
                  <div className="dzgradient__toggle" role="tablist" aria-label={t('Background type')}>
                    <button type="button" role="tab" aria-selected={bgMode === 'solid'} className={bgMode === 'solid' ? 'is-active' : ''} onClick={() => { setBgMode('solid'); clearPreset(); }}>{t('Solid')}</button>
                    <button type="button" role="tab" aria-selected={bgMode === 'gradient'} className={bgMode === 'gradient' ? 'is-active' : ''} onClick={() => { setBgMode('gradient'); clearPreset(); }}>{t('Gradient')}</button>
                  </div>

                  {/* Solid → card colour + text colour */}
                  {bgMode === 'solid' && (
                    <div className="designer__colors">
                      <SwatchField
                        labelId="card-colors-label"
                        label={t('Card Colors')}
                        swatches={CARD_SWATCHES}
                        value={cardColor}
                        selected={(c) => !selectedPreset && bgMode === 'solid' && cardColor === c}
                        onPick={(c) => { setCardColor(c); setBgMode('solid'); clearPreset(); }}
                      />
                      <SwatchField
                        labelId="text-colors-label"
                        label={t('Text Colors')}
                        swatches={TEXT_SWATCHES}
                        value={textColor}
                        selected={(c) => !selectedPreset && textColor === c}
                        onPick={(c) => { setTextColor(c); clearPreset(); }}
                      />
                    </div>
                  )}

                  {/* Gradient → text colour, then gradient customization */}
                  {bgMode === 'gradient' && (
                    <>
                      <div className="designer__colors">
                        <SwatchField
                          labelId="text-colors-label"
                          label={t('Text Colors')}
                          swatches={TEXT_SWATCHES}
                          value={textColor}
                          selected={(c) => !selectedPreset && textColor === c}
                          onPick={(c) => { setTextColor(c); clearPreset(); }}
                        />
                      </div>
                      <div className="dzgradient__row">
                        <label className="dzgradient__stop">{t('Start')}<input type="color" value={cardColor} onChange={(e) => { setCardColor(e.target.value); clearPreset(); }} /></label>
                        <label className="dzgradient__stop">{t('End')}<input type="color" value={cardColor2} onChange={(e) => { setCardColor2(e.target.value); clearPreset(); }} /></label>
                        <div className="dzgradient__angles" role="group" aria-label={t('Direction')}>
                          {GRADIENT_ANGLES.map((a) => (
                            <button key={a.deg} type="button" className={angle === a.deg ? 'dzgradient__angle is-active' : 'dzgradient__angle'} onClick={() => { setAngle(a.deg); clearPreset(); }} aria-label={`${a.deg}°`}>{a.icon}</button>
                          ))}
                        </div>
                      </div>
                      <div className="dzgradient__presets">
                        {GRADIENT_PRESETS.map(([a, b]) => (
                          <button key={a + b} type="button" className="dzgradient__preset" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-label={t('Preset gradient')} onClick={() => { setCardColor(a); setCardColor2(b); clearPreset(); }} />
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
        </div>
  );

  // Bare = just the builder card, for dropping into another page's layout.
  if (bare) {
    return <div className="onelnk-landing">{builderCard}</div>;
  }

  return (
    <div className="onelnk-landing">
      <section className="designer" aria-labelledby="designer-title">
        <div className="section-head">
          <h2 className="section-head__title" id="designer-title">{t('Digital Profile Preview')}</h2>
        </div>
        {builderCard}
      </section>
    </div>
  );
}
