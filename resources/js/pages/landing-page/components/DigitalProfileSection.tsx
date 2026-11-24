import { lazy, Suspense, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getBusinessTemplate, businessTypeOptions } from '../../vcard-builder/business-templates';

// The live card renderer, shared with the dashboard vCard builder + create-card
// wizard step 3. Lazy-loaded so its large template bundle only loads on view.
const VCardPreview = lazy(() => import('../../vcard-builder/components/VCardPreview'));

const STORAGE_KEY = 'onelnk_wizard_v1';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/**
 * Product-page "digital profile" section — a live teaser of create-card step 3.
 * Renders the real <VCardPreview> inside a phone frame on a white panel, and a
 * theme picker that live-swaps the template. "Continue Designing" seeds the
 * wizard (localStorage) so it opens on the template the visitor chose.
 */
export default function DigitalProfileSection(_props: Props) {
  const { t } = useTranslation();
  const [bt, setBt] = useState('tech-startup');
  const [search, setSearch] = useState('');

  const template = useMemo(() => getBusinessTemplate(bt), [bt]);
  // Rich per-theme preview: feed the template's own sample data (like step 3's
  // fullSections preview) so the phone shows a populated profile immediately.
  const previewData = useMemo(() => {
    const base = (template as any)?.defaultData ? JSON.parse(JSON.stringify((template as any).defaultData)) : {};
    return {
      name: base?.header?.name || t('My OneLnk Card'),
      config_sections: base,
      template_config: { sections: base, sectionSettings: base },
    };
  }, [template, t]);

  // Every real template, filtered by the search box - the same list and the same
  // match rule as the wizard's step 3, so the two pickers can never drift apart.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return businessTypeOptions;
    return businessTypeOptions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [search]);

  const continueDesigning = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, business_type: bt, __step: 3 }));
    } catch { /* ignore */ }
    router.visit(route('create-card.create'));
  };

  return (
    <div className="onelnk-landing onelnk-product">
      <section className="designer2" aria-labelledby="designer2-title">
        <div className="phead-block">
          <h2 className="phead-block__title" id="designer2-title">{t('A Smart Digital Profile Behind Every Card')}</h2>
          <p className="phead-block__text">
            {t('Your physical card triggers a highly customized digital page. Update your socials, files,')}<br />
            {t('background theme, or booking forms anytime without reprinting your card.')}
          </p>
        </div>
        <div className="designer2__row">
          {/* Live preview on a white panel (per the design ask). */}
          <div className="preview2 preview2--white">
            <span className="preview2__chip">{t('Preview')}</span>
            <div className="onelnk-wizard">
              <div className="wzphone wzphone--live">
                <div className="wzphone__scroll onelnk-embed">
                  <Suspense fallback={<div className="wzphone__loading">{t('Loading preview…')}</div>}>
                    <VCardPreview businessType={bt} data={previewData} template={template} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* The picker IS the wizard's step-3 template picker: same `.wzoptions`
              panel, same `.wztplsearch` field, same `.wztpl` cards. Carrying the
              wizard's own class names (and both scope classes, which its brand
              overrides need together) means it inherits that CSS wholesale -
              onelnk-wizard.css + onelnk-wizard-live.css are already imported by
              this page - rather than keeping a second look-alike in sync. */}
          <div className="presets onelnk-wizard onelnk-landing">
            <h3 className="presets__title">{t('Choose a Preset Dynamic Style')}</h3>
            <div className="wzfield wztplsearch">
              <input
                className="wzfield__control"
                type="search"
                placeholder={t('Search templates…')}
                aria-label={t('Search templates')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* radiogroup, not the wizard's `listbox`: what is inside are radio
                inputs, and a listbox with no role="option" children reads as
                empty. Purely semantic - identical on screen. */}
            <div className="wztemplates" role="radiogroup" aria-label={t('Templates')}>
              {filtered.map((opt) => (
                <label className={bt === opt.value ? 'wztpl wztpl--active' : 'wztpl'} key={opt.value}>
                  <input
                    type="radio"
                    name="preset-template"
                    value={opt.value}
                    checked={bt === opt.value}
                    onChange={() => setBt(opt.value)}
                  />
                  <span className="wztpl__icon" aria-hidden="true">{opt.icon}</span>
                  <span className="wztpl__name">{t(opt.label)}</span>
                </label>
              ))}
              {filtered.length === 0 && <p className="wztpl__empty">{t('No templates match your search.')}</p>}
            </div>
            <button type="button" onClick={continueDesigning} className="presets__cta">{t('Continue Designing')}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
