import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterProps {
  brandColor?: string;
  flash?: { success?: string; error?: string };
  settings: {
    company_name: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    config_sections?: {
      theme?: { logo_light?: string; logo_dark?: string };
    };
  };
  sectionData?: {
    description?: string;
    links?: { legal?: FooterLink[]; support?: FooterLink[]; [key: string]: any };
    social_links?: Array<{ name: string; icon?: string; href: string }>;
  };
}

/**
 * OneLnk footer — ported from the static design (scoped under .onelnk-landing).
 * Brand text/logo, legal links and social hrefs stay backend-driven where the
 * admin provides them; the marketing nav column is static per the OneLnk design.
 */
export default function Footer({ settings, sectionData = {} }: FooterProps) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // Dark footer → the light-on-dark logo.
  const logo = settings?.config_sections?.theme?.logo_dark || settings?.config_sections?.theme?.logo_light;

  const tagline =
    sectionData.description ||
    t('Smart NFC business cards for modern professionals. One tap. Every connection.');

  const navLinks: FooterLink[] = [
    { name: t('Product'), href: route('marketing.product') },
    { name: t('Packages'), href: route('marketing.packages') },
    { name: t('Gallery'), href: route('marketing.gallery') },
    { name: t('Teams'), href: route('marketing.teams') },
    { name: t('About'), href: route('marketing.about') },
    { name: t('Contact'), href: route('marketing.contact') },
  ];

  const legalLinks: FooterLink[] =
    sectionData.links?.legal || [
      { name: t('Privacy Policy'), href: '/page/privacy-policy' },
      { name: t('Terms & Conditions'), href: '/page/terms-of-service' },
      { name: t('Shipping Policy'), href: '/page/shipping-policy' },
    ];

  const socials = (sectionData.social_links && sectionData.social_links.length
    ? sectionData.social_links
    : [{ href: '#' }, { href: '#' }, { href: '#' }, { href: '#' }]
  ).slice(0, 4);

  return (
    <div className="onelnk-landing">
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__brand-head">
              <Link href={route('home')} className="footer__logo" aria-label={settings.company_name}>
                {logo ? (
                  <img src={getImageDisplayUrl(logo)} alt={settings.company_name} />
                ) : (
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem' }}>{settings.company_name}</span>
                )}
              </Link>
              <p className="footer__tagline">{tagline}</p>
            </div>

            <div className="footer__socials">
              {socials.map((s, i) => (
                <a key={i} href={s.href || '#'} aria-label={t('Social profile')}>
                  <img src={`/images/onelnk/social-${i + 1}.svg`} alt="" />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer__nav" aria-label={t('Footer')}>
            <div className="footer__col">
              <h3>{t('Navigation')}</h3>
              <ul>
                {navLinks.map((l) => (
                  <li key={l.name}>
                    <a href={l.href}>{l.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3>{t('Legal')}</h3>
              <ul>
                {legalLinks.map((l) => (
                  <li key={l.name}>
                    <a href={l.href}>{l.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer__rule" role="presentation"></div>

        <p className="footer__copyright">
          © {year} {settings.company_name}. {t('All rights reserved.')}
        </p>
      </footer>
    </div>
  );
}
