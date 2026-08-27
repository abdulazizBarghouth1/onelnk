import { Head, useForm, usePage } from '@inertiajs/react';
import { Fragment, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../landing-page/components/Header';
import { getBusinessTemplate, businessTypeOptions } from '../vcard-builder/business-templates';
import PhysicalCard from './components/PhysicalCard';
import '../../../css/onelnk-landing.css';
import '../../../css/onelnk-wizard.css';
import '../../../css/onelnk-wizard-live.css';

// The live card renderer, shared with the dashboard vCard builder. Lazy-loaded so
// its ~1.6MB bundle (41 template components) only loads when the user reaches step 3.
const VCardPreview = lazy(() => import('../vcard-builder/components/VCardPreview'));

const img = (name: string) => `/images/onelnk/${name}`;

// Default template the digital profile starts on (clean, generic). The user picks
// any of the 41 real templates in step 3.
const BASE_TEMPLATE = 'neutral-professional';

// The universal sections every template shares — the only ones the wizard edits and
// shows. Everything else is disabled so the card stays clean (no placeholder filler).
const CORE_SECTIONS = ['header', 'contact', 'about', 'social'];

const STEP_LABELS = ['Card Type', 'Design', 'Theme', 'Profile', 'Package', 'Review', 'Checkout'];

const CARD_SWATCHES = ['#050e22', '#96ddea', '#c396ea', '#ea9697', '#eac796', '#96caea'];
const TEXT_SWATCHES = ['#ffffff', '#96ddea', '#c396ea', '#ea9697', '#eac796', '#96caea'];

// Gradient builder: preset directions (arrow → CSS angle) + curated presets.
const GRADIENT_ANGLES = [
  { icon: '↖', deg: 315 }, { icon: '↑', deg: 0 }, { icon: '↗', deg: 45 }, { icon: '→', deg: 90 },
  { icon: '↘', deg: 135 }, { icon: '↓', deg: 180 }, { icon: '↙', deg: 225 }, { icon: '←', deg: 270 },
];
const GRADIENT_PRESETS: [string, string][] = [
  ['#050e22', '#1e3a8a'], ['#0f172a', '#334155'], ['#4f46e5', '#06b6d4'],
  ['#7c3aed', '#ec4899'], ['#0ea5e9', '#22d3ee'], ['#f59e0b', '#ef4444'],
];

const SOCIALS = [
  { key: 'twitter', icon: 'wz-soc-twitter.svg', name: 'Twitter' },
  { key: 'instagram', icon: 'wz-soc-instagram.svg', name: 'Instagram' },
  { key: 'linkedin', icon: 'wz-soc-linkedin.svg', name: 'LinkedIn' },
  { key: 'tiktok', icon: 'wz-soc-tiktok.svg', name: 'TikTok' },
  { key: 'snapchat', icon: 'wz-soc-snapchat.svg', name: 'Snapchat' },
  { key: 'youtube', icon: 'wz-soc-youtube.svg', name: 'YouTube' },
  { key: 'portfolio', icon: 'wz-soc-portfolio.svg', name: 'Portfolio' },
  { key: 'custom', icon: 'wz-soc-custom.svg', name: 'Custom Link' },
];

// Placeholder profile URLs so a not-yet-filled social link still renders its icon
// in the live preview (templates detect the platform from the URL domain). These
// are preview-only — empty links are dropped on save.
const SOCIAL_PLACEHOLDER: Record<string, string> = {
  twitter: 'https://twitter.com', instagram: 'https://instagram.com', linkedin: 'https://linkedin.com',
  tiktok: 'https://tiktok.com', snapchat: 'https://snapchat.com', youtube: 'https://youtube.com',
  portfolio: 'https://example.com', custom: 'https://example.com',
};

const STORAGE_KEY = 'onelnk_wizard_v1';

type WizardData = {
  nfc_card_id: number | null;
  quantity: number;
  card_color: string;
  text_color: string;
  card_gradient: boolean;
  card_color_2: string;
  card_gradient_angle: number;
  business_type: string;
  full_name: string;
  job_title: string;
  bio: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  location: string;
  social_links: { platform: string; url: string }[];
  show_whatsapp: boolean;
  show_save_contact: boolean;
  show_social_links: boolean;
  show_location: boolean;
  show_company_logo: boolean;
  plan_id: number | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  city: string;
  shipping_address: string;
  delivery_notes: string;
  payment_method: 'cod' | 'online';
};

export default function CreateCard() {
  const { t } = useTranslation();
  const page = usePage<any>().props;
  const { cardTypes = [], plans = [], shipping = { fee: 0, free_threshold: 0 }, settings, auth } = page;

  const [step, setStep] = useState(1);
  const [templateSearch, setTemplateSearch] = useState('');
  const [openPlan, setOpenPlan] = useState<number | null>(null); // step-5 "Know more" expansion

  const initial: WizardData = {
    nfc_card_id: cardTypes[0]?.id ?? null,
    quantity: 1,
    card_color: CARD_SWATCHES[0],
    text_color: TEXT_SWATCHES[0],
    card_gradient: false,
    card_color_2: '#1e3a8a',
    card_gradient_angle: 135,
    business_type: BASE_TEMPLATE,
    // Dummy Arabic starter content so the live card renders populated from step 3
    // onward — mirrors the dashboard vCard builder, whose preview is pre-seeded from
    // the template's defaultData. The user edits or clears these in step 4.
    full_name: 'عبدالله الأحمدي',
    job_title: 'المؤسس والرئيس التنفيذي',
    bio: 'نصمم بطاقات تعريف رقمية حديثة تصل عملك بعملائك بلمسة واحدة.',
    company: 'شركة ون لِنك',
    phone: '+966 55 123 4567',
    whatsapp: '+966 55 123 4567',
    email: 'abdullah@onelnk.sa',
    website: 'onelnk.sa',
    location: 'الرياض، المملكة العربية السعودية',
    social_links: [
      { platform: 'twitter', url: 'https://twitter.com/onelnk' },
      { platform: 'instagram', url: 'https://instagram.com/onelnk' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/onelnk' },
    ],
    show_whatsapp: true,
    show_save_contact: true,
    show_social_links: true,
    show_location: true,
    show_company_logo: true,
    plan_id: plans.find((p: any) => Number(p.price) === 0)?.id ?? plans[0]?.id ?? null,
    recipient_name: '',
    recipient_phone: '',
    recipient_email: '',
    city: '',
    shipping_address: '',
    delivery_notes: '',
    payment_method: 'cod',
  };

  const { data, setData, transform, post, processing, errors } = useForm<WizardData>(initial);

  // Image uploads are kept out of the (localStorage-persisted) form data because
  // File objects aren't JSON-serializable; they're injected at submit via transform().
  const [cardLogo, setCardLogo] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<{ file: File; url: string } | null>(null);
  const [coverImage, setCoverImage] = useState<{ file: File; url: string } | null>(null);
  const [profileLogo, setProfileLogo] = useState<{ file: File; url: string } | null>(null);

  const pickImage = (setter: (v: { file: File; url: string } | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter({ file, url: URL.createObjectURL(file) });
  };

  // Object-URL for the uploaded physical-card logo, so it shows on the live card
  // in step 2 / step 6. Revoked when it changes to avoid leaking blobs.
  const cardLogoUrl = useMemo(() => (cardLogo ? URL.createObjectURL(cardLogo) : null), [cardLogo]);
  useEffect(() => () => { if (cardLogoUrl) URL.revokeObjectURL(cardLogoUrl); }, [cardLogoUrl]);

  // Inline checkout auth — held OUTSIDE the localStorage-persisted form so passwords
  // are never written to storage; injected into the order submit via transform().
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', password_confirmation: '', terms: false });
  const setAuthField = (k: keyof typeof authForm, v: string | boolean) => setAuthForm((s) => ({ ...s, [k]: v }));
  // Registration can be turned off in admin — hide the Create-Account tab and keep login-only.
  const registrationEnabled = settings?.registrationEnabled !== false;
  useEffect(() => { if (!registrationEnabled && authMode === 'register') setAuthMode('login'); }, [registrationEnabled, authMode]);

  // Persist wizard state so it survives the login round-trip at checkout.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(initial).forEach((k) => {
          if (parsed[k] === undefined) return;
          let val = parsed[k];
          // Migrate legacy social_links (Record<platform,url>) → array shape.
          if (k === 'social_links' && !Array.isArray(val)) {
            val = Object.entries(val || {}).map(([platform, url]) => ({ platform, url: String(url ?? '') }));
          }
          setData(k as keyof WizardData, val);
        });
        if (parsed.__step) setStep(parsed.__step);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, __step: step }));
    } catch { /* ignore */ }
  }, [data, step]);

  const selectedCard = cardTypes.find((c: any) => c.id === data.nfc_card_id) || cardTypes[0];
  const cardPrice = selectedCard ? Number(selectedCard.price) : 0;
  const subtotal = +(cardPrice * data.quantity).toFixed(2);
  const shippingFee = shipping.free_threshold > 0 && subtotal >= shipping.free_threshold ? 0 : Number(shipping.fee || 0);
  // Selected plan billed at its YEARLY price as a line item (0 for the free plan).
  const selectedPlan = plans.find((p: any) => p.id === data.plan_id);
  const planPrice = selectedPlan && Number(selectedPlan.price) > 0 ? Number(selectedPlan.yearly_price || 0) : 0;
  const total = +(subtotal + shippingFee + planPrice).toFixed(2);

  // Effective card background: a solid colour or a linear-gradient (CSS `background`
  // accepts both). Fed to PhysicalCard's --pcard-bg.
  const cardBackground = data.card_gradient
    ? `linear-gradient(${data.card_gradient_angle}deg, ${data.card_color}, ${data.card_color_2})`
    : data.card_color;
  // The QR encodes the profile page. No slug exists at design time → encode the
  // site origin as a placeholder (becomes the real /v/{slug} once the card is made).
  const qrUrl = typeof window !== 'undefined' ? window.location.origin : 'https://onelnk.sa';

  const headerData = settings?.config_sections?.sections?.find((s: any) => s.key === 'header') || {};
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#27aae1';

  const go = (n: number) => { setStep(Math.min(7, Math.max(1, n))); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Assemble config_sections from the SELECTED template + the wizard's core fields.
  //  - fullSections=false (SUBMIT): every non-core render section is disabled so the
  //    saved public card shows only what the wizard collects — no placeholder filler.
  //  - fullSections=true (PREVIEW): the template's own sections stay enabled, so
  //    browsing a template shows its rich sample content, like the dashboard builder.
  // "Rich preview, clean save."
  const buildConfigSections = (fullSections = false) => {
    const template = getBusinessTemplate(data.business_type) as any;
    const base = template?.defaultData ? JSON.parse(JSON.stringify(template.defaultData)) : {};

    if (!fullSections) {
      // Clean save: core sections on, everything else off.
      (template?.sections || []).forEach((section: any) => {
        const key = section.key;
        if (!base[key] || typeof base[key] !== 'object' || Array.isArray(base[key])) {
          base[key] = { ...(base[key] || {}) };
        }
        base[key].enabled = CORE_SECTIONS.includes(key);
      });
    }
    // else: leave the template's default section enablement untouched (rich preview).

    return {
      ...base,
      header: {
        ...(base.header || {}), enabled: true,
        name: data.full_name, title: data.job_title, tagline: data.bio,
        profile_image: profileImage?.url || base.header?.profile_image || '',
      },
      // Templates diverge on the contact location key — ~40% render `address`,
      // the rest `location`. Write both (and overwrite the template's default
      // address) so the single wizard Location field always shows, and no stale
      // sample address ("123 Tech Park…") leaks through when it's left blank.
      contact: { ...(base.contact || {}), enabled: true, email: data.email, phone: data.phone, website: data.website, location: data.location, address: data.location },
      about: { ...(base.about || {}), enabled: true, description: data.bio },
      social: {
        ...(base.social || {}), enabled: true,
        // Preview (fullSections) keeps every chosen platform visible even before a
        // URL is typed (placeholder '#'), until the row is removed. On save, empty
        // links are dropped so nothing blank is persisted.
        social_links: data.social_links
          .filter((s) => fullSections || s.url.trim())
          .map((s) => ({ platform: s.platform, url: s.url.trim() || (fullSections ? (SOCIAL_PLACEHOLDER[s.platform] || 'https://example.com') : ''), username: '' })),
      },
      _onelnk: {
        company: data.company, whatsapp: data.whatsapp, template: data.business_type,
        toggles: {
          whatsapp: data.show_whatsapp, save_contact: data.show_save_contact,
          social: data.show_social_links, location: data.show_location, company_logo: data.show_company_logo,
        },
        card: { color: data.card_color, color2: data.card_color_2, gradient: data.card_gradient, angle: data.card_gradient_angle, text_color: data.text_color, background: cardBackground },
      },
    };
  };

  // Live-preview payload for VCardPreview, recomputed as the user types/selects.
  const previewTemplate = useMemo(() => getBusinessTemplate(data.business_type), [data.business_type]);
  const previewConfigSections = useMemo(
    () => buildConfigSections(true), // rich per-theme preview; submit uses the clean builder
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.business_type, data.full_name, data.job_title, data.bio, data.company, data.email, data.phone, data.website, data.location, data.social_links, profileImage?.url, coverImage?.url, profileLogo?.url],
  );
  const previewData = {
    name: data.full_name || t('My OneLnk Card'),
    config_sections: previewConfigSections,
    template_config: {
      sections: previewConfigSections,
      sectionSettings: previewConfigSections,
      // No allowedSections filter → the preview renders every section the template
      // enables (rich, per-theme). The clean-save enablement is handled at submit
      // by buildConfigSections(false), not here.
    },
  };

  // All 41 real templates, filtered by the step-3 search box.
  const filteredTemplates = useMemo(() => {
    const q = templateSearch.trim().toLowerCase();
    if (!q) return businessTypeOptions;
    return businessTypeOptions.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [templateSearch]);

  // Which image slots the SELECTED template actually renders — so step 4 only shows
  // the Cover/Logo uploads a theme uses (Profile is universal). Derived from the
  // template's `type:'file'` fields (11 templates declare cover, 16 declare logo).
  const templateImageSlots = useMemo(() => {
    const template = getBusinessTemplate(data.business_type) as any;
    const fileFields = new Set<string>();
    (template?.sections || []).forEach((s: any) => (s.fields || []).forEach((f: any) => {
      if (f.type === 'file') fileFields.add(f.name);
    }));
    return {
      cover: fileFields.has('cover_image') || fileFields.has('cover') || fileFields.has('cover_photo'),
      logo: fileFields.has('logo') || fileFields.has('company_logo') || fileFields.has('logo_image'),
    };
  }, [data.business_type]);

  // Live digital-card preview mounted inside the phone frame (replaces the static PNG).
  const digitalPreview = (
    <div className="wzphone wzphone--live">
      <div className="wzphone__scroll onelnk-embed">
        <Suspense fallback={<div className="wzphone__loading">{t('Loading preview…')}</div>}>
          <VCardPreview businessType={data.business_type} data={previewData} template={previewTemplate} />
        </Suspense>
      </div>
    </div>
  );

  const placeOrder = () => {
    transform((d) => ({
      ...d,
      name: d.full_name || t('My OneLnk Card'),
      config_sections: buildConfigSections(),
      card_design: {
        full_name: d.full_name, job_title: d.job_title, phone: d.phone, email: d.email, website: d.website,
        colors: {
          type: d.card_gradient ? 'gradient' : 'solid',
          color: d.card_color, color2: d.card_color_2, angle: d.card_gradient_angle,
          text_color: d.text_color, background: cardBackground,
        },
      },
      // Physical-card logo + digital-profile images (backend stores them and injects
      // the profile image into config_sections.header.profile_image).
      logo: cardLogo || undefined,
      profile_image: profileImage?.file || undefined,
      cover_image: coverImage?.file || undefined,
      profile_logo: profileLogo?.file || undefined,
      // Inline auth for logged-out buyers — the controller signs them in / registers
      // them in this same request, so no navigation and nothing is lost.
      ...(auth?.user ? {} : {
        auth_mode: authMode,
        auth_email: authForm.email,
        auth_password: authForm.password,
        ...(authMode === 'register' ? {
          auth_name: authForm.name,
          auth_password_confirmation: authForm.password_confirmation,
          auth_terms: authForm.terms,
        } : {}),
      }),
    }) as any);
    post(route('create-card.store'), {
      forceFormData: true,
      onSuccess: () => { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } },
    });
  };

  const railState = (i: number) => (step === i + 1 ? 'current' : step > i + 1 ? 'done' : 'upcoming');

  return (
    <>
      <Head title={`${t('Create Your Card')} — OneLnk`} />
      <Header settings={settings} sectionData={headerData} brandColor={primaryColor} user={auth?.user} />

      <div className="onelnk-landing onelnk-wizard">
        <div className="wz">
          <div className="wz__body">
            {/* Progress rail */}
            <ol className="wzsteps" aria-label={t('Progress')}>
              {STEP_LABELS.map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && <li className="wzsteps__line" aria-hidden="true"></li>}
                  <li className="wzstep" data-state={railState(i)} aria-current={step === i + 1 ? 'step' : 'false'}>
                    <span className="wzstep__dot">{i + 1}</span>
                    <span className="wzstep__label">{t(label)}</span>
                  </li>
                </Fragment>
              ))}
            </ol>

            {/* STEP 1 — Card Type */}
            {step === 1 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Choose your Card')}</h1>
                  <p className="wzpanel__lede">{t('Pick the experience that best matches your networking needs.')}</p>
                </div>
                <div className="wzsplit">
                  <div className="wzpreview">
                    <span className="pill pill--plain">{t('Preview')}</span>
                    <PhysicalCard
                      name={data.full_name}
                      title={data.job_title}
                      phone={data.phone}
                      cardColor={cardBackground}
                      textColor={data.text_color}
                      logoUrl={cardLogoUrl}
                      qrUrl={qrUrl}
                    />
                  </div>
                  <div className="wzoptions">
                    {cardTypes.map((c: any) => (
                      <label className="wzopt" key={c.id}>
                        <input type="radio" name="card-type" value={c.id} checked={data.nfc_card_id === c.id} onChange={() => setData('nfc_card_id', c.id)} />
                        <span className="wzopt__head">
                          <span className="wzopt__row">
                            <span className="wzopt__name">{t(c.name)} — ${Number(c.price).toFixed(0)}</span>
                            <img className="wzopt__mark wzopt__mark--off" src={img('wz-radio-off.svg')} alt="" />
                            <img className="wzopt__mark wzopt__mark--on" src={img('wz-radio-on.svg')} alt="" />
                          </span>
                          <span className="wzopt__desc">{t(c.description || '')}</span>
                        </span>
                        <span className="wzopt__rule"></span>
                        <span className="wzopt__tags">
                          {(c.tags || []).map((tag: string) => <span key={tag}>{t(tag)}</span>)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="wznav">
                  <button type="button" className="wznav__btn wznav__btn--back" disabled onClick={() => go(step - 1)}>{t('Back')}</button>
                  <button type="button" className="wznav__btn wznav__btn--next" onClick={() => go(step + 1)}>{t('Next Step')}</button>
                </div>
              </section>
            )}

            {/* STEP 2 — Design */}
            {step === 2 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Design your NFC Card')}</h1>
                  <p className="wzpanel__lede">{t('Personalise every detail. Changes appear on your live preview instantly.')}</p>
                </div>
                <div className="wzsplit">
                  <div className="wzpreview">
                    <span className="pill pill--plain">{t('Preview')}</span>
                    <PhysicalCard
                      name={data.full_name}
                      title={data.job_title}
                      phone={data.phone}
                      cardColor={cardBackground}
                      textColor={data.text_color}
                      logoUrl={cardLogoUrl}
                      qrUrl={qrUrl}
                    />
                  </div>
                  <div className="wzoptions">
                    <div className="wzfields">
                      <div className="wzrow">
                        <div className="wzfield">
                          <label className="wzfield__label" htmlFor="wz-name">{t('Full Name')}</label>
                          <input className="wzfield__control" id="wz-name" type="text" placeholder={t('e.g. Alex Rahman')} value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                        </div>
                        <div className="wzfield">
                          <label className="wzfield__label" htmlFor="wz-job">{t('Job Title')}</label>
                          <input className="wzfield__control" id="wz-job" type="text" placeholder={t('e.g. Senior Product Designer')} value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} />
                        </div>
                      </div>
                      <div className="wzrow">
                        <div className="wzfield">
                          <label className="wzfield__label" htmlFor="wz-phone">{t('Phone')}</label>
                          <input className="wzfield__control" id="wz-phone" type="tel" placeholder="e.g. (704) 555-0127" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div className="wzfield">
                          <label className="wzfield__label" htmlFor="wz-email">{t('Email')}</label>
                          <input className="wzfield__control" id="wz-email" type="email" placeholder="e.g. alex.rahman@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>
                      </div>
                      <div className="wzfield">
                        <label className="wzfield__label" htmlFor="wz-site">{t('Website')}</label>
                        <input className="wzfield__control" id="wz-site" type="url" placeholder="e.g. www.novotechsolution.com" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                      </div>
                    </div>
                    <div className="wzfield">
                      <span className="wzfield__label">{t('Logo Upload')}</span>
                      <label className="wzdrop">
                        <input type="file" name="logo" accept="image/*" onChange={(e) => setCardLogo(e.target.files?.[0] || null)} />
                        <img src={img('p5-upload.svg')} alt="" />
                        <span>{cardLogo ? cardLogo.name : t('Upload your logo image')}</span>
                      </label>
                    </div>
                    <div className="wzcolors">
                      <div className="wzfield">
                        <span className="wzfield__label">{t('Card Colors')}</span>
                        <div className="wzswatches" role="listbox" aria-label={t('Card colour')}>
                          {CARD_SWATCHES.slice(0, -1).map((c) => (
                            <button key={c} className="wzswatch" type="button" role="option" aria-selected={!data.card_gradient && data.card_color === c} style={{ background: c }} onClick={() => { setData('card_color', c); setData('card_gradient', false); }}></button>
                          ))}
                          <label className="wzswatch wzswatch--pick" title={t('Custom colour')}>
                            <input type="color" value={data.card_color} onChange={(e) => { setData('card_color', e.target.value); setData('card_gradient', false); }} />
                          </label>
                        </div>
                      </div>
                      <div className="wzfield">
                        <span className="wzfield__label">{t('Text Colors')}</span>
                        <div className="wzswatches" role="listbox" aria-label={t('Text colour')}>
                          {TEXT_SWATCHES.slice(0, -1).map((c) => (
                            <button key={c} className="wzswatch" type="button" role="option" aria-selected={data.text_color === c} style={{ background: c }} onClick={() => setData('text_color', c)}></button>
                          ))}
                          <label className="wzswatch wzswatch--pick" title={t('Custom colour')}>
                            <input type="color" value={data.text_color} onChange={(e) => setData('text_color', e.target.value)} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="wzgradient">
                      <div className="wzgradient__toggle" role="tablist" aria-label={t('Background type')}>
                        <button type="button" role="tab" aria-selected={!data.card_gradient} className={!data.card_gradient ? 'is-active' : ''} onClick={() => setData('card_gradient', false)}>{t('Solid')}</button>
                        <button type="button" role="tab" aria-selected={data.card_gradient} className={data.card_gradient ? 'is-active' : ''} onClick={() => setData('card_gradient', true)}>{t('Gradient')}</button>
                      </div>
                      {data.card_gradient && (
                        <>
                          <div className="wzgradient__row">
                            <label className="wzgradient__stop">{t('Start')}<input type="color" value={data.card_color} onChange={(e) => setData('card_color', e.target.value)} /></label>
                            <label className="wzgradient__stop">{t('End')}<input type="color" value={data.card_color_2} onChange={(e) => setData('card_color_2', e.target.value)} /></label>
                            <div className="wzgradient__angles" role="group" aria-label={t('Direction')}>
                              {GRADIENT_ANGLES.map((a) => (
                                <button key={a.deg} type="button" className={data.card_gradient_angle === a.deg ? 'wzgradient__angle is-active' : 'wzgradient__angle'} onClick={() => setData('card_gradient_angle', a.deg)} aria-label={`${a.deg}°`}>{a.icon}</button>
                              ))}
                            </div>
                          </div>
                          <div className="wzgradient__presets">
                            {GRADIENT_PRESETS.map(([a, b]) => (
                              <button key={a + b} type="button" className="wzgradient__preset" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-label={t('Preset gradient')} onClick={() => { setData('card_color', a); setData('card_color_2', b); }}></button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="wznav">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                  <button type="button" className="wznav__btn wznav__btn--next" onClick={() => go(step + 1)}>{t('Next Step')}</button>
                </div>
              </section>
            )}

            {/* STEP 3 — Template */}
            {step === 3 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Choose your template')}</h1>
                  <p className="wzpanel__lede">{t('Pick a design — your live preview updates instantly.')}</p>
                </div>
                <div className="wzsplit">
                  <div className="wzpreview wzpreview--tall">
                    <span className="pill pill--plain">{t('Preview')}</span>
                    {digitalPreview}
                  </div>
                  <div className="wzoptions">
                    <div className="wzfield wztplsearch">
                      <input
                        className="wzfield__control"
                        type="search"
                        placeholder={t('Search templates…')}
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                      />
                    </div>
                    <div className="wztemplates" role="listbox" aria-label={t('Templates')}>
                      {filteredTemplates.map((opt) => (
                        <label className={data.business_type === opt.value ? 'wztpl wztpl--active' : 'wztpl'} key={opt.value}>
                          <input type="radio" name="template" value={opt.value} checked={data.business_type === opt.value} onChange={() => setData('business_type', opt.value)} />
                          <span className="wztpl__icon" aria-hidden="true">{opt.icon}</span>
                          <span className="wztpl__name">{t(opt.label)}</span>
                        </label>
                      ))}
                      {filteredTemplates.length === 0 && <p className="wztpl__empty">{t('No templates match your search.')}</p>}
                    </div>
                  </div>
                </div>
                <div className="wznav">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                  <button type="button" className="wznav__btn wznav__btn--next" onClick={() => go(step + 1)}>{t('Next Step')}</button>
                </div>
              </section>
            )}

            {/* STEP 4 — Profile */}
            {step === 4 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Build your digital profile')}</h1>
                  <p className="wzpanel__lede">{t('Personalise every detail. Changes appear on your live preview instantly.')}</p>
                </div>
                <div className="wzsplit">
                  <div className="wzpreview wzpreview--tall">
                    <span className="pill pill--plain">{t('Preview')}</span>
                    {digitalPreview}
                  </div>
                  <div className="wzstack">
                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Image')}</h2>
                      <div className="wzimages">
                        <div className="wztile">
                          <span className="wztile__label">{t('Profile')}</span>
                          <label className="wztile__drop" style={{ backgroundImage: `url('${profileImage?.url || img('wz-profile-ph.jpg')}')` }}>
                            <input type="file" name="profile-image" accept="image/*" onChange={pickImage(setProfileImage)} />
                            <span className="wztile__bar"><img src={img('wz-camera.svg')} alt={t('Upload profile image')} /></span>
                          </label>
                        </div>
                        {templateImageSlots.cover && (
                          <div className="wztile">
                            <span className="wztile__label">{t('Cover')}</span>
                            <label className="wztile__drop" style={{ backgroundImage: `url('${coverImage?.url || img('wz-cover-ph.png')}')` }}>
                              <input type="file" name="cover-image" accept="image/*" onChange={pickImage(setCoverImage)} />
                              <span className="wztile__bar"><img src={img('wz-camera.svg')} alt={t('Upload cover image')} /></span>
                            </label>
                          </div>
                        )}
                        {templateImageSlots.logo && (
                          <div className="wztile">
                            <span className="wztile__label">{t('Logo')} <span>{t('(PNG)')}</span></span>
                            <label className="wztile__drop wztile__drop--logo" style={profileLogo ? { backgroundImage: `url('${profileLogo.url}')` } : undefined}>
                              <input type="file" name="logo-image" accept="image/png" onChange={pickImage(setProfileLogo)} />
                              {!profileLogo && <span className="wztile__logo" aria-hidden="true"><img src={img('wz-logo-ph.svg')} alt="" /></span>}
                              <span className="wztile__bar"><img src={img('wz-camera.svg')} alt={t('Upload logo')} /></span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Basic Fields')}</h2>
                      <div className="wzfields">
                        <div className="wzrow">
                          <div className="wzfield"><label className="wzfield__label">{t('Full Name')}</label><input className="wzfield__control" type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} /></div>
                          <div className="wzfield"><label className="wzfield__label">{t('Job Title')}</label><input className="wzfield__control" type="text" value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} /></div>
                        </div>
                        <div className="wzrow">
                          <div className="wzfield"><label className="wzfield__label">{t('Bio')}</label><input className="wzfield__control" type="text" placeholder={t('e.g. Creating intuitive digital experiences.')} value={data.bio} onChange={(e) => setData('bio', e.target.value)} /></div>
                          <div className="wzfield"><label className="wzfield__label">{t('Company')}</label><input className="wzfield__control" type="text" placeholder={t('e.g. NovaTech Solutions')} value={data.company} onChange={(e) => setData('company', e.target.value)} /></div>
                        </div>
                        <div className="wzrow">
                          <div className="wzfield"><label className="wzfield__label">{t('Phone')}</label><input className="wzfield__control" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} /></div>
                          <div className="wzfield"><label className="wzfield__label">{t('WhatsApp')}</label><input className="wzfield__control" type="tel" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} /></div>
                        </div>
                        <div className="wzrow">
                          <div className="wzfield"><label className="wzfield__label">{t('Email')}</label><input className="wzfield__control" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                          <div className="wzfield"><label className="wzfield__label">{t('Website')}</label><input className="wzfield__control" type="url" value={data.website} onChange={(e) => setData('website', e.target.value)} /></div>
                        </div>
                        <div className="wzfield"><label className="wzfield__label">{t('Location')}</label><input className="wzfield__control" type="text" placeholder={t('e.g. New York, USA')} value={data.location} onChange={(e) => setData('location', e.target.value)} /></div>
                      </div>
                    </div>

                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Social Links')}</h2>
                      <div className="wzsocials">
                        {data.social_links.map((s, i) => {
                          const meta = SOCIALS.find((o) => o.key === s.platform);
                          return (
                            <div className="wzsocial" key={i}>
                              <span className="wzsocial__icon"><img src={img(meta?.icon || 'wz-soc-custom.svg')} alt="" /></span>
                              <select
                                className="wzsocial__select"
                                aria-label={t('Platform')}
                                value={s.platform}
                                onChange={(e) => {
                                  const next = data.social_links.slice();
                                  next[i] = { ...next[i], platform: e.target.value };
                                  setData('social_links', next);
                                }}
                              >
                                {SOCIALS.map((o) => (
                                  <option key={o.key} value={o.key}>{t(o.name)}</option>
                                ))}
                              </select>
                              <input
                                className="wzfield__control wzsocial__url"
                                type="url"
                                placeholder={t('Paste link…')}
                                value={s.url}
                                onChange={(e) => {
                                  const next = data.social_links.slice();
                                  next[i] = { ...next[i], url: e.target.value };
                                  setData('social_links', next);
                                }}
                              />
                              <button
                                type="button"
                                className="wzsocial__remove"
                                aria-label={t('Remove link')}
                                onClick={() => setData('social_links', data.social_links.filter((_, j) => j !== i))}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        className="wzsocial__add"
                        onClick={() => setData('social_links', [...data.social_links, { platform: 'twitter', url: '' }])}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                        {t('Add link')}
                      </button>
                    </div>

                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Feature Toggles')}</h2>
                      <div className="wztoggles">
                        {([
                          ['show_whatsapp', 'Show WhatsApp Button'],
                          ['show_save_contact', 'Show Save Contact Button'],
                          ['show_social_links', 'Show Social Links'],
                          ['show_location', 'Show Location'],
                          ['show_company_logo', 'Show Company Logo'],
                        ] as const).map(([key, label]) => (
                          <div className="wztoggle" key={key}>
                            <span>{t(label)}</span>
                            <label className="wzswitch">
                              <input type="checkbox" checked={data[key] as boolean} onChange={(e) => setData(key, e.target.checked)} />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wznav">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                  <button type="button" className="wznav__btn wznav__btn--next" onClick={() => go(step + 1)}>{t('Next Step')}</button>
                </div>
              </section>
            )}

            {/* STEP 5 — Package / Plan */}
            {step === 5 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Choose your plan')}</h1>
                  <p className="wzpanel__lede">{t('Select the package that fits your networking needs.')}</p>
                </div>
                <div className="wzplans">
                  {plans.map((p: any, idx: number) => (
                    <label className={idx === 1 ? 'wzplan wzplan--featured' : 'wzplan'} key={p.id}>
                      <input type="radio" name="plan" value={p.id} checked={data.plan_id === p.id} onChange={() => setData('plan_id', p.id)} />
                      <span className="wzplan__top">
                        <span className="wzplan__head">
                          <span className="wzplan__id">
                            <span className="wzplan__name">{t(p.name)}</span>
                            <span className="wzplan__price"><b>${Number(p.price).toFixed(0)}</b><span> {Number(p.price) === 0 ? t('/ forever') : t('/ month')}</span></span>
                          </span>
                          <span className="wzplan__desc">{t(p.description || '')}</span>
                        </span>
                        <span className="wzplan__features">
                          {p.stats && (
                            <span className="wzplan__stats">
                              <span className="wzplan__stat"><b>{p.stats.templates}</b>{t('Templates')}</span>
                              <span className="wzplan__stat"><b>{p.stats.storage}</b>{t('Storage')}</span>
                              <span className="wzplan__stat"><b>{p.stats.users}</b>{t('Users')}</span>
                            </span>
                          )}
                          {(Array.isArray(p.features) ? p.features : []).length > 0 && (
                            <>
                              <button
                                type="button"
                                className="wzplan__more"
                                aria-expanded={openPlan === p.id}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenPlan(openPlan === p.id ? null : p.id); }}
                              >
                                {openPlan === p.id ? t('Show less') : t('Know more')}
                                <svg className="wzplan__more-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                              </button>
                              {openPlan === p.id && (
                                <span className="wzplan__featurelist">
                                  {(p.features as string[]).map((f) => (
                                    <span className="wzplan__feature" key={f}><img src={img('s8-check-dark.svg')} alt="" /><span>{t(f)}</span></span>
                                  ))}
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      </span>
                      <span className="wzplan__cta">{Number(p.price) === 0 ? t('Start Free') : t('Choose Plan')}</span>
                    </label>
                  ))}
                </div>
                <div className="wznav">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                  <button type="button" className="wznav__btn wznav__btn--next" onClick={() => go(step + 1)}>{t('Next Step')}</button>
                </div>
              </section>
            )}

            {/* STEP 6 — Review */}
            {step === 6 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Review your Order')}</h1>
                  <p className="wzpanel__lede">{t('Confirm your selections before checkout.')}</p>
                </div>
                <div className="wzsplit wzsplit--review">
                  <div className="wzpreview">
                    <span className="pill pill--plain">{t('Preview')}</span>
                    <PhysicalCard
                      name={data.full_name}
                      title={data.job_title}
                      phone={data.phone}
                      cardColor={cardBackground}
                      textColor={data.text_color}
                      logoUrl={cardLogoUrl}
                      qrUrl={qrUrl}
                    />
                  </div>
                  <div className="wzsummary">
                    <div className="wzsummary__head">{t('Order Summary')}</div>
                    <div className="wzsummary__body">
                      <div className="wzsummary__rows">
                        <div className="wzsumrow"><span>{t('Card Type')}</span><span>{t(selectedCard?.name || '')}</span></div>
                        <div className="wzsumrow"><span>{t('Card Color')}</span><span><i style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: cardBackground, verticalAlign: 'middle' }}></i></span></div>
                        <div className="wzsumrow"><span>{t('Template')}</span><span>{t(businessTypeOptions.find((o) => o.value === data.business_type)?.label || '')}</span></div>
                        <div className="wzsumrow"><span>{t('Package')}</span><span>{t(plans.find((p: any) => p.id === data.plan_id)?.name || '')}</span></div>
                        <div className="wzsumrow">
                          <span>{t('Quantity')}</span>
                          <div className="wzqty">
                            <button type="button" data-qty-dec aria-label={t('Decrease quantity')} disabled={data.quantity <= 1} onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}><img src={img('wz-minus.svg')} alt="" /></button>
                            <output>{data.quantity}</output>
                            <button type="button" data-qty-inc aria-label={t('Increase quantity')} onClick={() => setData('quantity', data.quantity + 1)}><img src={img('pd-plus.svg')} alt="" /></button>
                          </div>
                        </div>
                      </div>
                      <div className="wzsummary__rule"></div>
                      <div className="wzsummary__totals">
                        <div className="wzsumrow"><span>{t('Subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
                        {planPrice > 0 && (
                          <div className="wzsumrow"><span>{t('Plan')} — {t(selectedPlan?.name || '')} · {t('1 year')}</span><span>${planPrice.toFixed(2)}</span></div>
                        )}
                        <div className="wzsumrow"><span>{t('Shipping')}</span><span className={shippingFee === 0 ? 'wzsumrow__free' : ''}>{shippingFee === 0 ? t('FREE') : `$${shippingFee.toFixed(2)}`}</span></div>
                      </div>
                      <div className="wzsummary__total"><span>{t('Total')}</span><span>${total.toFixed(2)}</span></div>
                      <button type="button" className="wzsummary__cta" onClick={() => go(7)}>{t('Continue to Checkout')}</button>
                    </div>
                  </div>
                </div>
                <div className="wznav wznav--single">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                </div>
              </section>
            )}

            {/* STEP 7 — Checkout */}
            {step === 7 && (
              <section className="wzpanel">
                <div className="wzpanel__head">
                  <h1 className="wzpanel__title">{t('Complete Your Order')}</h1>
                  <p className="wzpanel__lede">{t('Enter your delivery details and choose how to pay.')}</p>
                </div>

                {!auth?.user && (
                  <div className="wzcard wzauth" style={{ marginBottom: 16 }}>
                    <div className="wzauth__toggle" role="tablist" aria-label={t('Account')}>
                      <button type="button" role="tab" aria-selected={authMode === 'login'} className={authMode === 'login' ? 'is-active' : ''} onClick={() => setAuthMode('login')}>{t('Sign In')}</button>
                      {registrationEnabled && (
                        <button type="button" role="tab" aria-selected={authMode === 'register'} className={authMode === 'register' ? 'is-active' : ''} onClick={() => setAuthMode('register')}>{t('Create Account')}</button>
                      )}
                    </div>
                    <p className="wzfield__label" style={{ margin: '10px 0 12px' }}>{t('Your design is ready — sign in or create an account to place your order.')}</p>
                    <div className="wzfields">
                      {authMode === 'register' && (
                        <div className="wzfield"><label className="wzfield__label">{t('Full Name')}</label><input className="wzfield__control" type="text" autoComplete="name" value={authForm.name} onChange={(e) => setAuthField('name', e.target.value)} />{errors.auth_name && <span className="wzfield__error">{errors.auth_name}</span>}</div>
                      )}
                      <div className="wzrow">
                        <div className="wzfield"><label className="wzfield__label">{t('Email')}</label><input className="wzfield__control" type="email" autoComplete="email" value={authForm.email} onChange={(e) => setAuthField('email', e.target.value)} />{errors.auth_email && <span className="wzfield__error">{errors.auth_email}</span>}</div>
                        <div className="wzfield"><label className="wzfield__label">{t('Password')}</label><input className="wzfield__control" type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} value={authForm.password} onChange={(e) => setAuthField('password', e.target.value)} />{errors.auth_password && <span className="wzfield__error">{errors.auth_password}</span>}</div>
                      </div>
                      {authMode === 'register' && (
                        <>
                          <div className="wzfield"><label className="wzfield__label">{t('Confirm Password')}</label><input className="wzfield__control" type="password" autoComplete="new-password" value={authForm.password_confirmation} onChange={(e) => setAuthField('password_confirmation', e.target.value)} /></div>
                          <label className="wzterms"><input type="checkbox" checked={authForm.terms} onChange={(e) => setAuthField('terms', e.target.checked)} /> <span>{t('I agree to the Terms & Privacy Policy')}</span></label>
                          {errors.auth_terms && <span className="wzfield__error">{errors.auth_terms}</span>}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="wzsplit wzsplit--checkout">
                  <div className="wzstack">
                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Delivery Information')}</h2>
                      <div className="wzfields">
                        <div className="wzfield"><label className="wzfield__label">{t('Full Name')}</label><input className="wzfield__control" type="text" value={data.recipient_name} onChange={(e) => setData('recipient_name', e.target.value)} />{errors.recipient_name && <span className="wzfield__error">{errors.recipient_name}</span>}</div>
                        <div className="wzrow">
                          <div className="wzfield"><label className="wzfield__label">{t('Phone')}</label><input className="wzfield__control" type="tel" value={data.recipient_phone} onChange={(e) => setData('recipient_phone', e.target.value)} /></div>
                          <div className="wzfield"><label className="wzfield__label">{t('Email')}</label><input className="wzfield__control" type="email" value={data.recipient_email} onChange={(e) => setData('recipient_email', e.target.value)} /></div>
                        </div>
                        <div className="wzfield"><label className="wzfield__label">{t('City')}</label><input className="wzfield__control" type="text" placeholder={t('e.g. New York')} value={data.city} onChange={(e) => setData('city', e.target.value)} /></div>
                        <div className="wzfield"><label className="wzfield__label">{t('Delivery Address')}</label><textarea className="wzfield__control wzfield__control--area" placeholder="e.g. 123 Main Street, Apt 4B, New York, NY 10001" value={data.shipping_address} onChange={(e) => setData('shipping_address', e.target.value)}></textarea>{errors.shipping_address && <span className="wzfield__error">{errors.shipping_address}</span>}</div>
                        <div className="wzfield"><label className="wzfield__label">{t('Order Notes (Optional)')}</label><textarea className="wzfield__control wzfield__control--area" value={data.delivery_notes} onChange={(e) => setData('delivery_notes', e.target.value)}></textarea></div>
                      </div>
                    </div>
                    <div className="wzcard">
                      <h2 className="wzcard__title">{t('Payment Method')}</h2>
                      <div className="wzpay">
                        <div className="wzpayopt">
                          <input type="radio" id="pay-cod" name="payment" value="cod" checked={data.payment_method === 'cod'} onChange={() => setData('payment_method', 'cod')} />
                          <label className="wzpayopt__head" htmlFor="pay-cod">
                            <img className="wzpayopt__mark wzpayopt__mark--off" src={img('wz-radio-off.svg')} alt="" />
                            <img className="wzpayopt__mark wzpayopt__mark--on" src={img('p5-radio-on.svg')} alt="" />
                            <span>{t('Cash on Delivery')}</span>
                          </label>
                        </div>
                        <div className="wzpayopt">
                          <input type="radio" id="pay-online" name="payment" value="online" checked={data.payment_method === 'online'} onChange={() => setData('payment_method', 'online')} />
                          <label className="wzpayopt__head" htmlFor="pay-online">
                            <img className="wzpayopt__mark wzpayopt__mark--off" src={img('wz-radio-off.svg')} alt="" />
                            <img className="wzpayopt__mark wzpayopt__mark--on" src={img('p5-radio-on.svg')} alt="" />
                            <span>{t('Online Payment')}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="wzsummary">
                    <div className="wzsummary__head">{t('Order Summary')}</div>
                    <div className="wzsummary__body">
                      <div className="wzsummary__rows">
                        <div className="wzsumrow"><span>{t(selectedCard?.name || '')} × {data.quantity}</span><span>${subtotal.toFixed(2)}</span></div>
                        {planPrice > 0 && (
                          <div className="wzsumrow"><span>{t(selectedPlan?.name || '')} · {t('1 year')}</span><span>${planPrice.toFixed(2)}</span></div>
                        )}
                        <div className="wzsumrow"><span>{t('Shipping')}</span><span className={shippingFee === 0 ? 'wzsumrow__free' : ''}>{shippingFee === 0 ? t('FREE') : `$${shippingFee.toFixed(2)}`}</span></div>
                      </div>
                      <div className="wzsummary__rule"></div>
                      <div className="wzsummary__total"><span>{t('Total')}</span><span>${total.toFixed(2)}</span></div>
                      <button type="button" className="wzsummary__cta" disabled={processing} onClick={placeOrder}>{processing ? t('Placing Order…') : t('Place Order')}</button>
                    </div>
                  </div>
                </div>
                <div className="wznav wznav--single">
                  <button type="button" className="wznav__btn wznav__btn--back" onClick={() => go(step - 1)}>{t('Back')}</button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
