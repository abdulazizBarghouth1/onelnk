import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
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
      custom_pages?: Array<{
        key: string;
        name: string;
        slug: string;
        active?: boolean;
        [key: string]: any;
      }>;
    };
    registrationEnabled?: string | number | boolean;
    is_authenticated?: boolean;
  };
  sectionData?: any;
  directorySettings?: any;
  customPages?: any[];
  user?: any;
}

const HEADER_VARIANTS = {
  header1: {
    nav: 'bg-white border-b border-gray-200 sticky top-0 z-50',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wrapper: 'relative flex justify-between items-center min-h-16 py-2 gap-4',
    logo: 'text-2xl font-bold lg:max-w-[180px] max-w-[140px] shrink-0 flex-none min-w-0',
    desktop: 'hidden md:flex flex-1 min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1',
    mobile: 'md:hidden text-gray-600 p-2 transition-colors',
    mobileMenu: 'absolute left-0 right-0 top-full z-50 md:hidden bg-white border-t shadow-lg'
  },
  header2: {
    nav: 'bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wrapper: 'relative flex flex-col items-center py-6 space-y-6',
    logo: 'text-3xl font-bold shrink-0 flex-none min-w-0',
    desktop: 'flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full',
    mobile: 'md:hidden text-gray-600 p-2 transition-colors absolute top-4 right-4 hover:bg-gray-100 rounded-lg',
    mobileMenu: 'absolute left-0 right-0 top-full z-50 md:hidden bg-white border-t w-full shadow-lg'
  },
  header3: {
    nav: 'bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50',
    container: 'max-w-6xl mx-auto px-6 sm:px-8 lg:px-10',
    wrapper: 'relative flex justify-between items-center min-h-14 py-2 gap-4',
    logo: 'text-xl font-bold shrink-0 flex-none min-w-0',
    desktop: 'hidden md:flex flex-1 min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1',
    mobile: 'md:hidden text-gray-600 p-2 transition-colors hover:bg-gray-100 rounded-md',
    mobileMenu: 'absolute left-0 right-0 top-full z-50 md:hidden bg-white/95 backdrop-blur-md border-t shadow-lg'
  },
  header4: {
    nav: 'bg-black/20 backdrop-blur-md absolute top-0 left-0 right-0 z-50 border-b border-white/10',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wrapper: 'relative flex justify-between items-center min-h-20 py-4 gap-4',
    logo: 'text-2xl font-bold text-white drop-shadow-lg shrink-0 flex-none min-w-0',
    desktop: 'hidden md:flex flex-1 min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1',
    mobile: 'md:hidden text-white p-2 transition-colors hover:bg-white/10 rounded-lg',
    mobileMenu: 'absolute left-0 right-0 top-full z-50 md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 shadow-lg'
  },
  header5: {
    nav: 'sticky top-0 z-50 shadow-xl',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wrapper: 'relative flex justify-between items-center min-h-20 py-4 gap-4',
    logo: 'text-2xl font-bold text-white drop-shadow-lg shrink-0 flex-none min-w-0',
    desktop: 'hidden md:flex flex-1 min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1',
    mobile: 'md:hidden text-white p-2 transition-colors hover:bg-white/10 rounded-lg',
    mobileMenu: 'absolute left-0 right-0 top-full z-50 md:hidden border-t border-white/20 shadow-lg'
  }
} as const;

export default function DirectoryHeader({ settings, sectionData, directorySettings, brandColor = '#3b82f6', textColor, user }: HeaderProps) {
  const { t } = useTranslation();
  const { auth } = usePage<any>().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const variant = sectionData?.variant || 'header1';
  const config = HEADER_VARIANTS[variant as keyof typeof HEADER_VARIANTS] || HEADER_VARIANTS.header1;

  const isAuthenticated = !!(user || auth?.user || settings?.is_authenticated);
  const colors = settings?.config_sections?.theme || {};
  const currentTextColor = sectionData?.text_color || textColor || colors.text_color || '#374151';
  const primaryColor = brandColor || colors.primary_color || '#10b77f';
  const isDarkMode = document?.documentElement?.classList.contains('dark');

  useEffect(() => {
    const checkTheme = () => {
      setMobileMenuOpen(false);
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const getLogo = () => {
    const logoLight = directorySettings?.config_sections?.company?.logo_light;
    const logoDark = directorySettings?.config_sections?.company?.logo_dark;
    return isDarkMode ? logoDark : logoLight;
  };

  const directoryHeader = directorySettings?.config_sections?.header || {};
  const navigationItems = (directoryHeader.navigation_items || sectionData?.navigation_items || []).map((item: any) => ({
    text: item.text || '',
    href: item.href || '#',
    target: item.target || '_self'
  }));

  const renderNavItems = (isMobile = false) => {
    const isTransparentOrGradient = variant === 'header4' || variant === 'header5';
    const textClass = isTransparentOrGradient ? 'text-white' : 'text-gray-600';

    return navigationItems.map((item) => {
      const href = item.href?.startsWith('/page/')
        ? route('directory.custom-page.show', item.href.replace('/page/', ''))
        : item.href;

      const classes = isMobile
        ? `block px-4 py-3 text-base font-medium ${textClass} transition-all`
        : `${textClass} px-4 py-2 text-sm font-medium transition-all duration-200`;

      if (item.target === '_blank') {
        return (
          <a
            key={item.text}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            style={{ color: currentTextColor }}
            onMouseEnter={!isMobile ? (e) => {
              if (!isTransparentOrGradient) e.currentTarget.style.color = primaryColor;
            } : undefined}
            onMouseLeave={!isMobile ? (e) => (e.currentTarget.style.color = currentTextColor) : undefined}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            {item.text}
          </a>
        );
      }

      return (
        <Link
          key={item.text}
          href={href}
          className={classes}
          style={{ color: currentTextColor }}
          onMouseEnter={!isMobile ? (e) => {
            if (!isTransparentOrGradient) e.currentTarget.style.color = primaryColor;
          } : undefined}
          onMouseLeave={!isMobile ? (e) => (e.currentTarget.style.color = currentTextColor) : undefined}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          {item.text}
        </Link>
      );
    });
  };

  const renderCTAButtons = (isMobile = false) => {
    const enableRegistration = settings?.registrationEnabled === '1';
    const ctaButtonClass = `rounded-md font-medium transition-colors cursor-pointer ${isMobile ? 'px-4 py-2 text-sm w-full' : variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}`;

    if (isAuthenticated) {
      return (
        <button
          onClick={() => router.visit(route('dashboard'))}
          className={`text-white rounded-md font-medium transition-colors cursor-pointer ${isMobile ? 'px-4 py-2 text-sm w-full' : variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}`}
          style={{ backgroundColor: primaryColor }}
        >
          {t('Dashboard')}
        </button>
      );
    }

    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
        <button
          onClick={() => router.visit(route('login'))}
          className={`border ${ctaButtonClass}`}
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          {t('Login')}
        </button>
        {enableRegistration && (
          <button
            onClick={() => router.visit(route('register'))}
            className={`text-white ${ctaButtonClass}`}
            style={{ backgroundColor: primaryColor }}
          >
            {t('Get Started')}
          </button>
        )}
      </div>
    );
  };

  const logoUrl = getLogo();
  const companyDisplayName = directorySettings?.config_sections?.company?.name;

  return (
    <header className={config.nav}>
      <div className={config.container}>
        <div className={config.wrapper}>
          <Link href={route('home')} className={config.logo}>
            {logoUrl ? (
              <img
                src={getImageDisplayUrl(logoUrl)}
                alt={companyDisplayName}
                className="h-8 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <span style={{ color: currentTextColor }}>
                {companyDisplayName}
              </span>
            )}
          </Link>

          <div className={config.desktop}>
            {renderNavItems()}
            {renderCTAButtons()}
          </div>

          <button
            type="button"
            className={config.mobile}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={config.mobileMenu}>
          <div className="px-3 py-3 space-y-1 sm:px-4">
            {renderNavItems(true)}
            <div className="pt-2">
              {renderCTAButtons(true)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
