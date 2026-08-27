import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { Search, Star, Eye, Phone, Mail, Globe, Filter, MapPin, Loader2, ChevronLeft, ChevronRight, Settings as SettingsIcon, BadgeCheck, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useFavicon } from '@/hooks/use-favicon';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import DirectoryHeader from './components/DirectoryHeader';
import DirectoryFooter from './components/DirectoryFooter';
import { businessTypeOptions } from '@/pages/vcard-builder/business-templates';

interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  clinic_address?: string;
}

interface ConfigSections {
  contact?: ContactInfo;
}

interface Business {
  id: number;
  name: string;
  business_type: string;
  slug: string;
  url_prefix: string;
  custom_domain?: string;
  domain_type?: string;
  is_featured: boolean;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  directory_description?: string;
  config_sections: ConfigSections;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface BusinessData {
  data: Business[];
  links: PaginationLink[];
  meta: {
    from?: number;
    to?: number;
    total?: number;
  };
}

interface LandingSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    theme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
    };
  };
}

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface MenuItem {
  id: number;
  title: string;
  type: 'category' | 'filter' | 'link';
  value: string;
  icon: string;
  order: number;
  is_active: boolean;
  url?: string;
}

interface DirectorySettings {
  id?: number;
  title: string;
  description: string;
  menu_items: MenuItem[];
  config_sections: {
    theme: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
    };
    background_image?: string;
    use_background_image?: boolean;
    company?: {
      name: string;
      contact_email?: string;
      contact_phone?: string;
      contact_address?: string;
      description?: string;
    };
    hero?: {
      trust_badge: string;
      main_title: string;
      subtitle: string;
      features: Array<{
        icon: string;
        text: string;
      }>;
    };
    footer?: {
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
        product: string;
        company: string;
        support: string;
        legal: string;
      };
    };
    section_order?: string[];
    section_visibility?: Record<string, boolean>;
  };
}

interface Props {
  businesses: BusinessData;
  categories: Array<{ value: string; label: string; count?: number }>;
  filters: {
    search?: string;
    category?: string;
  };
  settings: LandingSettings;

  directoryCustomPages: CustomPage[];
  directorySettings: DirectorySettings;
}

export default function BusinessDirectory({ businesses, categories, filters, settings, directoryCustomPages, directorySettings }: Props) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
  const [sortBy, setSortBy] = useState('views');
  const [isLoading, setIsLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  
  // Apply favicon from brand settings
  useFavicon();
  
  // Get brand colors - prioritize directory settings over landing page settings
  const { themeColor, customColor } = useBrand();
  const directoryPrimaryColor = directorySettings?.config_sections?.theme?.primary_color;
  const directorySecondaryColor = directorySettings?.config_sections?.theme?.secondary_color;
  const directoryAccentColor = directorySettings?.config_sections?.theme?.accent_color;
  const configPrimaryColor = settings.config_sections?.theme?.primary_color;
  const configSecondaryColor = settings.config_sections?.theme?.secondary_color;
  const configAccentColor = settings.config_sections?.theme?.accent_color;
  
  const primaryColor = directoryPrimaryColor || configPrimaryColor || (themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS]);
  const secondaryColor = directorySecondaryColor || configSecondaryColor || '#3b82f6';
  const accentColor = directoryAccentColor || configAccentColor || '#8b5cf6';
  
  // Apply theme colors to CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (primaryColor) {
        document.documentElement.style.setProperty('--theme-color', primaryColor);
        document.documentElement.style.setProperty('--primary', primaryColor);
      }
      if (secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      }
      if (accentColor) {
        document.documentElement.style.setProperty('--accent-color', accentColor);
      }
    }
  }, [primaryColor, secondaryColor, accentColor]);
  
  // Get auth user
  const page = usePage<any>();
  const { auth } = page.props;
  const handleSearch = async () => {
    setIsLoading(true);
    router.get(route('directory.index'), {
      search: searchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy !== 'views' ? sortBy : undefined,
    }, {
      onFinish: () => setIsLoading(false)
    });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setIsLoading(true);
    router.get(route('directory.index'), {
      search: searchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: newSort !== 'views' ? newSort : undefined,
    }, {
      onFinish: () => setIsLoading(false)
    });
  };

  // Helper function to get base host for subdomains
  const getBaseHost = (): string => {
    const hostname = window.location.hostname;
    // Extract base domain from current hostname
    const parts = hostname.split('.');
    return parts.length > 1 ? parts.slice(-2).join('.') : hostname;
  };
  
  // Helper function to sanitize slug for route usage
  const sanitizeSlug = (slug: string): string => {
    if (!slug) return 'invalid-slug';
    // Replace any characters that are not alphanumeric, hyphens, or underscores
    return slug.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'invalid-slug';
  };

  const getBusinessUrl = (business: Business) => {
    if (business.custom_domain) {
      return `https://${business.custom_domain}`;
    } else if (business.domain_type === 'subdomain') {
      return `${window.location.protocol}//${business.slug}.${getBaseHost()}`;
    } else {
      return business.url_prefix && business.url_prefix !== ''
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) })
        : route('public.vcard.show.direct', sanitizeSlug(business.slug));
    }
  };

  // Memoize contact info to avoid recalculation on every render
  const businessesWithContact = useMemo(() => {
    return businesses.data.map(business => {
      const contact = business.config_sections?.contact || {};
      return {
        ...business,
        contactInfo: {
          phone: contact.phone,
          email: contact.email,
          website: contact.website,
          address: contact.address || contact.clinic_address,
        }
      };
    });
  }, [businesses.data]);

  // Sanitize text to prevent XSS while preserving special characters
  const sanitizeText = (text: string) => {
    if (!text) return '';
    return text.replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  };

  // Check if section is visible
  const isSectionVisible = (sectionKey: string) => {
    return directorySettings?.config_sections?.section_visibility?.[sectionKey] !== false;
  };

  // Get section order
  const getSectionOrder = () => {
    return directorySettings?.config_sections?.section_order || ['hero', 'categories', 'filters', 'businesses'];
  };

  const renderFeatureIcon = (iconType: string) => {
    const iconClassName = 'mr-2 h-5 w-5 shrink-0';

    switch (iconType) {
      case 'verified':
        return <BadgeCheck className={iconClassName} />;
      case 'location':
        return <MapPin className={iconClassName} />;
      case 'contact':
        return <Phone className={iconClassName} />;
      case 'star':
        return <Star className={iconClassName} />;
      case 'shield':
        return <Shield className={iconClassName} />;
      case 'globe':
        return <Globe className={iconClassName} />;
      case 'users':
        return <Users className={iconClassName} />;
      case 'zap':
        return <Zap className={iconClassName} />;
      default:
        return <BadgeCheck className={iconClassName} />;
    }
  };

  return (
    <>
      <Head title={t("Business Directory")} />
      
      {/* Dynamic Header */}
      <DirectoryHeader
        settings={settings}
        directorySettings={directorySettings}
        brandColor={primaryColor}
        user={auth.user}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {getSectionOrder().map((sectionKey) => {
          if (!isSectionVisible(sectionKey)) return null;
          
          switch (sectionKey) {
            case 'hero':
              return (
                <section
                  key="hero"
                  className="relative overflow-hidden"
                  aria-label={t('Hero')}
                  style={{
                    background: directorySettings?.config_sections?.use_background_image && directorySettings?.config_sections?.background_image
                      ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${window.appSettings?.imageUrl || ''}${directorySettings.config_sections.background_image})`
                      : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Background SVG Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="businessPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                          {/* Business Card Icon */}
                          <rect x="20" y="25" width="40" height="25" rx="3" fill="currentColor" opacity="0.3" />
                          <rect x="22" y="27" width="12" height="2" fill="currentColor" opacity="0.5" />
                          <rect x="22" y="30" width="20" height="1" fill="currentColor" opacity="0.4" />
                          <rect x="22" y="32" width="16" height="1" fill="currentColor" opacity="0.4" />
                          {/* Network Dots */}
                          <circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.4" />
                          <circle cx="70" cy="65" r="2" fill="currentColor" opacity="0.4" />
                          <circle cx="30" cy="70" r="1.5" fill="currentColor" opacity="0.3" />
                          {/* Connection Lines */}
                          <line x1="10" y1="15" x2="20" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                          <line x1="60" y1="50" x2="70" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#businessPattern)" className="text-white" />
                    </svg>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-20 left-10 opacity-20 hero-float">
                    <svg width="60" height="40" viewBox="0 0 60 40" className="text-blue-300">
                      <rect x="5" y="8" width="50" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="8" y="12" width="20" height="3" fill="currentColor" />
                      <rect x="8" y="17" width="30" height="2" fill="currentColor" opacity="0.7" />
                      <rect x="8" y="21" width="25" height="2" fill="currentColor" opacity="0.7" />
                    </svg>
                  </div>

                  <div className="absolute top-40 right-20 opacity-15 hero-float" style={{ animationDelay: '1s' }}>
                    <svg width="50" height="50" viewBox="0 0 50 50" className="text-purple-300">
                      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="25" cy="25" r="3" fill="currentColor" />
                      <circle cx="15" cy="15" r="2" fill="currentColor" />
                      <circle cx="35" cy="15" r="2" fill="currentColor" />
                      <circle cx="15" cy="35" r="2" fill="currentColor" />
                      <circle cx="35" cy="35" r="2" fill="currentColor" />
                      <line x1="25" y1="25" x2="15" y2="15" stroke="currentColor" strokeWidth="1" />
                      <line x1="25" y1="25" x2="35" y2="15" stroke="currentColor" strokeWidth="1" />
                      <line x1="25" y1="25" x2="15" y2="35" stroke="currentColor" strokeWidth="1" />
                      <line x1="25" y1="25" x2="35" y2="35" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="absolute bottom-20 left-1/4 opacity-10 hero-float" style={{ animationDelay: '2s' }}>
                    <svg width="80" height="50" viewBox="0 0 80 50" className="text-indigo-300">
                      <path d="M10 25 Q25 10 40 25 Q55 40 70 25" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="10" cy="25" r="3" fill="currentColor" />
                      <circle cx="40" cy="25" r="3" fill="currentColor" />
                      <circle cx="70" cy="25" r="3" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                    <div className="mb-10 text-center sm:mb-12">
                      <div className="relative mb-5 flex items-center justify-center sm:mb-6">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium hero-fade-in">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t(directorySettings?.config_sections?.hero?.trust_badge || "Trusted by 10,000+ Businesses")}
                        </div>
                        {auth.user?.type === 'superadmin' && (
                          <div className="absolute right-0 hidden sm:block">
                            <Link
                              href={route('directory.settings')}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium transition-colors hover:bg-gray-50"
                            >
                              <SettingsIcon className="w-4 h-4" />
                              {t('Settings')}
                            </Link>
                          </div>
                        )}
                      </div>
                      <h1 className="text-3xl font-bold text-white mb-6 leading-tight hero-fade-in sm:text-5xl lg:text-7xl sm:mb-8">
                        {t(directorySettings?.config_sections?.hero?.main_title || "Discover Amazing Businesses")}
                      </h1>
                      <p className="mx-auto mb-6 max-w-4xl text-sm leading-relaxed text-blue-100 hero-fade-in-delay sm:mb-8 sm:text-xl lg:text-2xl">
                        {t(directorySettings?.config_sections?.hero?.subtitle || "Connect with professionals, explore services, and grow your network in our comprehensive business directory")}
                      </p>
                      <div className="hero-fade-in-delay mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
                        {(directorySettings?.config_sections?.hero?.features || [
                          { icon: 'verified', text: 'Verified Businesses' },
                          { icon: 'location', text: 'Local & Global' },
                          { icon: 'contact', text: 'Instant Contact' }
                        ]).map((feature, index) => {
                          return (
                            <div
                              key={index}
                              className="flex min-w-[170px] items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-2.5 text-left transition-all duration-300 hover:bg-white/15 sm:px-4 sm:py-2.5"
                            >
                              <div className="flex shrink-0 items-center justify-center text-white">
                                {renderFeatureIcon(feature.icon)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white sm:text-[15px]">
                                  {t(feature.text)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Enhanced Search Filters */}
                    {(isSectionVisible('search') || isSectionVisible('filters')) && (
                      <div className="rounded-3xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-lg sm:p-5.5 lg:p-6.5">
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 lg:gap-5">
                          {isSectionVisible('search') && (
                            <div className="lg:col-span-2 relative">
                              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                              <Input
                                placeholder={t("Search businesses, services, or locations...")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-10.5 border-gray-200 bg-white pl-11 text-sm text-gray-900 shadow-none transition-all placeholder:text-gray-500 sm:h-11.5 sm:text-base"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                              />
                            </div>
                          )}

                          {isSectionVisible('filters') && (
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="h-10.5 border-gray-200 bg-white shadow-none sm:h-11.5">
                                <Filter className="h-4.5 w-4.5 mr-2 text-gray-500" />
                                <SelectValue placeholder={t("Business Type")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">{t("All Business Types")}</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {(isSectionVisible('search') || isSectionVisible('filters')) && (
                            <div className="flex gap-3">
                              <Button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="h-10.5 flex-1 text-sm font-medium transition-all shadow-none sm:h-11.5 sm:text-base"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                                    {t("Searching...")}
                                  </>
                                ) : (
                                  <>
                                    <Search className="mr-2 h-4.5 w-4.5" />
                                    {t("Search")}
                                  </>
                                )}
                              </Button>
                              {(searchTerm || selectedCategory !== 'all') && (
                                <Button
                                  variant="outline"
                                  className="h-10.5 px-4 text-sm shadow-none sm:h-11.5"
                                  onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('views');
                                    setIsLoading(true);
                                    router.get(route('directory.index'), {}, {
                                      onFinish: () => setIsLoading(false)
                                    });
                                  }}
                                >
                                  {t("Reset")}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );


            case 'filters':
              return (
                <section key="filters" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label={t('Filters')}>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Filters')}</h3>
                    <div className="flex flex-wrap gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder={t("Business Type")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("All Business Types")}</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              );

            case 'categories':
              return (
                <section
                  key="categories"
                  id="categories"
                  className="max-w-7xl mx-auto scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
                  aria-labelledby="directory-categories-title"
                >
                  <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div className="text-center flex-1">
                      <h2 id="directory-categories-title" className="mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl">{directorySettings?.title || t("Browse by Business Type")}</h2>
                      <p className="text-sm text-gray-600 sm:text-base">{directorySettings?.description || t("Explore businesses across different industries")}</p>
                    </div>
                    {auth.user?.type === 'superadmin' && (
                      <Link
                        href={route('directory.settings')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        {t('Settings')}
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSliderIndex(Math.max(0, sliderIndex - 4))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      disabled={sliderIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <div className="overflow-hidden mx-0 sm:mx-14">
                      <div
                        className="flex gap-4 transition-transform duration-300 sm:gap-5"
                        style={{ transform: `translateX(-${sliderIndex * 196}px)` }}
                      >
                        {categories.map((category) => {
                          const businessCount = category.count || 0;
                          const isActiveCategory = selectedCategory === category.value;
                          return (
                            <div
                              key={category.value}
                              className={`group flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all duration-300 theme-border-hover ${
                                isActiveCategory ? 'border-transparent ring-2 ring-offset-1' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={isActiveCategory ? { borderColor: primaryColor, boxShadow: `0 10px 25px -12px ${primaryColor}55` } : {}}
                              onClick={() => {
                                setSelectedCategory(category.value);
                                setIsLoading(true);
                                router.get(route('directory.index'), {
                                  search: searchTerm,
                                  category: category.value !== 'all' ? category.value : undefined,
                                  sort: sortBy !== 'views' ? sortBy : undefined,
                                }, {
                                  onFinish: () => setIsLoading(false)
                                });
                              }}
                            >
                              <div className="flex min-w-[150px] flex-col items-center justify-center px-4 py-4 text-center sm:min-w-[176px] sm:px-5 sm:py-5">
                                <div className="mb-3 text-3xl leading-none transition-transform duration-300 group-hover:-translate-y-0.5">
                                  {businessTypeOptions.find(bt => bt.value === category.value)?.icon || '🏢'}
                                </div>
                                <h3 className={`text-sm font-semibold sm:text-[15px] ${isActiveCategory ? 'text-gray-950' : 'text-gray-900'}`}>
                                  {category.label}
                                </h3>
                                <p
                                  className={`mt-1 text-xs ${
                                    isActiveCategory ? 'font-semibold' : 'text-gray-500'
                                  }`}
                                  style={isActiveCategory ? { color: primaryColor } : {}}
                                >
                                  {businessCount} {t("businesses")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => setSliderIndex(Math.min(categories.length - 4, sliderIndex + 4))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      disabled={sliderIndex >= categories.length - 4}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </section>
              );

            case 'businesses':
              return (
                <section
                  key="businesses"
                  id="businesses"
                  className="max-w-7xl mx-auto scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
                  aria-labelledby="directory-businesses-title"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 id="directory-businesses-title" className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">
                        {businesses.data?.length > 0 ? t("Featured Businesses") : t("No Results Found")}
                      </h2>
                      <p className="text-sm text-gray-600 sm:text-base">
                        {businesses.data?.length > 0 ? (
                          `${t("Showing")} ${businesses.meta?.from || 1} ${t("to")} ${businesses.meta?.to || businesses.data.length} ${t("of")} ${businesses.meta?.total || businesses.data.length} ${t("businesses")}`
                        ) : (
                          t("Try adjusting your search criteria or browse all categories")
                        )}
                      </p>
                    </div>
                    {businesses.data?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t("Sort by:")}</span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                          <SelectTrigger className="w-40 border-gray-200 bg-white shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="views">{t("Most Viewed")}</SelectItem>
                            <SelectItem value="name">{t("Name A-Z")}</SelectItem>
                            <SelectItem value="newest">{t("Newest First")}</SelectItem>
                            <SelectItem value="oldest">{t("Oldest First")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                    {businessesWithContact.map((business) => {
                      return (
                        <Card key={business.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
                          <CardHeader className="space-y-4 pb-4 pt-5">
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  {business.is_featured ? (
                                    <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                                      {t("Featured")}
                                    </div>
                                  ) : null}

                                  {business.is_verified ? (
                                    <Badge variant="secondary" className="h-7 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 text-[11px] font-medium text-emerald-700">
                                      ✓ {t("Verified")}
                                    </Badge>
                                  ) : null}
                                </div>

                                <h3 className="text-[18px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-gray-700">
                                  {sanitizeText(business.name)}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize"
                                    style={{
                                      backgroundColor: `${primaryColor}14`,
                                      color: primaryColor,
                                    }}
                                  >
                                    {business.business_type.replace('-', ' ')}
                                  </span>

                                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-100">
                                    <Eye className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                                    <span>{business.view_count.toLocaleString()} {t("views")}</span>
                                  </div>

                                  {business.rating > 0 ? (
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${
                                              i < Math.floor(business.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-gray-700">{business.rating}</span>
                                      <span className="text-gray-400">({business.rating_count})</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>

                              {business.directory_description ? (
                                <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                                  {sanitizeText(business.directory_description)}
                                </p>
                              ) : null}
                            </div>
                          </CardHeader>

                          <CardContent className="flex flex-1 flex-col justify-between pt-0 pb-5">
                            <div className="mb-5 space-y-3 flex-1 rounded-2xl bg-gray-50/70 p-4 ring-1 ring-gray-100">
                              {business.contactInfo.phone ? (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <Phone className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                                  <span className="truncate font-medium">{sanitizeText(business.contactInfo.phone)}</span>
                                </div>
                              ) : null}

                              {business.contactInfo.email ? (
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                  <Mail className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                                  <span className="truncate font-medium">{sanitizeText(business.contactInfo.email)}</span>
                                </div>
                              ) : null}

                              {business.contactInfo.address ? (
                                <div className="flex items-start gap-3 text-sm text-gray-700">
                                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                                  <span className="line-clamp-2 font-medium leading-relaxed text-gray-600">{sanitizeText(business.contactInfo.address)}</span>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
                              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="h-9 border-gray-200 px-3 text-xs font-medium text-gray-700 shadow-none transition-colors hover:border-gray-300 hover:bg-gray-50"
                                >
                                  <a href={getBusinessUrl(business)} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-1.5 h-3.5 w-3.5" />
                                    {t("View Card")}
                                  </a>
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() => router.visit(route('directory.show', { business: business.id }))}
                                  className="h-9 px-3 text-xs font-medium shadow-none transition-all hover:shadow-sm sm:text-sm"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  {t("View Details")}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Modern Pagination */}
                  {businesses.links && businesses.links.length > 3 && (
                    <div className="mt-10 flex justify-center px-4 sm:mt-12">
                      <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                        {businesses.links.map((link, index) => {
                          const isActive = link.active;
                          const isDisabled = !link.url;
                          const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                          const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                          const isNumber = !isPrevious && !isNext && link.label.match(/^\d+$/);

                          if (isPrevious) {
                            return (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled={isDisabled}
                                onClick={() => link.url && router.visit(link.url)}
                                className="h-9 border-gray-300 px-2.5 text-xs hover:border-gray-400 disabled:opacity-50 sm:h-10 sm:px-3 sm:text-sm"
                              >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">{t("Previous")}</span>
                              </Button>
                            );
                          }

                          if (isNext) {
                            return (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled={isDisabled}
                                onClick={() => link.url && router.visit(link.url)}
                                className="h-9 border-gray-300 px-2.5 text-xs hover:border-gray-400 disabled:opacity-50 sm:h-10 sm:px-3 sm:text-sm"
                              >
                                <span className="hidden sm:inline">{t("Next")}</span>
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            );
                          }

                          if (isNumber) {
                            return (
                              <Button
                                key={index}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                disabled={isDisabled}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`h-9 w-9 p-0 text-xs transition-all sm:h-10 sm:w-10 sm:text-sm ${isActive
                                    ? 'shadow-md border-0'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                style={isActive ? { backgroundColor: primaryColor } : {}}
                              >
                                {link.label}
                              </Button>
                            );
                          }

                          if (link.label === '...') {
                            return (
                              <span key={index} className="px-1.5 py-2 text-xs text-gray-400 sm:px-2 sm:text-sm">
                                •••
                              </span>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );

            default:
              return null;
          }
        })}

      </div>

      <DirectoryFooter
        settings={settings}
        directorySettings={directorySettings}
        brandColor={primaryColor}
      />
    </>
  );
}
