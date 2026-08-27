import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Paintbrush2 } from 'lucide-react';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface ThemesSectionProps {
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    block_title?: string;
    block_subtitle?: string;
    image?: string;
    cta_text?: string;
    cta_link?: string;
    background_color?: string;
    text_color?: string;
    benefits_list?: Array<{
      value?: string;
    }>;
  };
  brandColor: string;
}

export default function ThemesSection({ sectionData, brandColor }: ThemesSectionProps) {
  const { t } = useTranslation();

  const {
    title,
    subtitle,
    block_title,
    block_subtitle,
    image,
    cta_text,
    cta_link,
    background_color,
    text_color,
    benefits_list = [],
  } = sectionData || {};

  const benefits = (benefits_list || []).filter((benefit) => benefit?.value);
  const imageUrl = image ? getImageDisplayUrl(image) : '';
  const sectionLabel = 'Themes';
  const sectionTextColor = text_color || '#0f172a';
  const sectionSubtitleColor = text_color ? `${text_color}cc` : '#475569';

  if (!title && !subtitle && benefits.length === 0 && !block_title) return null;

  return (
    <section id="themes" className="py-10 md:py-14 lg:py-16" style={{ backgroundColor: background_color || '#ffffff' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            
            {sectionLabel}
          </p>
          {title ? (
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: sectionTextColor }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: sectionSubtitleColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-3 sm:space-y-4 lg:max-w-xl">
            {block_title ? (
              <h3 className="text-2xl font-bold text-slate-950">{block_title}</h3>
            ) : null}
            {block_subtitle ? (
              <p className="max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {block_subtitle}
              </p>
            ) : null}

            {benefits.length > 0 ? (
              <ul className="space-y-2.5 sm:space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={`${benefit.value}-${index}`} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brandColor }} />
                    <span>{benefit.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <a
              href={cta_link || route('create-card.create')}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:!text-white focus:!text-white active:!text-white visited:!text-white"
              style={{ backgroundColor: brandColor }}
            >
              <span>{cta_text || t('Get Started')}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="flex justify-center lg:justify-end">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={block_title || title || t('Theme Image')}
              />
            ) : (
              <div className="flex h-[280px] w-full max-w-[500px] items-center justify-center sm:h-[340px] lg:h-[400px]">
                <div className="relative w-full max-w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <Paintbrush2 className="h-6 w-6" style={{ color: brandColor }} />
                  </div>

                  <div className="relative mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: brandColor }}>
                      Themes
                    </p>
                    <h4 className="mt-2 text-lg font-bold text-slate-950">
                      {t('Image Preview')}
                    </h4>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      {t('You can display image here')}
                    </p>
                  </div>

                  <div className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                    <CheckCircle2 className="h-4 w-4" style={{ color: brandColor }} />
                    <span>{t('Upload theme image to preview')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
