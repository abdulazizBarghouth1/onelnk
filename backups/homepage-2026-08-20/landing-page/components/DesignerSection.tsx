import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/**
 * OneLnk "Card Designer" preview — ported 1:1 from the static design (scoped).
 * The controls are a static visual preview; the real designer is the wizard,
 * reached via "Continue Designing".
 */
export default function DesignerSection(_props: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const swatches = [
    { label: t('Midnight'), color: '#050e22', on: true },
    { label: t('Sky'), color: '#96ddea', on: false },
    { label: t('Lilac'), color: '#c396ea', on: false },
    { label: t('Rose'), color: '#ea9697', on: false },
    { label: t('Sand'), color: '#eac796', on: false },
    { label: t('Azure'), color: '#96caea', on: false },
  ];

  const Swatches = ({ labelId }: { labelId: string }) => (
    <div className="swatches" role="group" aria-labelledby={labelId}>
      {swatches.map((s) => (
        <button
          key={s.label}
          className="swatch"
          type="button"
          aria-selected={s.on}
          aria-label={s.label}
          style={{ background: s.color }}
        />
      ))}
    </div>
  );

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
                  <div className="field__input" id="designer-name">Esther Howard</div>
                </div>
              </div>

              <div className="field">
                <p className="field__label" id="layout-label">{t('Layout Style')}</p>
                <div className="seg" role="tablist" aria-labelledby="layout-label">
                  <button className="seg__item" type="button" role="tab" aria-selected="true">{t('Modern')}</button>
                  <button className="seg__item" type="button" role="tab" aria-selected="false">{t('Minimal')}</button>
                  <button className="seg__item" type="button" role="tab" aria-selected="false">{t('Bold')}</button>
                </div>
              </div>

              <div className="designer__colors">
                <div className="field">
                  <p className="field__label" id="card-colors-label">{t('Card Colors')}</p>
                  <Swatches labelId="card-colors-label" />
                </div>
                <div className="field">
                  <p className="field__label" id="text-colors-label">{t('Text Colors')}</p>
                  <Swatches labelId="text-colors-label" />
                </div>
              </div>
            </div>

            <Link href={route('create-card.create')} className="btn btn--primary benefits__cta">
              {t('Continue Designing')}
            </Link>
          </div>

          {/* Preview */}
          <div className="panel panel--preview">
            <span className="pill pill--plain">{t('Preview')}</span>

            <div className="preview__tabs" role="tablist" aria-label={t('Card side')}>
              <button className="preview__tab" type="button" role="tab" aria-selected="true">{t('Front')}</button>
              <button className="preview__tab" type="button" role="tab" aria-selected="false">{t('Back')}</button>
            </div>

            <div className="card-front">
              <img src={img('s6-card-front.svg')} alt={t('OneLnk card front preview')} />
              <div className="card-front__pattern" aria-hidden="true">
                <img src={img('s6-card-pattern.svg')} alt="" />
              </div>
              <div className="card-front__logo" aria-hidden="true">
                <img src={img('s6-card-logo.svg')} alt="" />
              </div>
              <div className="card-front__nfc" aria-hidden="true">
                <img src={img('s6-card-nfc.svg')} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
