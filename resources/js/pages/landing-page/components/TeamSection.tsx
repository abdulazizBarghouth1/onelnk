import React from 'react';
import { Linkedin, Twitter, Mail, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface TeamSectionProps {
  brandColor?: string;
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    members?: Array<{
      name: string;
      role: string;
      bio: string;
      image?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    }>;
    cta_title?: string;
    cta_description?: string;
    cta_button_text?: string;
  };
}

export default function TeamSection({ settings, sectionData, brandColor = '#3b82f6' }: TeamSectionProps) {
  const { t } = useTranslation();
  const teamMembers = sectionData?.members || [];
  const label = 'Team Members';
  const title = sectionData?.title;
  const subtitle = sectionData?.subtitle;
  const backgroundColor = sectionData?.background_color || '#ffffff';
  const textColor = sectionData?.text_color || '#111827';
  const subtitleColor = sectionData?.text_color ? `${sectionData.text_color}cc` : '#4b5563';

  return (
    <section
      className="py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {label ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
              {label}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: textColor }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50"
                    style={{ backgroundColor: `${brandColor}10` }}
                  >
                    {member.image ? (
                      <img
                        src={getImageDisplayUrl(member.image)}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold" style={{ color: brandColor }}>
                        {member.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 min-w-0">
                    <h3 className="truncate text-lg font-bold tracking-tight text-slate-950">
                      {member.name}
                    </h3>
                    <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-center text-base leading-7 text-slate-600">
                  {member.bio}
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-transparent hover:text-white"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandColor;
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-transparent hover:text-white"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandColor;
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-transparent hover:text-white"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandColor;
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
