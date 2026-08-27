import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

interface ContactSectionProps {
  brandColor?: string;
  settings?: any;
  sectionData?: {
    label?: string;
    title?: string;
    subtitle?: string;
    form_title?: string;
    info_title?: string;
    contact_info?: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function ContactSection({ settings, sectionData, brandColor = '#3b82f6', flash }: ContactSectionProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(route('landing-page.contact'), formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
      },
      onError: (errors) => {
        setIsSubmitting(false);
        const errorMessages = Object.values(errors).flat().join(', ');
        toast.error(errorMessages || 'Please check your input and try again.');
      }
    });
  };

  const defaultContactInfo = {
    email: settings?.contact_email || 'support@vcard.com',
    phone: settings?.contact_phone || '+1 (555) 123-4567',
    address: settings?.contact_address || '123 Business Ave, Suite 100, San Francisco, CA 94105'
  };

  const contactInfo = {
    email: sectionData?.contact_info?.email || settings?.contact_email || defaultContactInfo.email,
    phone: sectionData?.contact_info?.phone || settings?.contact_phone || defaultContactInfo.phone,
    address: sectionData?.contact_info?.address || settings?.contact_address || defaultContactInfo.address
  };
  const label = 'Contact';

  const footerSection = settings?.config_sections?.sections?.find((section: any) => section.key === 'footer');
  const socialLinks = footerSection?.social_links || [];

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
  };

  return (
    <section id="contact" className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: sectionData?.background_color || '#ffffff' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
            {label}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {sectionData?.title || 'We are here to help you succeed.'}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
            {sectionData?.subtitle || 'Have a question about vCard, need technical support, or want to explore partnerships? Our team is ready to assist you.'}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-950">
              {sectionData?.form_title || 'Send us a Message'}
            </h3>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-semibold text-slate-700" required>
                    {t('Full Name')}
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 px-4 py-3 outline-none focus:ring-2"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-semibold text-slate-700" required>
                    {t('Email Address')}
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 px-4 py-3 outline-none focus:ring-2"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700" required>
                  {t('Subject')}
                </Label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 px-4 py-3 outline-none focus:ring-2"
                  placeholder="What’s this about?"
                  required
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-semibold text-slate-700" required>
                  {t('Message')}
                </Label>
                <Textarea
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full resize-none border border-slate-200 px-4 py-3 outline-none focus:ring-2"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div className="space-y-5 lg:order-2">
            <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">
                {sectionData?.info_title || 'Contact Information'}
              </h3>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${brandColor}14`, color: brandColor }}>
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: brandColor }}>{t('Email Us')}</p>
                    <p className="text-base font-medium text-slate-950">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${brandColor}14`, color: brandColor }}>
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: brandColor }}>{t('Call Us')}</p>
                    <p className="text-base font-medium text-slate-950">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${brandColor}14`, color: brandColor }}>
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: brandColor }}>{t('Visit Us')}</p>
                    <p className="text-base font-medium text-slate-950">{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">{t('Follow Us')}</h3>
              <div className="mt-4 flex gap-3">
                {socialLinks.slice(0, 4).map((social: any) => {
                  const IconComponent = iconMap[social.icon] || iconMap.Facebook;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:opacity-90"
                      style={{ backgroundColor: `${brandColor}14`, color: brandColor }}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
