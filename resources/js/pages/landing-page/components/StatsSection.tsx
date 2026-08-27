import React from 'react';

interface StatsSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    stats?: Array<{value: string; label: string}>;
    background_color?: string;
    text_color?: string;
  };
}

export default function StatsSection({ settings, sectionData, brandColor = '#3b82f6' }: StatsSectionProps) {
  const backgroundColor = sectionData.background_color || '#ffffff';
  const textColor = sectionData.text_color || '#0f172a';
  const stats = sectionData.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-8 md:py-10" style={{ backgroundColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 md:gap-x-8 md:gap-y-0">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-0.5 text-center md:py-1">
              <p className="text-2xl font-bold tracking-tight md:text-4xl" style={{ color: textColor }}>
                {item.value}
              </p>
              <p className="mt-1.5 text-sm font-medium md:mt-2 md:text-base" style={{ color: textColor, opacity: 0.7 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
