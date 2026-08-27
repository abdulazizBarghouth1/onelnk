import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Eye, Settings as SettingsIcon, Type, Info, Phone, Globe, Palette, Image, Users, Code, Search, Layout, Monitor, FileText, Award, Mail, CreditCard, HelpCircle, X, GripVertical, ArrowUpDown, ArrowLeft, Target, Heart, Lightbulb, AlertCircle, Workflow, LayoutGrid } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaPicker from '@/components/MediaPicker';
import { Link } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { SettingsSection } from '@/components/settings-section';
import { toast } from '@/components/custom-toast';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { RichTextField } from '@/components/ui/rich-text-field';
import { Repeater } from '@/components/ui/repeater';
import FeaturesSection from './settings-features';
import ContactSection from './settings-contact';
import TemplatesSection from './settings-templates';
import CTASection from './settings-cta';
import HowItWorksSection from './settings-how-it-works';
import UseCasesSettings from './settings-use-cases';
import ThemesSection from './settings-themes';
import ContactPageSettings from './settings-contact-page';

import { defaultLandingPageSections } from './templates/default-sections';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';

interface Settings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    sections: Array<{
      key: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}

type LandingPageSectionData = {
  key: string;
  [key: string]: any;
};

interface PageProps {
  settings: Settings;
  customPages?: { id: number; title: string; slug: string; is_active?: boolean }[];
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function LandingPageSettings() {
  const { t } = useTranslation();
  const { settings, customPages = [], flash } = usePage<PageProps>().props;
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  const [activeSection, setActiveSection] = useState<'general' | 'header' | 'hero' | 'stats' | 'features' | 'screenshots' | 'templates' | 'cta' | 'how_it_works' | 'use_cases' | 'themes' | 'about' | 'team' | 'testimonials' | 'active_campaigns' | 'plans' | 'faq' | 'newsletter' | 'contact' | 'footer' | 'order' | 'advanced' | 'about-page' | 'privacy' | 'terms' | 'refund' | 'faq-page' | 'contact-page'>('general');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['setup', 'layout', 'content', 'social', 'engagement']);
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function for consistent dark mode styling
  const sectionClasses = "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm";
  const headingClasses = "text-lg font-semibold text-gray-900 dark:text-gray-100";
  const subheadingClasses = "text-sm text-gray-500 dark:text-gray-400";
  
  // Helper function to convert full URL to relative path for database storage
  const convertToRelativePath = (url: string): string => {
    return convertUrlToRelativePath(url);
  };
  
  // Helper function to convert relative path to full URL for display
  const getDisplayUrl = (path: string): string => {
    return getImageDisplayUrl(path);
  };
  
  const { data, setData, post, processing, errors } = useForm<Settings>({
    company_name: settings.company_name,
    contact_email: settings.contact_email,
    contact_phone: settings.contact_phone,
    contact_address: settings.contact_address,
    config_sections: settings.config_sections && settings.config_sections.sections && settings.config_sections.sections.length > 0 
      ? {
          sections: settings.config_sections.sections || [],
          theme: settings.config_sections.theme || defaultLandingPageSections.theme,
          seo: settings.config_sections.seo || defaultLandingPageSections.seo,
          section_order: settings.config_sections.section_order || defaultLandingPageSections.section_order,
          section_visibility: settings.config_sections.section_visibility || defaultLandingPageSections.section_visibility
        }
      : { ...defaultLandingPageSections }
  });

  const getSectionData = (key: string): LandingPageSectionData => {
    return data.config_sections?.sections?.find(section => section.key === key) || { key };
  };

  const getAboutPageStats = () => {
    const aboutPage = getSectionData('about-page');
    return aboutPage.stats || [];
  };

  const updateSectionData = (key: string, updates: any) => {
    const sections = [...(data.config_sections?.sections || [])];
    const sectionIndex = sections.findIndex(section => section.key === key);
    
    if (sectionIndex >= 0) {
      sections[sectionIndex] = { ...sections[sectionIndex], ...updates };
    } else {
      sections.push({ key, ...updates });
    }
    
    setData('config_sections', {
      ...data.config_sections,
      sections
    });
  };

  const updateThemeData = (updates: any) => {
    setData('config_sections', {
      ...data.config_sections,
      theme: { ...data.config_sections?.theme, ...updates }
    });
  };

  const updateSeoData = (updates: any) => {
    setData('config_sections', {
      ...data.config_sections,
      seo: { ...data.config_sections?.seo, ...updates }
    });
  };

  const updateSectionVisibility = (sectionKey: string, visible: boolean) => {
    setData('config_sections', {
      ...data.config_sections,
      section_visibility: { ...data.config_sections?.section_visibility, [sectionKey]: visible }
    });
  };

  const updateSectionOrder = (newOrder: string[]) => {
    setData('config_sections', {
      ...data.config_sections,
      section_order: newOrder
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const currentOrder = [...(data.config_sections?.section_order || [])];
    const draggedItem = currentOrder[dragIndex];
    currentOrder.splice(dragIndex, 1);
    currentOrder.splice(dropIndex, 0, draggedItem);
    updateSectionOrder(currentOrder);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(name as keyof Settings, value);
  };

  const saveSettings = () => {
    setIsLoading(true);
          
    router.post(route('landing-page.settings.update'), data, {
      preserveScroll: true,
      onSuccess: (page) => {
        setIsLoading(false);
        const successMessage = page.props.flash?.success || t('Landing page settings saved successfully');
        const errorMessage = page.props.flash?.error;
        
        if (successMessage && !errorMessage) {
          toast.success(successMessage);
        } else if (errorMessage) {
          toast.error(errorMessage);
        }
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to save landing page settings');
        toast.error(errorMessage);
      }
    });
  };
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Landing Page') }
  ];

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  // Navigation structure
  const navigationGroups = [
    {
      key: 'setup',
      label: t('Setup'),
      icon: SettingsIcon,
      sections: [
        { key: 'general', label: t('General'), icon: Info },
        { key: 'order', label: t('Section Order'), icon: ArrowUpDown },
        { key: 'advanced', label: t('Advanced'), icon: Code }
      ]
    },
    {
      key: 'layout',
      label: t('Layout'),
      icon: Layout,
      sections: [
        { key: 'header', label: t('Header'), icon: Layout },
        { key: 'hero', label: t('Hero Section'), icon: Target },
        { key: 'stats', label: t('Stats'), icon: SettingsIcon },
        { key: 'footer', label: t('Footer'), icon: Layout }
      ]
    },
    {
      key: 'content',
      label: t('Content'),
      icon: FileText,
      sections: [
        { key: 'features', label: t('Features'), icon: Lightbulb },
        { key: 'screenshots', label: t('Screenshots'), icon: Monitor },
        { key: 'templates', label: t('Templates'), icon: Layout },
        { key: 'how_it_works', label: t('How It Works'), icon: Workflow },
        { key: 'themes', label: t('Themes'), icon: Palette },
        { key: 'use_cases', label: t('Use Cases'), icon: LayoutGrid },
        { key: 'active_campaigns', label: t('Active Campaigns'), icon: Target }
      ]
    },
    {
      key: 'social',
      label: t('Social Proof'),
      icon: Users,
      sections: [
        { key: 'team', label: t('Team'), icon: Users },
        { key: 'testimonials', label: t('Testimonials'), icon: Award },
        { key: 'plans', label: t('Pricing Plans'), icon: CreditCard }
      ]
    },
    {
      key: 'engagement',
      label: t('Engagement'),
      icon: Mail,
      sections: [
        { key: 'faq', label: t('FAQ'), icon: HelpCircle },
        { key: 'cta', label: t('CTA'), icon: Target },
        { key: 'newsletter', label: t('Newsletter'), icon: Mail },
        { key: 'contact', label: t('Contact'), icon: Phone }
      ]
    },
  ];

  // Get current group and section info
  const getCurrentGroupAndSection = () => {
    for (const group of navigationGroups) {
      const section = group.sections.find(s => s.key === activeSection);
      if (section) {
        return { group, section };
      }
    }
    return null;
  };

  const currentInfo = getCurrentGroupAndSection();
  return (
    <PageTemplate 
      title={t("Landing Page")} 
      breadcrumbs={breadcrumbs}
      url="/landing-page/settings"
      action={
        <div className="flex gap-2">
          <Link
            href={route('landing-page')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <Eye className="w-4 h-4" />
            {t("View Landing Page")}
          </Link>
        </div>
      }
    >
      <SettingsSection
        title={t('Landing Page Settings')}
        description={t('Customize your landing page content and appearance')}
        action={
          <Button onClick={saveSettings} disabled={isLoading} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? t('Saving...') : t('Save Changes')}
          </Button>
        }
      >
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: brandColor + '10' }}>
                <h3 className="font-semibold text-sm" style={{ color: brandColor }}>
                  {t('Navigation')}
                </h3>
                {currentInfo && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentInfo.section.label}
                  </p>
                )}
              </div>
              
              <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                {navigationGroups.map((group) => {
                  const isExpanded = expandedGroups.includes(group.key);
                  const GroupIcon = group.icon;
                  
                  return (
                    <div key={group.key} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <button
                        onClick={() => toggleGroup(group.key)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon className="h-4 w-4" style={{ color: brandColor }} />
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {group.label}
                          </span>
                        </div>
                        <svg
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isExpanded && (
                        <div className="bg-gray-50 dark:bg-gray-900/50">
                          {group.sections.map((section) => {
                            const SectionIcon = section.icon;
                            const isActive = activeSection === section.key;
                            
                            return (
                              <button
                                key={section.key}
                                onClick={() => setActiveSection(section.key as any)}
                                className={`w-full px-4 py-2.5 pl-10 flex items-center gap-2 text-sm transition-colors ${
                                  isActive
                                    ? 'text-white dark:text-white font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                style={isActive ? {
                                  backgroundColor: brandColor,
                                  borderLeft: `3px solid ${brandColor}`
                                } : {}}
                              >
                                <SectionIcon className="h-3.5 w-3.5" />
                                <span>{section.label}</span>
                              </button>
                            );
                          })}
                          
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* General Section */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('Company Information')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('Basic company details for your landing page')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="company_name" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" style={{ color: brandColor }} />
                        {t('Company Name')}
                      </Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={data.company_name}
                        onChange={handleInputChange}
                        placeholder={t('Your Company Name')}
                        className="h-10 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.company_name && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.company_name}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_email">{t('Contact Email')}</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={data.contact_email}
                        onChange={handleInputChange}
                        placeholder={t('support@company.com')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_phone">{t('Contact Phone')}</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={data.contact_phone}
                        onChange={handleInputChange}
                        placeholder={t('+1 (555) 123-4567')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_address">{t('Contact Address')}</Label>
                      <Input
                        id="contact_address"
                        name="contact_address"
                        value={data.contact_address}
                        onChange={handleInputChange}
                        placeholder={t('123 Business Ave, City, State')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r rounded-lg border" style={{ backgroundColor: brandColor + '10', borderColor: brandColor + '30' }}>
                    <h4 className="text-sm font-medium mb-4" style={{ color: brandColor }}>{t('Branding & Theme')}</h4>
                    
                    {/* Logo Upload Section */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('Company Logo')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <MediaPicker
                            label={t('Logo (Light Theme)')}
                            value={getDisplayUrl(data.config_sections?.theme?.logo_light || '')}
                            onChange={(value) => {
                              updateThemeData({ logo_light: convertToRelativePath(value) });
                            }}
                            placeholder={t('Select logo for light backgrounds...')}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Logo displayed on light backgrounds')}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <MediaPicker
                            label={t('Logo (Dark Theme)')}
                            value={getDisplayUrl(data.config_sections?.theme?.logo_dark || '')}
                            onChange={(value) => {
                              updateThemeData({ logo_dark: convertToRelativePath(value) });
                            }}
                            placeholder={t('Select logo for dark backgrounds...')}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Logo displayed on dark backgrounds')}
                          </p>
                        </div>
                      </div>
                      
                     
                    </div>
                    
                    {/* Theme Colors */}
                    <div>
                      <h5 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('Theme Colors')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="general_primary_color">{t('Primary Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_primary_color"
                              type="color"
                              value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                              onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                              onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="general_secondary_color">{t('Secondary Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_secondary_color"
                              type="color"
                              value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                              onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                              onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                              placeholder="#8b5cf6"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="general_accent_color">{t('Accent Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_accent_color"
                              type="color"
                              value={data.config_sections?.theme?.accent_color || '#10b77f'}
                              onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.accent_color || '#10b77f'}
                              onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                              placeholder="#10b77f"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header Section */}
            {activeSection === 'header' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Layout className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Header Style')}</h3>
                        <p className="text-sm text-gray-500">{t('Customize your header appearance and behavior')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.header !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('header', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="header_variant">{t('Header Variant')}</Label>
                      <Select
                        value={getSectionData('header').variant || 'header1'}
                        onValueChange={(value) => updateSectionData('header', { variant: value })}
                      >
                        <SelectTrigger id="header_variant">
                          <SelectValue placeholder={t('Select header style')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="header1">{t('Standard')}</SelectItem>
                          <SelectItem value="header2">{t('Centered')}</SelectItem>
                          <SelectItem value="header3">{t('Minimal')}</SelectItem>
                          <SelectItem value="header4">{t('Transparent')}</SelectItem>
                          <SelectItem value="header5">{t('Gradient')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="header_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="header_background_color"
                          type="color"
                          value={getSectionData('header').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('header', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                          disabled={getSectionData('header').transparent}
                        />
                        <Input
                          value={getSectionData('header').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('header', { background_color: e.target.value })}
                          placeholder="#ffffff"
                          disabled={getSectionData('header').transparent}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="header_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="header_text_color"
                          type="color"
                          value={getSectionData('header').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('header', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('header').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('header', { text_color: e.target.value })}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Layout className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Navigation Menu')}</h3>
                      <p className="text-sm text-gray-500">{t('Manage the links shown in the landing page header')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-6">
                    <div className="space-y-0.5">
                      <Label htmlFor="header_business_directory">{t('Business Directory')}</Label>
                      <p className="text-xs text-gray-500">{t('Show the default Business Directory link in the header')}</p>
                    </div>
                    <Switch
                      id="header_business_directory"
                      checked={getSectionData('header').show_business_directory !== false}
                      onCheckedChange={(checked) => updateSectionData('header', { show_business_directory: checked })}
                    />
                  </div>

                  <Repeater
                    fields={[
                      { name: 'text', label: t('Menu Text'), type: 'text', placeholder: t('Menu Text'), required: true },
                      {
                        name: 'type',
                        label: t('Type'),
                        type: 'select',
                        options: [
                          { value: 'link', label: t('Link') },
                          { value: 'page', label: t('Page') }
                        ],
                        required: true
                      },
                      {
                        name: 'href',
                        label: t('URL/Page'),
                        type: 'conditional',
                        dependsOn: 'type',
                        conditions: {
                          link: { type: 'text', placeholder: t('Enter URL (e.g., #features, https://example.com)') },
                          page: {
                            type: 'select',
                            placeholder: t('Select Page'),
                            options: customPages.map((page) => ({
                              value: route('custom-page.show', page.slug),
                              label: page.title
                            }))
                          }
                        }
                      },
                      { name: 'target', label: t('Open in New Tab'), type: 'switch' }
                    ]}
                    value={(getSectionData('header').navigation_items || []).map((item: any, index: number) => ({
                      id: `header-nav-${index}`,
                      text: item.text || '',
                      type: item.type || 'link',
                      href: item.href || '',
                      target: item.target === '_blank' || item.target === true
                    }))}
                    onChange={(items) => {
                      const navigation_items = items.map(({ id, ...item }) => ({
                        text: item.text,
                        type: item.type,
                        href: item.href,
                        target: item.target ? '_blank' : '_self'
                      }));
                      updateSectionData('header', { navigation_items });
                    }}
                    addButtonText={t('Add Navigation Item')}
                    deleteTooltipText={t('Delete Navigation Item')}
                    removeButtonText=""
                    minItems={0}
                    maxItems={-1}
                  />
                </div>
              </div>
            )}

            {/* Hero Section */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Layout className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Hero Layout & Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure hero layout and visual styling')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.hero !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('hero', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="hero_layout">{t('Layout Style')}</Label>
                      <Select
                        value={getSectionData('hero').layout || 'image-right'}
                        onValueChange={(value) => updateSectionData('hero', { layout: value })}
                      >
                        <SelectTrigger id="hero_layout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image-right">Content Left, Image Right</SelectItem>
                          <SelectItem value="image-left">Image Left, Content Right</SelectItem>
                          <SelectItem value="centered">Centered Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_background_color">{t("Background Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero_background_color"
                          type="color"
                          value={getSectionData('hero').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('hero', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('hero').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('hero', { background_color: e.target.value })}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="hero_text_color">{t("Text Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero_text_color"
                          type="color"
                          value={getSectionData('hero').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('hero', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('hero').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('hero', { text_color: e.target.value })}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                      <div className="rounded-lg border border-gray-200 px-3 py-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0 space-y-0.5">
                            <Label htmlFor="hero_overlay">{t('Background Overlay')}</Label>
                            <p className="text-xs text-muted-foreground truncate">
                              {t('Add overlay on background image')}
                            </p>
                          </div>
                          <Switch
                            id="hero_overlay"
                            checked={getSectionData('hero').overlay || false}
                            onCheckedChange={(checked) => updateSectionData('hero', { overlay: checked })}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="hero_overlay_color">{t('Overlay Color')}</Label>
                        <Input
                          id="hero_overlay_color"
                          value={getSectionData('hero').overlay_color || 'rgba(0,0,0,0.5)'}
                          onChange={(e) => updateSectionData('hero', { overlay_color: e.target.value })}
                          placeholder="rgba(0,0,0,0.5)"
                          disabled={!getSectionData('hero').overlay}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Image className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Image')}</h3>
                      <p className="text-sm text-gray-500">{t('Configure hero section imagery')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <MediaPicker
                        label={t('Hero Image')}
                        value={getDisplayUrl(getSectionData('hero').image || '')}
                        onChange={(value) => {
                          updateSectionData('hero', { image: convertToRelativePath(value) });
                        }}
                        placeholder={t('Select hero image...')}
                      />
                    </div>

                    <div className="space-y-3">
                      <MediaPicker
                        label={t('Background Image')}
                        value={getDisplayUrl(getSectionData('hero').background_image || '')}
                        onChange={(value) => {
                          updateSectionData('hero', { background_image: convertToRelativePath(value) });
                        }}
                        placeholder={t('Select background image...')}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Type className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Content')}</h3>
                      <p className="text-sm text-gray-500">{t('Main headline and supporting text')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_title" className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {t('Hero Title')}
                      </Label>
                      <Input
                        id="hero_title"
                        value={getSectionData('hero').title || ''}
                        onChange={(e) => updateSectionData('hero', { title: e.target.value })}
                        placeholder={t("Your main headline")}
                        className="h-10 border-gray-200"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.hero_title && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.hero_title}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_subtitle" className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {t('Hero Subtitle')}
                      </Label>
                      <Textarea
                        id="hero_subtitle"
                        value={getSectionData('hero').subtitle || ''}
                        onChange={(e) => updateSectionData('hero', { subtitle: e.target.value })}
                        placeholder={t("Supporting text for your headline")}
                        rows={3}
                        className="border-gray-200 resize-none"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.hero_subtitle && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.hero_subtitle}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_announcement_text">{t('Announcement Badge')}</Label>
                      <Input
                        id="hero_announcement_text"
                        value={getSectionData('hero').announcement_text || ''}
                        onChange={(e) => updateSectionData('hero', { announcement_text: e.target.value })}
                        placeholder={t("🚀 New: Advanced Analytics Dashboard")}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('Small announcement text shown above the title')}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="hero_primary_button_text">{t('Primary Button Text')}</Label>
                        <Input
                          id="hero_primary_button_text"
                          value={getSectionData('hero').primary_button_text || ''}
                          onChange={(e) => updateSectionData('hero', { primary_button_text: e.target.value })}
                          placeholder={t("Start Free Trial")}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="hero_primary_button_link">{t('Primary Button URL')}</Label>
                        <Input
                          id="hero_primary_button_link"
                          value={getSectionData('hero').primary_button_link || ''}
                          onChange={(e) => updateSectionData('hero', { primary_button_link: e.target.value })}
                          placeholder={t("example.com/register")}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="hero_secondary_button_text">{t('Secondary Button Text')}</Label>
                        <Input
                          id="hero_secondary_button_text"
                          value={getSectionData('hero').secondary_button_text || ''}
                          onChange={(e) => updateSectionData('hero', { secondary_button_text: e.target.value })}
                          placeholder={t("Login")}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="hero_secondary_button_link">{t('Secondary Button URL')}</Label>
                        <Input
                          id="hero_secondary_button_link"
                          value={getSectionData('hero').secondary_button_link || ''}
                          onChange={(e) => updateSectionData('hero', { secondary_button_link: e.target.value })}
                          placeholder={t("example.com/login")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Card')}</h3>
                      <p className="text-sm text-gray-500">{t('Sample business card displayed in hero')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_name">{t('Name')}</Label>
                      <Input
                        id="hero_card_name"
                        value={getSectionData('hero').card?.name || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, name: e.target.value } });
                        }}
                        placeholder={t("John Doe")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_title">{t('Title')}</Label>
                      <Input
                        id="hero_card_title"
                        value={getSectionData('hero').card?.title || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, title: e.target.value } });
                        }}
                        placeholder={t("Senior Developer")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_company">{t('Company')}</Label>
                      <Input
                        id="hero_card_company"
                        value={getSectionData('hero').card?.company || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, company: e.target.value } });
                        }}
                        placeholder={t("Tech Solutions Inc.")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_initials">{t('Initials')}</Label>
                      <Input
                        id="hero_card_initials"
                        value={getSectionData('hero').card?.initials || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, initials: e.target.value } });
                        }}
                        placeholder={t("JD")}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Stats Section */}
            {activeSection === 'stats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Palette className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Stats Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the statistics section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.stats !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('stats', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="stats_background_color">{t("Background Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="stats_background_color"
                          type="color"
                          value={getSectionData('stats').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('stats', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('stats').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('stats', { background_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="stats_text_color">{t("Text Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="stats_text_color"
                          type="color"
                          value={getSectionData('stats').text_color || '#111827'}
                          onChange={(e) => updateSectionData('stats', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('stats').text_color || '#111827'}
                          onChange={(e) => updateSectionData('stats', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <SettingsIcon className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Statistics')}</h3>
                        <p className="text-sm text-gray-500">{t('Add statistics cards to display key metrics')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'value',
                        label: t('Value'),
                        type: 'text',
                        placeholder: '10K+',
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'label',
                        label: t('Label'),
                        type: 'text',
                        placeholder: t('Active Users'),
                        required: true,
                        colSpan: 1,
                      },
                    ]}
                    value={getSectionData('stats').stats || []}
                    onChange={(stats) => updateSectionData('stats', { stats })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Statistic')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No statistics added yet.')}
                  />
                </div>
              </div>
            )}


            
            {/* Features Section */}
            {activeSection === 'features' && (
              <FeaturesSection 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}
            
            {/* Screenshots Section */}
            {activeSection === 'screenshots' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Palette className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Gallery Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the gallery section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.screenshots !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('screenshots', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="screenshots_background_color">{t("Background Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="screenshots_background_color"
                          type="color"
                          value={getSectionData('screenshots').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('screenshots', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('screenshots').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('screenshots', { background_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="screenshots_text_color">{t("Text Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="screenshots_text_color"
                          type="color"
                          value={getSectionData('screenshots').text_color || '#111827'}
                          onChange={(e) => updateSectionData('screenshots', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('screenshots').text_color || '#111827'}
                          onChange={(e) => updateSectionData('screenshots', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Type className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Screenshots Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title and description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="screenshots_title">{t('Section Title')}</Label>
                      <Input
                        id="screenshots_title"
                        value={getSectionData('screenshots').title || ''}
                        onChange={(e) => updateSectionData('screenshots', { title: e.target.value })}
                        placeholder={t("See vCard SaaS in Action")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="screenshots_subtitle">{t('Section Subtitle')}</Label>
                      <Textarea
                        id="screenshots_subtitle"
                        value={getSectionData('screenshots').subtitle || ''}
                        onChange={(e) => updateSectionData('screenshots', { subtitle: e.target.value })}
                        placeholder={t("Explore our intuitive interface and powerful features...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Monitor className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Screenshots Gallery')}</h3>
                      <p className="text-sm text-gray-500">{t('Manage application screenshots')}</p>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'title',
                        label: t('Title'),
                        type: 'text',
                        placeholder: t('Dashboard Overview'),
                        required: true,
                      },
                      {
                        name: 'src',
                        label: t('Screenshot Image'),
                        type: 'file',
                        placeholder: t('Select screenshot image...'),
                        required: true,
                      },
                      
                    ]}
                    value={getSectionData('screenshots').screenshots_list || []}
                    onChange={(screenshots_list) => updateSectionData('screenshots', { screenshots_list })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Screenshot')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No screenshots added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* Templates Section */}
            {activeSection === 'templates' && (
              <TemplatesSection 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}

            {/* CTA Section */}
            {activeSection === 'cta' && (
              <CTASection
                data={data}
                setData={setData}
                errors={errors}
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}

            {/* How It Works Section */}
            {activeSection === 'how_it_works' && (
              <HowItWorksSection
                data={data}
                setData={setData}
                errors={errors}
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}

            {/* Use Cases Section */}
            {activeSection === 'use_cases' && (
              <UseCasesSettings
                data={data}
                setData={setData}
                errors={errors}
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}

            {/* Themes Section */}
            {activeSection === 'themes' && (
              <ThemesSection
                data={data}
                setData={setData}
                errors={errors}
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}
            
            {/* Active Campaigns Section */}
            {activeSection === 'active_campaigns' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Type className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Active Campaigns Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure active campaigns section display')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.active_campaigns !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('active_campaigns', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_title">{t('Section Title')}</Label>
                      <Input
                        id="active_campaigns_title"
                        value={getSectionData('active_campaigns').title || ''}
                        onChange={(e) => updateSectionData('active_campaigns', { title: e.target.value })}
                        placeholder={t('Featured Business Promotions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_subtitle">{t('Section Subtitle')}</Label>
                      <Textarea
                        id="active_campaigns_subtitle"
                        value={getSectionData('active_campaigns').subtitle || ''}
                        onChange={(e) => updateSectionData('active_campaigns', { subtitle: e.target.value })}
                        placeholder={t('Explore businesses we\'re currently promoting and discover amazing services')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Palette className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Background & Styling')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize section appearance')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="active_campaigns_background_color"
                          type="color"
                          value={getSectionData('active_campaigns').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('active_campaigns', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('active_campaigns').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('active_campaigns', { background_color: e.target.value })}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="active_campaigns_text_color"
                          type="color"
                          value={getSectionData('active_campaigns').text_color || '#0f172a'}
                          onChange={(e) => updateSectionData('active_campaigns', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('active_campaigns').text_color || '#0f172a'}
                          onChange={(e) => updateSectionData('active_campaigns', { text_color: e.target.value })}
                          placeholder="#0f172a"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <MediaPicker
                      label={t('Background Image')}
                      value={getDisplayUrl(getSectionData('active_campaigns').background_image || '')}
                      onChange={(value) => {
                        updateSectionData('active_campaigns', { background_image: convertToRelativePath(value) });
                      }}
                      placeholder={t('Select background image...')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg border border-gray-200 px-3 py-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 space-y-0.5">
                          <Label htmlFor="hero_overlay">{t('Background Overlay')}</Label>
                          <p className="text-xs text-muted-foreground truncate">
                            {t('Add overlay on background image')}
                          </p>
                        </div>
                        <Switch
                        id="active_campaigns_overlay"
                        checked={getSectionData('active_campaigns').overlay || false}
                        onCheckedChange={(checked) => updateSectionData('active_campaigns', { overlay: checked })}
                      />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_overlay_color">{t('Overlay Color')}</Label>
                      <Input
                        id="active_campaigns_overlay_color"
                        value={getSectionData('active_campaigns').overlay_color || 'rgba(0,0,0,0.5)'}
                        onChange={(e) => updateSectionData('active_campaigns', { overlay_color: e.target.value })}
                        placeholder="rgba(0,0,0,0.5)"
                        disabled={!getSectionData('active_campaigns').overlay}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">{t('Campaign Data Source')}</h4>
                      <p className="text-sm text-blue-700">
                        {t('This section automatically displays active marketing campaigns from businesses. Campaigns are shown only if they are currently active and within their date range.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Section */}
            {activeSection === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Palette className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Team Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the team section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.team !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('team', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="team_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="team_background_color"
                          type="color"
                          value={getSectionData('team').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('team', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('team').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('team', { background_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="team_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="team_text_color"
                          type="color"
                          value={getSectionData('team').text_color || '#111827'}
                          onChange={(e) => updateSectionData('team', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('team').text_color || '#111827'}
                          onChange={(e) => updateSectionData('team', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Type className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Team Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Team section title and description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="team_title">{t('Team Title')}</Label>
                      <Input
                        id="team_title"
                        value={getSectionData('team').title || ''}
                        onChange={(e) => updateSectionData('team', { title: e.target.value })}
                        placeholder={t('Meet Our Team')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="team_subtitle">{t('Team Subtitle')}</Label>
                      <Textarea
                        id="team_subtitle"
                        value={getSectionData('team').subtitle || ''}
                        onChange={(e) => updateSectionData('team', { subtitle: e.target.value })}
                        placeholder={t("We're a diverse team of innovators...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Team Members')}</h3>
                      <p className="text-sm text-gray-500">{t('Add and manage team member profiles')}</p>
                    </div>
                  </div>
                  <Repeater
                    fields={[
                      {
                        name: 'name',
                        label: t('Name'),
                        type: 'text',
                        placeholder: t('John Doe'),
                        required: true,
                      },
                      {
                        name: 'role',
                        label: t('Role'),
                        type: 'text',
                        placeholder: t('CEO & Founder'),
                        required: true,
                      },
                      {
                        name: 'bio',
                        label: t('Bio'),
                        type: 'textarea',
                        placeholder: t('Brief description about the team member...'),
                        required: true,
                        colSpan: 2,
                      },
                      {
                        name: 'linkedin',
                        label: t('LinkedIn'),
                        type: 'text',
                        placeholder: 'https://linkedin.com/in/...',
                      },
                      {
                        name: 'twitter',
                        label: t('Twitter'),
                        type: 'text',
                        placeholder: 'https://twitter.com/...',
                      },
                      {
                        name: 'email',
                        label: t('Email'),
                        type: 'email',
                        placeholder: 'john@company.com',
                      },
                      {
                        name: 'image',
                        label: t('Profile Image'),
                        type: 'file',
                        placeholder: t('Select profile image...'),
                      },
                      
                    ]}
                    value={getSectionData('team').members || []}
                    onChange={(members) => updateSectionData('team', { members })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Team Member')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No team members added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Palette className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Testimonials Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the testimonials section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.testimonials !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('testimonials', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="testimonials_background_color"
                          type="color"
                          value={getSectionData('testimonials').background_color || '#f9fafb'}
                          onChange={(e) => updateSectionData('testimonials', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('testimonials').background_color || '#f9fafb'}
                          onChange={(e) => updateSectionData('testimonials', { background_color: e.target.value })}
                          placeholder="#f9fafb"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="testimonials_text_color"
                          type="color"
                          value={getSectionData('testimonials').text_color || '#111827'}
                          onChange={(e) => updateSectionData('testimonials', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('testimonials').text_color || '#111827'}
                          onChange={(e) => updateSectionData('testimonials', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Type className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Testimonials Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title and description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_title">{t("Section Title")}</Label>
                      <Input
                        id="testimonials_title"
                        value={getSectionData('testimonials').title || ''}
                        onChange={(e) => updateSectionData('testimonials', { title: e.target.value })}
                        placeholder={t("What Our Clients Say")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="testimonials_subtitle"
                        value={getSectionData('testimonials').subtitle || ''}
                        onChange={(e) => updateSectionData('testimonials', { subtitle: e.target.value })}
                        placeholder={t("Don't just take our word for it...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <Users className="h-5 w-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Default Testimonials')}</h3>
                      <p className="text-sm text-gray-500">{t('Customer reviews and feedback')}</p>
                    </div>
                  </div>
                  <Repeater
                    fields={[
                      {
                        name: 'name',
                        label: t('Name'),
                        type: 'text',
                        placeholder: t('John Doe'),
                        required: true,
                      },
                      {
                        name: 'role',
                        label: t('Role'),
                        type: 'text',
                        placeholder: t('CEO'),
                        required: true,
                      },
                      {
                        name: 'image',
                        label: t('Image'),
                        type: 'file',
                        placeholder: t('Select image...'),
                      },
                      {
                        name: 'rating',
                        label: t('Rating'),
                        type: 'select',
                        placeholder: t('Select rating'),
                        options: [
                          { value: '1', label: t('1 Star') },
                          { value: '2', label: t('2 Stars') },
                          { value: '3', label: t('3 Stars') },
                          { value: '4', label: t('4 Stars') },
                          { value: '5', label: t('5 Stars') },
                        ],
                        defaultValue: '5',
                      },
                      {
                        name: 'content',
                        label: t('Content'),
                        type: 'textarea',
                        placeholder: t('Testimonial content...'),
                        required: true,
                        colSpan: 2,
                      },
                    ]}
                    value={getSectionData('testimonials').testimonials || []}
                    onChange={(testimonials) => updateSectionData('testimonials', { testimonials })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Default Testimonial')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No testimonials added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* Plans Section */}
            {activeSection === 'plans' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Palette className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Plans Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the plans section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.plans !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('plans', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="plans_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="plans_background_color"
                          type="color"
                          value={getSectionData('plans').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('plans', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('plans').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('plans', { background_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="plans_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="plans_text_color"
                          type="color"
                          value={getSectionData('plans').text_color || '#111827'}
                          onChange={(e) => updateSectionData('plans', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('plans').text_color || '#111827'}
                          onChange={(e) => updateSectionData('plans', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Type className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Plans Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Pricing section title and description')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="plans_title">{t("Section Title")}</Label>
                      <Input
                        id="plans_title"
                        value={getSectionData('plans').title || ''}
                        onChange={(e) => updateSectionData('plans', { title: e.target.value })}
                        placeholder={t("Choose Your Plan")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="plans_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="plans_subtitle"
                        value={getSectionData('plans').subtitle || ''}
                        onChange={(e) => updateSectionData('plans', { subtitle: e.target.value })}
                        placeholder={t("Start with our free plan and upgrade as you grow...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="plans_faq_text">{t('FAQ Text')}</Label>
                      <Input
                        id="plans_faq_text"
                        value={getSectionData('plans').faq_text || ''}
                        onChange={(e) => updateSectionData('plans', { faq_text: e.target.value })}
                        placeholder={t("Have questions about our plans? Contact our sales team")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-900">{t('Plans Management')}</h4>
                      <p className="text-sm text-blue-700">
                        {t('The actual plans displayed on the landing page are managed through the Plans module. Go to Plans section to create, edit, or manage your subscription plans.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title, subtitle and CTA')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.faq !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('faq', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_title">{t("Section Title")}</Label>
                      <Input
                        id="faq_title"
                        value={getSectionData('faq').title || ''}
                        onChange={(e) => updateSectionData('faq', { title: e.target.value })}
                        placeholder={t("Frequently Asked Questions")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="faq_subtitle"
                        value={getSectionData('faq').subtitle || ''}
                        onChange={(e) => updateSectionData('faq', { subtitle: e.target.value })}
                        placeholder={t("Got questions? We've got answers...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_cta_text">{t('CTA Text')}</Label>
                      <Input
                        id="faq_cta_text"
                        value={getSectionData('faq').cta_text || ''}
                        onChange={(e) => updateSectionData('faq', { cta_text: e.target.value })}
                        placeholder={t("Still have questions?")}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="faq_button_text">{t("Button Text")}</Label>
                      <Input
                        id="faq_button_text"
                        value={getSectionData('faq').button_text || 'Contact Support'}
                        onChange={(e) => updateSectionData('faq', { button_text: e.target.value })}
                        placeholder={t("Contact Support")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Default FAQs')}</h3>
                      <p className="text-sm text-gray-500">{t('Frequently asked questions and answers')}</p>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'question',
                        label: t('Question'),
                        type: 'text',
                        placeholder: t('How does vCard SaaS work?'),
                        required: true,
                      },
                      {
                        name: 'answer',
                        label: t('Answer'),
                        type: 'textarea',
                        placeholder: t('vCard SaaS allows you to create digital business cards...'),
                        required: true,
                      },
                    ]}
                    value={getSectionData('faq').faqs || []}
                    onChange={(value) => updateSectionData('faq', { faqs: value })}
                    addButtonText={t('Add FAQ')}
                    removeButtonText=""
                    emptyMessage={t('No FAQs added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* Newsletter Section */}
            {activeSection === 'newsletter' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Palette className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Newsletter Colors')}</h3>
                        <p className="text-sm text-gray-500">{t('Background and text colors for the newsletter section')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.newsletter !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('newsletter', checked)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newsletter_background_color"
                          type="color"
                          value={getSectionData('newsletter').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('newsletter', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('newsletter').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('newsletter', { background_color: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newsletter_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newsletter_text_color"
                          type="color"
                          value={getSectionData('newsletter').text_color || '#111827'}
                          onChange={(e) => updateSectionData('newsletter', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('newsletter').text_color || '#111827'}
                          onChange={(e) => updateSectionData('newsletter', { text_color: e.target.value })}
                          placeholder="#111827"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Type className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Newsletter Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Newsletter section title and text')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_title">{t("Section Title")}</Label>
                      <Input
                        id="newsletter_title"
                        value={getSectionData('newsletter').title || ''}
                        onChange={(e) => updateSectionData('newsletter', { title: e.target.value })}
                        placeholder={t("Stay Updated with vCard")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_privacy_text">{t('Privacy Text')}</Label>
                      <Input
                        id="newsletter_privacy_text"
                        value={getSectionData('newsletter').privacy_text || ''}
                        onChange={(e) => updateSectionData('newsletter', { privacy_text: e.target.value })}
                        placeholder={t("No spam, unsubscribe at any time...")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Type className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Contact Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Contact section titles and descriptions')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.contact !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('contact', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="contact_title">{t("Section Title")}</Label>
                      <Input
                        id="contact_title"
                        value={getSectionData('contact').title || ''}
                        onChange={(e) => updateSectionData('contact', { title: e.target.value })}
                        placeholder={t("Get in Touch")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="contact_subtitle"
                        value={getSectionData('contact').subtitle || ''}
                        onChange={(e) => updateSectionData('contact', { subtitle: e.target.value })}
                        placeholder={t("Have questions about vCard?...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_form_title">{t('Form Title')}</Label>
                      <Input
                        id="contact_form_title"
                        value={getSectionData('contact').form_title || ''}
                        onChange={(e) => updateSectionData('contact', { form_title: e.target.value })}
                        placeholder={t("Send us a Message")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_info_title">{t('Contact Info Title')}</Label>
                      <Input
                        id="contact_info_title"
                        value={getSectionData('contact').info_title || ''}
                        onChange={(e) => updateSectionData('contact', { info_title: e.target.value })}
                        placeholder={t("Contact Information")}
                      />
                    </div>
                    
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Contact Information')}</h3>
                      <p className="text-sm text-gray-500">{t('Company contact details')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="contact_email">{t('Email Address')}</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        value={data.contact_email || ''}
                        onChange={handleInputChange}
                        placeholder="support@vCard.com"
                        type="email"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_phone">{t('Phone Number')}</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={data.contact_phone || ''}
                        onChange={handleInputChange}
                        placeholder={t("+1 (555) 123-4567")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_address">{t('Address')}</Label>
                      <Textarea
                        id="contact_address"
                        name="contact_address"
                        value={data.contact_address || ''}
                        onChange={handleInputChange}
                        placeholder={t("123 Business Ave, Suite 100, San Francisco, CA 94105")}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            )}
            
            {/* Footer Section */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Type className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Footer Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Footer description and newsletter content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.footer !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('footer', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="footer_description">{t('Company Description')}</Label>
                      <Textarea
                        id="footer_description"
                        value={getSectionData('footer').description || ''}
                        onChange={(e) => updateSectionData('footer', { description: e.target.value })}
                        placeholder={t("Transforming professional networking...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="footer_newsletter_title">{t('Newsletter Title')}</Label>
                      <Input
                        id="footer_newsletter_title"
                        value={getSectionData('footer').newsletter_title || ''}
                        onChange={(e) => updateSectionData('footer', { newsletter_title: e.target.value })}
                        placeholder={t("Stay Updated with Our Latest Features")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="footer_newsletter_subtitle">{t('Newsletter Subtitle')}</Label>
                      <Input
                        id="footer_newsletter_subtitle"
                        value={getSectionData('footer').newsletter_subtitle || ''}
                        onChange={(e) => updateSectionData('footer', { newsletter_subtitle: e.target.value })}
                        placeholder={t("Join our newsletter for product updates...")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Social Links')}</h3>
                      <p className="text-sm text-gray-500">{t('Social media links and profiles')}</p>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'name',
                        label: t('Name'),
                        type: 'text',
                        placeholder: t('Facebook'),
                        required: true,
                      },
                      {
                        name: 'icon',
                        label: t('Icon'),
                        type: 'select',
                        placeholder: t('Select icon'),
                        required: true,
                        options: [
                          { value: 'Facebook', label: 'Facebook' },
                          { value: 'Twitter', label: 'Twitter' },
                          { value: 'Linkedin', label: 'LinkedIn' },
                          { value: 'Instagram', label: 'Instagram' },
                        ],
                      },
                      {
                        name: 'href',
                        label: t('URL'),
                        type: 'text',
                        placeholder: 'https://facebook.com/...',
                        required: true,
                      },
                    ]}
                    value={getSectionData('footer').social_links || []}
                    onChange={(social_links) => updateSectionData('footer', { social_links })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Social Link')}
                    removeButtonText= ""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No social links added yet.')}
                  />
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("Footer Links")}</h3>
                      <p className="text-sm text-gray-500">{t("Footer navigation links by category")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {['support', 'legal'].map((category) => (
                      <div key={category} className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor={`${category}_title`}>{t("Section Title")}</Label>
                          <Input
                            id={`${category}_title`}
                            value={getSectionData('footer').section_titles?.[category] || ''}
                            onChange={(e) => {
                              const newTitles = { ...getSectionData('footer').section_titles };
                              newTitles[category] = e.target.value;
                              updateSectionData('footer', { section_titles: newTitles });
                            }}
                            placeholder={category.charAt(0).toUpperCase() + category.slice(1)}
                          />
                        </div>
                        <h4 className="font-medium">
                          {getSectionData('footer').section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} Links
                        </h4>
                        <Repeater
                          fields={[
                            {
                              name: 'name',
                              label: t('Name'),
                              type: 'text',
                              placeholder: t('Features'),
                              required: true,
                            },
                            {
                              name: 'href',
                              label: t('URL'),
                              type: 'text',
                              placeholder: '#features',
                              required: true,
                            },
                          ]}
                          value={getSectionData('footer').links?.[category] || []}
                          onChange={(links) => {
                            const newLinks = { ...getSectionData('footer').links, [category]: links };
                            updateSectionData('footer', { links: newLinks });
                          }}
                          minItems={0}
                          maxItems={-1}
                          addButtonText={`${t("Add")} ${getSectionData('footer').section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} ${t("Link")}`}
                          removeButtonText=""
                          showItemNumbers={true}
                          allowReorder={false}
                          emptyMessage={t('No links added yet.')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Design Section */}
            {activeSection === 'design' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Colors & Theme")}</h3>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="primary_color">{t("Primary Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                          onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                          onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="secondary_color">{t("Secondary Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                          onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                          onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="accent_color">{t("Accent Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent_color"
                          type="color"
                          value={data.config_sections?.theme?.accent_color || '#10b77f'}
                          onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.accent_color || '#10b77f'}
                          onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                          placeholder="#10b77f"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Image className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Images & Logos")}</h3>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <MediaPicker
                        label={t("Logo (Light)")}
                        value={getDisplayUrl(data.config_sections?.theme?.logo_light || '')}
                        onChange={(value) => {
                          updateThemeData({ logo_light: convertToRelativePath(value) });
                        }}
                        placeholder={t("Select light logo...")}
                      />
                    </div>
                    <div className="space-y-3">
                      <MediaPicker
                        label={t("Logo (Dark)")}
                        value={getDisplayUrl(data.config_sections?.theme?.logo_dark || '')}
                        onChange={(value) => {
                          updateThemeData({ logo_dark: convertToRelativePath(value) });
                        }}
                        placeholder={t("Select dark logo...")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Change Order Section */}
            {activeSection === 'order' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <ArrowUpDown className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Section Order')}</h3>
                      <p className="text-sm text-gray-500">{t('Drag and drop to reorder sections on your landing page')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {(data.config_sections?.section_order || []).map((sectionKey, index) => {
                      const sectionNames = {
                        header: t('Header'),
                        hero: t('Hero'),
                        stats: t('Stats'),
                        features: t('Features'),
                        screenshots: t('Screenshots'),
                        templates: t('Templates'),
                        cta: t('CTA'),
                        how_it_works: t('How It Works'),
                        use_cases: t('Use Cases'),
                        themes: t('Themes'),
                        team: t('Team'),
                        testimonials: t('Testimonials'),
                        active_campaigns: t('Active Campaigns'),
                        plans: t('Plans'),
                        faq: t('FAQ'),
                        newsletter: t('Newsletter'),
                        contact: t('Contact'),
                        footer: t('Footer'),
                      };
                      
                      const isEnabled = data.config_sections?.section_visibility?.[sectionKey] !== false;
                      
                      return (
                        <div
                          key={sectionKey}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-move transition-all hover:shadow-md ${
                            isEnabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'
                          }`}
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900">{sectionNames[sectionKey] || sectionKey}</h4>
                                <p className="text-sm text-gray-500">
                                  {isEnabled ? t('Enabled') : t('Disabled')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">{t('Enable')}</Label>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => updateSectionVisibility(sectionKey, checked)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">{t('How to reorder')}</h4>
                        <p className="text-sm text-blue-700">
                          {t('Click and drag any section to change its position. Disabled sections will still appear in the order but won\'t be visible on the landing page.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Advanced Section */}
            {activeSection === 'advanced' && (
              <div className="space-y-6">
                {/* SEO Settings Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("SEO Settings")}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Optimize your landing page for search engines")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="meta_title">{t("Meta Title")}</Label>
                      <Input
                        id="meta_title"
                        value={data.config_sections?.seo?.meta_title || ''}
                        onChange={(e) => updateSeoData({ meta_title: e.target.value })}
                        placeholder={t("Landing Page Title")}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('The title that appears in search engine results')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="meta_description">{t("Meta Description")}</Label>
                      <Textarea
                        id="meta_description"
                        value={data.config_sections?.seo?.meta_description || ''}
                        onChange={(e) => updateSeoData({ meta_description: e.target.value })}
                        placeholder={t("Landing page description for search engines")}
                        rows={3}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Brief description shown in search results (150-160 characters recommended)')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="meta_keywords">{t("Meta Keywords")}</Label>
                      <Input
                        id="meta_keywords"
                        value={data.config_sections?.seo?.meta_keywords || ''}
                        onChange={(e) => updateSeoData({ meta_keywords: e.target.value })}
                        placeholder={t("vcard, digital business card, networking")}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Comma-separated keywords related to your business')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom CSS Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("Custom CSS")}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Add custom styles to your landing page")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="custom_css">{t("CSS Code")}</Label>
                    <Textarea
                      id="custom_css"
                      value={data.config_sections?.custom_css || ''}
                      onChange={(e) => setData('config_sections', { ...data.config_sections, custom_css: e.target.value })}
                      placeholder={t("/* Add your custom CSS here */\n.my-custom-class {\n  color: #333;\n}")}
                      rows={8}
                      className="font-mono text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('Add custom CSS to override default styles. Changes will be applied to your landing page.')}
                    </p>
                  </div>
                </div>
                
                {/* Custom JavaScript Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('Custom JavaScript')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Add custom functionality to your landing page")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="custom_js">{t('JavaScript Code')}</Label>
                    <Textarea
                      id="custom_js"
                      value={data.config_sections?.custom_js || ''}
                      onChange={(e) => setData('config_sections', { ...data.config_sections, custom_js: e.target.value })}
                      placeholder={t("// Add your custom JavaScript here\nconsole.log('Custom JS loaded');")}
                      rows={8}
                      className="font-mono text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('Add custom JavaScript for advanced functionality. Code will be executed on your landing page.')}
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">{t('Warning')}</h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-500">
                          {t('Be careful when adding custom JavaScript. Incorrect code may break your landing page functionality.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Privacy Policy */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Policy Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure privacy policy page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('privacy').active !== false}
                        onCheckedChange={(checked) => updateSectionData('privacy', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="privacy_title">{t('Page Title')}</Label>
                      <Input
                        id="privacy_title"
                        value={getSectionData('privacy').title || t('Privacy Policy')}
                        onChange={(e) => updateSectionData('privacy', { title: e.target.value })}
                        placeholder={t('Privacy Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_description">{t('Page Description')}</Label>
                      <Textarea
                        id="privacy_description"
                        value={getSectionData('privacy').description || t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                        onChange={(e) => updateSectionData('privacy', { description: e.target.value })}
                        placeholder={t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Terms of Service */}
            {activeSection === 'terms' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Terms of Service Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure terms of service page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('terms').active !== false}
                        onCheckedChange={(checked) => updateSectionData('terms', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="terms_title">{t('Page Title')}</Label>
                      <Input
                        id="terms_title"
                        value={getSectionData('terms').title || t('Terms of Service')}
                        onChange={(e) => updateSectionData('terms', { title: e.target.value })}
                        placeholder={t('Terms of Service')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_description">{t('Page Description')}</Label>
                      <Textarea
                        id="terms_description"
                        value={getSectionData('terms').description || t('Please read these terms carefully before using our services.')}
                        onChange={(e) => updateSectionData('terms', { description: e.target.value })}
                        placeholder={t('Please read these terms carefully before using our services.')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - FAQ Page */}
            {/* {activeSection === 'faq-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure FAQ page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('faq-page').active !== false}
                        onCheckedChange={(checked) => updateSectionData('faq-page', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_title">{t('Page Title')}</Label>
                      <Input
                        id="faq_page_title"
                        value={getSectionData('faq-page').title || t('Frequently Asked Questions')}
                        onChange={(e) => updateSectionData('faq-page', { title: e.target.value })}
                        placeholder={t('Frequently Asked Questions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_description">{t('Page Description')}</Label>
                      <Textarea
                        id="faq_page_description"
                        value={getSectionData('faq-page').description || t('Find quick answers to the most common questions')}
                        onChange={(e) => updateSectionData('faq-page', { description: e.target.value })}
                        placeholder={t('Find quick answers to the most common questions')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            
            {/* Pages Section - About Us */}
            {activeSection === 'about-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('About Us Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Customize your About Us page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('about-page').active !== false}
                        onCheckedChange={(checked) => updateSectionData('about-page', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="about_page_title">{t('Page Title')}</Label>
                      <Input
                        id="about_page_title"
                        value={getSectionData('about-page').title || 'About vCard'}
                        onChange={(e) => updateSectionData('about-page', { title: e.target.value })}
                        placeholder={t('About Us')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="about_page_subtitle"
                        value={getSectionData('about-page').subtitle || 'Revolutionizing digital networking with innovative business card solutions'}
                        onChange={(e) => updateSectionData('about-page', { subtitle: e.target.value })}
                        placeholder={t('Learn more about our company')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_story_title">{t('Story Title')}</Label>
                      <Input
                        id="about_page_story_title"
                        value={getSectionData('about-page').story_title || 'Empowering Professional Connections Since 2020'}
                        onChange={(e) => updateSectionData('about-page', { story_title: e.target.value })}
                        placeholder={t('Empowering Professional Connections Since 2020')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_content">{t('Story Content')}</Label>
                      <RichTextField
                        value={getSectionData('about-page').content || '<p>vCard SaaS is a leading digital business card platform that helps businesses create professional online presence. Our mission is to revolutionize how businesses connect and share information in the digital age.</p><p>Founded with the vision of making networking seamless and efficient, we provide cutting-edge solutions for modern businesses. We believe that every connection matters and every interaction should leave a lasting impression.</p>'}
                        onChange={(value) => updateSectionData('about-page', { content: value })}
                        placeholder={t('Write your about us story here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stats Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Statistics')}</h3>
                      <p className="text-sm text-gray-500">{t('Add key statistics')}</p>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'value',
                        label: t('Value'),
                        type: 'text',
                        placeholder: '4+ Years',
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'label',
                        label: t('Label'),
                        type: 'text',
                        placeholder: t('Experience'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'color',
                        label: t('Color'),
                        type: 'color',
                        placeholder: '#000000',
                        required: false,
                        colSpan: 1,
                        defaultValue: '#000000',
                      },
                    ]}
                    value={getAboutPageStats()}
                    onChange={(stats) => updateSectionData('about-page', { stats })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Statistic')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No statistics added yet.')}
                  />
                </div>
                
                {/* Values Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Target className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Values Cards')}</h3>
                      <p className="text-sm text-gray-500">{t('Add company values with icons')}</p>
                    </div>
                  </div>
                  
                  <Repeater
                    fields={[
                      {
                        name: 'icon',
                        label: t('Icon'),
                        type: 'select',
                        placeholder: t('Select icon'),
                        required: true,
                        colSpan: 1,
                        options: [
                          { value: 'target', label: 'Target' },
                          { value: 'heart', label: 'Heart' },
                          { value: 'award', label: 'Award' },
                          { value: 'lightbulb', label: 'Lightbulb' },
                        ],
                      },
                      {
                        name: 'title',
                        label: t('Title'),
                        type: 'text',
                        placeholder: t('Our Mission'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'description',
                        label: t('Description'),
                        type: 'textarea',
                        placeholder: t('To revolutionize professional networking...'),
                        required: true,
                        colSpan: 2,
                      },
                    ]}
                    value={getSectionData('about-page').values || []}
                    onChange={(values) => updateSectionData('about-page', { values })}
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Value Card')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No value cards added yet.')}
                  />
                </div>
                
                {/* Image Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Image className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Image Section')}</h3>
                      <p className="text-sm text-gray-500">{t('Image with icon and text')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <Label>{t('Upload Image')}</Label>
                      <MediaPicker
                        value={getSectionData('about-page').image || ''}
                        onChange={(url) => updateSectionData('about-page', { image: url })}
                        accept="image/*"
                        maxSize={5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{t('Icon Emoji')} ({t('Shows when no image')})</Label>
                      <Input
                        value={getSectionData('about-page').image_icon || '🚀'}
                        onChange={(e) => updateSectionData('about-page', { image_icon: e.target.value })}
                        placeholder="🚀"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>{t('Image Title')}</Label>
                      <Input
                        value={getSectionData('about-page').image_title || 'Innovation Driven'}
                        onChange={(e) => updateSectionData('about-page', { image_title: e.target.value })}
                        placeholder={t('Innovation Driven')}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{t('Image Subtitle')}</Label>
                      <Input
                        value={getSectionData('about-page').image_subtitle || 'Building the future of networking'}
                        onChange={(e) => updateSectionData('about-page', { image_subtitle: e.target.value })}
                        placeholder={t('Building the future')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Page Settings */}
            {activeSection === 'contact-page' && (
              <ContactPageSettings 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                t={t}
              />
            )}
            
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Policy Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Privacy Policy page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="privacy_title">{t('Page Title')}</Label>
                      <Input
                        id="privacy_title"
                        value={getSectionData('privacy').title || 'Privacy Policy'}
                        onChange={(e) => updateSectionData('privacy', { title: e.target.value })}
                        placeholder={t('Privacy Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="privacy_subtitle"
                        value={getSectionData('privacy').subtitle || 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.'}
                        onChange={(e) => updateSectionData('privacy', { subtitle: e.target.value })}
                        placeholder={t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_story_title">{t('Story Title')}</Label>
                      <Input
                        id="privacy_story_title"
                        value={getSectionData('privacy').story_title || 'How We Protect Your Information'}
                        onChange={(e) => updateSectionData('privacy', { story_title: e.target.value })}
                        placeholder={t('How We Protect Your Information')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_content">{t('Privacy Policy Content')}</Label>
                      <RichTextField
                        value={getSectionData('privacy').content || '<p>We are committed to protecting your privacy and ensuring the security of your personal information.</p>'}
                        onChange={(value) => updateSectionData('privacy', { content: value })}
                        placeholder={t('Write your privacy policy content here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Privacy Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <Repeater
                    fields={[
                      {
                        name: 'title',
                        label: t('Section Title'),
                        type: 'text',
                        placeholder: t('Section Title'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'color',
                        label: t('Color'),
                        type: 'color',
                        placeholder: '#3b82f6',
                        required: false,
                        colSpan: 1,
                        defaultValue: '#3b82f6',
                      },
                      {
                        name: 'content',
                        label: t('Section Content'),
                        type: 'textarea',
                        placeholder: t('Section content...'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'items',
                        label: t('Bullet Points') + ` (${t('One per line')})`,
                        type: 'textarea',
                        placeholder: t('Enter bullet points, one per line...'),
                        required: false,
                        colSpan: 1,
                      },
                    ]}
                    value={(getSectionData('privacy').sections || []).map((section: any) => ({
                      ...section,
                      items: Array.isArray(section.items) ? section.items.join('\n') : section.items || '',
                    }))}
                    onChange={(sections) =>
                      updateSectionData('privacy', {
                        sections: sections.map((section: any) => ({
                          ...section,
                          items: typeof section.items === 'string'
                            ? section.items.split('\n').filter((item: string) => item.trim())
                            : section.items || [],
                        })),
                      })
                    }
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Section')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No privacy sections added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* Terms of Service Section */}
            {activeSection === 'terms' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Terms of Service Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Terms of Service page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="terms_title">{t('Page Title')}</Label>
                      <Input
                        id="terms_title"
                        value={getSectionData('terms').title || 'Terms of Service'}
                        onChange={(e) => updateSectionData('terms', { title: e.target.value })}
                        placeholder={t('Terms of Service')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="terms_subtitle"
                        value={getSectionData('terms').subtitle || 'Please read these terms carefully before using our services.'}
                        onChange={(e) => updateSectionData('terms', { subtitle: e.target.value })}
                        placeholder={t('Please read these terms carefully before using our services.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_story_title">{t('Story Title')}</Label>
                      <Input
                        id="terms_story_title"
                        value={getSectionData('terms').story_title || 'Terms and Conditions'}
                        onChange={(e) => updateSectionData('terms', { story_title: e.target.value })}
                        placeholder={t('Terms and Conditions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_content">{t('Terms of Service Content')}</Label>
                      <RichTextField
                        value={getSectionData('terms').content || '<p>By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement.</p>'}
                        onChange={(value) => updateSectionData('terms', { content: value })}
                        placeholder={t('Write your terms of service content here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Terms Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Terms Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <Repeater
                    fields={[
                      {
                        name: 'title',
                        label: t('Section Title'),
                        type: 'text',
                        placeholder: t('Section Title'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'color',
                        label: t('Color'),
                        type: 'color',
                        placeholder: '#000000',
                        required: false,
                        colSpan: 1,
                        defaultValue: '#000000',
                      },
                      {
                        name: 'content',
                        label: t('Section Content'),
                        type: 'textarea',
                        placeholder: t('Section content...'),
                        required: true,
                        colSpan: 1,
                      },
                      {
                        name: 'items',
                        label: t('Bullet Points') + ` (${t('One per line')})`,
                        type: 'textarea',
                        placeholder: t('Enter bullet points, one per line...'),
                        required: false,
                        colSpan: 1,
                      },
                    ]}
                    value={(getSectionData('terms').sections || []).map((section: any) => ({
                      ...section,
                      items: Array.isArray(section.items) ? section.items.join('\n') : section.items || '',
                    }))}
                    onChange={(sections) =>
                      updateSectionData('terms', {
                        sections: sections.map((section: any) => ({
                          ...section,
                          items: typeof section.items === 'string'
                            ? section.items.split('\n').filter((item: string) => item.trim())
                            : section.items || [],
                        })),
                      })
                    }
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Section')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No terms sections added yet.')}
                  />
                </div>
              </div>
            )}
            
            {/* FAQ Page Section */}
            {activeSection === 'faq-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your FAQ page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_title">{t('Page Title')}</Label>
                      <Input
                        id="faq_page_title"
                        value={getSectionData('faq-page').title || 'Frequently Asked Questions'}
                        onChange={(e) => updateSectionData('faq-page', { title: e.target.value })}
                        placeholder={t('Frequently Asked Questions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="faq_page_subtitle"
                        value={getSectionData('faq-page').subtitle || 'Find quick answers to the most common questions'}
                        onChange={(e) => updateSectionData('faq-page', { subtitle: e.target.value })}
                        placeholder={t('Find quick answers to the most common questions')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* FAQ Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add FAQ sections with questions and answers')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(getSectionData('faq-page').sections || [
                      { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                      { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                      { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                    ]).map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Section')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentSections = getSectionData('faq-page').sections || [];
                              const newSections = currentSections.filter((_: any, i: number) => i !== index);
                              updateSectionData('faq-page', { sections: newSections });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <Label>{t('Section Title')}</Label>
                            <Input
                              value={section?.title || ''}
                              onChange={(e) => {
                                const currentSections = getSectionData('faq-page').sections || [
                                  { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                  { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                  { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], title: e.target.value };
                                updateSectionData('faq-page', { sections: newSections });
                              }}
                              placeholder={t('Section Title')}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>{t('Icon Color')}</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={section?.icon_color || '#000000'}
                                onChange={(e) => {
                                  const currentSections = getSectionData('faq-page').sections || [
                                    { title: 'Getting Started', icon_color: '#000000', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                    { title: 'Features & Plans', icon_color: '#000000', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                    { title: 'Analytics & Support', icon_color: '#000000', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                  ];
                                  const newSections = [...currentSections];
                                  newSections[index] = { ...newSections[index], icon_color: e.target.value };
                                  updateSectionData('faq-page', { sections: newSections });
                                }}
                                className="w-16 h-10 p-1"
                              />
                              <Input
                                value={section?.icon_color || '#000000'}
                                onChange={(e) => {
                                  const currentSections = getSectionData('faq-page').sections || [
                                    { title: 'Getting Started', icon_color: '#000000', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                    { title: 'Features & Plans', icon_color: '#000000', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                    { title: 'Analytics & Support', icon_color: '#000000', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                  ];
                                  const newSections = [...currentSections];
                                  newSections[index] = { ...newSections[index], icon_color: e.target.value };
                                  updateSectionData('faq-page', { sections: newSections });
                                }}
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label>{t('FAQs')}</Label>
                          <Repeater
                            fields={[
                              { name: 'question', label: t('Question'), type: 'text', placeholder: t('Enter question...'), required: true, colSpan: 1 },
                              { name: 'answer', label: t('Answer'), type: 'textarea', placeholder: t('Enter answer...'), required: true, colSpan: 1 },
                            ]}
                            value={section?.faqs || []}
                            onChange={(faqs) => {
                              const currentSections = getSectionData('faq-page').sections || [];
                              const newSections = [...currentSections];
                              newSections[index] = { ...newSections[index], faqs };
                              updateSectionData('faq-page', { sections: newSections });
                            }}
                            minItems={0}
                            maxItems={-1}
                            addButtonText={t('Add FAQ')}
                            removeButtonText=""
                            showItemNumbers={true}
                            allowReorder={false}
                            emptyMessage={t('No FAQs added yet.')}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSections = [...(getSectionData('faq-page').sections || []), { title: '', icon_color: 'blue', faqs: [] }];
                        updateSectionData('faq-page', { sections: newSections });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Section')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Refund Policy Section */}
            {activeSection === 'refund' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Refund Page Content')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Refund Policy page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="refund_title">{t('Page Title')}</Label>
                      <Input
                        id="refund_title"
                        value={getSectionData('refund').title || 'Refund Policy'}
                        onChange={(e) => updateSectionData('refund', { title: e.target.value })}
                        placeholder={t('Refund Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_subtitle">{t('Page Summary')}</Label>
                      <Input
                        id="refund_subtitle"
                        value={getSectionData('refund').subtitle || 'We stand behind our service with a satisfaction guarantee.'}
                        onChange={(e) => updateSectionData('refund', { subtitle: e.target.value })}
                        placeholder={t('We stand behind our service with a satisfaction guarantee.')}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="refund_guarantee_title">{t('Guarantee Title')}</Label>
                      <Input
                        id="refund_guarantee_title"
                        value={getSectionData('refund').guarantee_title || '30-Day Money Back Guarantee'}
                        onChange={(e) => updateSectionData('refund', { guarantee_title: e.target.value })}
                        placeholder={t('30-Day Money Back Guarantee')}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="refund_guarantee_text">{t('Guarantee Text')}</Label>
                      <Textarea
                        id="refund_guarantee_text"
                        value={getSectionData('refund').guarantee_text || 'We offer a 30-day money back guarantee for all premium plans. If you\'re not completely satisfied with vCard, we\'ll refund your payment in full.'}
                        onChange={(e) => updateSectionData('refund', { guarantee_text: e.target.value })}
                        placeholder={t('We offer a 30-day money back guarantee for all premium plans.')}
                        rows={3}
                      />
                    </div>
                  </div> 
                </div>
                
                {/* Refund Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Refund Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <Repeater
                    fields={[
                      { name: 'title', label: t('Section Title'), type: 'text', placeholder: t('Section Title'), required: true, colSpan: 1 },
                      { name: 'color', label: t('Color'), type: 'color', placeholder: '#000000', required: false, colSpan: 1, defaultValue: '#000000' },
                      { name: 'content', label: t('Section Content'), type: 'textarea', placeholder: t('Section content...'), required: true, colSpan: 1 },
                      { name: 'items', label: t('Bullet Points') + ` (${t('One per line')})`, type: 'textarea', placeholder: t('Enter bullet points, one per line...'), required: false, colSpan: 1 },
                    ]}
                    value={(getSectionData('refund').sections || []).map((section: any) => ({
                      ...section,
                      items: Array.isArray(section.items) ? section.items.join('\n') : section.items || '',
                    }))}
                    onChange={(sections) =>
                      updateSectionData('refund', {
                        sections: sections.map((section: any) => ({
                          ...section,
                          items: typeof section.items === 'string'
                            ? section.items.split('\n').filter((item: string) => item.trim())
                            : section.items || [],
                        })),
                      })
                    }
                    minItems={0}
                    maxItems={-1}
                    addButtonText={t('Add Section')}
                    removeButtonText=""
                    showItemNumbers={true}
                    allowReorder={false}
                    emptyMessage={t('No refund sections added yet.')}
                  />
                </div>
                
                {/* Contact Support Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Contact Support Section')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize the contact support section')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="refund_cta_text">{t('CTA Text')}</Label>
                      <Input
                        id="refund_cta_text"
                        value={getSectionData('refund').cta_text || 'Questions?'}
                        onChange={(e) => updateSectionData('refund', { cta_text: e.target.value })}
                        placeholder={t('Questions?')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_cta_description">{t('CTA Description')}</Label>
                      <Input
                        id="refund_cta_description"
                        value={getSectionData('refund').cta_description || 'If you have any questions about our refund policy, please contact our support team.'}
                        onChange={(e) => updateSectionData('refund', { cta_description: e.target.value })}
                        placeholder={t('If you have any questions about our refund policy, please contact our support team.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_button_text">{t('Button Text')}</Label>
                      <Input
                        id="refund_button_text"
                        value={getSectionData('refund').button_text || 'Contact Support'}
                        onChange={(e) => updateSectionData('refund', { button_text: e.target.value })}
                        placeholder={t('Contact Support')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other Pages Section */}
            {['about-page', 'privacy', 'terms', 'refund', 'faq-page', 'contact-page'].includes(activeSection) && (
              <div key={activeSection} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('Edit')} {activeSection === 'about-page' ? t('About Us') : activeSection === 'privacy' ? t('Privacy Policy') : activeSection === 'terms' ? t('Terms of Service') : activeSection === 'refund' ? t('Refund Policy') : activeSection === 'faq-page' ? t('FAQ Page') : activeSection === 'contact-page' ? t('Contact Page') : activeSection}
                        </h3>
                        <p className="text-sm text-gray-500">{t('Update page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData(activeSection).active !== false}
                        onCheckedChange={(checked) => updateSectionData(activeSection, { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_title`}>{t('Page Title')}</Label>
                      <Input
                        id={`${activeSection}_title`}
                        value={getSectionData(activeSection).title || ''}
                        onChange={(e) => updateSectionData(activeSection, { title: e.target.value })}
                        placeholder={t('Enter page title')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_subtitle`}>{t('Page Subtitle')}</Label>
                      <Input
                        id={`${activeSection}_subtitle`}
                        value={getSectionData(activeSection).subtitle || ''}
                        onChange={(e) => updateSectionData(activeSection, { subtitle: e.target.value })}
                        placeholder={t('Enter page subtitle')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_content`}>{t('Page Content')}</Label>
                      <RichTextField
                        id={`${activeSection}_content`}
                        value={getSectionData(activeSection).content || ''}
                        onChange={(value) => updateSectionData(activeSection, { content: value })}
                        placeholder={t('Enter page content')}
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsSection>
      
      <Toaster />
    </PageTemplate>
  );
}
