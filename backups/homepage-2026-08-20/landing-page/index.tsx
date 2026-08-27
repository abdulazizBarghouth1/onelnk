import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import ScreenshotsSection from './components/ScreenshotsSection';
import TeamSection from './components/TeamSection';
import TemplatesSection from './components/TemplatesSection';
import CTASection from './components/CTASection';
import HowItWorksSection from './components/HowItWorksSection';
import UseCasesSection from './components/UseCasesSection';
import ThemesSection from './components/ThemesSection';
import TestimonialsSection from './components/TestimonialsSection';
import PlansSection from './components/PlansSection';
import FaqSection from './components/FaqSection';
import NewsletterSection from './components/NewsletterSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ActiveCampaignsSection from './components/ActiveCampaignsSection';
import TrustedSection from './components/TrustedSection';
import BenefitsSection from './components/BenefitsSection';
import HowToSection from './components/HowToSection';
import ProcessSection from './components/ProcessSection';
import DesignerSection from './components/DesignerSection';
import IdentitySection from './components/IdentitySection';
import GallerySection from './components/GallerySection';
import ShowcaseSection from './components/ShowcaseSection';
import IndustriesSection from './components/IndustriesSection';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { useFavicon } from '@/hooks/use-favicon';
import { useTranslation } from 'react-i18next';
// OneLnk landing design — ported from the static build, scoped under
// `.onelnk-landing` (see resources/css/onelnk-landing.css). Only elements
// inside a reskinned section's `.onelnk-landing` wrapper are affected.
import '../../../css/onelnk-landing.css';

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

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface LandingSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    sections: Array<{
      key: string;
      [key: string]: any;
    }>;
    theme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
      logo_light?: string;
      logo_dark?: string;
      favicon?: string;
    };
    seo?: {
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string;
    };
    custom_css?: string;
    custom_js?: string;
    section_order?: string[];
    section_visibility?: {
      [key: string]: boolean;
    };
  };
}

interface CustomPage {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  business: {
    id: number;
    name: string;
    slug: string;
    url_prefix?: string;
    custom_domain?: string;
  };
}

interface PageProps {
  plans: Plan[];
  testimonials: Testimonial[];
  faqs: Faq[];
  customPages: CustomPage[];
  settings: LandingSettings;
  activeCampaigns: Campaign[];
  seo_data?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
    og_image?: string;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function LandingPage() {
  const { plans, testimonials, faqs, customPages = [], settings, activeCampaigns = [], seo_data, flash } = usePage<PageProps>().props;
  const { i18n } = useTranslation();

  useFavicon();
  // Get brand colors - prioritize config_sections theme over brand context
  const { themeColor, customColor } = useBrand();
  const configPrimaryColor = settings.config_sections?.theme?.primary_color;
  const primaryColor = configPrimaryColor || (themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS]);
  const page = usePage<any>();
  const { auth, globalSettings } = page.props;
  
  // Initialize language from system default language setting
  React.useEffect(() => {
    const defaultLanguage = globalSettings?.defaultLanguage;
    if (defaultLanguage && defaultLanguage !== i18n.language) {
      i18n.changeLanguage(defaultLanguage);
    }
  }, [globalSettings?.defaultLanguage, i18n]);

  // Custom CSS
  React.useEffect(() => {
    const customCss = settings.config_sections?.custom_css;
    if (customCss) {
      const styleId = 'landing-custom-css';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = customCss;
    }
  }, [settings.config_sections?.custom_css]);

  // Custom JS
  React.useEffect(() => {
    const customJs = settings.config_sections?.custom_js;
    if (customJs) {
      const scriptId = 'landing-custom-js';
      let scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        scriptElement.remove();
      }
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.textContent = customJs;
      document.body.appendChild(scriptElement);
    }
  }, [settings.config_sections?.custom_js]);

  // Get section data helper
  const getSectionData = (key: string) => {
    return settings.config_sections?.sections?.find(section => section.key === key) || {};
  };

  // Get section visibility
  const isSectionVisible = (key: string) => {
    return settings.config_sections?.section_visibility?.[key] !== false;
  };

  // Get section order or use default
  // OneLnk marketing home renders the static-design section sequence. Section
  // hide/show still honours the admin `section_visibility`; ordering is fixed to
  // the OneLnk design. Sections not yet ported are simply skipped (null).
  const sectionOrder = [
    'header', 'hero', 'trusted', 'benefits', 'howto', 'process', 'designer',
    'identity', 'plans', 'gallery', 'showcase', 'industries', 'faq', 'cta', 'footer',
  ];

  // Component mapping
  const sectionComponents = {
    header: () => isSectionVisible('header') && (
      <Header
        settings={settings}
        sectionData={getSectionData('header')}
        customPages={customPages}
        brandColor={primaryColor}
        user={auth.user}
        glass
      />
    ),
    hero: () => isSectionVisible('hero') && (
      <HeroSection
        settings={settings}
        sectionData={getSectionData('hero')}
        brandColor={primaryColor}
      />
    ),
    trusted: () => isSectionVisible('trusted') && (
      <TrustedSection
        settings={settings}
        sectionData={getSectionData('trusted')}
        brandColor={primaryColor}
      />
    ),
    benefits: () => isSectionVisible('benefits') && (
      <BenefitsSection
        settings={settings}
        sectionData={getSectionData('benefits')}
        brandColor={primaryColor}
      />
    ),
    howto: () => isSectionVisible('howto') && (
      <HowToSection settings={settings} sectionData={getSectionData('howto')} brandColor={primaryColor} />
    ),
    process: () => isSectionVisible('process') && (
      <ProcessSection settings={settings} sectionData={getSectionData('process')} brandColor={primaryColor} />
    ),
    designer: () => isSectionVisible('designer') && (
      <DesignerSection settings={settings} sectionData={getSectionData('designer')} brandColor={primaryColor} />
    ),
    identity: () => isSectionVisible('identity') && (
      <IdentitySection settings={settings} sectionData={getSectionData('identity')} brandColor={primaryColor} />
    ),
    gallery: () => isSectionVisible('gallery') && (
      <GallerySection settings={settings} sectionData={getSectionData('gallery')} brandColor={primaryColor} />
    ),
    showcase: () => isSectionVisible('showcase') && (
      <ShowcaseSection settings={settings} sectionData={getSectionData('showcase')} brandColor={primaryColor} />
    ),
    industries: () => isSectionVisible('industries') && (
      <IndustriesSection settings={settings} sectionData={getSectionData('industries')} brandColor={primaryColor} />
    ),
    stats: () => isSectionVisible('stats') && (
      <StatsSection 
        settings={settings} 
        sectionData={getSectionData('stats')}
        brandColor={primaryColor} 
      />
    ),
    features: () => isSectionVisible('features') && (
      <FeaturesSection 
        settings={settings} 
        sectionData={getSectionData('features')}
        brandColor={primaryColor} 
      />
    ),
    screenshots: () => isSectionVisible('screenshots') && (
      <ScreenshotsSection 
        settings={settings} 
        sectionData={getSectionData('screenshots')}
        brandColor={primaryColor} 
      />
    ),
    templates: () => isSectionVisible('templates') && (
      <TemplatesSection 
        settings={settings} 
        sectionData={getSectionData('templates')}
        brandColor={primaryColor} 
      />
    ),
    cta: () => isSectionVisible('cta') && (
      <CTASection
        settings={settings}
        sectionData={getSectionData('cta')}
        brandColor={primaryColor}
      />
    ),
    how_it_works: () => isSectionVisible('how_it_works') && (
      <HowItWorksSection
        settings={settings}
        sectionData={getSectionData('how_it_works')}
        brandColor={primaryColor}
      />
    ),
    use_cases: () => isSectionVisible('use_cases') && (
      <UseCasesSection
        settings={settings}
        sectionData={getSectionData('use_cases')}
        brandColor={primaryColor}
      />
    ),
    themes: () => isSectionVisible('themes') && (
      <ThemesSection
        settings={settings}
        sectionData={getSectionData('themes')}
        brandColor={primaryColor}
      />
    ),
    team: () => isSectionVisible('team') && (
      <TeamSection 
        settings={settings} 
        sectionData={getSectionData('team')}
        brandColor={primaryColor} 
      />
    ),
    testimonials: () => isSectionVisible('testimonials') && (
      <TestimonialsSection 
        testimonials={testimonials} 
        settings={settings} 
        sectionData={getSectionData('testimonials')}
        brandColor={primaryColor} 
      />
    ),
    active_campaigns: () => isSectionVisible('active_campaigns') && activeCampaigns.length > 0 && (
      <ActiveCampaignsSection 
        campaigns={activeCampaigns} 
        settings={settings} 
        sectionData={getSectionData('active_campaigns')}
        brandColor={primaryColor} 
      />
    ),
    plans: () => isSectionVisible('plans') && (
      <PlansSection 
        plans={plans} 
        settings={settings} 
        sectionData={getSectionData('plans')}
        brandColor={primaryColor} 
      />
    ),
    faq: () => isSectionVisible('faq') && (
      <FaqSection 
        faqs={faqs} 
        settings={settings} 
        sectionData={getSectionData('faq')}
        brandColor={primaryColor} 
      />
    ),
    newsletter: () => isSectionVisible('newsletter') && (
      <NewsletterSection 
        flash={flash} 
        settings={settings} 
        sectionData={getSectionData('newsletter')}
        brandColor={primaryColor} 
      />
    ),
    contact: () => isSectionVisible('contact') && (
      <ContactSection 
        flash={flash} 
        settings={settings} 
        sectionData={getSectionData('contact')}
        brandColor={primaryColor} 
      />
    ),
    footer: () => isSectionVisible('footer') && (
      <Footer 
        settings={settings} 
        sectionData={getSectionData('footer')}
        brandColor={primaryColor} 
      />
    )
  };

  return (
    <>
      <Head title={seo_data?.meta_title || settings.config_sections?.seo?.meta_title || 'vCard'}>
        {/* SEO Meta Tags */}
        {(seo_data?.meta_description || settings.config_sections?.seo?.meta_description) && (
          <meta name="description" content={seo_data?.meta_description || settings.config_sections?.seo?.meta_description} />
        )}
        {(seo_data?.keywords || settings.config_sections?.seo?.meta_keywords) && (
          <meta name="keywords" content={seo_data?.keywords || settings.config_sections?.seo?.meta_keywords} />
        )}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seo_data?.meta_title || settings.config_sections?.seo?.meta_title || 'vCard'} />
        {(seo_data?.meta_description || settings.config_sections?.seo?.meta_description) && (
          <meta property="og:description" content={seo_data?.meta_description || settings.config_sections?.seo?.meta_description} />
        )}
        {seo_data?.og_image && <meta property="og:image" content={seo_data.og_image} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo_data?.meta_title || settings.config_sections?.seo?.meta_title || 'vCard'} />
        {(seo_data?.meta_description || settings.config_sections?.seo?.meta_description) && (
          <meta name="twitter:description" content={seo_data?.meta_description || settings.config_sections?.seo?.meta_description} />
        )}
        {seo_data?.og_image && <meta name="twitter:image" content={seo_data.og_image} />}
      </Head>
      
      <div 
        className="min-h-screen bg-white" 
        data-landing-page="true"
        style={{ 
          scrollBehavior: 'smooth', 
          '--brand-color': primaryColor,
          '--primary-color': settings.config_sections?.theme?.primary_color || primaryColor,
          '--secondary-color': settings.config_sections?.theme?.secondary_color || '#8b5cf6',
          '--accent-color': settings.config_sections?.theme?.accent_color || '#10b77f'
        } as React.CSSProperties}
      >
        {sectionOrder.map((sectionKey) => {
          const Component = sectionComponents[sectionKey as keyof typeof sectionComponents];
          return Component ? <React.Fragment key={sectionKey}>{Component()}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}
