import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  yearly_price?: number;
  duration: string;
  features?: string[];
  is_popular?: boolean;
  is_plan_enable: string;
}

interface PlansSectionProps {
  brandColor?: string;
  plans?: Plan[];
  settings?: any;
  sectionData?: { title?: string; subtitle?: string; [key: string]: any };
}

/**
 * OneLnk "Packages" pricing — ported 1:1 from the static design (scoped),
 * rendering the real enabled Plan records. Falls back to the OneLnk static
 * three-plan set when no plans are configured.
 */
export default function PlansSection({ plans = [], sectionData = {} }: PlansSectionProps) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const formatCurrency = (amount: number | string) => {
    const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
    if (typeof window !== 'undefined' && (window as any).appSettings?.formatCurrency) {
      return (window as any).appSettings.formatCurrency(n, { showSymbol: true });
    }
    return '$' + n;
  };

  const enabledPlans = plans.filter(
    (p) => p.is_plan_enable === 'on' && (p.duration === 'monthly' || p.duration === 'both'),
  );

  // Card view-model: real plans first, else the OneLnk static set.
  type Card = { key: string; eyebrow: string; priceBig: string; priceSuffix: string; desc: string; tag?: string; features: string[]; cta: string; featured: boolean };

  const cards: Card[] =
    enabledPlans.length > 0
      ? enabledPlans.map((p) => {
          const free = Number(p.price) === 0;
          return {
            key: String(p.id),
            eyebrow: p.name,
            priceBig: free ? t('Free') : formatCurrency(p.price),
            priceSuffix: free ? '' : ` / ${t('month')}`,
            desc: p.description,
            features: p.features || [],
            cta: free ? t('Start Free') : t('Get Started'),
            featured: !!p.is_popular,
          };
        })
      : [
          {
            key: 'free', eyebrow: t('Free'), priceBig: '$0', priceSuffix: ` / ${t('forever')}`,
            desc: t('Get started with your digital profile and basic sharing tools.'),
            features: [t('Digital profile'), t('Basic Link Sharing'), t('Limited Customization')],
            cta: t('Start Free'), featured: false,
          },
          {
            key: 'premium', eyebrow: t('Premium NFC Card'), priceBig: '$49', priceSuffix: ` ${t('One-time')}`,
            desc: t('The complete package — premium physical card with a powerful digital profile.'),
            tag: t('4 months FREE included'),
            features: [t('Digital profile'), t('PVC NFC card'), t('Custom card design'), t('More profile sections'), t('Priority design options')],
            cta: t('Create My Card'), featured: true,
          },
          {
            key: 'teams', eyebrow: t('Teams'), priceBig: t('Custom'), priceSuffix: '',
            desc: t('Branded employee cards with centralized team management.'),
            features: [t('Multiple employee cards'), t('Company branding'), t('Team management'), t('Bulk order'), t('Centralized control')],
            cta: t('Request a Quote'), featured: false,
          },
        ];

  return (
    <div className="onelnk-landing">
      <section className="packages" aria-labelledby="packages-title">
        <h2 className="packages__title" id="packages-title">
          {sectionData.title ? (
            sectionData.title
          ) : (
            <>
              {t('Choose Your')}
              <br />
              {t('Networking Package')}
            </>
          )}
        </h2>

        <div className="packages__grid">
          {cards.map((card) => (
            <article className={card.featured ? 'plan plan--featured' : 'plan'} key={card.key}>
              {card.featured && <span className="ribbon">{t('Recommended')}</span>}
              <div className="plan__top">
                <div className="plan__intro">
                  <p className="plan__eyebrow">{card.eyebrow}</p>
                  <p className="plan__price">
                    <b>{card.priceBig}</b>
                    {card.priceSuffix}
                  </p>
                  <p className="plan__desc">{card.desc}</p>
                  {card.tag && <span className="plan__tag">{card.tag}</span>}
                </div>
                <ul className="plan__features">
                  {card.features.map((f, i) => (
                    <li className="plan__feature" key={i}>
                      <img src={img(card.featured ? 's8-check-light.svg' : 's8-check-dark.svg')} alt="" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={route('register')} className={card.featured ? 'plan__cta plan__cta--accent' : 'plan__cta'}>
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
