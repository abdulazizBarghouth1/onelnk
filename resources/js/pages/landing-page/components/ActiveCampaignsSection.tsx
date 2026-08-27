import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Campaign {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  business: {
    id: number;
    name: string;
    slug: string;
    url_prefix?: string;
    custom_domain?: string;
  };
}

interface ActiveCampaignsSectionProps {
  campaigns: Campaign[];
  settings: any;
  sectionData: any;
  brandColor: string;
}

export default function ActiveCampaignsSection({
  campaigns,
  settings,
  sectionData,
  brandColor
}: ActiveCampaignsSectionProps) {
  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  const { t } = useTranslation();
  const backgroundColor = sectionData?.background_color || '#f8fafc';
  const backgroundImage = sectionData?.background_image ? getImageDisplayUrl(sectionData.background_image) : null;
  const overlay = sectionData?.overlay || false;
  const overlayColor = sectionData?.overlay_color || 'rgba(0,0,0,0.5)';
  const textColor = sectionData?.text_color || '#0f172a';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getBusinessUrl = (business: Campaign['business']) => {
    return business.custom_domain
      ? `https://${business.custom_domain}`
      : (business.url_prefix && business.url_prefix !== ''
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug }, true)
        : route('public.vcard.show.direct', business.slug, true));
  };

  const title = sectionData?.title || 'Featured Business Promotions';
  const subtitle = sectionData?.subtitle || 'Explore businesses we\'re currently promoting and discover amazing services';
  const displayedCampaigns = campaigns;

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const daysRemaining = getDaysRemaining(campaign.end_date);
    const businessUrl = getBusinessUrl(campaign.business);

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-950">{campaign.name}</h3>
            </div>
            {daysRemaining > 0 && (
              <div
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold  text-white"
                style={{ backgroundColor: brandColor }}
              >
                <Clock className="h-3 w-3" />
                {daysRemaining} {t('days left')}
              </div>
            )}
          </div>
          <p className="mt-3 leading-7 text-slate-600 text-base">
            {campaign.description}
          </p>

          <div className="flex-1 mt-5">
            <div className="rounded-lg border border-slate-200 bg-white/50 p-4">
              <div className="mb-3 flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: brandColor }} />
                <span className="break-words text-sm font-semibold leading-relaxed text-slate-800">
                  {campaign.business.name}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: brandColor }} />
                <span className="break-words text-sm font-medium leading-relaxed text-slate-600">
                  {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Button
              className="flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 hover:!text-white focus:!text-white active:!text-white visited:!text-white"
              style={{ backgroundColor: brandColor }}
              onClick={() => window.open(businessUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4" />
              <span>{t('Visit Business')}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      className="py-12 md:py-16 lg:py-20 relative"
      style={{ backgroundColor }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {t('Campaigns')}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl" style={{ color: textColor }}>
            {title}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg" style={{ color: textColor, opacity: 0.78 }}>
            {subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {displayedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}
