import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface FooterProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings: {
    company_name: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    config_sections?: {
      theme?: {
        logo_light?: string;
        logo_dark?: string;
      };
    };
  };
  directorySettings?: any;
  sectionData?: {
    description?: string;
    newsletter_title?: string;
    newsletter_subtitle?: string;
    links?: any;
    social_links?: Array<{
      name: string;
      icon: string;
      href: string;
    }>;
    section_titles?: {
      support: string;
      legal: string;
    };
  };
}

export default function DirectoryFooter({ settings, directorySettings, sectionData = {}, brandColor = '#3b82f6', flash }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [isDarkMode, setIsDarkMode] = React.useState(() => document.documentElement.classList.contains('dark'));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email: ''
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.subscribe'), {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    });
  };

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getLogo = () => {
    const logoLight = directorySettings?.config_sections?.company?.logo_light;
    const logoDark = directorySettings?.config_sections?.company?.logo_dark;

    if ((window as any).isDemo === true) return logoDark;

    return isDarkMode ? logoDark : logoLight;
  };

  const logoUrl = getLogo();
  const companyDisplayName = directorySettings?.config_sections?.company?.name;

  const footerLinks = sectionData.links || {
    support: [
      { name: 'Help Center', href: '#faq' },
      { name: 'Documentation', href: '#contact' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/page/privacy-policy' },
      { name: 'Terms of Service', href: '/page/terms-of-service' }
    ]
  };

  const iconMap: Record<string, any> = {
    Facebook,
    Twitter,
    Linkedin,
    Instagram
  };

  const socialLinks = sectionData.social_links || [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Link href={route('home')} className="mb-6 block transition-opacity hover:opacity-80">
                {logoUrl ? (
                  <img
                    key={`${logoUrl}-${isDarkMode}`}
                    src={getImageDisplayUrl(logoUrl)}
                    alt={companyDisplayName}
                    className="h-8 w-auto max-w-[200px] object-contain"
                  />
                ) : null}
                <span className={`text-2xl font-bold text-white transition-colors ${logoUrl ? 'hidden' : 'block'}`}>
                  {companyDisplayName}
                </span>
              </Link>
              <p className="mb-8 leading-relaxed text-gray-400">
                {sectionData.description || t('Digital business card landing page with the exact section names from the markdown blueprint.')}
              </p>
            </div>

            <div>
              <p className="mb-4 font-semibold text-white">{sectionData.section_titles?.legal || t('Legal')}</p>
              <div className="space-y-3 text-sm text-gray-400">
                {(footerLinks.legal || []).map((link: any) => (
                  <div key={link.name}>
                    <a href={link.href} className="transition-colors hover:text-white">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-semibold text-white">{sectionData.section_titles?.support || t('Support')}</p>
              <div className="space-y-3 text-sm text-gray-400">
                {(footerLinks.support || []).map((link: any) => (
                  <div key={link.name}>
                    <a href={link.href} className="transition-colors hover:text-white">
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 lg:pl-8 xl:pl-12">
              <p className="mb-4 font-semibold text-white">{sectionData.newsletter_title || t('Subscribe Newsletter')}</p>
              <p className="mb-6 text-sm leading-6 text-gray-400">
                {sectionData.newsletter_subtitle || t('Get the latest updates, tips, and exclusive content delivered to your inbox.')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="flex-1">
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder={t('Enter your email')}
                    className="min-w-[220px] flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 outline-none"
                    style={{ borderColor: `${brandColor}66` }}
                    required
                    disabled={processing}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-[52px] rounded-lg border-0 px-6 font-semibold text-white shadow-none transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:shrink-0"
                  style={{ backgroundColor: brandColor }}
                >
                  {processing ? t('Subscribing...') : t('Subscribe')}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="text-sm text-gray-400">
              © {currentYear} {settings.company_name}. {t('All rights reserved.')}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{t('Follow us:')}</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.icon] || Facebook;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
