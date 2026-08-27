import React from 'react';
import { QrCode, Smartphone, Share2, BarChart3, Globe, Shield, ShieldCheck, Star, Zap, Users, Lock, Wifi, Heart, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Feature {
  title: string;
  description: string;
  icon: string;
  icon_color?: string;
}

interface FeaturesSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    features_list?: Feature[];
    background_color?: string;
    text_color?: string;
    columns?: number;
    show_icons?: boolean;
    image?: string;
  };
}

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  'qr-code': QrCode,
  'smartphone': Smartphone,
  'share': Share2,
  'bar-chart': BarChart3,
  'globe': Globe,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'star': Star,
  'zap': Zap,
  'users': Users,
  'lock': Lock,
  'wifi': Wifi,
  'heart': Heart,
  'sparkles': Sparkles
};

export default function FeaturesSection({ settings, sectionData, brandColor = '#3b82f6' }: FeaturesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  
  const sectionImage = sectionData.image ? getImageDisplayUrl(sectionData.image) : null;
  const backgroundColor = sectionData.background_color || '#f9fafb';
  const textColor = sectionData.text_color || '#0f172a';
  const showIcons = sectionData.show_icons !== false;
  const features = sectionData.features_list || [];
  const title = sectionData.title;
  const subtitle = sectionData.description;
  const label = t('Key Features');

  if (features.length === 0) return null;

  return (
    <section id="features" className="py-12 md:py-16 lg:py-20" style={{ backgroundColor }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {label ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
              {label}
            </p>
          ) : null}
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: textColor }}>{title}</h2>
          {subtitle ? <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: `${textColor}cc` }}>{subtitle}</p> : null}
        </div>

        {sectionImage && (
          <div className="mt-14 text-center">
            <img src={sectionImage} alt="Features" className="mx-auto max-w-full rounded-2xl shadow-lg ring-1 ring-black/5" />
          </div>
        )}
        
        <div className={`mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || QrCode;
            const iconColor = feature.icon_color || brandColor;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-7 shadow-[0_12px_32px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                role="article"
                aria-labelledby={`feature-${index}-title`}
              >
                <div className="flex items-start gap-4 pt-1">
                  {showIcons && (
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: `${iconColor}10`,
                        borderColor: `${iconColor}18`,
                        color: iconColor,
                      }}
                      role="img"
                      aria-label={`${feature.title} icon`}
                    >
                      <IconComponent className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold tracking-tight text-slate-950" id={`feature-${index}-title`}>
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
