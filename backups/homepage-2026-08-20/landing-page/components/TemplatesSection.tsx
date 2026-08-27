import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Template {
  name: string;
  category: string;
}

interface TemplatesSectionProps {
  settings: any;
  sectionData: {
    label?: string;
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    templates_list?: Template[];
    cta_text?: string;
    cta_link?: string;
  };
  brandColor: string;
}

function TemplateArrowButton({
  direction,
  onClick,
  primaryColor,
  className = ''
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  primaryColor: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous template' : 'Next template'}
      className={`group inline-flex items-center justify-center bg-white/95 text-slate-700 shadow-sm transition-all duration-200 hover:border-transparent hover:bg-[var(--arrow-hover)] hover:shadow-md hover:text-white ${className}`}
      style={{
        borderColor: `${primaryColor}22`,
        ['--arrow-hover' as any]: primaryColor,
      }}
    >
      {direction === 'left' ? (
        <ChevronLeft
          className="h-5 w-5 text-slate-900 transition-colors duration-200 group-hover:text-white"
        />
      ) : (
        <ChevronRight
          className="h-5 w-5 text-slate-900 transition-colors duration-200 group-hover:text-white"
        />
      )}
    </button>
  );
}

export default function TemplatesSection({ sectionData, brandColor }: TemplatesSectionProps) {
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const { t } = useTranslation();

  const {
    title,
    subtitle,
    background_color,
    text_color,
    templates_list = [],
    cta_text = 'See More',
  } = sectionData || {};

  const templates = useMemo(() => {
    return (templates_list || []).filter((template) => template && template.name);
  }, [templates_list]);

  const totalTemplates = templates.length;
  const sectionLabel = 'Templates';
  const sectionTextColor = text_color || '#0f172a';
  const sectionSubtitleColor = text_color ? `${text_color}cc` : '#475569';

  const goToPreviousTemplate = () => {
    if (totalTemplates === 0) return;
    setActiveTemplateIndex((current) => (current - 1 + totalTemplates) % totalTemplates);
  };

  const goToNextTemplate = () => {
    if (totalTemplates === 0) return;
    setActiveTemplateIndex((current) => (current + 1) % totalTemplates);
  };

  const openPreview = (templateName: string) => {
    const templateData = getBusinessTemplate(templateName);
    localStorage.setItem('vcard_preview_data', JSON.stringify({
      business_type: templateName,
      name: templateData?.defaultData?.header?.name || 'Business Name',
      slug: 'preview',
      config_sections: templateData?.defaultData || {}
    }));
    window.open(route('vcard.preview'), '_blank');
  };

  if (templates.length === 0) return null;

  return (
    <section id="templates" className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: background_color }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {sectionLabel ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
              {sectionLabel}
            </p>
          ) : null}
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

        <div className="relative mx-auto mt-10 w-full max-w-5xl">
          <div className="relative mx-auto sm:hidden">
            <div className="flex h-[520px] items-center justify-center overflow-hidden px-16">
              {[-2, -1, 0, 1, 2].map((relativeOffset) => {
                const index = (activeTemplateIndex + relativeOffset + totalTemplates) % totalTemplates;
                const template = templates[index];
                const isActive = relativeOffset === 0;
                const absOffset = Math.abs(relativeOffset);

                return (
                  <button
                    key={`${template.name}-${relativeOffset}`}
                    type="button"
                    onClick={() => setActiveTemplateIndex(index)}
                    className={`group flex-shrink-0 transition-all duration-700 ease-out ${isActive ? 'z-10 scale-100' : absOffset === 1 ? 'scale-[0.92] opacity-80' : 'scale-[0.82] opacity-55'}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[1.75rem] cursor-pointer transition-all duration-500 ${isActive ? 'w-56 border-2' : 'w-48 border border-slate-200 bg-white'}`}
                      style={isActive ? { borderColor: brandColor, backgroundColor: `${brandColor}08` } : undefined}
                    >
                      {isActive ? <div className="absolute inset-x-0 top-0 h-[3px] bg-slate-900" /> : null}
                      <div className={`${isActive ? 'relative h-[25rem]' : 'relative h-[19rem]'} ${isActive ? 'w-56' : 'w-48'} overflow-hidden bg-gray-100`}>
                        <img
                          src={getImageDisplayUrl(`/storage/images/business-template/${template.name}.png`)}
                          alt={template.name}
                          className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-[4000ms] group-hover:scale-[1.03] group-hover:object-bottom"
                          onError={(e) => {
                            e.currentTarget.src = getImageDisplayUrl('/storage/images/business-template/freelancer.png');
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/12 to-transparent" />
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/5 to-transparent" />
                      </div>
                      <div className={`flex h-14 items-center justify-center p-3 text-center ${isActive ? 'bg-white/90' : 'bg-white'}`}>
                        <span
                          className="inline-flex max-w-full items-center justify-center rounded-full px-3 py-1 text-sm font-semibold tracking-tight capitalize"
                          style={isActive ? { backgroundColor: `${brandColor}18`, color: brandColor } : { color: text_color }}
                        >
                          {template.name.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4">
              <TemplateArrowButton
                direction="left"
                onClick={goToPreviousTemplate}
                primaryColor={brandColor}
                className="pointer-events-auto relative z-40 h-11 w-11 rounded-full border border-slate-200/60 shadow-lg"
              />
              <TemplateArrowButton
                direction="right"
                onClick={goToNextTemplate}
                primaryColor={brandColor}
                className="pointer-events-auto relative z-40 h-11 w-11 rounded-full border border-slate-200/60 shadow-lg"
              />
            </div>
          </div>

          <div className="relative mx-auto hidden lg:block">
            <div className="flex items-center justify-center space-x-2 overflow-visible px-20">
              {[-2, -1, 0, 1, 2].map((relativeOffset) => {
                const index = (activeTemplateIndex + relativeOffset + totalTemplates) % totalTemplates;
                const template = templates[index];
                const isActive = relativeOffset === 0;
                const absOffset = Math.abs(relativeOffset);

                return (
                  <button
                    key={`${template.name}-${relativeOffset}`}
                    type="button"
                    onClick={() => setActiveTemplateIndex(index)}
                    className={`group flex-shrink-0 transition-all duration-700 ease-out ${isActive ? 'scale-100 z-10' : absOffset === 1 ? 'scale-[0.92] opacity-80' : 'scale-[0.82] opacity-55'} ${relativeOffset === -1 ? '-ml-4' : ''} ${relativeOffset === 1 ? '-mr-2' : ''}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[1.75rem] cursor-pointer transition-all duration-500 ${isActive ? 'w-[19rem] border-2' : 'w-56 border border-slate-200 bg-white'}`}
                      style={isActive ? { borderColor: brandColor, backgroundColor: `${brandColor}08` } : undefined}
                    >
                      {isActive ? <div className="absolute inset-x-0 top-0 h-[3px] bg-slate-900" /> : null}
                      <div className={`${isActive ? 'relative h-[31rem] xl:h-[33rem]' : 'relative h-[23rem] xl:h-[25rem]'} ${isActive ? 'w-[19rem]' : 'w-56'} overflow-hidden bg-gray-100`}>
                        <img
                          src={getImageDisplayUrl(`/storage/images/business-template/${template.name}.png`)}
                          alt={template.name}
                          className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-[4000ms] group-hover:scale-[1.03] group-hover:object-bottom"
                          onError={(e) => {
                            e.currentTarget.src = getImageDisplayUrl('/storage/images/business-template/freelancer.png');
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/12 to-transparent" />
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/5 to-transparent" />
                      </div>
                      <div className={`flex h-14 items-center justify-center p-3 text-center ${isActive ? 'bg-white/90' : 'bg-white'}`}>
                        <span
                          className="inline-flex max-w-full items-center justify-center rounded-full px-4 py-1.5 text-base font-semibold tracking-tight capitalize"
                          style={isActive ? { backgroundColor: `${brandColor}18`, color: brandColor } : { color: text_color }}
                        >
                          {template.name.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute -left-6 -right-6 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-0 xl:-left-10 xl:-right-10">
              <TemplateArrowButton
                direction="left"
                onClick={goToPreviousTemplate}
                primaryColor={brandColor}
                className="pointer-events-auto relative z-40 h-11 w-11 rounded-full border border-slate-200/60 cursor-pointer bg-white lg:h-12 lg:w-12"
              />
              <TemplateArrowButton
                direction="right"
                onClick={goToNextTemplate}
                primaryColor={brandColor}
                className="pointer-events-auto relative z-40 h-11 w-11 rounded-full border border-slate-200/60 cursor-pointer bg-white shadow-md lg:h-12 lg:w-12"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-2 sm:mt-8">
            {templates.map((_, index) => {
              const distance = Math.abs(index - activeTemplateIndex);
              const shouldShow = distance <= 4 || index === 0 || index === totalTemplates - 1;

              if (!shouldShow) return null;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTemplateIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeTemplateIndex === index ? 'w-5 sm:w-6' : 'w-2 sm:w-2.5'} ${Math.abs(index - activeTemplateIndex) > 2 ? 'opacity-50' : 'opacity-100'}`}
                  style={{ backgroundColor: activeTemplateIndex === index ? brandColor : '#d1d5db' }}
                  aria-label={`Go to template ${index + 1}`}
                />
              );
            })}
          </div>

          {cta_text ? (
            <div className="mt-6 text-center sm:mt-8">
              <Link
                href={route('template.index')}
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:!text-white"
                style={{ backgroundColor: brandColor }}
              >
                {cta_text}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
