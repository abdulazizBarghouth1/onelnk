import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface HeaderProps {
  brandColor?: string;
  textColor?: string;
  settings: {
    company_name: string;
    business_directory_enabled?: string | number | boolean;
    config_sections?: {
      theme?: {
        logo_light?: string;
        logo_dark?: string;
        primary_color?: string;
        secondary_color?: string;
        accent_color?: string;
        text_color?: string;
      };
      sections?: Array<{ key: string; active?: boolean; [key: string]: any }>;
      custom_pages?: Array<{ key: string; name: string; slug: string; active?: boolean; [key: string]: any }>;
    };
    registrationEnabled?: string | number | boolean;
    is_authenticated?: boolean;
  };
  sectionData?: any;
  customPages?: any[];
  user?: any;
  /** Homepage-only: render the bar as a dark glassmorphism pill. */
  glass?: boolean;
}

/**
 * OneLnk header — a minimal floating "pill": logo + hamburger. All navigation
 * (nav items, Business Directory, custom pages) and the auth CTAs live inside
 * the opened menu, matching the OneLnk design. Data contract is unchanged, so
 * the landing-page admin config still drives every link.
 */
export default function Header({ settings, sectionData, brandColor = '#F3801E', user, glass = false }: HeaderProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const companyName = settings?.company_name || 'OneLnk';
  const colors = settings?.config_sections?.theme || {};
  const primaryColor = brandColor || colors.primary_color || '#F3801E';
  const isAuthenticated = !!(user || settings?.is_authenticated);
  const enableRegistration =
    settings?.registrationEnabled === '1' ||
    settings?.registrationEnabled === 1 ||
    settings?.registrationEnabled === true;
  const showDirectory = sectionData?.show_business_directory !== false;

  // Per the user's asset setup: the white (non-glass) navbar uses the
  // "Logo (Dark Theme)" field, and the dark glass navbar uses "Logo (Light Theme)".
  const logoUrl = glass ? colors.logo_light || colors.logo_dark : colors.logo_dark || colors.logo_light;

  const navigationItems: Array<{ text: string; href: string; target: string }> = (
    sectionData?.navigation_items || []
  ).map((item: any) => ({
    text: item.text || '',
    href: item.href || '#',
    target: item.target || '_self',
  }));

  const resolveHref = (href: string) =>
    href?.startsWith('/page/') ? route('custom-page.show', href.replace('/page/', '')) : href;

  const menuLinkClass =
    'rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50';

  return (
    <nav className="sticky top-0 z-50 w-full px-4 pt-4">
      <div className="relative mx-auto max-w-md">
        {/* Pill */}
        <div
          className={
            glass
              ? 'flex items-center justify-between rounded-[12px] border border-white/[0.06] bg-neutral-950/55 px-5 py-3 shadow-lg shadow-black/20 backdrop-blur-xl backdrop-saturate-150'
              : 'flex items-center justify-between rounded-full border border-black/5 bg-white px-5 py-3 shadow-lg shadow-black/5'
          }
        >
        <Link href={route('home')} className="flex items-center" aria-label={companyName}>
          {logoUrl && !logoFailed ? (
            <img
              src={getImageDisplayUrl(logoUrl)}
              alt={companyName}
              className="h-8 w-auto max-w-[150px] object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-xl font-bold" style={{ color: primaryColor }}>
              {companyName}
            </span>
          )}
        </Link>

        <button
          type="button"
          aria-label={open ? t('Close menu') : t('Open menu')}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`rounded-full p-2 transition-colors ${glass ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Dropdown menu — absolute so it overlays instead of pushing content down */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-black/5 bg-white p-4 shadow-xl shadow-black/10">
          <div className="flex flex-col gap-1">
            {showDirectory && (
              <Link href={route('directory.index')} onClick={() => setOpen(false)} className={menuLinkClass}>
                {t('Business Directory')}
              </Link>
            )}
            {navigationItems.map((item) =>
              item.target === '_blank' ? (
                <a
                  key={item.text}
                  href={resolveHref(item.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={menuLinkClass}
                >
                  {item.text}
                </a>
              ) : (
                <Link key={item.text} href={resolveHref(item.href)} onClick={() => setOpen(false)} className={menuLinkClass}>
                  {item.text}
                </Link>
              ),
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <button
                onClick={() => router.visit(route('dashboard'))}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                {t('Dashboard')}
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.visit(route('login'))}
                  className="rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  {t('Login')}
                </button>
                {enableRegistration && (
                  <button
                    onClick={() => router.visit(route('register'))}
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {t('Get Started')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </nav>
  );
}
