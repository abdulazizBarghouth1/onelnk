import type { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CircleDot,
  Compass,
  LayoutGrid,
  Layers3,
  QrCode,
  Send,
  Share2,
  Sparkles,
  UserPlus,
  CreditCard,
  Users,
  Rocket,
  CheckCircle2,
  ScanLine,
  Workflow,
  ShieldCheck,
  MousePointerClick,
  Database,
} from 'lucide-react';

interface HowItWorksSectionProps {
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    steps_list?: Array<{
      icon?: string;
      icon_color?: string;
      title?: string;
      description?: string;
    }>;
  };
  brandColor: string;
}

const iconMap: Record<string, ElementType> = {
  'user-plus': UserPlus,
  'layout-grid': LayoutGrid,
  'credit-card': CreditCard,
  'users': Users,
  'share-2': Share2,
  share: Share2,
  'layers-3': Layers3,
  layers: Layers3,
  'qr-code': QrCode,
  'send': Send,
  rocket: Rocket,
  'check-circle-2': CheckCircle2,
  'scan-line': ScanLine,
  workflow: Workflow,
  database: Database,
  'shield-check': ShieldCheck,
  'mouse-pointer-click': MousePointerClick,
  sparkles: Sparkles,
  compass: Compass,
  'circle-dot': CircleDot,
};

export default function HowItWorksSection({ sectionData, brandColor }: HowItWorksSectionProps) {
  const { t } = useTranslation();

  const {
    title,
    subtitle,
    background_color,
    text_color,
    steps_list = [],
  } = sectionData || {};

  const steps = (steps_list || []).filter((step) => step?.title || step?.description || step?.icon);
  const label = 'How It Works';
  if (!title && !subtitle && steps.length === 0) return null;

  const sectionTextColor = text_color || '#111827';
  const sectionSubtitleColor = text_color ? `${text_color}cc` : '#475569';

  return (
    <section id="how-it-works" className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: background_color || '#f8fafc' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {label}
          </p>
          {title ? (
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: sectionTextColor }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 md:text-lg" style={{ color: sectionSubtitleColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const StepIcon = iconMap[step.icon || ''] || UserPlus;
            const stepIconColor = step.icon_color || brandColor;

            return (
              <div
                key={`${step.title || 'step'}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: `${stepIconColor}10`,
                    borderColor: `${stepIconColor}18`,
                    color: stepIconColor,
                  }}
                >
                  <StepIcon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {`${index + 1}. ${step.title || t('Step')}`}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description || ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
