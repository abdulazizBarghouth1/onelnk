import { useTranslation } from 'react-i18next';

interface Props {
  settings?: any;
  sectionData?: any;
  brandColor?: string;
}

/** OneLnk "The Process" tiers — ported 1:1 from the static design (scoped). */
export default function ProcessSection(_props: Props) {
  const { t } = useTranslation();
  const img = (name: string) => `/images/onelnk/${name}`;

  const tiers = [
    {
      mod: 'classic',
      title: t('Classic Card'),
      subtitle: t('Effortless Professionalism in Minutes'),
      image: 's5-classic.png',
      alt: t('A OneLnk classic card'),
      points: [
        [t('The Pitch:'), t('Clean, pre-designed templates optimized for a fast, sleek turnaround.')],
        [t('Best For:'), t('Individuals, freelancers, and independent consultants who want immediate professionalism.')],
        [t('Included:'), t('Premium PVC card, custom text laser-engraving, standard digital profile features, and built-in QR backup.')],
      ],
    },
    {
      mod: 'custom',
      title: t('Custom Card'),
      subtitle: t('Your Unique Identity, Laser-Engraved'),
      image: 's5-custom.png',
      alt: t('A custom laser-engraved OneLnk card'),
      points: [
        [t('The Pitch:'), t('Complete control over your physical visual identity to truly stand out.')],
        [t('Best For:'), t('Personal brands, founders, executives, creatives, and premium users.')],
        [t('Included:'), t('Full logo upload support, custom card canvas colors, accent controls, and premium digital profile layouts.')],
      ],
    },
    {
      mod: 'teams',
      title: t('Teams & Enterprise Cards'),
      subtitle: t('Centralized Networking for Modern Workforces'),
      image: 's5-teams.png',
      alt: t('OneLnk cards for teams and enterprise'),
      points: [
        [t('The Pitch:'), t('Cohesive, brand-consistent smart cards managed from a centralized dashboard.')],
        [t('Best For:'), t('Growing sales departments, corporate teams, real estate brokerages, and entire organizations.')],
        [t('Included:'), t('Bulk pricing scales, central admin dashboard, locked corporate branding templates, and employee seat management.')],
      ],
    },
  ];

  return (
    <div className="onelnk-landing">
      <section className="process" aria-labelledby="process-title">
        <div className="section-head">
          <h2 className="section-head__title" id="process-title">{t('More Than Just a Business Card')}</h2>
          <p className="section-head__lede">{t('Three simple steps to go fully digital')}</p>
        </div>

        <div className="process__list">
          {tiers.map((tier) => (
            <article className={`tier tier--${tier.mod}`} key={tier.mod}>
              <div className="tier__text">
                <div className="tier__heading">
                  <h3 className="tier__title">{tier.title}</h3>
                  <p className="tier__subtitle">{tier.subtitle}</p>
                </div>
                <ul className="tier__points">
                  {tier.points.map(([label, text]) => (
                    <li className="tier__point" key={label}>
                      <img src={img('s5-check.svg')} alt="" />
                      <p>
                        <b>{label}</b> {text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tier__media">
                <img src={img(tier.image)} alt={tier.alt} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
