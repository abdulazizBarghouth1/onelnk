import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface NewsletterSectionProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    privacy_text?: string;
    background_color?: string;
    text_color?: string;
  };
}

export default function NewsletterSection({ flash, settings, sectionData, brandColor = '#3b82f6' }: NewsletterSectionProps) {
  const { t } = useTranslation();
  const backgroundColor = sectionData?.background_color || '#f8fafc';
  const textColor = sectionData?.text_color || '#0f172a';
  const mutedTextColor = sectionData?.text_color ? `${sectionData.text_color}cc` : '#64748b';
  const label = 'Newsletter';
  
  const { data, setData, post, processing, errors, reset } = useForm({
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.subscribe'), {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {label}
          </p>
          <h2 className="mx-auto mt-3 max-w-xl text-2xl font-bold leading-tight md:text-4xl" style={{ color: textColor }}>
            {sectionData?.title || t('Stay in the loop, Get product updates in one place')}
          </h2>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="h-14 w-full flex-1 rounded-xl border bg-white px-5 text-sm outline-none transition-shadow focus:ring-2"
                  required
                  disabled={processing}
                  aria-label="Email address for newsletter subscription"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={processing}
                className="h-14 rounded-xl px-8 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: brandColor }}
                aria-label={processing ? t('Subscribing to newsletter') : t('Subscribe to newsletter')}
              >
                {processing ? t('Subscribing...') : t('Subscribe')}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm" style={{ color: mutedTextColor }}>
            {sectionData?.privacy_text || 'No spam. Unsubscribe anytime.'}
          </p>
        </div>
      </div>
    </section>
  );
}
