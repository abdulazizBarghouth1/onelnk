import { useTranslation } from 'react-i18next';

interface UseCasesSectionProps {
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    cases_list?: Array<{
      title?: string;
      description?: string;
    }>;
  };
  brandColor: string;
}

export default function UseCasesSection({ sectionData, brandColor }: UseCasesSectionProps) {
  const { t } = useTranslation();

  const {
    title,
    subtitle,
    background_color,
    text_color,
    cases_list = [],
  } = sectionData || {};

  const cases = (cases_list || []).filter((item) => item?.title || item?.description);

  if (!title && !subtitle && cases.length === 0) return null;
  
  const label = 'Use Cases';
  const sectionTextColor = text_color || '#111827';
  const sectionSubtitleColor = text_color ? `${text_color}cc` : '#475569';

  return (
    <section id="use-cases" className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: background_color || '#f8fafc' }}>
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
            <p className="mt-3 text-base leading-7 md:text-lg max-w-3xl mx-auto" style={{ color: sectionSubtitleColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cases.map((item, index) => (
            <div
              key={`${item.title || 'case'}-${index}`}
              className="rounded-xl border border-slate-200 bg-white/95 p-8 shadow-[0_12px_32px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-2xl font-bold text-slate-950">
                {item.title || t('Use Case')}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {item.description || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
