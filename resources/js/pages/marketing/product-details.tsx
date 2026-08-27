import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import BenefitsSection from '../landing-page/components/BenefitsSection';
import HowToSection from '../landing-page/components/HowToSection';
import CTASection from '../landing-page/components/CTASection';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-productdetails.css';

const img = (name: string) => `/images/onelnk/${name}`;

interface Card {
  id: number;
  name: string;
  description: string | null;
  features: string[];
  tags: string[];
  price: number;
  compare_price: number | null;
  front_image: string | null;
  back_image: string | null;
}

const formatCurrency = (amount: number) => {
  if (typeof window !== 'undefined' && (window as any).appSettings?.formatCurrency) {
    return (window as any).appSettings.formatCurrency(amount, { showSymbol: true });
  }
  return '$' + amount.toFixed(2);
};

const SWATCHES = [
  { c: '#0b1729', label: 'Navy Blue' },
  { c: '#96ddea', label: 'Sky' },
  { c: '#c396ea', label: 'Lilac' },
  { c: '#ea9697', label: 'Coral' },
  { c: '#eac796', label: 'Sand' },
  { c: '#96caea', label: 'Azure' },
];

// Static product highlights + spec grid — universal to the NFC card, matches the Figma.
const DEFAULT_CHIPS = ['Instant Sharing', 'No App Required', 'Reusable', 'Fully Customizable'];
const SPECS: Array<[string, string]> = [
  ['Material', 'Premium PVC'],
  ['Updates', 'Unlimited'],
  ['Size', '85.6 × 54 mm'],
  ['Compatibility', 'iOS & Android'],
];

export default function ProductDetails() {
  const { t } = useTranslation();
  const { settings, auth, card } = usePage<any>().props as { settings: any; auth: any; card: Card };
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';
  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};

  const [qty, setQty] = useState(1);
  const [swatch, setSwatch] = useState(0);

  const price = Number(card.price) || 0;
  const comparePrice = card.compare_price != null ? Number(card.compare_price) : null;
  const savePercent = useMemo(() => {
    if (comparePrice && comparePrice > price) return Math.round((1 - price / comparePrice) * 100);
    return 0;
  }, [price, comparePrice]);
  const subtotal = +(price * qty).toFixed(2);

  const chips = card.features && card.features.length > 0 ? card.features.slice(0, 4) : DEFAULT_CHIPS;
  const heroImage = card.front_image || img('pd-hero.png');
  const createCardUrl = route('create-card.create');

  return (
    <>
      <Head title={`${card.name} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-productdetails">
        <main>
          {/* Product detail — bound to the real NfcCard */}
          <section className="pd" aria-labelledby="pd-title">
            <div className="pd__media">
              <img src={heroImage} alt={card.name} />
            </div>

            <div className="pd__info">
              <div className="pd__badges">
                <span className="pdbadge pdbadge--seller">{t('Best Seller')}</span>
                <span className="pdbadge pdbadge--stock">
                  <img src={img('pd-stock.svg')} alt="" />{t('In stock & Ready To Ship')}
                </span>
              </div>

              <div className="pd__body">
                <div>
                  <div className="pd__heading">
                    <h1 className="pd__title" id="pd-title">{t(card.name)}</h1>
                    {card.description && <p className="pd__desc">{t(card.description)}</p>}
                  </div>

                  <div className="pd__pricing" style={{ marginTop: 40 }}>
                    <p className="pd__price-group">
                      <span className="pd__price">{formatCurrency(price)}</span>
                      {comparePrice && comparePrice > price && (
                        <span className="pd__price-was">{formatCurrency(comparePrice)}</span>
                      )}
                    </p>
                    {savePercent > 0 && <span className="pd__save">{t('Save')} {savePercent}%</span>}
                  </div>
                </div>

                <div className="pd__chips">
                  {chips.map((c) => (
                    <span className="pdchip" key={c}><img src={img('pd-feat.svg')} alt="" />{t(c)}</span>
                  ))}
                </div>

                <div className="pdbuy">
                  <div className="pdbuy__group">
                    <div className="pdbuy__field">
                      <p className="pdbuy__label-row"><span>{t('Card Colors')}</span><span>{t(SWATCHES[swatch].label)}</span></p>
                      <div className="pdbuy__swatches" role="group" aria-label={t('Card colour')}>
                        {SWATCHES.map((s, i) => (
                          <button
                            key={s.c}
                            className="pdbuy__swatch"
                            type="button"
                            aria-selected={swatch === i}
                            aria-label={t(s.label)}
                            style={{ background: s.c }}
                            onClick={() => setSwatch(i)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pdbuy__pair">
                      <div className="pdbuy__field">
                        <label className="pdbuy__label" htmlFor="pd-name">{t('Full Name')}</label>
                        <div className="pdbuy__input" id="pd-name">{t('e.g. Alex Rahman')}</div>
                      </div>
                      <div className="pdbuy__field">
                        <label className="pdbuy__label" htmlFor="pd-role">{t('Job Title')}</label>
                        <div className="pdbuy__input" id="pd-role">{t('e.g. Senior Product Designer')}</div>
                      </div>
                    </div>
                  </div>

                  <dl className="pdspecs">
                    <div className="pdspecs__row">
                      {SPECS.slice(0, 2).map(([k, v]) => (
                        <div className="pdspecs__item" key={k}><dt>{t(k)}</dt><dd>{t(v)}</dd></div>
                      ))}
                    </div>
                    <div className="pdspecs__row">
                      {SPECS.slice(2, 4).map(([k, v]) => (
                        <div className="pdspecs__item" key={k}><dt>{t(k)}</dt><dd>{t(v)}</dd></div>
                      ))}
                    </div>
                  </dl>

                  <div className="pdbuy__actions">
                    <div className="pdqty">
                      <button type="button" aria-label={t('Decrease quantity')} disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                        <img src={img('pd-minus.svg')} alt="" />
                      </button>
                      <output aria-label={t('Quantity')}>{qty}</output>
                      <button type="button" aria-label={t('Increase quantity')} onClick={() => setQty((q) => q + 1)}>
                        <img src={img('pd-plus.svg')} alt="" />
                      </button>
                    </div>
                    <Link href={createCardUrl} className="pdbuy__cta">{t('Create Your Card')}</Link>
                  </div>

                  <dl className="pdbuy__total">
                    <dt>{t('Subtotal:')}</dt>
                    <dd>{formatCurrency(subtotal)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* Shared reused sections */}
          <BenefitsSection />
          <HowToSection />

          {/* Why your digital profile matters — static */}
          <section className="why" aria-labelledby="why-title">
            <div className="why__copy">
              <div className="why__head">
                <h2 className="why__title" id="why-title">{t('Why Your Digital Profile Matters')}</h2>
                <ul className="why__list">
                  {[
                    ['Everything in One Place', 'Keep all your professional details in a single, shareable profile.'],
                    ['Always Up to Date', 'Update your information anytime without reprinting your card.'],
                    ['Professional First Impression', 'Present a polished profile that reflects your brand.'],
                    ['Instant Sharing', 'Share your profile instantly with a tap or QR scan.'],
                    ['Create More Opportunities', 'Turn every connection into a potential customer or client.'],
                  ].map(([b, s]) => (
                    <li className="why__item" key={b}>
                      <span className="why__icon"><img src={img('pd-check.svg')} alt="" /></span>
                      <div><b>{t(b)}</b><span>{t(s)}</span></div>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={createCardUrl} className="btn btn--outline">{t('Learn More')}</Link>
            </div>
            <div className="why__media">
              <img src={img('s5-classic.png')} alt={t('A OneLnk card in use')} />
            </div>
          </section>

          <CTASection sectionData={{}} />
        </main>

        <Footer settings={settings} sectionData={{}} brandColor={primaryColor} />
      </div>
    </>
  );
}
