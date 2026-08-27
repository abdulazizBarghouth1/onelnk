import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  image?: string;
  rating: number;
}

interface TestimonialsSectionProps {
  brandColor?: string;
  testimonials: Testimonial[];
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    background_color?: string;
    text_color?: string;
    default_testimonials?: Array<{
      name: string;
      role: string;
      image?: string;
      content: string;
      rating: number;
    }>;
  };
}

export default function TestimonialsSection({ testimonials, settings, sectionData, brandColor = '#3b82f6' }: TestimonialsSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  
  // Extract testimonials from settings
  const settingsTestimonials = settings?.config_sections?.sections?.find((section: any) => section.key === 'testimonials')?.testimonials?.map((testimonial: any, index: number) => ({
    id: index + 1,
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    rating: testimonial.rating || 5,
    avatar: testimonial.avatar,
    image: testimonial.image
  })) || [];
  const displayTestimonials = settingsTestimonials.length > 0 ? settingsTestimonials : testimonials;
  const title = sectionData?.title;
  const subtitle = sectionData?.subtitle;
  const backgroundColor = sectionData?.background_color || '#f9fafb';
  const textColor = sectionData?.text_color || '#111827';
  const subtitleColor = sectionData?.text_color ? `${sectionData.text_color}cc` : '#4b5563';
  const label = 'Testimonials';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-current text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {label}
          </p>
          {title ? (
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl" style={{ color: textColor }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-base leading-7 md:text-lg max-w-3xl mx-auto" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white px-6 py-7 text-center shadow-[0_12px_32px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-4 ring-slate-100 shadow-sm">
                {testimonial.image || testimonial.avatar ? (
                  <img
                    src={getImageDisplayUrl(testimonial.image || testimonial.avatar || '')}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: `${brandColor}12`, color: brandColor }}>
                    <span className="text-lg font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                {testimonial.name}
              </h3>
              <p className="mt-1 text-sm font-medium" style={{ color: brandColor }}>
                {testimonial.role}
              </p>

              <p className="mx-auto mt-4 max-w-sm text-[15px] leading-7 text-slate-600">
                {testimonial.content}
              </p>

              <div className="mt-5 flex items-center justify-center gap-1.5">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
