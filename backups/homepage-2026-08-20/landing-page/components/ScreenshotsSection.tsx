import React from 'react';
import { Monitor } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface ScreenshotsSectionProps {
  brandColor?: string;
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    screenshots_list?: Array<{
      src: string;
      title: string;
    }>;
  };
}

export default function ScreenshotsSection({ brandColor = '#3b82f6', sectionData }: ScreenshotsSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const sectionLabel = t('Screenshots');
  const sectionTextColor = sectionData?.text_color || '#0f172a';
  const sectionSubtitleColor = sectionData?.text_color ? `${sectionData.text_color}cc` : '#475569';

  const screenshots = sectionData?.screenshots_list && sectionData.screenshots_list.length > 0
    ? sectionData.screenshots_list.map((screenshot) => ({
        ...screenshot,
        src: screenshot.src ? getImageDisplayUrl(screenshot.src) : null,
      })).filter((screenshot) => screenshot.src)
    : [];

  if (screenshots.length === 0) return null;

  return (
    <section
      id="screenshots"
      className="py-12 md:py-16 lg:py-20"
      ref={ref}
      style={{ backgroundColor: sectionData?.background_color || '#ffffff' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {sectionLabel}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: sectionTextColor }}>
            {sectionData?.title}
          </h2>
          <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: sectionSubtitleColor }}>
            {sectionData?.subtitle}
          </p>
        </div>

        {screenshots.length > 0 ? (
          <div
            className={`mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-lg bg-white/95 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="overflow-hidden bg-slate-100/90">
                  {screenshot.src ? (
                    <img
                      src={screenshot.src}
                      alt={screenshot.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="flex w-full items-center justify-center text-gray-400"
                    style={{ display: screenshot.src ? 'none' : 'flex', minHeight: '240px' }}
                  >
                    <div className="px-4 text-center">
                      <Monitor className="mx-auto mb-2 h-10 w-10" />
                      <p className="text-sm font-medium text-gray-500">{screenshot.title}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-5">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {screenshot.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`py-12 text-center transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-4 text-gray-400">
              <Monitor className="mx-auto h-16 w-16" />
            </div>
            <p className="text-gray-500">{t('No gallery items configured yet. Add some in the admin settings.')}</p>
          </div>
        )}
      </div>
    </section>
  );
}