import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhysicalCard from '../../create-card/components/PhysicalCard';
import { CARD_PRESETS } from '../../create-card/components/cardPresets';

// Shared palette with the wizard / homepage designer so the team preview feels
// like one tool across the site.
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

/**
 * Teams "Keep Every Card On Brand" builder — reuses the homepage's single dark
 * builder card (.designer__card): the live <PhysicalCard> is the full-bleed
 * header and the colour, gradient and design controls stack below it.
 */
export default function TeamCardBuilder() {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [cardColor, setCardColor] = useState('#4f46e5');
  const [textColor, setTextColor] = useState(TEXT_SWATCHES[0]);
  const [gradient, setGradient] = useState(true);
  const [cardColor2, setCardColor2] = useState('#06b6d4');
  const [angle, setAngle] = useState(135);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const cardBackground = gradient
    ? `linear-gradient(${angle}deg, ${cardColor}, ${cardColor2})`
    : cardColor;
  const clearPreset = () => setSelectedPreset(null);
  const pickPreset = (id: string) => setSelectedPreset((cur) => (cur === id ? null : id));

  return (
    <div className="designer__card tbuilder">
      {/* Live preview header (reuses the wizard PhysicalCard; needs the .onelnk-wizard scope). */}
      <div className="dzhead onelnk-wizard">
        <PhysicalCard name={name} cardColor={cardBackground} textColor={textColor} preset={selectedPreset} />
      </div>

      {/* Controls — inside the dark card, like the homepage builder. */}
      <div className="dzbody">
        <p className="dzbody__eyebrow">{t('Team Card Designer')}</p>
        <div className="designer__controls">
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

          <div className="field">
            <label className="field__label" htmlFor="tbuilder-name">{t('Enter Name')}</label>
            <div className="field__box">
              <input
                className="field__input onelnk-dark-field"
                id="tbuilder-name"
                type="text"
                placeholder={t('e.g. Alex Rahman')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="designer__colors">
            <div className="field">
              <p className="field__label" id="tb-card-colors">{t('Card Colors')}</p>
              <div className="swatches" role="listbox" aria-labelledby="tb-card-colors">
                {CARD_SWATCHES.slice(0, -1).map((c) => (
                  <button
                    key={c}
                    className="swatch"
                    type="button"
                    role="option"
                    aria-selected={!selectedPreset && !gradient && cardColor === c}
                    aria-label={c}
                    style={{ background: c }}
                    onClick={() => { setCardColor(c); setGradient(false); clearPreset(); }}
                  />
                ))}
                <label className="swatch swatch--pick" title={t('Custom colour')}>
                  <input type="color" value={cardColor} onChange={(e) => { setCardColor(e.target.value); setGradient(false); clearPreset(); }} />
                </label>
              </div>
            </div>
            <div className="field">
              <p className="field__label" id="tb-text-colors">{t('Text Colors')}</p>
              <div className="swatches" role="listbox" aria-labelledby="tb-text-colors">
                {TEXT_SWATCHES.slice(0, -1).map((c) => (
                  <button
                    key={c}
                    className="swatch"
                    type="button"
                    role="option"
                    aria-selected={!selectedPreset && textColor === c}
                    aria-label={c}
                    style={{ background: c }}
                    onClick={() => { setTextColor(c); clearPreset(); }}
                  />
                ))}
                <label className="swatch swatch--pick" title={t('Custom colour')}>
                  <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); clearPreset(); }} />
                </label>
              </div>
            </div>
          </div>

          <div className="field">
            <span className="field__label">{t('Background')}</span>
            <div className="dzgradient">
              <div className="dzgradient__toggle" role="tablist" aria-label={t('Background type')}>
                <button type="button" role="tab" aria-selected={!gradient} className={!gradient ? 'is-active' : ''} onClick={() => { setGradient(false); clearPreset(); }}>{t('Solid')}</button>
                <button type="button" role="tab" aria-selected={gradient} className={gradient ? 'is-active' : ''} onClick={() => { setGradient(true); clearPreset(); }}>{t('Gradient')}</button>
              </div>
              {gradient && (
                <>
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
      </div>
    </div>
  );
}
